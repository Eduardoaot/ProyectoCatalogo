// Órdenes: crearlas y leerlas. Todas requieren token.

import { pedir } from './cliente'

/**
 * Crea la orden en la base. El total NO se manda desde aquí: lo calcula el
 * backend con los precios y descuentos vigentes, dentro de una transacción.
 *
 * @param {Array} items  [{ productoId, cantidad }]
 * @param {string|null} textoCodigo  Código de descuento aplicado, si hay.
 */
export async function crearOrden(items, textoCodigo = null) {
  return pedir('/ordenes', {
    metodo: 'POST',
    autenticado: true,
    cuerpo: {
      items: items.map((item) => ({
        ID_producto: item.productoId,
        cantidad: item.cantidad,
      })),
      ...(textoCodigo ? { texto_codigo: textoCodigo } : {}),
    },
  })
}

export async function obtenerOrden(idOrden) {
  return pedir(`/ordenes/${idOrden}`, { autenticado: true })
}

/**
 * Órdenes de un cliente, con su detalle. La API devuelve primero el resumen
 * y el detalle en otra llamada, así que aquí se juntan para que la pantalla
 * de "Mis órdenes" reciba todo listo.
 */
export async function obtenerOrdenesDeCliente(idCliente) {
  const resumen = await pedir(`/clientes/${idCliente}/ordenes`, { autenticado: true })

  const detalles = await Promise.all(
    resumen.ordenes.map((orden) => obtenerOrden(orden.ID_orden)),
  )

  return detalles.map((orden) => ({
    id: orden.ID_orden,
    fecha: orden.fecha_orden,
    total: Number(orden.total_orden),
    subtotal: Number(orden.subtotal),
    descuentoTotal: Number(orden.descuento_total),
    items: orden.productos.map((renglon) => ({
      productoId: renglon.ID_producto,
      nombre: renglon.nombre_producto,
      precio: Number(renglon.precio_orden_producto),
      cantidad: Number(renglon.cantidad_orden_producto),
      unidad: renglon.nombre_unidad,
    })),
  }))
}
