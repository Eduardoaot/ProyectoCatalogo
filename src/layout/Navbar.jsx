import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import LogoRosa from '../assets/LogoRosa.png'
import LogoLetras from '../assets/LogoLetras.png'
import PreferenciasPanel from '../common/PreferenciasPanel'
import { formatearCantidad } from '../data/unidades'
import { useAuth } from '../context/AuthContext'
import { useCatalogo } from '../context/CatalogoContext'
import { usePreferencias } from '../context/PreferenciasContext'
import { useTienda } from '../context/TiendaContext'
import {
  IconoAjustes,
  IconoBuscar,
  IconoCarrito,
  IconoCorazon,
  IconoLuna,
  IconoMenu,
  IconoPanelLateral,
  IconoSol,
  IconoX,
} from '../common/iconos'
import MenuLateral from './MenuLateral'
import './Navbar.css'

// A partir de qué tanto scroll hacia abajo empieza a poder ocultarse la
// navbar (evita que "parpadee" con pequeños scrolls cerca del tope).
const UMBRAL_SCROLL_PX = 80
const MAX_SUGERENCIAS = 6
// Separador improbable de encontrar en un nombre real: sirve para partir la
// plantilla traducida "Hola, {nombre}" en un "antes" y un "después" del
// nombre, sin asumir el orden de las palabras (varía según el idioma).
const MARCADOR = '§'

function Navbar() {
  const { usuario } = useAuth()
  const { productos } = useCatalogo()
  const { totalUnidades, abrirPanel } = useTienda()
  const { t, esOscuro, alternarTema } = usePreferencias()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [menuAbierto, setMenuAbierto] = useState(false)
  const [preferenciasAbiertas, setPreferenciasAbiertas] = useState(false)
  const [oculta, setOculta] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  // Índice de la sugerencia resaltada con el teclado (-1 = ninguna).
  const [indiceActivo, setIndiceActivo] = useState(-1)
  const ultimoScrollRef = useRef(0)
  const navRef = useRef(null)

  // Comportamiento tipo Amazon: al bajar se oculta, al subir reaparece.
  useEffect(() => {
    const alHacerScroll = () => {
      const actual = window.scrollY
      const anterior = ultimoScrollRef.current
      setOculta(actual > anterior && actual > UMBRAL_SCROLL_PX)
      ultimoScrollRef.current = actual
    }
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => window.removeEventListener('scroll', alHacerScroll)
  }, [])

  // Expone la altura real de la navbar como variable CSS para que el
  // contenido de la página deje el espacio justo (la navbar es fixed).
  useEffect(() => {
    const actualizarAltura = () => {
      if (navRef.current) {
        document.documentElement.style.setProperty(
          '--navbar-alto',
          `${navRef.current.offsetHeight}px`,
        )
      }
    }
    actualizarAltura()
    window.addEventListener('resize', actualizarAltura)
    return () => window.removeEventListener('resize', actualizarAltura)
  }, [])

  const sugerencias = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return []
    return productos
      .filter((producto) => producto.nombre.toLowerCase().includes(texto))
      .slice(0, MAX_SUGERENCIAS)
  }, [productos, busqueda])

  const hayDropdown = mostrarSugerencias && sugerencias.length > 0

  const irAProducto = (id) => {
    setBusqueda('')
    setMostrarSugerencias(false)
    setIndiceActivo(-1)
    navigate(`/producto/${id}`)
  }

  // Teclado: flechas para recorrer la lista, Enter para abrir la sugerencia
  // resaltada (si no hay ninguna, Enter cae en el submit de siempre) y Escape
  // para cerrar sin perder lo escrito.
  const teclaEnBusqueda = (e) => {
    if (e.key === 'Escape') {
      setMostrarSugerencias(false)
      setIndiceActivo(-1)
      return
    }
    if (!hayDropdown) {
      if (e.key === 'ArrowDown') setMostrarSugerencias(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndiceActivo((i) => (i + 1) % sugerencias.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceActivo((i) => (i <= 0 ? sugerencias.length : i) - 1)
    } else if (e.key === 'Enter' && indiceActivo >= 0 && sugerencias[indiceActivo]) {
      e.preventDefault()
      irAProducto(sugerencias[indiceActivo].id)
    }
  }

  // Enter sin elegir nada del dropdown: mantiene la búsqueda de siempre
  // (navega a "/?buscar=..."), Home.jsx se encarga de bajar la vista hacia
  // el catálogo cuando detecta una búsqueda nueva.
  const buscar = (e) => {
    e.preventDefault()
    setMostrarSugerencias(false)
    const texto = busqueda.trim()
    navigate(texto ? `/?buscar=${encodeURIComponent(texto)}` : '/')
  }

  const limpiarBusqueda = () => {
    setBusqueda('')
    setMostrarSugerencias(false)
    if (location.pathname === '/' && searchParams.get('buscar')) {
      const params = new URLSearchParams(searchParams)
      params.delete('buscar')
      setSearchParams(params)
    }
  }

  // El nombre se pinta en su propio <span> (recortable con "…" por CSS, ver
  // Navbar.css) en vez de quedar embebido en el string traducido: así un
  // nombre largo no empuja/deforma el buscador, sea cual sea el idioma.
  const [antesDelNombre, despuesDelNombre] = usuario
    ? t('nav.hola', { nombre: MARCADOR }).split(MARCADOR)
    : []

  return (
    <>
      <header ref={navRef} className={oculta ? 'navbar navbar--oculta' : 'navbar'}>
        <div className="navbar__inner">
          <div className="navbar__izquierda">
            <button
              type="button"
              className="navbar__hamburguesa"
              aria-label={t('nav.menu')}
              onClick={() => setMenuAbierto(true)}
            >
              <IconoMenu className="navbar__icono" />
            </button>
            <Link to="/" className="navbar__brand">
              <img className="navbar__logo" src={LogoRosa} alt="" />
              <img className="navbar__brand-texto" src={LogoLetras} alt="Rosamark" />
            </Link>
          </div>

          <form
            className="navbar__busqueda"
            onSubmit={buscar}
            role="search"
            onBlur={(e) => {
              // Solo se cierra si el foco se fue del buscador entero: con el
              // `onBlur` pelado, mover el foco al botón de limpiar (o a una
              // sugerencia) cerraba la lista antes de poder usarla.
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setMostrarSugerencias(false)
                setIndiceActivo(-1)
              }
            }}
          >
            <IconoBuscar className="navbar__icono-buscar" />
            <input
              type="text"
              className="navbar__input-busqueda"
              placeholder={t('nav.buscar')}
              value={busqueda}
              autoComplete="off"
              onChange={(e) => {
                setBusqueda(e.target.value)
                setMostrarSugerencias(true)
                setIndiceActivo(-1)
              }}
              onFocus={() => setMostrarSugerencias(true)}
              onKeyDown={teclaEnBusqueda}
              role="combobox"
              aria-expanded={hayDropdown}
              aria-controls="navbar-sugerencias"
              aria-activedescendant={
                indiceActivo >= 0 ? `navbar-sugerencia-${indiceActivo}` : undefined
              }
            />
            {busqueda && (
              <button
                type="button"
                className="navbar__limpiar-busqueda"
                aria-label={t('nav.buscar')}
                onMouseDown={(e) => e.preventDefault()}
                onClick={limpiarBusqueda}
              >
                <IconoX className="navbar__icono-limpiar" />
              </button>
            )}

            {hayDropdown && (
              <ul className="navbar__sugerencias" id="navbar-sugerencias" role="listbox">
                {sugerencias.map((producto, indice) => (
                  <li key={producto.id} role="presentation">
                    <button
                      type="button"
                      id={`navbar-sugerencia-${indice}`}
                      role="option"
                      aria-selected={indice === indiceActivo}
                      className={
                        indice === indiceActivo
                          ? 'navbar__sugerencia is-activa'
                          : 'navbar__sugerencia'
                      }
                      // onPointerDown cubre ratón, dedo y lápiz de una sola
                      // vez, y el preventDefault evita que el botón robe el
                      // foco (si lo robaba, el onBlur del form cerraba la
                      // lista y el clic se perdía en el aire). El onClick
                      // queda de respaldo por si el navegador no manda
                      // eventos de puntero.
                      onPointerDown={(e) => {
                        e.preventDefault()
                        irAProducto(producto.id)
                      }}
                      onClick={() => irAProducto(producto.id)}
                      onMouseEnter={() => setIndiceActivo(indice)}
                    >
                      <span className="navbar__sugerencia-nombre">{producto.nombre}</span>
                      <span className="navbar__sugerencia-categoria">
                        {t(`cat.${producto.categoria}`)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="navbar__derecha">
            <Link to={usuario ? '/cuenta' : '/login'} className="navbar__link navbar__link--usuario">
              {usuario ? (
                <>
                  {antesDelNombre}
                  <span className="navbar__usuario-nombre">{usuario.nombre}</span>
                  {despuesDelNombre}
                </>
              ) : (
                t('nav.iniciarSesion')
              )}
            </Link>
            <Link
              to={usuario ? '/ordenes' : '/login'}
              state={usuario ? undefined : { from: '/ordenes' }}
              className="navbar__link"
            >
              {t('nav.ordenes')}
            </Link>
            <Link
              to="/favoritos"
              className="navbar__favoritos"
              aria-label={t('nav.favoritos')}
              title={t('nav.favoritos')}
            >
              <IconoCorazon className="navbar__icono" />
            </Link>
            <Link to="/carrito" className="navbar__carrito" aria-label={t('nav.carrito')}>
              <IconoCarrito className="navbar__icono" />
              {totalUnidades > 0 && (
                <span className="navbar__carrito-badge">
                  {formatearCantidad(totalUnidades)}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="navbar__abrir-panel"
              aria-label={t('nav.vistaRapida')}
              title={t('nav.vistaRapida')}
              onClick={abrirPanel}
            >
              <IconoPanelLateral className="navbar__icono" />
            </button>
            <button
              type="button"
              className="navbar__tema"
              aria-label={esOscuro ? t('nav.temaClaro') : t('nav.temaOscuro')}
              title={esOscuro ? t('nav.temaClaro') : t('nav.temaOscuro')}
              onClick={alternarTema}
            >
              {esOscuro ? <IconoSol className="navbar__icono" /> : <IconoLuna className="navbar__icono" />}
            </button>
            <button
              type="button"
              className="navbar__preferencias"
              aria-label={t('pref.titulo')}
              title={t('pref.titulo')}
              onClick={() => setPreferenciasAbiertas(true)}
            >
              <IconoAjustes className="navbar__icono" />
            </button>
          </div>
        </div>
      </header>

      <MenuLateral
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        onAbrirPreferencias={() => setPreferenciasAbiertas(true)}
      />
      <PreferenciasPanel abierto={preferenciasAbiertas} onCerrar={() => setPreferenciasAbiertas(false)} />
    </>
  )
}

export default Navbar
