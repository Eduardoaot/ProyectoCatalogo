import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { CATEGORIAS, PRODUCTOS } from '../data/productos'
import './Home.css'

function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todas') return PRODUCTOS
    return PRODUCTOS.filter((producto) => producto.categoria === categoriaActiva)
  }, [categoriaActiva])

  return (
    <section className="home">
      <div className="home__intro">
        <h1>Catálogo Rosamark</h1>
        <p>Todo lo que necesitas para tu hogar, a un clic de distancia.</p>
      </div>

      <div className="home__filtros">
        <button
          type="button"
          className={categoriaActiva === 'Todas' ? 'filtro is-active' : 'filtro'}
          onClick={() => setCategoriaActiva('Todas')}
        >
          Todas
        </button>
        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria}
            type="button"
            className={categoriaActiva === categoria ? 'filtro is-active' : 'filtro'}
            onClick={() => setCategoriaActiva(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="home__grid">
        {productosFiltrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  )
}

export default Home
