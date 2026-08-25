import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalogo } from '../context/CatalogoContext'
import { usePreferencias } from '../context/PreferenciasContext'
import { IconoAjustes, IconoChevron, IconoCorazon, IconoUsuario, IconoX } from '../common/iconos'
import './MenuLateral.css'

// Menú lateral (drawer) tipo Amazon: usuario / órdenes / catálogo con
// filtros / configuración. Se mantiene montado siempre y se anima con
// clases CSS (así el cierre también se ve animado, no solo la apertura).
function MenuLateral({ abierto, onCerrar, onAbrirPreferencias }) {
  const { usuario, cerrarSesion } = useAuth()
  const { categorias } = useCatalogo()
  const { t } = usePreferencias()
  const navigate = useNavigate()
  const [usuarioExpandido, setUsuarioExpandido] = useState(false)
  const [catalogoExpandido, setCatalogoExpandido] = useState(false)

  const irAOrdenes = () => {
    onCerrar()
    if (usuario) {
      navigate('/ordenes')
    } else {
      navigate('/login', { state: { from: '/ordenes' } })
    }
  }

  const irACuenta = () => {
    onCerrar()
    navigate('/cuenta')
  }

  const handleCerrarSesion = () => {
    cerrarSesion()
    setUsuarioExpandido(false)
    onCerrar()
    navigate('/')
  }

  const abrirPreferencias = () => {
    onCerrar()
    onAbrirPreferencias()
  }

  return (
    <>
      <div
        className={
          abierto ? 'menu-lateral__fondo menu-lateral__fondo--visible' : 'menu-lateral__fondo'
        }
        onClick={onCerrar}
        aria-hidden="true"
      />

      <aside
        className={abierto ? 'menu-lateral menu-lateral--abierto' : 'menu-lateral'}
        aria-hidden={!abierto}
      >
        <div className="menu-lateral__cabecera">
          <span>{t('nav.menu')}</span>
          <button
            type="button"
            className="menu-lateral__cerrar"
            onClick={onCerrar}
            aria-label={t('nav.menu')}
          >
            <IconoX className="menu-lateral__icono-cerrar" />
          </button>
        </div>

        <div className="menu-lateral__cuerpo">
          {/* Usuario */}
          <div className="menu-lateral__seccion">
            {usuario ? (
              <button
                type="button"
                className="menu-lateral__usuario"
                onClick={() => setUsuarioExpandido((v) => !v)}
              >
                <IconoUsuario className="menu-lateral__icono-usuario" />
                <span
                  className="menu-lateral__usuario-nombre"
                  onClick={(e) => {
                    e.stopPropagation()
                    irACuenta()
                  }}
                >
                  {t('nav.hola', { nombre: usuario.nombre })}
                </span>
              </button>
            ) : (
              <Link to="/login" className="menu-lateral__usuario" onClick={onCerrar}>
                <IconoUsuario className="menu-lateral__icono-usuario" />
                <span className="menu-lateral__usuario-nombre">{t('menu.invitado')}</span>
              </Link>
            )}
            {usuario && usuarioExpandido && (
              <button
                type="button"
                className="menu-lateral__cerrar-sesion"
                onClick={handleCerrarSesion}
              >
                {t('menu.cerrarSesion')}
              </button>
            )}
          </div>

          {/* Órdenes */}
          <button type="button" className="menu-lateral__item" onClick={irAOrdenes}>
            {t('menu.misOrdenes')}
          </button>

          {/* Favoritos */}
          <Link to="/favoritos" className="menu-lateral__item menu-lateral__item--icono" onClick={onCerrar}>
            <IconoCorazon className="menu-lateral__icono-item" />
            {t('menu.misFavoritos')}
          </Link>

          {/* Catálogo */}
          <div className="menu-lateral__seccion">
            <div className="menu-lateral__item-conjunto">
              <Link to="/" className="menu-lateral__item menu-lateral__item--flex" onClick={onCerrar}>
                {t('menu.catalogo')}
              </Link>
              <button
                type="button"
                className="menu-lateral__flecha"
                aria-label={t('menu.categorias')}
                onClick={() => setCatalogoExpandido((v) => !v)}
              >
                <IconoChevron
                  className={
                    catalogoExpandido
                      ? 'menu-lateral__icono-flecha menu-lateral__icono-flecha--abierta'
                      : 'menu-lateral__icono-flecha'
                  }
                />
              </button>
            </div>
            {catalogoExpandido && (
              <div className="menu-lateral__filtros">
                {categorias.map((categoria) => (
                  <Link
                    key={categoria}
                    to={`/?categoria=${encodeURIComponent(categoria)}`}
                    className="menu-lateral__filtro"
                    onClick={onCerrar}
                  >
                    {t(`cat.${categoria}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="menu-lateral__pie">
          <button
            type="button"
            className="menu-lateral__item menu-lateral__item--icono"
            onClick={abrirPreferencias}
          >
            <IconoAjustes className="menu-lateral__icono-item" />
            {t('pref.titulo')}
          </button>
        </div>
      </aside>
    </>
  )
}

export default MenuLateral
