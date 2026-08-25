/**
 * Reglas de descuento del catalogo.
 *
 * Tipos soportados (columna Descuentos_tipos.tipo_descuento, sin distinguir
 * mayusculas ni acentos):
 *   - "porcentaje"  -> descuento_valor es un % sobre el precio unitario.
 *   - "monto_fijo"  -> descuento_valor son pesos que se restan al precio unitario.
 *   - "NxM" / "3x2" -> promo por volumen usando cantidad_lleva / cantidad_paga.
 *                      Si esas columnas vienen nulas se leen los numeros del
 *                      propio texto del tipo ("3x2" => lleva 3, paga 2).
 */

export const TIPO_PORCENTAJE = 'porcentaje';
export const TIPO_MONTO_FIJO = 'monto_fijo';
export const TIPO_NXM = 'NxM';

function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function redondear(valor, decimales = 2) {
  const factor = 10 ** decimales;
  return Math.round((Number(valor) + Number.EPSILON) * factor) / factor;
}

/** Devuelve 'porcentaje' | 'monto_fijo' | 'NxM' | null a partir del texto del tipo. */
export function clasificarTipo(tipoDescuento) {
  const t = normalizar(tipoDescuento);
  if (!t) return null;
  if (t.includes('porcent') || t === '%') return TIPO_PORCENTAJE;
  if (t.includes('monto') || t.includes('fijo')) return TIPO_MONTO_FIJO;
  if (t.includes('nxm') || /\d+\s*x\s*\d+/.test(t)) return TIPO_NXM;
  return null;
}

/** Extrae "lleva"/"paga" de las columnas o, en su defecto, del texto "3x2". */
function leerNxM(descuento) {
  let lleva = Number(descuento.cantidad_lleva);
  let paga = Number(descuento.cantidad_paga);

  if (!Number.isFinite(lleva) || !Number.isFinite(paga) || lleva <= 0 || paga < 0) {
    const match = normalizar(descuento.tipo_descuento).match(/(\d+)\s*x\s*(\d+)/);
    if (!match) return null;
    lleva = Number(match[1]);
    paga = Number(match[2]);
  }

  if (!Number.isFinite(lleva) || !Number.isFinite(paga)) return null;
  if (lleva <= 0 || paga < 0 || paga >= lleva) return null;
  return { lleva, paga };
}

function soloFecha(valor) {
  if (!valor) return null;
  return String(valor).slice(0, 10);
}

export function hoyISO(fecha = new Date()) {
  const desfase = fecha.getTimezoneOffset() * 60000;
  return new Date(fecha.getTime() - desfase).toISOString().slice(0, 10);
}

/**
 * Un descuento esta vigente si la fecha esta dentro del rango.
 * Las fechas nulas se interpretan como "sin limite" por ese extremo.
 */
export function estaVigente(descuento, fechaISO = hoyISO()) {
  if (!descuento) return false;
  const inicio = soloFecha(descuento.fecha_inicio);
  const fin = soloFecha(descuento.fecha_final);
  if (inicio && fechaISO < inicio) return false;
  if (fin && fechaISO > fin) return false;
  return true;
}

/**
 * Calcula el importe de un renglon aplicando el descuento (si aplica).
 * @returns {{subtotal:number, descuento_aplicado:number, total:number,
 *            precio_unitario:number, tipo_aplicado:string|null, detalle:string|null}}
 */
export function calcularRenglon({ precio, cantidad, descuento = null, fechaISO = hoyISO() }) {
  const precioUnitario = Number(precio);
  const cant = Number(cantidad);
  const subtotal = redondear(precioUnitario * cant);

  const sinDescuento = {
    subtotal,
    descuento_aplicado: 0,
    total: subtotal,
    precio_unitario: redondear(precioUnitario),
    tipo_aplicado: null,
    detalle: null,
  };

  if (!descuento || !estaVigente(descuento, fechaISO)) return sinDescuento;

  const tipo = clasificarTipo(descuento.tipo_descuento);
  const valor = Number(descuento.descuento_valor ?? 0);
  let total;
  let detalle;

  if (tipo === TIPO_PORCENTAJE) {
    const porcentaje = Math.min(Math.max(valor, 0), 100);
    if (porcentaje === 0) return sinDescuento;
    total = subtotal * (1 - porcentaje / 100);
    detalle = `${porcentaje}% sobre ${cant} unidad(es)`;
  } else if (tipo === TIPO_MONTO_FIJO) {
    const monto = Math.max(valor, 0);
    if (monto === 0) return sinDescuento;
    const precioConDescuento = Math.max(precioUnitario - monto, 0);
    total = precioConDescuento * cant;
    detalle = `-${redondear(monto)} por unidad`;
  } else if (tipo === TIPO_NXM) {
    const nxm = leerNxM(descuento);
    if (!nxm) return sinDescuento;
    const grupos = Math.floor(cant / nxm.lleva);
    if (grupos < 1) return sinDescuento;
    const resto = cant - grupos * nxm.lleva;
    const unidadesPagadas = grupos * nxm.paga + resto;
    total = precioUnitario * unidadesPagadas;
    detalle = `${nxm.lleva}x${nxm.paga}: pagas ${redondear(unidadesPagadas, 3)} de ${cant}`;
  } else {
    return sinDescuento;
  }

  total = redondear(Math.max(total, 0));
  return {
    subtotal,
    descuento_aplicado: redondear(subtotal - total),
    total,
    precio_unitario: redondear(precioUnitario),
    tipo_aplicado: tipo,
    detalle,
  };
}

/**
 * Descuento de un codigo aplicado sobre la orden completa.
 *
 * Se calcula DESPUES de los descuentos propios de cada producto: recibe los
 * renglones ya resueltos y trabaja sobre su total.
 *
 * @param {object} opciones
 * @param {Array} opciones.renglones  [{ ID_categoria, cantidad, total }]
 * @param {object} opciones.descuento Fila de Descuentos_valores + tipo_descuento.
 * @param {number|null} [opciones.ID_categoria] Si el codigo esta limitado a una
 *        categoria (via la tabla Ofertas), solo cuentan los renglones de esa
 *        categoria. Si es null, aplica a toda la orden.
 * @returns {{monto:number, detalle:string|null}}
 */
export function calcularDescuentoCodigo({
  renglones,
  descuento,
  ID_categoria = null,
  fechaISO = hoyISO(),
}) {
  const nulo = { monto: 0, detalle: null };
  if (!descuento || !estaVigente(descuento, fechaISO)) return nulo;

  const elegibles = ID_categoria
    ? renglones.filter((r) => r.ID_categoria === ID_categoria)
    : renglones;
  if (elegibles.length === 0) return nulo;

  const baseElegible = redondear(elegibles.reduce((acc, r) => acc + r.total, 0));
  if (baseElegible <= 0) return nulo;

  const tipo = clasificarTipo(descuento.tipo_descuento);
  const valor = Number(descuento.descuento_valor ?? 0);

  if (tipo === TIPO_PORCENTAJE) {
    const porcentaje = Math.min(Math.max(valor, 0), 100);
    if (porcentaje === 0) return nulo;
    return {
      monto: redondear(baseElegible * (porcentaje / 100)),
      detalle: `${porcentaje}% sobre ${redondear(baseElegible)}`,
    };
  }

  if (tipo === TIPO_MONTO_FIJO) {
    const monto = Math.min(Math.max(valor, 0), baseElegible);
    if (monto === 0) return nulo;
    return { monto: redondear(monto), detalle: `-${redondear(monto)} sobre la orden` };
  }

  if (tipo === TIPO_NXM) {
    const nxm = leerNxM(descuento);
    if (!nxm) return nulo;

    let monto = 0;
    for (const renglon of elegibles) {
      const grupos = Math.floor(renglon.cantidad / nxm.lleva);
      if (grupos < 1) continue;
      // Precio unitario ya efectivo (con el descuento propio del producto).
      const unitario = renglon.total / renglon.cantidad;
      monto += grupos * (nxm.lleva - nxm.paga) * unitario;
    }
    if (monto <= 0) return nulo;
    return {
      monto: redondear(Math.min(monto, baseElegible)),
      detalle: `${nxm.lleva}x${nxm.paga} aplicado a los productos elegibles`,
    };
  }

  return nulo;
}

/** Precio unitario ya con descuento, util para mostrar el catalogo. */
export function precioConDescuento(precio, descuento, fechaISO = hoyISO()) {
  return calcularRenglon({ precio, cantidad: 1, descuento, fechaISO }).total;
}

/** Da forma al bloque `descuento` que se devuelve en las respuestas JSON. */
export function mapearDescuento(fila, fechaISO = hoyISO()) {
  if (!fila || fila.ID_descuento === null || fila.ID_descuento === undefined) return null;
  return {
    ID_descuento: fila.ID_descuento,
    ID_descuento_tipo: fila.ID_descuento_tipo ?? null,
    tipo_descuento: fila.tipo_descuento ?? null,
    tipo_normalizado: clasificarTipo(fila.tipo_descuento),
    nombre_descuento: fila.nombre_descuento ?? null,
    descuento_valor: fila.descuento_valor ?? null,
    cantidad_lleva: fila.cantidad_lleva ?? null,
    cantidad_paga: fila.cantidad_paga ?? null,
    fecha_inicio: soloFecha(fila.fecha_inicio),
    fecha_final: soloFecha(fila.fecha_final),
    vigente: estaVigente(fila, fechaISO),
  };
}
