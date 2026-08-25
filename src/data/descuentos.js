// Códigos de descuento del carrito.
//
// La app YA NO lee este archivo: los códigos viven en MySQL y se validan
// contra la API (`POST /descuentos/validar-codigo`). Esto es la **fuente**
// desde la que `backend/npm run seed:sql` genera las filas de las tablas
// `Descuentos_valores` y `Descuentos_codigo`.
//
// Cada código se describe con la forma que tiene en la base:
//
//   texto       -> lo que teclea el cliente (columna texto_codigo)
//   etiqueta    -> nombre corto para mostrarlo
//   descripcion -> explicación que ve el cliente
//   tipo        -> 'porcentaje' | 'monto_fijo' | 'NxM'
//   valor       -> el % o el monto, según el tipo (0 para NxM)
//   lleva/paga  -> solo para NxM (lleva 2, paga 1 = 2x1)
//   categoria   -> a qué categoría se limita, o null para toda la orden.
//                  Se guarda en la tabla `Ofertas` y es lo que lee
//                  `POST /ordenes` para saber a qué renglones aplica.

export const CODIGOS_DESCUENTO = [
  {
    texto: 'FRESCUERA',
    etiqueta: 'FRESCUERA',
    descripcion: '20% de descuento en frutas y verduras',
    tipo: 'porcentaje',
    valor: 20,
    categoria: 'Frutas y Verduras',
  },
  {
    texto: 'LLEVATEUNAVACA',
    etiqueta: 'LlevateUnaVaca',
    descripcion: '2x1 en lácteos',
    tipo: 'NxM',
    valor: 0,
    lleva: 2,
    paga: 1,
    categoria: 'Lácteos',
  },
  {
    texto: 'PARRILLADA',
    etiqueta: 'PARRILLADA',
    descripcion: '15% de descuento en carnes y pescados',
    tipo: 'porcentaje',
    valor: 15,
    categoria: 'Carnes',
  },
  {
    texto: 'REFRESCATE',
    etiqueta: 'REFRESCATE',
    descripcion: '3x2 en bebidas',
    tipo: 'NxM',
    valor: 0,
    lleva: 3,
    paga: 2,
    categoria: 'Bebidas',
  },
]
