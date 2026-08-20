// Códigos de descuento aplicables en el carrito.
// `calcularDescuento` recibe el carrito ya resuelto (cada item con su
// `producto` y `cantidad`) y devuelve el monto total a descontar.
export const CODIGOS_DESCUENTO = [
  {
    codigo: 'FRESCUERA',
    etiqueta: 'FRESCUERA',
    descripcion: '20% de descuento en frutas y verduras',
    calcularDescuento: (carrito) =>
      carrito
        .filter((item) => item.producto.categoria === 'Frutas y Verduras')
        .reduce((acc, item) => acc + item.producto.precio * item.cantidad * 0.2, 0),
  },
  {
    codigo: 'LLEVATEUNAVACA',
    etiqueta: 'LlevateUnaVaca',
    descripcion: '2x1 en lácteos',
    calcularDescuento: (carrito) =>
      carrito
        .filter((item) => item.producto.categoria === 'Lácteos')
        .reduce((acc, item) => acc + Math.floor(item.cantidad / 2) * item.producto.precio, 0),
  },
]

// Busca un código sin importar mayúsculas/minúsculas ni espacios extra.
export function buscarCodigo(texto) {
  const normalizado = texto.trim().toUpperCase()
  return CODIGOS_DESCUENTO.find((c) => c.codigo === normalizado) ?? null
}
