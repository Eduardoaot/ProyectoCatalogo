import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import rosaLogo from '../assets/RosaLogo.webp'
import { useAuth } from '../context/AuthContext'
import { useTienda } from '../context/TiendaContext'
import { PRODUCTOS } from '../data/productos'
import { IconoBuscar, IconoCarrito, IconoMenu, IconoX } from './iconos'
import MenuLateral from './MenuLateral'
import './Navbar.css'

// A partir de qué tanto scroll hacia abajo empieza a poder ocultarse la
// navbar (evita que "parpadee" con pequeños scrolls cerca del tope).
const UMBRAL_SCROLL_PX = 80
const MAX_SUGERENCIAS = 6

function Navbar() {
  const { usuario } = useAuth()
  const { totalUnidades } = useTienda()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [menuAbierto, setMenuAbierto] = useState(false)
  const [oculta, setOculta] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
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
    return PRODUCTOS.filter((producto) => producto.nombre.toLowerCase().includes(texto)).slice(
      0,
      MAX_SUGERENCIAS,
    )
  }, [busqueda])

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

  return (
    <>
      <header ref={navRef} className={oculta ? 'navbar navbar--oculta' : 'navbar'}>
        <div className="navbar__inner">
          <div className="navbar__izquierda">
            <button
              type="button"
              className="navbar__hamburguesa"
              aria-label="Abrir menú"
              onClick={() => setMenuAbierto(true)}
            >
              <IconoMenu className="navbar__icono" />
            </button>
            <Link to="/" className="navbar__brand">
              <img className="navbar__logo" src={rosaLogo} alt="" />
              <span className="navbar__brand-texto">Rosamark</span>
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
              placeholder="Buscar productos en Rosamark..."
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
                aria-label="Limpiar búsqueda"
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
                      <span className="navbar__sugerencia-categoria">{producto.categoria}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="navbar__derecha">
            <Link to={usuario ? '/cuenta' : '/login'} className="navbar__link">
              {usuario ? `Hola, ${usuario.nombre}` : 'Iniciar sesión'}
            </Link>
            <Link
              to={usuario ? '/ordenes' : '/login'}
              state={usuario ? undefined : { from: '/ordenes' }}
              className="navbar__link"
            >
              Órdenes
            </Link>
            <Link to="/carrito" className="navbar__carrito" aria-label="Ver carrito">
              <IconoCarrito className="navbar__icono" />
              {totalUnidades > 0 && (
                <span className="navbar__carrito-badge">{totalUnidades}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MenuLateral abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
    </>
  )
}

export default Navbar
