import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import CampoPassword from '../../common/CampoPassword'
import { useAuth } from '../../context/AuthContext'
import { usePreferencias } from '../../context/PreferenciasContext'
import './Cuenta.css'

// Datos del usuario / configuración de cuenta. Sirve también como destino
// del botón "Configuración" del menú lateral. Si no hay sesión, redirige
// a iniciar sesión (y de ahí de vuelta a /cuenta).
function Cuenta() {
  const { usuario, cargandoSesion, cerrarSesion, cambiarPassword } = useAuth()
  const { t } = usePreferencias()
  const navigate = useNavigate()

  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)

  // Al recargar la página el token se valida contra la API; hasta que
  // termine no se sabe si hay sesión, y redirigir antes sacaría al usuario.
  if (cargandoSesion) {
    return (
      <section className="cuenta">
        <h1>{t('cuenta.titulo')}</h1>
        <p>{t('cuenta.cargando')}</p>
      </section>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: '/cuenta' }} replace />
  }

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  const limpiarFormulario = () => {
    setActual('')
    setNueva('')
    setConfirmar('')
    setError('')
  }

  const cerrarFormulario = () => {
    setFormularioAbierto(false)
    limpiarFormulario()
  }

  const handleCambiarPassword = async (e) => {
    e.preventDefault()
    if (guardando) return
    setError('')
    setExito('')

    if (nueva !== confirmar) {
      setError(t('cuenta.noCoinciden'))
      return
    }

    setGuardando(true)
    const resultado = await cambiarPassword(actual, nueva)
    setGuardando(false)

    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setExito(t('cuenta.cambiada'))
    limpiarFormulario()
    setFormularioAbierto(false)
  }

  return (
    <section className="cuenta">
      <h1>{t('cuenta.titulo')}</h1>
      <div className="cuenta__tarjeta">
        <div className="cuenta__campo">
          <span className="cuenta__etiqueta">{t('cuenta.nombre')}</span>
          <span className="cuenta__valor">{usuario.nombre}</span>
        </div>
        <div className="cuenta__campo">
          <span className="cuenta__etiqueta">{t('cuenta.correo')}</span>
          <span className="cuenta__valor">{usuario.email}</span>
        </div>

        <div className="cuenta__seguridad">
          <span className="cuenta__etiqueta">{t('cuenta.seguridad')}</span>
          <p className="cuenta__nota-cifrado">{t('cuenta.notaCifrado')}</p>

          {!formularioAbierto ? (
            <button
              type="button"
              className="cuenta__cambiar-password"
              onClick={() => {
                setFormularioAbierto(true)
                setExito('')
              }}
            >
              {t('cuenta.cambiarContrasena')}
            </button>
          ) : (
            <form className="cuenta__form-password" onSubmit={handleCambiarPassword}>
              <CampoPassword
                id="cuenta-password-actual"
                label={t('cuenta.contrasenaActual')}
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                autoComplete="current-password"
                required
              />
              <CampoPassword
                id="cuenta-password-nueva"
                label={t('cuenta.contrasenaNueva')}
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                autoComplete="new-password"
                required
              />
              <CampoPassword
                id="cuenta-password-confirmar"
                label={t('cuenta.confirmarNueva')}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                autoComplete="new-password"
                required
              />
              {error && <p className="cuenta__error">{error}</p>}
              <div className="cuenta__form-password-acciones">
                <button type="button" className="cuenta__cancelar" onClick={cerrarFormulario}>
                  {t('carrito.cancelar')}
                </button>
                <button type="submit" className="cuenta__guardar-password" disabled={guardando}>
                  {guardando ? t('cuenta.guardando') : t('cuenta.guardar')}
                </button>
              </div>
            </form>
          )}

          {exito && <p className="cuenta__exito">{exito}</p>}
        </div>

        <button type="button" className="cuenta__cerrar-sesion" onClick={handleCerrarSesion}>
          {t('cuenta.cerrarSesion')}
        </button>
      </div>
    </section>
  )
}

export default Cuenta
