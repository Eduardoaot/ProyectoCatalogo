import { pool } from '../db.js';
import { ApiError } from './ApiError.js';
import { asyncHandler } from './asyncHandler.js';
import { enviarCreado, enviarOk } from './respuesta.js';

/**
 * Fabrica el CRUD de las tablas de catalogo que solo tienen id + un nombre
 * (Categorias, Unidades, Descuentos_tipos). Evita repetir cuatro veces
 * el mismo SELECT/INSERT/UPDATE/DELETE.
 *
 * Los nombres de tabla y columna NO vienen del usuario: se fijan aqui,
 * por eso pueden interpolarse en el SQL sin riesgo de inyeccion.
 */
export function crearCrudSimple({ tabla, idColumna, campo, etiqueta }) {
  const listar = asyncHandler(async (_req, res) => {
    const [filas] = await pool.query(
      `SELECT ${idColumna}, ${campo} FROM ${tabla} ORDER BY ${campo} ASC`,
    );
    return enviarOk(res, filas);
  });

  const obtener = asyncHandler(async (req, res) => {
    const [filas] = await pool.execute(
      `SELECT ${idColumna}, ${campo} FROM ${tabla} WHERE ${idColumna} = ?`,
      [req.params.id],
    );
    if (filas.length === 0) throw ApiError.notFound(`${etiqueta} no encontrada`);
    return enviarOk(res, filas[0]);
  });

  const crear = asyncHandler(async (req, res) => {
    const valor = req.body[campo];
    const [resultado] = await pool.execute(
      `INSERT INTO ${tabla} (${campo}) VALUES (?)`,
      [valor],
    );
    return enviarCreado(res, { [idColumna]: resultado.insertId, [campo]: valor });
  });

  const actualizar = asyncHandler(async (req, res) => {
    const valor = req.body[campo];
    const [resultado] = await pool.execute(
      `UPDATE ${tabla} SET ${campo} = ? WHERE ${idColumna} = ?`,
      [valor, req.params.id],
    );
    if (resultado.affectedRows === 0) throw ApiError.notFound(`${etiqueta} no encontrada`);
    return enviarOk(res, { [idColumna]: Number(req.params.id), [campo]: valor });
  });

  const eliminar = asyncHandler(async (req, res) => {
    const [resultado] = await pool.execute(
      `DELETE FROM ${tabla} WHERE ${idColumna} = ?`,
      [req.params.id],
    );
    if (resultado.affectedRows === 0) throw ApiError.notFound(`${etiqueta} no encontrada`);
    return enviarOk(res, { eliminado: true, [idColumna]: Number(req.params.id) });
  });

  return { listar, obtener, crear, actualizar, eliminar };
}
