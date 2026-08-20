import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

// Inicio de sesión de demostración: no hay backend, así que solo se pide
// nombre + correo (la contraseña no se valida contra nada). Si se llegó
// aquí desde un enlace que necesitaba sesión (ej. "Órdenes"), al iniciar
// sesión se redirige de vuelta a esa página gracias a location.state.from.
function Login() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const destino = location.state?.from || '/'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) return
    iniciarSesion({ nombre: nombre.trim(), email: email.trim() })
    navigate(destino, { replace: true })
  }

  return (
    <section className="login">
      <div className="login__tarjeta">
        <h1>Iniciar sesión</h1>
        <p className="login__nota">
          Inicio de sesión de demostración: solo necesitas un nombre y un correo, no se valida
          contra ningún servidor.
        </p>
        <form onSubmit={handleSubmit} className="login__formulario">
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
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="login__boton">
            Iniciar sesión
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
