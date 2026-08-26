import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CampoPassword from '../../common/CampoPassword'
import { useAuth } from '../../context/AuthContext'
import { usePreferencias } from '../../context/PreferenciasContext'
import './Login.css'

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LARGO_MINIMO_PASSWORD = 8

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

  // Antes esto era un solo mensaje genérico ("completa nombre, correo y
  // contraseña") sin importar cuál faltaba o qué tenía mal. Ahora se
  // revisa campo por campo y se dice exactamente cuál es el problema, en
  // el mismo orden en que aparecen en el formulario.
  const validar = () => {
    if (modo === 'registro' && !nombre.trim()) {
      return t('login.errorNombre')
    }
    if (!email.trim()) {
      return t('login.errorCorreo')
    }
    if (!PATRON_CORREO.test(email.trim())) {
      return t('login.errorCorreoInvalido')
    }
    if (!password) {
      return t('login.errorContrasena')
    }
    if (modo === 'registro' && password.length < LARGO_MINIMO_PASSWORD) {
      return t('login.errorContrasenaCorta')
    }
    return ''
  }

  // Registro e inicio de sesión pegan a la API; la contraseña se hashea
  // con bcrypt en el servidor y aquí solo se guarda el token que devuelve.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (enviando) return

    const errorValidacion = validar()
    if (errorValidacion) {
      setError(errorValidacion)
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

        {/* noValidate: sin esto, el navegador bloquea el submit con su propio
            aviso nativo (sin traducir, con otro estilo) apenas ve un campo
            vacío o un correo con formato raro, y validar() de acá abajo
            nunca llega a correr. Con noValidate, siempre gana nuestro
            mensaje, traducido y consistente con el resto de la app. */}
        <form onSubmit={handleSubmit} className="login__formulario" noValidate>
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
