import { pool } from '../db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { enviarCreado, enviarOk } from '../utils/respuesta.js';
import { hoyISO, mapearDescuento, precioConDescuento } from '../utils/descuentos.js';

/**
 * Favoritos de un cliente. Siempre salen del token: nadie puede leer ni
 * modificar los favoritos de otra persona.
 */

/**
 * `condicionExtra` se concatena al WHERE. No viene del usuario: solo se usa
 * desde este archivo con literales fijos, y los valores siempre van por `?`.
 */
const selectFavoritos = (condicionExtra = '') => `
  SELECT f.ID_favorito,
         f.created_at        AS agregado_en,
         p.ID_producto,
         p.nombre_producto,
         p.precio_producto,
         p.imagen,
         p.descripcion,
         p.destacado,
         p.cantidad_producto,
         p.factor_pieza,
         p.ID_categoria,
         c.nombre_categoria,
         p.ID_unidad,
         u.nombre_unidad,
         p.ID_Descuento       AS ID_descuento,
         dv.ID_descuento_tipo,
         dv.nombre_descuento,
         dv.descuento_valor,
         dv.cantidad_lleva,
         dv.cantidad_paga,
         dv.fecha_inicio,
         dv.fecha_final,
         dt.tipo_descuento
    FROM Favoritos f
    INNER JOIN Productos  p ON p.ID_producto  = f.ID_producto
    INNER JOIN Categorias c ON c.ID_categoria = p.ID_categoria
    INNER JOIN Unidades   u ON u.ID_unidad    = p.ID_unidad
    LEFT  JOIN Descuentos_valores dv ON dv.ID_descuento      = p.ID_Descuento
    LEFT  JOIN Descuentos_tipos   dt ON dt.ID_descuento_tipo = dv.ID_descuento_tipo
   WHERE f.ID_cliente = ?
   ${condicionExtra}
   ORDER BY f.created_at DESC, f.ID_favorito DESC
`;

/** Mismo formato de producto que devuelve /productos, para que el front lo reutilice. */
function mapearFavorito(fila, fechaISO) {
  const descuento = mapearDescuento(fila, fechaISO);
  return {
    ID_favorito: fila.ID_favorito,
    agregado_en: fila.agregado_en,
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
    categoria: { ID_categoria: fila.ID_categoria, nombre_categoria: fila.nombre_categoria },
    unidad: { ID_unidad: fila.ID_unidad, nombre_unidad: fila.nombre_unidad },
    descuento,
  };
}

/** GET /favoritos */
export const listarFavoritos = asyncHandler(async (req, res) => {
  const [filas] = await pool.execute(selectFavoritos(), [req.cliente.ID_cliente]);
  const fecha = hoyISO();
  return enviarOk(res, {
    total: filas.length,
    favoritos: filas.map((fila) => mapearFavorito(fila, fecha)),
  });
});

/** POST /favoritos  { ID_producto } */
export const agregarFavorito = asyncHandler(async (req, res) => {
  const idCliente = req.cliente.ID_cliente;
  const idProducto = Number(req.body.ID_producto);

  const [productos] = await pool.execute(
    'SELECT ID_producto FROM Productos WHERE ID_producto = ?',
    [idProducto],
  );
  if (productos.length === 0) {
    throw ApiError.notFound(`El producto ${idProducto} no existe`);
  }

  // La llave única (ID_cliente, ID_producto) hace que marcar dos veces el
  // mismo producto no falle ni duplique: simplemente no cambia nada.
  await pool.execute(
    `INSERT INTO Favoritos (ID_cliente, ID_producto) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE ID_favorito = ID_favorito`,
    [idCliente, idProducto],
  );

  const [filas] = await pool.execute(selectFavoritos('AND p.ID_producto = ?'), [
    idCliente,
    idProducto,
  ]);
  return enviarCreado(res, mapearFavorito(filas[0], hoyISO()));
});

/** DELETE /favoritos/:idProducto */
export const quitarFavorito = asyncHandler(async (req, res) => {
  const [resultado] = await pool.execute(
    'DELETE FROM Favoritos WHERE ID_cliente = ? AND ID_producto = ?',
    [req.cliente.ID_cliente, req.params.idProducto],
  );
  if (resultado.affectedRows === 0) {
    throw ApiError.notFound('Ese producto no estaba en tus favoritos');
  }
  return enviarOk(res, { eliminado: true, ID_producto: Number(req.params.idProducto) });
});
