import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Cuenta.css'

// Datos del usuario / configuración de cuenta. Sirve también como destino
// del botón "Configuración" del menú lateral. Si no hay sesión, redirige
// a iniciar sesión (y de ahí de vuelta a /cuenta).
function Cuenta() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  if (!usuario) {
    return <Navigate to="/login" state={{ from: '/cuenta' }} replace />
  }

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  return (
    <section className="cuenta">
      <h1>Mi cuenta</h1>
      <div className="cuenta__tarjeta">
        <div className="cuenta__campo">
          <span className="cuenta__etiqueta">Nombre</span>
          <span className="cuenta__valor">{usuario.nombre}</span>
        </div>
        <div className="cuenta__campo">
          <span className="cuenta__etiqueta">Correo electrónico</span>
          <span className="cuenta__valor">{usuario.email}</span>
        </div>
        <button type="button" className="cuenta__cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </section>
  )
}

export default Cuenta
