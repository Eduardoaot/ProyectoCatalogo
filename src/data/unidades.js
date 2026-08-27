// Reglas de unidades de venta.
//
// La base guarda las cantidades como DECIMAL(10,3) y cada producto tiene un
// `factor_pieza`: cuánto pesa (o mide) UNA pieza expresado en la unidad de
// venta del producto. Por ejemplo, una manzana suelta pesa 0.18 kg, así que
// "3 piezas" son 0.54 kg. Esto es lo que permite ofrecer, en los productos a
// granel, comprar por kilo o por pieza indistintamente.
//
// REGLA IMPORTANTE: la cantidad canónica (la del carrito, la de la orden y la
// que descuenta stock) SIEMPRE está en la unidad de venta. El "modo" solo dice
// cómo lo eligió la persona, para poder mostrárselo igual que lo pidió.

const UNIDADES_A_GRANEL = new Set([
  'kg',
  'kilo',
  'kilos',
  'kilogramo',
  'kilogramos',
  'g',
  'gramo',
  'gramos',
  'litro',
  'litros',
  'l',
])

/** Máximo de decimales que acepta la API (cantidad_orden_producto DECIMAL(10,3)). */
export const DECIMALES_CANTIDAD = 3

/** Cómo se eligió la cantidad: en la unidad de venta o de a piezas sueltas. */
export const MODO_UNIDAD = 'unidad'
export const MODO_PIEZA = 'pieza'

/**
 * Salto de los botones +/- cuando se compra por peso/volumen: de kilo en kilo
 * se vuelve un salto enorme para fruta o carne, un cuarto es más realista.
 */
export const PASO_GRANEL = 0.25

/** Recorta el ruido de coma flotante (0.1 + 0.2 -> 0.3, no 0.30000000000000004). */
export function redondearCantidad(valor) {
  const numero = Number(valor)
  if (!Number.isFinite(numero)) return 0
  return Number(numero.toFixed(DECIMALES_CANTIDAD))
}

/** ¿Se vende por peso/volumen (admite decimales) o de a piezas enteras? */
export function esAGranel(producto) {
  return UNIDADES_A_GRANEL.has(String(producto?.unidad ?? '').trim().toLowerCase())
}

/** Equivalencia de una pieza en la unidad de venta. Nunca 0 ni negativa. */
export function factorPiezaDe(producto) {
  const factor = Number(producto?.factorPieza)
  return Number.isFinite(factor) && factor > 0 ? factor : 1
}

/**
 * ¿Se muestra el selector kilo/pieza?
 *
 * En todo lo que se vende a granel, sin más condiciones. Antes esto también
 * exigía que el factor fuera distinto de 1 (con factor 1 las dos opciones dan
 * lo mismo), pero eso escondía el selector en cuanto la base todavía no tenía
 * cargados los factores reales — y el selector tiene que estar siempre.
 */
export function permitePorPieza(producto) {
  return esAGranel(producto)
}

/**
 * ¿El factor de este producto ya trae información real?
 *
 * Con factor 1 el selector sigue estando, pero una pieza equivale a una unidad
 * de venta: la línea de equivalencia no aporta nada y se calla.
 */
export function tieneFactorReal(producto) {
  return factorPiezaDe(producto) !== 1
}

/**
 * Modo con el que se agrega desde fuera del detalle del producto (la tarjeta
 * del catálogo, favoritos...). Ahí no hay dónde elegir kilos, y pedir un kilo
 * entero de carne por un clic no es lo que espera nadie: se agrega una pieza.
 */
export function modoPorDefecto(producto) {
  return permitePorPieza(producto) ? MODO_PIEZA : MODO_UNIDAD
}

/**
 * Cuánto suma o resta un toque a los botones +/-, en unidad de venta.
 * En modo pieza, una pieza; a granel por peso, un cuarto; el resto, uno.
 */
export function pasoDeProducto(producto, modo = MODO_UNIDAD) {
  if (modo === MODO_PIEZA) return factorPiezaDe(producto)
  return esAGranel(producto) ? PASO_GRANEL : 1
}

/**
 * Pasa de la cantidad canónica (unidad de venta) a la que hay que mostrarle a
 * la persona: 0.54 kg comprados de a piezas se le enseñan como "3".
 */
export function cantidadEnModo(cantidad, producto, modo) {
  if (modo === MODO_PIEZA) return redondearCantidad(cantidad / factorPiezaDe(producto))
  return redondearCantidad(cantidad)
}

/** El camino inverso: 3 piezas -> 0.54 kg. */
export function cantidadAUnidadDeVenta(cantidad, producto, modo) {
  if (modo === MODO_PIEZA) return redondearCantidad(cantidad * factorPiezaDe(producto))
  return redondearCantidad(cantidad)
}

/**
 * En modo pieza la cantidad tiene que ser un múltiplo exacto del factor: media
 * manzana no existe. Recorta hacia abajo (nunca cobra de más) después de
 * redondear, porque 0.54 / 0.18 da 2.9999999999999996 en coma flotante y un
 * floor a secas se comería una pieza entera.
 */
export function ajustarAlModo(cantidad, producto, modo) {
  if (modo !== MODO_PIEZA) return redondearCantidad(cantidad)
  const factor = factorPiezaDe(producto)
  const piezas = Math.floor(redondearCantidad(cantidad / factor) + 1e-9)
  return redondearCantidad(Math.max(piezas, 0) * factor)
}

/** 3 -> "3"; 0.54 -> "0.54"; 0.5400000000000001 -> "0.54". */
export function formatearCantidad(valor) {
  return String(redondearCantidad(valor))
}

/**
 * Texto de la cantidad tal como la eligió la persona: "3 pz" o "2.5 kg".
 * Recibe `t` porque la abreviatura de pieza sí está traducida.
 */
export function etiquetaCantidad(cantidad, producto, modo, t) {
  const mostrada = formatearCantidad(cantidadEnModo(cantidad, producto, modo))
  const unidad = modo === MODO_PIEZA ? t('producto.piezasCorto') : producto?.unidad
  return unidad ? `${mostrada} ${unidad}` : mostrada
}
