import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Carousel from './componentes/Carousel'
import ProductCard from './componentes/ProductCard'
import { CATEGORIAS, PRODUCTOS } from '../../data/productos'
import ICONOS_CATEGORIAS from '../../data/iconos'
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
  const catalogoRef = useRef(null)

  const [subFiltroActivo, setSubFiltroActivo] = useState(null)

  const [precioFiltro, setPrecioFiltro] = useState(500);
  const [ordenDropdownAbierto, setOrdenDropdownAbierto] = useState(false);
  
  const [precioMin, setPrecioMin] = useState(1);
  const [precioMax, setPrecioMax] = useState(500);

  const PRECIO_MIN_GLOBAL = 1;
  const PRECIO_MAX_GLOBAL = 500;

  const handleMinChange = (e) => {
    const valor = Math.min(Number(e.target.value), precioMax - 1);
    setPrecioMin(valor);
  };

  const handleMaxChange = (e) => {
    const valor = Math.max(Number(e.target.value), precioMin + 1);
    setPrecioMax(valor);
  };

  const [ordenNombre, setOrdenNombre] = useState('A-Z');

  // La categoría y la búsqueda se combinan: los filtros de categoría se
  // aplican sobre los resultados de búsqueda (y viceversa), no se
  // reemplazan entre sí.
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

  // Al llegar desde una búsqueda del navbar (Enter sin elegir del
  // dropdown), baja la vista hacia el catálogo en vez de dejar al usuario
  // arriba del todo, tapado por el carrusel.
  useEffect(() => {
    if (busqueda && catalogoRef.current) {
      catalogoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [busqueda])

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

  let mensajeIntro = 'Todo lo que necesitas para tu hogar, a un clic de distancia.'
  if (busqueda && categoriaActiva !== 'Todas') {
    mensajeIntro = `Resultados para "${busqueda}" en ${categoriaActiva}`
  } else if (busqueda) {
    mensajeIntro = `Resultados para "${busqueda}"`
  } else if (categoriaActiva !== 'Todas') {
    mensajeIntro = `Categoría: ${categoriaActiva}`
  }

  const toggleSubFiltro = (filtro) => {
    setSubFiltroActivo(subFiltroActivo === filtro ? null : filtro)
  }

  return (
    <section className="home">
      <Carousel />

      <div className="home__intro">
        <h1>Catálogo Rosamark</h1>
        <p>{mensajeIntro}</p>
      </div>

      <div className="navbar__filtros-botones">
        {/* Botón y Barra de Categorías */}
        <div className="filtro-item">
          <button 
            type="button" 
            className={`filtro-btn ${subFiltroActivo === 'categorias' ? 'is-active' : ''}`} 
            onClick={() => toggleSubFiltro('categorias')}
          >
            Categorías 
            <svg className={`icono-flecha ${subFiltroActivo === 'categorias' ? 'activa' : ''}`} xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
          </button>
        </div>

        <div className="filtro-item">
          <button 
            type="button" 
            className={`filtro-btn ${subFiltroActivo === 'descuentos' ? 'is-active' : ''}`}
          >
            En oferta
          </button>
        </div>

        <div className="filtro-item">
          <button 
            type="button" 
            className={`filtro-btn ${subFiltroActivo === 'destacados' ? 'is-active' : ''}`}
          >
            Tendencias
          </button>
        </div>
      </div>

      {/* Sub-barra de Categorías (Ocupa todo el ancho disponible) */}
      <div className={`navbar__subfiltros-categorias-wrapper ${subFiltroActivo === 'categorias' ? 'is-open' : ''}`}>
        <div className="navbar__subfiltros-categorias-inner">
          <div className="navbar__subfiltros-categorias">
            <button
              type="button"
              className={`filtro filtro-categoria ${categoriaActiva === 'Todas' ? 'is-active' : ''}`}
              onClick={() => cambiarCategoria('Todas')}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M183.5-183.5Q160-207 160-240t23.5-56.5Q207-320 240-320t56.5 23.5Q320-273 320-240t-23.5 56.5Q273-160 240-160t-56.5-23.5Zm240 0Q400-207 400-240t23.5-56.5Q447-320 480-320t56.5 23.5Q560-273 560-240t-23.5 56.5Q513-160 480-160t-56.5-23.5Zm240 0Q640-207 640-240t23.5-56.5Q687-320 720-320t56.5 23.5Q800-273 800-240t-23.5 56.5Q753-160 720-160t-56.5-23.5Zm-480-240Q160-447 160-480t23.5-56.5Q207-560 240-560t56.5 23.5Q320-513 320-480t-23.5 56.5Q273-400 240-400t-56.5-23.5Zm240 0Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5Zm240 0Q640-447 640-480t23.5-56.5Q687-560 720-560t56.5 23.5Q800-513 800-480t-23.5 56.5Q753-400 720-400t-56.5-23.5Zm-480-240Q160-687 160-720t23.5-56.5Q207-800 240-800t56.5 23.5Q320-753 320-720t-23.5 56.5Q273-640 240-640t-56.5-23.5Zm240 0Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Zm240 0Q640-687 640-720t23.5-56.5Q687-800 720-800t56.5 23.5Q800-753 800-720t-23.5 56.5Q753-640 720-640t-56.5-23.5Z"/></svg>
              Todas
            </button>
            {CATEGORIAS.map((categoria) => (
              <button
                key={categoria}
                type="button"
                className="filtro-categoria"
                onClick={() => cambiarCategoria(categoria)}
              >
                {ICONOS_CATEGORIAS[categoria]}
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="home__sin-resultados">No encontramos productos que coincidan.</p>
      ) : (
        <div className="product__catalog">
          
          <div className="order__side-menu">
            
            {/* Filtro de Rango de Precio Doble */}
            <div className="side-menu__card">
              <h3 className="side-menu__title font-outfit">Rango de Precio</h3>
              <div className="side-menu__price-info font-outfit">
                <span>${precioMin}</span>
                <span>${precioMax}</span>
              </div>
              
              <div className="dual-slider">
                {/* Barra de fondo estática */}
                <div className="dual-slider__track"></div>
                
                {/* Barra de color que indica el rango activo */}
                <div 
                  className="dual-slider__progress"
                  style={{
                    left: `${((precioMin - PRECIO_MIN_GLOBAL) / (PRECIO_MAX_GLOBAL - PRECIO_MIN_GLOBAL)) * 100}%`,
                    width: `${((precioMax - precioMin) / (PRECIO_MAX_GLOBAL - PRECIO_MIN_GLOBAL)) * 100}%`
                  }}
                ></div>
                
                {/* Input para el mínimo */}
                <input 
                  type="range" 
                  min={PRECIO_MIN_GLOBAL} 
                  max={PRECIO_MAX_GLOBAL} 
                  value={precioMin}
                  onChange={handleMinChange}
                  className="dual-slider__input" 
                />
                
                {/* Input para el máximo */}
                <input 
                  type="range" 
                  min={PRECIO_MIN_GLOBAL} 
                  max={PRECIO_MAX_GLOBAL} 
                  value={precioMax}
                  onChange={handleMaxChange}
                  className="dual-slider__input" 
                />
              </div>
            </div>

            {/* Ordenar por Nombre */}
            <div className="side-menu__card side-menu__card--row">
              <span className="side-menu__label">Ordenar por nombre</span>
              
              <div className="side-menu__dropdown-container">
                <button 
                  type="button"
                  className="side-menu__dropdown-btn"
                  onClick={() => setOrdenDropdownAbierto(!ordenDropdownAbierto)}
                >
                  {ordenNombre} {/* Aquí mostramos la opción actual */}
                  <svg className={`icono-flecha ${ordenDropdownAbierto ? 'activa' : ''}`} xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                </button>
                
                <div className={`side-menu__dropdown-menu ${ordenDropdownAbierto ? 'is-open' : ''}`}>
                  <button 
                    type="button" 
                    className={`dropdown-item ${ordenNombre === 'A-Z' ? 'is-selected' : ''}`}
                    onClick={() => {
                      setOrdenNombre('A-Z');
                      setOrdenDropdownAbierto(false);
                    }}
                  >
                    A-Z
                  </button>
                  <button 
                    type="button" 
                    className={`dropdown-item ${ordenNombre === 'Z-A' ? 'is-selected' : ''}`}
                    onClick={() => {
                      setOrdenNombre('Z-A');
                      setOrdenDropdownAbierto(false);
                    }}
                  >
                    Z-A
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className={transicionando ? 'home__grid home__grid--transicion' : 'home__grid'}>
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      )}
      
    </section>
  )
}

export default Home
