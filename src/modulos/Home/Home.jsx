import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Carousel from './componentes/Carousel'
import ProductCard from './componentes/ProductCard'
import { usePreferencias } from '../../context/PreferenciasContext'
import { useCatalogo } from '../../context/CatalogoContext'
import { ICONO_POR_CATEGORIA, ICONO_TODAS } from '../../data/categoriaMeta'
import './Home.css'

const DURACION_TRANSICION_MS = 200

function Home() {
  const { productos, categorias, cargando, error, reintentar } = useCatalogo()
  const { t } = usePreferencias()
  // La URL es la única fuente de verdad del filtro: ?categoria=... permite
  // que el dropdown del menú lateral enlace directo a un filtro aplicado,
  // y ?buscar=... conecta la barra de búsqueda del navbar.
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaActiva = searchParams.get('categoria') || 'Todas'
  const busqueda = searchParams.get('buscar') || ''

  const [transicionando, setTransicionando] = useState(false)
  const catalogoRef = useRef(null)

  // La categoría y la búsqueda se combinan: los filtros de categoría se
  // aplican sobre los resultados de búsqueda (y viceversa), no se
  // reemplazan entre sí.
  const productosFiltrados = useMemo(() => {
    let lista = productos
    if (categoriaActiva !== 'Todas') {
      lista = lista.filter((producto) => producto.categoria === categoriaActiva)
    }
    if (busqueda) {
      const texto = busqueda.toLowerCase()
      lista = lista.filter((producto) => producto.nombre.toLowerCase().includes(texto))
    }
    return lista
  }, [productos, categoriaActiva, busqueda])

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

  // null = eslogan por defecto (con su segunda línea); si hay búsqueda o
  // categoría activa, se muestra ese mensaje en su lugar.
  let mensajeIntro = null
  if (busqueda && categoriaActiva !== 'Todas') {
    mensajeIntro = t('home.resultadosEn', { texto: busqueda, categoria: t(`cat.${categoriaActiva}`) })
  } else if (busqueda) {
    mensajeIntro = t('home.resultadosPara', { texto: busqueda })
  } else if (categoriaActiva !== 'Todas') {
    mensajeIntro = t('home.categoria', { categoria: t(`cat.${categoriaActiva}`) })
  }

  // El catálogo viene de la API, así que hay dos estados nuevos que antes no
  // existían: mientras carga, y cuando el backend no responde.
  if (error) {
    return (
      <section className="home home--aviso">
        <h1>{t('home.errorTitulo')}</h1>
        <p className="home__error">{error}</p>
        <button type="button" className="filtro" onClick={reintentar}>
          {t('home.reintentar')}
        </button>
      </section>
    )
  }

  if (cargando) {
    return (
      <section className="home home--aviso">
        <h1>{t('home.titulo')}</h1>
        <p>{t('home.cargando')}</p>
      </section>
    )
  }

  return (
    <section className="home">
      <Carousel />

      <div className="home__intro">
        <h1 className="home__intro-titulo">{t('home.titulo')}</h1>
        <p className="home__intro-eslogan">
          <span className="home__intro-eslogan-punto" aria-hidden="true" />
          {mensajeIntro ?? t('home.eslogan')}
        </p>
        {!mensajeIntro && <p className="home__intro-eslogan2">{t('home.eslogan2')}</p>}
      </div>

      <div className="home__filtros" ref={catalogoRef}>
        <button
          type="button"
          className={categoriaActiva === 'Todas' ? 'filtro is-active' : 'filtro'}
          onClick={() => cambiarCategoria('Todas')}
        >
          <span className="filtro__icono">
            <ICONO_TODAS />
          </span>
          <span>{t('home.todas')}</span>
        </button>
        {categorias.map((categoria) => {
          const Icono = ICONO_POR_CATEGORIA[categoria]
          return (
            <button
              key={categoria}
              type="button"
              className={categoriaActiva === categoria ? 'filtro is-active' : 'filtro'}
              onClick={() => cambiarCategoria(categoria)}
            >
              <span className="filtro__icono">{Icono && <Icono />}</span>
              <span>{t(`cat.${categoria}`)}</span>
            </button>
          )
        })}
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="home__sin-resultados">{t('home.sinResultados')}</p>
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
