import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  // Ancla de scroll: tanto una búsqueda nueva como un cambio de categoría
  // llevan la vista hasta acá (el título "Catálogo Rosamark"), nunca más
  // abajo ni más arriba, sin importar cuánto cambie de alto la grilla.
  const introRef = useRef(null)

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

  // Lleva la vista al título del catálogo después de filtrar (búsqueda del
  // navbar o botón de categoría), en vez de dejar al usuario arriba del todo
  // tapado por el carrusel.
  //
  // No se usa scrollIntoView a propósito: al filtrar, la grilla se queda con
  // muchos menos productos y la página entera se vuelve más baja. Si el
  // destino calculado ya no existe, el navegador recorta el scroll hasta el
  // final del documento — y el usuario terminaba mirando el footer con los
  // resultados por encima. Se mide a mano y, si no se llega, se vuelve
  // directamente arriba (con una página tan corta igual se ve todo).
  const irAlCatalogo = useCallback(() => {
    // En el frame siguiente: para entonces la grilla nueva ya está en el DOM
    // y getBoundingClientRect devuelve la posición definitiva, no la vieja.
    requestAnimationFrame(() => {
      const intro = introRef.current
      if (!intro) return
      const navbarAlto =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-alto'),
        ) || 0
      const destino = intro.getBoundingClientRect().top + window.scrollY - navbarAlto - 12
      const maximo = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      window.scrollTo({
        top: destino > maximo ? 0 : Math.max(0, destino),
        behavior: 'smooth',
      })
    })
  }, [])

  // Se dispara con el filtro ya aplicado (no al hacer clic), así la medición
  // de arriba ve la altura real de la página. En la primera carga solo se
  // mueve si la URL ya traía un filtro; si no, se respeta el arranque arriba.
  const primeraVez = useRef(true)
  useEffect(() => {
    if (cargando) return
    if (primeraVez.current) {
      primeraVez.current = false
      if (!busqueda && categoriaActiva === 'Todas') return
    }
    irAlCatalogo()
  }, [busqueda, categoriaActiva, cargando, irAlCatalogo])

  // Al cambiar de categoría desde los botones de filtro, primero se
  // desvanece la grilla (fade out) y, una vez invisible, se actualiza la
  // URL (lo que a su vez cambia productosFiltrados) y vuelve a aparecer.
  //
  // El scroll no se dispara acá sino en el efecto de arriba, cuando la
  // grilla nueva ya está montada: hacerlo antes significaba medir la página
  // vieja y acabar en una posición que ya no existía.
  const cambiarCategoria = (categoria, boton) => {
    if (categoria === categoriaActiva) return
    // Sin esto, el navegador intenta mantener visible el botón recién
    // enfocado y "pelea" con nuestro scroll hacia el título de arriba.
    boton?.blur()
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

      <div className="home__intro" ref={introRef}>
        <h1 className="home__intro-titulo">{t('home.titulo')}</h1>
        <p className="home__intro-eslogan">
          <span className="home__intro-eslogan-punto" aria-hidden="true" />
          {mensajeIntro ?? t('home.eslogan')}
        </p>
        {!mensajeIntro && <p className="home__intro-eslogan2">{t('home.eslogan2')}</p>}
      </div>

      <div className="home__filtros">
        <button
          type="button"
          className={categoriaActiva === 'Todas' ? 'filtro is-active' : 'filtro'}
          onClick={(e) => cambiarCategoria('Todas', e.currentTarget)}
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
              onClick={(e) => cambiarCategoria(categoria, e.currentTarget)}
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
