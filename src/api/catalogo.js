// Lectura del catálogo desde la API, adaptada a la forma que ya usaban los
// componentes (producto.nombre, .precio, .emoji, .destacado, ...). Así el
// cambio de "datos quemados" a "datos de MySQL" no obliga a reescribir cada
// tarjeta, filtro y pantalla de detalle.

import { pedir } from './cliente'

/**
 * Fila de la API -> objeto de producto que consume la UI.
 *
 * `precio` es el precio final (ya con el descuento del producto aplicado) y
 * `precioOriginal` el de lista, que es justo lo que la UI tacha cuando hay
 * oferta. Para promos por volumen (NxM) la API no baja el precio unitario,
 * así que ahí ambos coinciden y no se tacha nada — igual que antes.
 */
export function adaptarProducto(fila) {
  return {
    id: fila.ID_producto,
    nombre: fila.nombre_producto,
    categoria: fila.categoria?.nombre_categoria ?? '',
    categoriaId: fila.categoria?.ID_categoria ?? null,
    precio: Number(fila.precio_con_descuento ?? fila.precio_producto),
    precioOriginal: Number(fila.precio_producto),
    unidad: fila.unidad?.nombre_unidad ?? '',
    // La columna se llama `imagen` en la base; la UI lo sigue leyendo como
    // `emoji` porque ImagenProducto acepta tanto una URL como un emoji.
    emoji: fila.imagen ?? '',
    descripcion: fila.descripcion ?? '',
    destacado: Boolean(fila.destacado),
    stock: Number(fila.cantidad_producto),
    descuento: fila.descuento ?? null,
  }
}

export function adaptarOferta(fila) {
  return {
    id: fila.ID_oferta,
    titulo: fila.titulo_oferta,
    texto: fila.descripcion_oferta ?? '',
    beneficio: fila.descripcion_beneficio ?? null,
    codigo: fila.codigo?.texto_codigo ?? null,
    imagen: fila.imagen_oferta ?? '',
  }
}

/** Trae el catálogo completo (el límite de la API es 200 por página). */
export async function obtenerProductos() {
  const data = await pedir('/productos', { query: { limit: 200 } })
  return data.productos.map(adaptarProducto)
}

export async function obtenerProducto(id) {
  return adaptarProducto(await pedir(`/productos/${id}`))
}

export async function obtenerCategorias() {
  const filas = await pedir('/categorias')
  return filas.map((fila) => ({
    id: fila.ID_categoria,
    nombre: fila.nombre_categoria,
  }))
}

export async function obtenerOfertas() {
  const filas = await pedir('/ofertas')
  return filas.map(adaptarOferta)
}

/** Códigos publicados, para anunciarlos en el footer. */
export async function obtenerCodigos() {
  const filas = await pedir('/descuentos/codigos')
  return filas
    .filter((fila) => fila.descuento?.vigente)
    .map((fila) => ({
      texto: fila.texto_codigo,
      etiqueta: fila.etiqueta_codigo ?? fila.texto_codigo,
      descripcion: fila.descripcion_codigo ?? fila.descuento?.nombre_descuento ?? '',
    }))
}

/** Valida un código de descuento contra la base (existencia + vigencia). */
export async function validarCodigo(textoCodigo) {
  const data = await pedir('/descuentos/validar-codigo', {
    metodo: 'POST',
    cuerpo: { texto_codigo: textoCodigo },
  })
  return {
    texto: data.texto_codigo,
    etiqueta: data.etiqueta_codigo ?? data.texto_codigo,
    descripcion: data.descripcion_codigo ?? data.descuento?.nombre_descuento ?? '',
    descuento: data.descuento,
    categoria: data.categoria ?? null,
  }
}
