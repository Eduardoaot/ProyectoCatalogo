// Favoritos del cliente autenticado. La API los devuelve con la misma forma
// que /productos, así que se reutiliza el mismo adaptador del catálogo.

import { adaptarProducto } from './catalogo'
import { pedir } from './cliente'

export async function obtenerFavoritos() {
  const data = await pedir('/favoritos', { autenticado: true })
  return data.favoritos.map((fila) => ({
    ...adaptarProducto(fila),
    agregadoEn: fila.agregado_en,
  }))
}

export async function agregarFavorito(idProducto) {
  const fila = await pedir('/favoritos', {
    metodo: 'POST',
    autenticado: true,
    cuerpo: { ID_producto: idProducto },
  })
  return { ...adaptarProducto(fila), agregadoEn: fila.agregado_en }
}

export async function quitarFavorito(idProducto) {
  return pedir(`/favoritos/${idProducto}`, { metodo: 'DELETE', autenticado: true })
}
