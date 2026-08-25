import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../api/favoritos'
import { useAuth } from './AuthContext'
import { FavoritosContext } from './FavoritosContext'

/**
 * Favoritos del cliente, guardados en la tabla `Favoritos` de MySQL.
 *
 * El corazón de cada tarjeta se pinta al instante y solo después se confirma
 * con el servidor: si la petición falla, se deshace el cambio. Así marcar un
 * favorito se siente inmediato aunque la red tarde.
 */
export function FavoritosProvider({ children }) {
  const { usuario } = useAuth()
  const [ids, setIds] = useState(() => new Set())
  const [productos, setProductos] = useState([])
  const [dueno, setDueno] = useState(null)
  const [error, setError] = useState(null)

  // El estado se actualiza dentro del callback de la promesa, nunca de forma
  // síncrona en el cuerpo del efecto (react-hooks/set-state-in-effect).
  const cargar = useCallback(() => {
    const idCliente = usuario?.id ?? null
    const peticion = idCliente ? api.obtenerFavoritos() : Promise.resolve([])
    return peticion
      .catch(() => [])
      .then((lista) => {
        setProductos(lista)
        setIds(new Set(lista.map((p) => p.id)))
        setDueno(idCliente)
      })
  }, [usuario])

  useEffect(() => {
    cargar()
  }, [cargar])

  const esFavorito = useCallback((idProducto) => ids.has(Number(idProducto)), [ids])

  const alternar = async (producto) => {
    if (!usuario) {
      return { ok: false, necesitaSesion: true }
    }

    const id = Number(producto.id ?? producto)
    const eraFavorito = ids.has(id)

    // Pintado optimista.
    setIds((actual) => {
      const copia = new Set(actual)
      if (eraFavorito) copia.delete(id)
      else copia.add(id)
      return copia
    })
    setError(null)

    try {
      if (eraFavorito) {
        await api.quitarFavorito(id)
        setProductos((actual) => actual.filter((p) => p.id !== id))
      } else {
        const guardado = await api.agregarFavorito(id)
        setProductos((actual) => [guardado, ...actual.filter((p) => p.id !== id)])
      }
      return { ok: true, esFavorito: !eraFavorito }
    } catch (err) {
      // Se deshace el pintado optimista: el servidor manda.
      setIds((actual) => {
        const copia = new Set(actual)
        if (eraFavorito) copia.add(id)
        else copia.delete(id)
        return copia
      })
      setError(err.message)
      return { ok: false, error: err.message }
    }
  }

  const valor = useMemo(
    () => ({
      favoritos: productos,
      total: productos.length,
      // Mientras las peticiones van en camino, `dueno` todavía no coincide.
      cargando: Boolean(usuario) && dueno !== usuario.id,
      error,
      esFavorito,
      alternar,
      recargar: cargar,
    }),
    // `alternar` se recrea en cada render a propósito: necesita el `ids` actual.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productos, usuario, dueno, error, esFavorito, cargar],
  )

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>
}
