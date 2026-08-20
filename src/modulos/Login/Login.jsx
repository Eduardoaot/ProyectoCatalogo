import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

// Pantalla de acceso con dos modos: iniciar sesión (contra el seed de
// usuarios + los registrados) o crear cuenta nueva. Si se llegó aquí desde
// un enlace que necesitaba sesión (ej. "Órdenes" o "Generar orden" sin
// login), al autenticarse se redirige de vuelta a esa página gracias a
// location.state.from.
function Login() {
  const { iniciarSesion, registrarUsuario } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const destino = location.state?.from || '/'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (modo === 'registro') {
      if (!nombre.trim() || !email.trim() || !password) {
        setError('Completa nombre, correo y contraseña.')
        return
      }
      const resultado = registrarUsuario({ nombre, email, password })
      if (!resultado.ok) {
        setError(resultado.error)
        return
      }
    } else {
      if (!email.trim() || !password) {
        setError('Ingresa tu correo y contraseña.')
        return
      }
      const resultado = iniciarSesion({ email, password })
      if (!resultado.ok) {
        setError(resultado.error)
        return
      }
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
            Iniciar sesión
          </button>
          <button
            type="button"
            className={modo === 'registro' ? 'login__tab is-active' : 'login__tab'}
            onClick={() => cambiarModo('registro')}
          >
            Registrarse
          </button>
        </div>

        <h1>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
        <p className="login__nota">
          {modo === 'login'
            ? 'Demostración: prueba con diana@rosamark.com / rosamark123, o crea tu propia cuenta en la pestaña "Registrarse".'
            : 'Solo se guarda en este navegador (no hay servidor real detrás).'}
        </p>

        <form onSubmit={handleSubmit} className="login__formulario">
          {modo === 'registro' && (
            <label className="login__campo">
              Nombre
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                required
              />
            </label>
          )}
          <label className="login__campo">
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="login__campo">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="login__boton">
            {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
