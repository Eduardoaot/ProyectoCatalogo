import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import LogoRosa from '../assets/LogoRosa.png'
import LogoLetras from '../assets/LogoLetras.png'
import PreferenciasPanel from '../common/PreferenciasPanel'
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
const [desplazamientoNavbar, setDesplazamientoNavbar] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
 const ultimoScrollRef = useRef(0)
  const navRef = useRef(null)

  // Comportamiento tipo Amazon: al bajar se oculta, al subir reaparece.
useEffect(() => {
  const alHacerScroll = () => {
    const actual = window.scrollY
    const anterior = ultimoScrollRef.current
    const diferencia = actual - anterior

    // Si estamos en el principio, la navbar siempre está completamente visible.
    if (actual <= 0) {
      setDesplazamientoNavbar(0)
      ultimoScrollRef.current = actual
      return
    }

    setDesplazamientoNavbar((actualDesplazamiento) => {
      const siguiente = actualDesplazamiento + diferencia

      // No permitimos que suba más allá de 0 ni que desaparezca
      // más allá de su propia altura.
      const alturaNavbar = navRef.current?.offsetHeight ?? 0

      return Math.max(0, Math.min(siguiente, alturaNavbar))
    })

    ultimoScrollRef.current = actual
  }

  window.addEventListener('scroll', alHacerScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', alHacerScroll)
  }
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

  const irAProducto = (id) => {
    setBusqueda('')
    setMostrarSugerencias(false)
    navigate(`/producto/${id}`)
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
            <header
        ref={navRef}
        className="navbar"
        style={{
          transform: `translateY(-${desplazamientoNavbar}px)`,
        }}
>
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
            onBlur={() => setMostrarSugerencias(false)}
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
              }}
              onFocus={() => setMostrarSugerencias(true)}
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

            {mostrarSugerencias && sugerencias.length > 0 && (
              <ul className="navbar__sugerencias">
                {sugerencias.map((producto) => (
                  <li key={producto.id}>
                    <button
                      type="button"
                      className="navbar__sugerencia"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        irAProducto(producto.id)
                      }}
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
              {totalUnidades > 0 && <span className="navbar__carrito-badge">{totalUnidades}</span>}
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
