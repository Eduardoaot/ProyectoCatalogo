import { conTransaccion, pool } from '../db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { enviarCreado, enviarOk } from '../utils/respuesta.js';
import {
  calcularDescuentoCodigo,
  calcularRenglon,
  estaVigente,
  hoyISO,
  mapearDescuento,
  redondear,
} from '../utils/descuentos.js';

/**
 * Junta los renglones repetidos del carrito (si mandan dos veces el mismo
 * producto) y ordena por ID: bloquear siempre en el mismo orden evita
 * interbloqueos entre dos compras simultaneas.
 */
function normalizarItems(items) {
  const acumulado = new Map();

  for (const item of items) {
    const id = Number(item.ID_producto);
    const cantidad = Number(item.cantidad);
    const piezas =
      item.piezas === undefined || item.piezas === null ? null : Number(item.piezas);
    const previo = acumulado.get(id);

    if (previo === undefined) {
      acumulado.set(id, { cantidad: redondear(cantidad, 3), piezas });
      continue;
    }

    // Si dos renglones del mismo producto vinieron uno por piezas y otro por
    // peso, la suma ya no es un numero exacto de piezas: se guarda como peso.
    acumulado.set(id, {
      cantidad: redondear(previo.cantidad + cantidad, 3),
      piezas:
        previo.piezas !== null && piezas !== null
          ? redondear(previo.piezas + piezas, 3)
          : null,
    });
  }

  return [...acumulado.entries()]
    .map(([ID_producto, valor]) => ({ ID_producto, ...valor }))
    .sort((a, b) => a.ID_producto - b.ID_producto);
}

/** Lee el descuento del producto dentro de la transaccion. */
async function leerDescuento(conn, idDescuento) {
  if (!idDescuento) return null;
  const [filas] = await conn.execute(
    `SELECT dv.ID_descuento, dv.ID_descuento_tipo, dt.tipo_descuento, dv.nombre_descuento,
            dv.descuento_valor, dv.cantidad_lleva, dv.cantidad_paga,
            dv.fecha_inicio, dv.fecha_final
       FROM Descuentos_valores dv
       INNER JOIN Descuentos_tipos dt ON dt.ID_descuento_tipo = dv.ID_descuento_tipo
      WHERE dv.ID_descuento = ?`,
    [idDescuento],
  );
  return filas[0] ?? null;
}

/**
 * Busca un codigo de descuento vigente y hasta donde alcanza.
 *
 * El alcance sale de la tabla Ofertas: si una oferta enlaza este codigo con
 * una categoria, el codigo solo cuenta para los productos de esa categoria
 * (asi funcionan "20% en frutas y verduras" o "2x1 en lacteos"). Si ninguna
 * oferta lo limita, aplica a la orden completa.
 */
async function leerCodigo(conn, textoCodigo, fecha) {
  const texto = String(textoCodigo).trim();

  const [filas] = await conn.execute(
    `SELECT dc.ID_descuento_codigo, dc.texto_codigo, dc.etiqueta_codigo, dc.descripcion_codigo,
            dv.ID_descuento, dv.ID_descuento_tipo, dt.tipo_descuento, dv.nombre_descuento,
            dv.descuento_valor, dv.cantidad_lleva, dv.cantidad_paga,
            dv.fecha_inicio, dv.fecha_final
       FROM Descuentos_codigo dc
       INNER JOIN Descuentos_valores dv ON dv.ID_descuento      = dc.ID_descuento
       INNER JOIN Descuentos_tipos   dt ON dt.ID_descuento_tipo = dv.ID_descuento_tipo
      WHERE dc.texto_codigo = ?`,
    [texto],
  );

  if (filas.length === 0) throw ApiError.notFound(`El codigo "${texto}" no existe`);
  const codigo = filas[0];
  if (!estaVigente(codigo, fecha)) {
    throw ApiError.conflict(`El codigo "${texto}" no esta vigente`);
  }

  const [ofertas] = await conn.execute(
    `SELECT ID_categoria FROM Ofertas
      WHERE ID_codigo_descuento = ? AND ID_categoria IS NOT NULL
      LIMIT 1`,
    [codigo.ID_descuento_codigo],
  );

  return { codigo, ID_categoria: ofertas[0]?.ID_categoria ?? null };
}

/**
 * POST /ordenes
 * Cuerpo: { items: [{ ID_producto, cantidad }], texto_codigo? }
 * El ID_cliente sale del JWT, nunca del body.
 *
 * Todo ocurre dentro de una transaccion: si un producto no existe o no hay
 * stock, se hace rollback y no queda ni la cabecera ni el descuento de stock.
 *
 * El total SIEMPRE se calcula aqui con los precios y descuentos de la base:
 * nada de lo que mande el navegador influye en el importe.
 */
export const crearOrden = asyncHandler(async (req, res) => {
  const idCliente = req.cliente.ID_cliente;
  const items = normalizarItems(req.body.items);
  const textoCodigo = req.body.texto_codigo?.trim() || null;
  const fecha = hoyISO();

  const resultado = await conTransaccion(async (conn) => {
    const renglones = [];
    let total = 0;

    for (const item of items) {
      // FOR UPDATE bloquea la fila hasta el commit: dos compras del mismo
      // producto no pueden leer el mismo stock y venderlo dos veces.
      const [productos] = await conn.execute(
        `SELECT ID_producto, ID_categoria, nombre_producto, precio_producto,
                cantidad_producto, ID_Descuento
           FROM Productos WHERE ID_producto = ? FOR UPDATE`,
        [item.ID_producto],
      );

      if (productos.length === 0) {
        throw ApiError.notFound(`El producto ${item.ID_producto} no existe`);
      }

      const producto = productos[0];
      const stock = Number(producto.cantidad_producto);
      if (stock < item.cantidad) {
        throw ApiError.conflict(`Stock insuficiente de "${producto.nombre_producto}"`, {
          ID_producto: producto.ID_producto,
          solicitado: item.cantidad,
          disponible: stock,
        });
      }

      const descuento = await leerDescuento(conn, producto.ID_Descuento);
      const calculo = calcularRenglon({
        precio: producto.precio_producto,
        cantidad: item.cantidad,
        descuento,
        fechaISO: fecha,
      });

      total = redondear(total + calculo.total);
      renglones.push({
        ID_producto: producto.ID_producto,
        ID_categoria: producto.ID_categoria,
        nombre_producto: producto.nombre_producto,
        cantidad_orden_producto: item.cantidad,
        piezas_orden_producto: item.piezas,
        // El precio se congela: se guarda el precio de lista del momento de la compra.
        precio_orden_producto: calculo.precio_unitario,
        subtotal: calculo.subtotal,
        descuento_aplicado: calculo.descuento_aplicado,
        total_renglon: calculo.total,
        descuento: descuento
          ? { ...mapearDescuento(descuento, fecha), detalle: calculo.detalle }
          : null,
      });
    }

    // El codigo se aplica sobre los renglones ya con su descuento de producto.
    let codigoAplicado = null;
    if (textoCodigo) {
      const { codigo, ID_categoria } = await leerCodigo(conn, textoCodigo, fecha);
      const calculo = calcularDescuentoCodigo({
        renglones: renglones.map((r) => ({
          ID_categoria: r.ID_categoria,
          cantidad: r.cantidad_orden_producto,
          total: r.total_renglon,
        })),
        descuento: codigo,
        ID_categoria,
        fechaISO: fecha,
      });

      total = redondear(Math.max(total - calculo.monto, 0));
      codigoAplicado = {
        texto_codigo: codigo.texto_codigo,
        etiqueta_codigo: codigo.etiqueta_codigo,
        descripcion_codigo: codigo.descripcion_codigo,
        ID_categoria,
        descuento_aplicado: calculo.monto,
        detalle: calculo.detalle,
      };
    }

    const [cabecera] = await conn.execute(
      'INSERT INTO Ordenes (ID_cliente, total_orden) VALUES (?, ?)',
      [idCliente, 0],
    );
    const idOrden = cabecera.insertId;

    for (const renglon of renglones) {
      await conn.execute(
        `INSERT INTO Maestra_orden_productos
           (ID_orden, ID_producto, cantidad_orden_producto, piezas_orden_producto,
            precio_orden_producto)
         VALUES (?, ?, ?, ?, ?)`,
        [
          idOrden,
          renglon.ID_producto,
          renglon.cantidad_orden_producto,
          // mysql2 no acepta `undefined` como parametro.
          renglon.piezas_orden_producto ?? null,
          renglon.precio_orden_producto,
        ],
      );

      // La condicion del WHERE es la ultima red de seguridad contra stock negativo.
      const [bajaStock] = await conn.execute(
        `UPDATE Productos
            SET cantidad_producto = cantidad_producto - ?
          WHERE ID_producto = ? AND cantidad_producto >= ?`,
        [renglon.cantidad_orden_producto, renglon.ID_producto, renglon.cantidad_orden_producto],
      );
      if (bajaStock.affectedRows === 0) {
        throw ApiError.conflict(
          `Stock insuficiente de "${renglon.nombre_producto}" al confirmar la orden`,
        );
      }
    }

    await conn.execute('UPDATE Ordenes SET total_orden = ? WHERE ID_orden = ?', [
      total,
      idOrden,
    ]);

    const [ordenes] = await conn.execute(
      'SELECT ID_orden, ID_cliente, fecha_orden, total_orden FROM Ordenes WHERE ID_orden = ?',
      [idOrden],
    );

    const subtotal = redondear(renglones.reduce((acc, r) => acc + r.subtotal, 0));
    return {
      ...ordenes[0],
      total_orden: total,
      subtotal,
      descuento_total: redondear(subtotal - total),
      codigo: codigoAplicado,
      productos: renglones,
    };
  });

  return enviarCreado(res, resultado);
});

const SELECT_DETALLE = `
  SELECT m.ID_maestra_orden_producto,
         m.ID_orden,
         m.ID_producto,
         m.cantidad_orden_producto,
         m.piezas_orden_producto,
         m.precio_orden_producto,
         p.nombre_producto,
         p.imagen,
         u.nombre_unidad
    FROM Maestra_orden_productos m
    INNER JOIN Productos p ON p.ID_producto = m.ID_producto
    INNER JOIN Unidades  u ON u.ID_unidad   = p.ID_unidad
   WHERE m.ID_orden = ?
   ORDER BY m.ID_maestra_orden_producto ASC
`;

function mapearRenglon(fila) {
  return {
    ...fila,
    subtotal: redondear(
      Number(fila.cantidad_orden_producto) * Number(fila.precio_orden_producto),
    ),
  };
}

/** GET /ordenes/:id  (solo el cliente propietario de la orden) */
export const obtenerOrden = asyncHandler(async (req, res) => {
  const [ordenes] = await pool.execute(
    `SELECT o.ID_orden, o.ID_cliente, o.fecha_orden, o.total_orden,
            c.nombre_cliente, c.correo_cliente
       FROM Ordenes o
       INNER JOIN Clientes c ON c.ID_cliente = o.ID_cliente
      WHERE o.ID_orden = ?`,
    [req.params.id],
  );
  if (ordenes.length === 0) throw ApiError.notFound('Orden no encontrada');

  const orden = ordenes[0];
  if (orden.ID_cliente !== req.cliente.ID_cliente) {
    throw ApiError.forbidden('Esta orden pertenece a otro cliente');
  }

  const [detalle] = await pool.execute(SELECT_DETALLE, [orden.ID_orden]);
  const productos = detalle.map(mapearRenglon);
  const subtotal = redondear(productos.reduce((acc, r) => acc + r.subtotal, 0));

  return enviarOk(res, {
    ID_orden: orden.ID_orden,
    fecha_orden: orden.fecha_orden,
    total_orden: orden.total_orden,
    // precio_orden_producto guarda el precio de lista congelado, por eso la
    // diferencia contra total_orden es el descuento aplicado en la compra.
    subtotal,
    descuento_total: redondear(subtotal - Number(orden.total_orden)),
    cliente: {
      ID_cliente: orden.ID_cliente,
      nombre_cliente: orden.nombre_cliente,
      correo_cliente: orden.correo_cliente,
    },
    productos,
  });
});

/** GET /clientes/:id/ordenes  (solo el propio cliente) */
export const listarOrdenesDeCliente = asyncHandler(async (req, res) => {
  const [ordenes] = await pool.execute(
    `SELECT o.ID_orden, o.fecha_orden, o.total_orden,
            COUNT(m.ID_maestra_orden_producto) AS renglones,
            COALESCE(SUM(m.cantidad_orden_producto), 0) AS piezas
       FROM Ordenes o
       LEFT JOIN Maestra_orden_productos m ON m.ID_orden = o.ID_orden
      WHERE o.ID_cliente = ?
      GROUP BY o.ID_orden, o.fecha_orden, o.total_orden
      ORDER BY o.fecha_orden DESC, o.ID_orden DESC`,
    [req.params.id],
  );

  return enviarOk(res, {
    ID_cliente: Number(req.params.id),
    total_ordenes: ordenes.length,
    ordenes,
  });
});
