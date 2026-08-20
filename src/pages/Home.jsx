import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Carousel from '../components/Carousel'
import ProductCard from '../components/ProductCard'
import { CATEGORIAS, PRODUCTOS } from '../data/productos'
import './Home.css'

const DURACION_TRANSICION_MS = 200

function Home() {
  // La URL es la única fuente de verdad del filtro: ?categoria=... permite
  // que el dropdown del menú lateral enlace directo a un filtro aplicado,
  // y ?buscar=... conecta la barra de búsqueda del navbar.
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaActiva = searchParams.get('categoria') || 'Todas'
  const busqueda = searchParams.get('buscar') || ''

  const [transicionando, setTransicionando] = useState(false)

  const productosFiltrados = useMemo(() => {
    let lista = PRODUCTOS
    if (categoriaActiva !== 'Todas') {
      lista = lista.filter((producto) => producto.categoria === categoriaActiva)
    }
    if (busqueda) {
      const texto = busqueda.toLowerCase()
      lista = lista.filter((producto) => producto.nombre.toLowerCase().includes(texto))
    }
    return lista
  }, [categoriaActiva, busqueda])

  // Al cambiar de categoría desde los botones de filtro, primero se
  // desvanece la grilla (fade out) y, una vez invisible, se actualiza la
  // URL (lo que a su vez cambia productosFiltrados) y vuelve a aparecer.
  const cambiarCategoria = (categoria) => {
    if (categoria === categoriaActiva) return
    setTransicionando(true)
    setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (categoria === 'Todas') {
        params.delete('categoria')
      } else {
        params.set('categoria', categoria)
      }
      setSearchParams(params)
      setTransicionando(false)
    }, DURACION_TRANSICION_MS)
  }

  return (
    <section className="home">
      <Carousel />

      <div className="home__intro">
        <h1>Catálogo Rosamark</h1>
        <p>
          {busqueda
            ? `Resultados para "${busqueda}"`
            : 'Todo lo que necesitas para tu hogar, a un clic de distancia.'}
        </p>
      </div>

      <div className="home__filtros">
        <button
          type="button"
          className={categoriaActiva === 'Todas' ? 'filtro is-active' : 'filtro'}
          onClick={() => cambiarCategoria('Todas')}
        >
          Todas
        </button>
        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria}
            type="button"
            className={categoriaActiva === categoria ? 'filtro is-active' : 'filtro'}
            onClick={() => cambiarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="home__sin-resultados">No encontramos productos que coincidan.</p>
      ) : (
        <div className={transicionando ? 'home__grid home__grid--transicion' : 'home__grid'}>
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Home
