import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTienda } from '../../context/TiendaContext'
import './Ordenes.css'

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Listado de órdenes del usuario. Si no hay sesión, redirige a iniciar
// sesión (y de ahí de vuelta a /ordenes) — igual que el enlace "Órdenes"
// del navbar y del menú lateral.
function Ordenes() {
  const { usuario } = useAuth()
  const { ordenes } = useTienda()

  if (!usuario) {
    return <Navigate to="/login" state={{ from: '/ordenes' }} replace />
  }

  return (
    <section className="ordenes">
      <h1>Mis órdenes</h1>

      {ordenes.length === 0 ? (
        <p className="ordenes__vacio">Todavía no tienes ninguna orden generada.</p>
      ) : (
        <ul className="ordenes__lista">
          {ordenes.map((orden) => (
            <li key={orden.id} className="ordenes__orden">
              <div className="ordenes__orden-cabecera">
                <span className="ordenes__orden-id">Orden #{orden.id}</span>
                <span className="ordenes__orden-fecha">{formatearFecha(orden.fecha)}</span>
              </div>
              <ul className="ordenes__items">
                {orden.items.map((item) => (
                  <li key={item.productoId} className="ordenes__item">
                    <span>
                      {item.cantidad}× {item.nombre}
                    </span>
                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="ordenes__orden-total">Total: ${orden.total.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Ordenes
