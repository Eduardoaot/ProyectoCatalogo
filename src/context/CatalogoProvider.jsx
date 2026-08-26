import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  obtenerCategorias,
  obtenerCodigos,
  obtenerOfertas,
  obtenerProductos,
} from '../api/catalogo'
import { CatalogoContext } from './CatalogoContext'

// Fuera del componente: solo pide datos, no toca el estado de React.
async function traerCatalogo() {
  const [productos, categorias, ofertas, codigos] = await Promise.all([
    obtenerProductos(),
    obtenerCategorias(),
    obtenerOfertas(),
    obtenerCodigos(),
  ])
  return { productos, categorias, ofertas, codigos }
}

/**
 * Carga el catálogo una sola vez al arrancar la app y lo comparte con todas
 * las pantallas. Antes esto eran los arreglos de src/data/; ahora viene de
 * MySQL a través de la API.
 *
 * `recargar()` se usa después de generar una orden, para que el stock que se
 * ve en pantalla refleje lo que el backend acaba de descontar.
 */
export function CatalogoProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [ofertas, setOfertas] = useState([])
  const [codigos, setCodigos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // El estado se actualiza dentro de los callbacks de la promesa, nunca de
  // forma síncrona en el cuerpo del efecto (react-hooks/set-state-in-effect).
  const cargar = useCallback(
    () =>
      traerCatalogo()
        .then((datos) => {
          setProductos(datos.productos)
          setCategorias(datos.categorias)
          setOfertas(datos.ofertas)
          setCodigos(datos.codigos)
          setError(null)
        })
        .catch((err) => setError(err.message))
        .finally(() => setCargando(false)),
    [],
  )

  useEffect(() => {
    cargar()
  }, [cargar])

  // Desde un manejador de eventos sí se puede marcar "cargando" de entrada.
  const reintentar = () => {
    setCargando(true)
    setError(null)
    cargar()
  }

  // Los filtros del catálogo, el menú lateral y el footer trabajan con
  // nombres de categoría, no con ids.
  const nombresCategorias = useMemo(
    () => categorias.map((categoria) => categoria.nombre),
    [categorias],
  )

  const buscarProducto = useCallback(
    (id) => productos.find((producto) => producto.id === Number(id)) ?? null,
    [productos],
  )

  const valor = {
    productos,
    categorias: nombresCategorias,
    categoriasCompletas: categorias,
    ofertas,
    codigos,
    cargando,
    error,
    recargar: cargar,
    reintentar,
    buscarProducto,
  }

  return <CatalogoContext.Provider value={valor}>{children}</CatalogoContext.Provider>
}
