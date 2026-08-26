import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import rosaLogo from '../assets/RosaLogo.webp'
import { useAuth } from '../context/AuthContext'
import { useTienda } from '../context/TiendaContext'
import { PRODUCTOS, CATEGORIAS } from '../data/productos' // Agregada la importación de CATEGORIAS
import ICONOS_CATEGORIAS from '../data/iconos' // Agregada la importación de iconos
import { IconoBuscar, IconoCarrito, IconoMenu, IconoPanelLateral, IconoX } from '../common/iconos'
import MenuLateral from './MenuLateral'
import './Navbar.css'

const UMBRAL_SCROLL_PX = 80
const MAX_SUGERENCIAS = 6

function Navbar() {
  const { usuario } = useAuth()
  const { totalUnidades, abrirPanel } = useTienda()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [menuAbierto, setMenuAbierto] = useState(false)
  const [oculta, setOculta] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  
  // Nuevos estados para los filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [subFiltroActivo, setSubFiltroActivo] = useState(null) // Puede ser: 'categorias', 'precio', 'nombre' u null

  const ultimoScrollRef = useRef(0)
  const navRef = useRef(null)

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
  }, [mostrarFiltros, subFiltroActivo]) // Actualizamos la altura si se abren los filtros

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

  const toggleSubFiltro = (filtro) => {
    setSubFiltroActivo(subFiltroActivo === filtro ? null : filtro)
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
              onBlur={() => {
                // Pequeño delay para permitir clic en sugerencias
                setTimeout(() => setMostrarSugerencias(false), 150)
              }}
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
            <button
              type="button"
              className="navbar__abrir-panel"
              aria-label="Abrir vista rápida del carrito"
              title="Vista rápida del carrito"
              onClick={abrirPanel}
            >
              <IconoPanelLateral className="navbar__icono" />
            </button>
          </div>
        </div>
      </header>

      <MenuLateral abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
    </>
  )
}

export default Navbar