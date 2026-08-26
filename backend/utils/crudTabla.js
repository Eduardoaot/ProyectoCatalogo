import { pool } from '../db.js';
import { ApiError } from './ApiError.js';
import { asyncHandler } from './asyncHandler.js';
import { enviarCreado, enviarOk } from './respuesta.js';

/**
 * CRUD generico para tablas con varias columnas y lectura con JOIN.
 *
 * @param {object} opciones
 * @param {string} opciones.tabla        Nombre real de la tabla (para INSERT/UPDATE/DELETE).
 * @param {string} opciones.idColumna    Llave primaria.
 * @param {string[]} opciones.columnas   Columnas que el cliente puede escribir.
 * @param {string} opciones.etiqueta     Nombre legible para los mensajes de error.
 * @param {string} opciones.select       SELECT con sus JOIN, sin WHERE ni ORDER BY.
 * @param {string} opciones.filtroId     Columna calificada por la que se filtra (ej. "dv.ID_descuento").
 * @param {string} [opciones.orden]      ORDER BY para el listado.
 * @param {(fila:object)=>object} [opciones.mapear] Da forma a la fila devuelta.
 */
export function crearCrudTabla({
  tabla,
  idColumna,
  columnas,
  etiqueta,
  select,
  filtroId,
  orden = '',
  mapear = (fila) => fila,
}) {
  async function leerPorId(id) {
    const [filas] = await pool.execute(`${select} WHERE ${filtroId} = ?`, [id]);
    return filas[0] ?? null;
  }

  function extraerCampos(body) {
    const datos = {};
    for (const columna of columnas) {
      if (body[columna] !== undefined) datos[columna] = body[columna];
    }
    return datos;
  }

  const listar = asyncHandler(async (_req, res) => {
    const [filas] = await pool.query(`${select} ${orden}`);
    return enviarOk(res, filas.map(mapear));
  });

  const obtener = asyncHandler(async (req, res) => {
    const fila = await leerPorId(req.params.id);
    if (!fila) throw ApiError.notFound(`${etiqueta} no encontrado`);
    return enviarOk(res, mapear(fila));
  });

  const crear = asyncHandler(async (req, res) => {
    const datos = extraerCampos(req.body);
    const nombres = Object.keys(datos);
    if (nombres.length === 0) throw ApiError.badRequest('No se envio ningun campo');

    const [resultado] = await pool.execute(
      `INSERT INTO ${tabla} (${nombres.join(', ')}) VALUES (${nombres.map(() => '?').join(', ')})`,
      Object.values(datos),
    );
    return enviarCreado(res, mapear(await leerPorId(resultado.insertId)));
  });

  const actualizar = asyncHandler(async (req, res) => {
    const datos = extraerCampos(req.body);
    const nombres = Object.keys(datos);
    if (nombres.length === 0) {
      throw ApiError.badRequest('No se envio ningun campo para actualizar');
    }

    const [resultado] = await pool.execute(
      `UPDATE ${tabla} SET ${nombres.map((c) => `${c} = ?`).join(', ')} WHERE ${idColumna} = ?`,
      [...Object.values(datos), req.params.id],
    );
    if (resultado.affectedRows === 0) throw ApiError.notFound(`${etiqueta} no encontrado`);
    return enviarOk(res, mapear(await leerPorId(req.params.id)));
  });

  const eliminar = asyncHandler(async (req, res) => {
    const [resultado] = await pool.execute(
      `DELETE FROM ${tabla} WHERE ${idColumna} = ?`,
      [req.params.id],
    );
    if (resultado.affectedRows === 0) throw ApiError.notFound(`${etiqueta} no encontrado`);
    return enviarOk(res, { eliminado: true, [idColumna]: Number(req.params.id) });
  });

  return { listar, obtener, crear, actualizar, eliminar };
}
