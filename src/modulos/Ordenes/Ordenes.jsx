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
  const { usuario, cargandoSesion } = useAuth()
  const { ordenes, cargandoOrdenes } = useTienda()

  // Al recargar la página la sesión tarda un instante en confirmarse contra
  // la API; sin esta espera se redirigiría a /login teniendo sesión válida.
  if (cargandoSesion) {
    return (
      <section className="ordenes">
        <h1>Mis órdenes</h1>
        <p className="ordenes__vacio">Cargando…</p>
      </section>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: '/ordenes' }} replace />
  }

  return (
    <section className="ordenes">
      <h1>Mis órdenes</h1>

      {cargandoOrdenes ? (
        <p className="ordenes__vacio">Cargando tus órdenes…</p>
      ) : ordenes.length === 0 ? (
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
              {/* precio_orden_producto guarda el precio de lista congelado, así
                  que sin este desglose los renglones no cuadrarían con el total. */}
              {orden.descuentoTotal > 0 && (
                <>
                  <div className="ordenes__orden-linea">
                    <span>Subtotal</span>
                    <span>${orden.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="ordenes__orden-linea ordenes__orden-linea--descuento">
                    <span>Descuentos</span>
                    <span>−${orden.descuentoTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="ordenes__orden-total">Total: ${orden.total.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Ordenes
