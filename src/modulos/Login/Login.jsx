import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CampoPassword from '../../common/CampoPassword'
import { useAuth } from '../../context/AuthContext'
import { usePreferencias } from '../../context/PreferenciasContext'
import './Login.css'

// Pantalla de acceso con dos modos: iniciar sesión (contra el seed de
// usuarios + los registrados) o crear cuenta nueva. Si se llegó aquí desde
// un enlace que necesitaba sesión (ej. "Órdenes" o "Generar orden" sin
// login), al autenticarse se redirige de vuelta a esa página gracias a
// location.state.from.
function Login() {
  const { iniciarSesion, registrarUsuario } = useAuth()
  const { t } = usePreferencias()
  const navigate = useNavigate()
  const location = useLocation()

  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [enviando, setEnviando] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const destino = location.state?.from || '/'

  // Registro e inicio de sesión pegan a la API; la contraseña se hashea
  // con bcrypt en el servidor y aquí solo se guarda el token que devuelve.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (enviando) return

    if (modo === 'registro' && !nombre.trim()) {
      setError(t('login.faltanDatos'))
      return
    }
    if (!email.trim() || !password) {
      setError(t('login.faltanCredenciales'))
      return
    }

    setEnviando(true)
    const resultado =
      modo === 'registro'
        ? await registrarUsuario({ nombre, email, password })
        : await iniciarSesion({ email, password })
    setEnviando(false)

    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    navigate(destino, { replace: true })
  }

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo)
    setError('')
  }

  return (
    <section className="login">
      <div className="login__tarjeta">
        <div className="login__tabs">
          <button
            type="button"
            className={modo === 'login' ? 'login__tab is-active' : 'login__tab'}
            onClick={() => cambiarModo('login')}
          >
            {t('login.iniciar')}
          </button>
          <button
            type="button"
            className={modo === 'registro' ? 'login__tab is-active' : 'login__tab'}
            onClick={() => cambiarModo('registro')}
          >
            {t('login.registrarse')}
          </button>
        </div>

        <h1>{modo === 'login' ? t('login.iniciar') : t('login.crearCuenta')}</h1>
        <p className="login__nota">
          {modo === 'login' ? t('login.ayudaLogin') : t('login.ayudaRegistro')}
        </p>

        <form onSubmit={handleSubmit} className="login__formulario">
          {modo === 'registro' && (
            <label className="login__campo">
              {t('login.nombre')}
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={t('login.nombrePlaceholder')}
                autoComplete="name"
                required
              />
            </label>
          )}
          <label className="login__campo">
            {t('login.correo')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>
          <CampoPassword
            id="login-password"
            label={t('login.contrasena')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            required
          />

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="login__boton" disabled={enviando}>
            {enviando ? t('login.enviando') : modo === 'login' ? t('login.iniciar') : t('login.crearCuenta')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
