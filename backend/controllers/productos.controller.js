import { pool } from '../db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { enviarCreado, enviarOk } from '../utils/respuesta.js';
import { hoyISO, mapearDescuento, precioConDescuento } from '../utils/descuentos.js';

/** SELECT base: producto + categoria + unidad + descuento (con su tipo). */
const SELECT_PRODUCTO = `
  SELECT p.ID_producto,
         p.nombre_producto,
         p.precio_producto,
         p.imagen,
         p.descripcion,
         p.destacado,
         p.cantidad_producto,
         p.factor_pieza,
         p.created_at,
         p.updated_at,
         p.ID_categoria,
         c.nombre_categoria,
         p.ID_unidad,
         u.nombre_unidad,
         p.ID_Descuento           AS ID_descuento,
         dv.ID_descuento_tipo,
         dv.nombre_descuento,
         dv.descuento_valor,
         dv.cantidad_lleva,
         dv.cantidad_paga,
         dv.fecha_inicio,
         dv.fecha_final,
         dt.tipo_descuento
    FROM Productos p
    INNER JOIN Categorias c ON c.ID_categoria = p.ID_categoria
    INNER JOIN Unidades   u ON u.ID_unidad    = p.ID_unidad
    LEFT  JOIN Descuentos_valores dv ON dv.ID_descuento      = p.ID_Descuento
    LEFT  JOIN Descuentos_tipos   dt ON dt.ID_descuento_tipo = dv.ID_descuento_tipo
`;

/** Convierte la fila plana del JOIN en el objeto JSON que consume el front. */
function mapearProducto(fila, fechaISO = hoyISO()) {
  const descuento = mapearDescuento(fila, fechaISO);
  return {
    ID_producto: fila.ID_producto,
    nombre_producto: fila.nombre_producto,
    precio_producto: fila.precio_producto,
    precio_con_descuento: descuento?.vigente
      ? precioConDescuento(fila.precio_producto, fila, fechaISO)
      : fila.precio_producto,
    imagen: fila.imagen,
    descripcion: fila.descripcion,
    destacado: Boolean(fila.destacado),
    cantidad_producto: fila.cantidad_producto,
    factor_pieza: fila.factor_pieza,
    created_at: fila.created_at,
    updated_at: fila.updated_at,
    categoria: {
      ID_categoria: fila.ID_categoria,
      nombre_categoria: fila.nombre_categoria,
    },
    unidad: {
      ID_unidad: fila.ID_unidad,
      nombre_unidad: fila.nombre_unidad,
    },
    descuento,
  };
}

/** Entero acotado; evita valores raros en LIMIT/OFFSET (no admiten placeholders). */
function entero(valor, porDefecto, min, max) {
  const n = Number.parseInt(valor, 10);
  if (!Number.isFinite(n)) return porDefecto;
  return Math.min(Math.max(n, min), max);
}

function esVerdadero(valor) {
  return ['1', 'true', 'si', 'sí', 'yes'].includes(String(valor).toLowerCase());
}

export const listarProductos = asyncHandler(async (req, res) => {
  const condiciones = [];
  const valores = [];

  const idCategoria = req.query.ID_categoria ?? req.query.categoria;
  if (idCategoria !== undefined && idCategoria !== '') {
    condiciones.push('p.ID_categoria = ?');
    valores.push(Number(idCategoria));
  }

  if (req.query.destacado !== undefined && req.query.destacado !== '') {
    condiciones.push('p.destacado = ?');
    valores.push(esVerdadero(req.query.destacado) ? 1 : 0);
  }

  const busqueda = req.query.q ?? req.query.nombre;
  if (busqueda) {
    condiciones.push('p.nombre_producto LIKE ?');
    valores.push(`%${busqueda}%`);
  }

  if (req.query.con_descuento !== undefined && req.query.con_descuento !== '') {
    condiciones.push(esVerdadero(req.query.con_descuento)
      ? 'p.ID_Descuento IS NOT NULL'
      : 'p.ID_Descuento IS NULL');
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const limite = entero(req.query.limit, 50, 1, 200);
  const desplazamiento = entero(req.query.offset, 0, 0, 1_000_000);

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM Productos p ${where}`,
    valores,
  );

  const [filas] = await pool.query(
    `${SELECT_PRODUCTO} ${where} ORDER BY p.destacado DESC, p.nombre_producto ASC
     LIMIT ${limite} OFFSET ${desplazamiento}`,
    valores,
  );

  const fecha = hoyISO();
  return enviarOk(res, {
    total,
    limit: limite,
    offset: desplazamiento,
    productos: filas.map((fila) => mapearProducto(fila, fecha)),
  });
});

export const obtenerProducto = asyncHandler(async (req, res) => {
  const [filas] = await pool.execute(`${SELECT_PRODUCTO} WHERE p.ID_producto = ?`, [
    req.params.id,
  ]);
  if (filas.length === 0) throw ApiError.notFound('Producto no encontrado');
  return enviarOk(res, mapearProducto(filas[0]));
});

const COLUMNAS_PRODUCTO = [
  'ID_categoria',
  'ID_unidad',
  'ID_Descuento',
  'nombre_producto',
  'precio_producto',
  'imagen',
  'descripcion',
  'destacado',
  'cantidad_producto',
  'factor_pieza',
];

/** express-validator acepta true/false tambien como texto: "false" es falso. */
function aBooleano(valor) {
  return valor === true || valor === 1 || valor === '1' || valor === 'true';
}

/** Toma del body solo las columnas reales de la tabla. */
function extraerCampos(body) {
  const datos = {};
  for (const columna of COLUMNAS_PRODUCTO) {
    if (body[columna] !== undefined) {
      datos[columna] = columna === 'destacado' ? aBooleano(body[columna]) : body[columna];
    }
  }
  return datos;
}

export const crearProducto = asyncHandler(async (req, res) => {
  const datos = extraerCampos(req.body);
  const columnas = Object.keys(datos);
  const marcadores = columnas.map(() => '?').join(', ');

  const [resultado] = await pool.execute(
    `INSERT INTO Productos (${columnas.join(', ')}) VALUES (${marcadores})`,
    Object.values(datos),
  );

  const [filas] = await pool.execute(`${SELECT_PRODUCTO} WHERE p.ID_producto = ?`, [
    resultado.insertId,
  ]);
  return enviarCreado(res, mapearProducto(filas[0]));
});

export const actualizarProducto = asyncHandler(async (req, res) => {
  const datos = extraerCampos(req.body);
  const columnas = Object.keys(datos);
  if (columnas.length === 0) {
    throw ApiError.badRequest('No se envio ningun campo para actualizar');
  }

  const [resultado] = await pool.execute(
    `UPDATE Productos SET ${columnas.map((c) => `${c} = ?`).join(', ')} WHERE ID_producto = ?`,
    [...Object.values(datos), req.params.id],
  );
  if (resultado.affectedRows === 0) throw ApiError.notFound('Producto no encontrado');

  const [filas] = await pool.execute(`${SELECT_PRODUCTO} WHERE p.ID_producto = ?`, [
    req.params.id,
  ]);
  return enviarOk(res, mapearProducto(filas[0]));
});

export const eliminarProducto = asyncHandler(async (req, res) => {
  const [resultado] = await pool.execute('DELETE FROM Productos WHERE ID_producto = ?', [
    req.params.id,
  ]);
  if (resultado.affectedRows === 0) throw ApiError.notFound('Producto no encontrado');
  return enviarOk(res, { eliminado: true, ID_producto: Number(req.params.id) });
});
