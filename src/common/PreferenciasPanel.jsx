import { TAMANOS_TEXTO } from '../context/PreferenciasProvider'
import { usePreferencias } from '../context/PreferenciasContext'
import { IconoLuna, IconoSol, IconoX } from './iconos'
import './PreferenciasPanel.css'

const CLAVE_TAMANO = {
  normal: 'pref.textoNormal',
  grande: 'pref.textoGrande',
  enorme: 'pref.textoEnorme',
}

// Drawer con las tres preferencias del sitio: tema, tamaño de texto e
// idioma. Se controla desde afuera (abierto/onCerrar), igual que
// MenuLateral y PanelCarrito, y se monta donde se necesite abrirlo (ver
// Navbar.jsx).
function PreferenciasPanel({ abierto, onCerrar }) {
  const {
    t,
    esOscuro,
    alternarTema,
    tamanoTexto,
    cambiarTamanoTexto,
    idioma,
    idiomas,
    cambiarIdioma,
    restablecer,
  } = usePreferencias()

  return (
    <>
      <div
        className={
          abierto ? 'preferencias-panel__fondo preferencias-panel__fondo--visible' : 'preferencias-panel__fondo'
        }
        onClick={onCerrar}
        aria-hidden="true"
      />

      <aside
        className={abierto ? 'preferencias-panel preferencias-panel--abierto' : 'preferencias-panel'}
        aria-hidden={!abierto}
      >
        <div className="preferencias-panel__cabecera">
          <span>{t('pref.titulo')}</span>
          <button type="button" className="preferencias-panel__cerrar" onClick={onCerrar} aria-label={t('pref.cerrar')}>
            <IconoX className="preferencias-panel__icono-cerrar" />
          </button>
        </div>

        <div className="preferencias-panel__cuerpo">
          <div className="preferencias-panel__seccion">
            <span className="preferencias-panel__etiqueta">{t('pref.tema')}</span>
            <button type="button" className="preferencias-panel__tema" onClick={alternarTema}>
              {esOscuro ? (
                <IconoLuna className="preferencias-panel__icono" />
              ) : (
                <IconoSol className="preferencias-panel__icono" />
              )}
              <span>{esOscuro ? t('pref.temaOscuro') : t('pref.temaClaro')}</span>
              <span
                className={
                  esOscuro
                    ? 'preferencias-panel__switch preferencias-panel__switch--on'
                    : 'preferencias-panel__switch'
                }
                aria-hidden="true"
              >
                <span className="preferencias-panel__switch-bola" />
              </span>
            </button>
          </div>

          <div className="preferencias-panel__seccion">
            <span className="preferencias-panel__etiqueta">{t('pref.texto')}</span>
            <div className="preferencias-panel__pasos">
              {TAMANOS_TEXTO.map((paso) => (
                <button
                  key={paso}
                  type="button"
                  className={
                    tamanoTexto === paso
                      ? 'preferencias-panel__paso is-active'
                      : 'preferencias-panel__paso'
                  }
                  onClick={() => cambiarTamanoTexto(paso)}
                >
                  {t(CLAVE_TAMANO[paso])}
                </button>
              ))}
            </div>
          </div>

          <div className="preferencias-panel__seccion">
            <label className="preferencias-panel__etiqueta" htmlFor="preferencias-idioma">
              {t('pref.idioma')}
            </label>
            <select
              id="preferencias-idioma"
              className="preferencias-panel__select"
              value={idioma}
              onChange={(e) => cambiarIdioma(e.target.value)}
            >
              {idiomas.map((opcion) => (
                <option key={opcion.codigo} value={opcion.codigo}>
                  {opcion.bandera} {opcion.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="preferencias-panel__restablecer" onClick={restablecer}>
            {t('pref.restablecer')}
          </button>
        </div>
      </aside>
    </>
  )
}

export default PreferenciasPanel
