import { useMemo, useState } from 'react'
import Carousel from '../components/Carousel'
import ProductCard from '../components/ProductCard'
import { CATEGORIAS, PRODUCTOS } from '../data/productos'
import './Home.css'

const DURACION_TRANSICION_MS = 200

function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [transicionando, setTransicionando] = useState(false)

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todas') return PRODUCTOS
    return PRODUCTOS.filter((producto) => producto.categoria === categoriaActiva)
  }, [categoriaActiva])

  // Al cambiar de categoría, primero se desvanece la grilla (fade out) y,
  // una vez invisible, se actualiza el filtro y vuelve a aparecer (fade in).
  const cambiarCategoria = (categoria) => {
    if (categoria === categoriaActiva) return
    setTransicionando(true)
    setTimeout(() => {
      setCategoriaActiva(categoria)
      setTransicionando(false)
    }, DURACION_TRANSICION_MS)
  }

  return (
    <section className="home">
      <Carousel />

      <div className="home__intro">
        <h1>Catálogo Rosamark</h1>
        <p>Todo lo que necesitas para tu hogar, a un clic de distancia.</p>
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

      <div className={transicionando ? 'home__grid home__grid--transicion' : 'home__grid'}>
        {productosFiltrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  )
}

export default Home
