import { pool } from '../db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { enviarOk } from '../utils/respuesta.js';
import { crearCrudTabla } from '../utils/crudTabla.js';
import { estaVigente, hoyISO, mapearDescuento } from '../utils/descuentos.js';

const SELECT_CODIGO = `
  SELECT dc.ID_descuento_codigo,
         dc.texto_codigo,
         dc.etiqueta_codigo,
         dc.descripcion_codigo,
         dc.ID_descuento,
         dv.ID_descuento_tipo,
         dt.tipo_descuento,
         dv.nombre_descuento,
         dv.descuento_valor,
         dv.cantidad_lleva,
         dv.cantidad_paga,
         dv.fecha_inicio,
         dv.fecha_final
    FROM Descuentos_codigo dc
    INNER JOIN Descuentos_valores dv ON dv.ID_descuento      = dc.ID_descuento
    INNER JOIN Descuentos_tipos   dt ON dt.ID_descuento_tipo = dv.ID_descuento_tipo
`;

function mapear(fila) {
  if (!fila) return fila;
  return {
    ID_descuento_codigo: fila.ID_descuento_codigo,
    texto_codigo: fila.texto_codigo,
    etiqueta_codigo: fila.etiqueta_codigo,
    descripcion_codigo: fila.descripcion_codigo,
    descuento: mapearDescuento(fila),
  };
}

export const {
  listar: listarCodigos,
  obtener: obtenerCodigo,
  crear: crearCodigo,
  actualizar: actualizarCodigo,
  eliminar: eliminarCodigo,
} = crearCrudTabla({
  tabla: 'Descuentos_codigo',
  idColumna: 'ID_descuento_codigo',
  etiqueta: 'Codigo de descuento',
  columnas: ['ID_descuento', 'texto_codigo', 'etiqueta_codigo', 'descripcion_codigo'],
  select: SELECT_CODIGO,
  filtroId: 'dc.ID_descuento_codigo',
  orden: 'ORDER BY dc.ID_descuento_codigo DESC',
  mapear,
});

/**
 * POST /descuentos/validar-codigo
 * Recibe { texto_codigo } y responde con el descuento asociado si existe
 * y esta dentro de su vigencia.
 */
export const validarCodigo = asyncHandler(async (req, res) => {
  const texto = String(req.body.texto_codigo).trim();

  const [filas] = await pool.execute(`${SELECT_CODIGO} WHERE dc.texto_codigo = ?`, [texto]);
  if (filas.length === 0) {
    throw ApiError.notFound(`El codigo "${texto}" no existe`);
  }

  const fila = filas[0];
  const fecha = hoyISO();
  if (!estaVigente(fila, fecha)) {
    throw ApiError.conflict(`El codigo "${texto}" no esta vigente`, {
      fecha_inicio: fila.fecha_inicio,
      fecha_final: fila.fecha_final,
      fecha_evaluada: fecha,
    });
  }

  // Si una oferta enlaza este codigo con una categoria, el codigo solo
  // cuenta para esa categoria (asi se define el alcance de "20% en frutas").
  const [ofertas] = await pool.execute(
    `SELECT o.ID_categoria, c.nombre_categoria
       FROM Ofertas o
       INNER JOIN Categorias c ON c.ID_categoria = o.ID_categoria
      WHERE o.ID_codigo_descuento = ?
      LIMIT 1`,
    [fila.ID_descuento_codigo],
  );

  return enviarOk(res, {
    valido: true,
    ...mapear(fila),
    categoria: ofertas[0] ?? null,
  });
});
