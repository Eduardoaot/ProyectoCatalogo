import { Link, useNavigate } from 'react-router-dom'
import ImagenProducto from '../components/ImagenProducto'
import { useTienda } from '../context/TiendaContext'
import './Carrito.css'

// Página del carrito: columna izquierda con los productos (aumentar,
// disminuir, eliminar) y columna derecha con el resumen + "Generar orden".
function Carrito() {
  const { carrito, subtotal, total, cambiarCantidad, eliminarDelCarrito, generarOrden } =
    useTienda()
  const navigate = useNavigate()

  const handleGenerarOrden = () => {
    const orden = generarOrden()
    if (orden) {
      navigate('/ordenes')
    }
  }

  if (carrito.length === 0) {
    return (
      <section className="carrito carrito--vacio">
        <h1>Tu carrito</h1>
        <p>Todavía no has agregado productos.</p>
        <Link to="/" className="carrito__volver">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="carrito">
      <h1>Tu carrito</h1>
      <div className="carrito__contenido">
        <ul className="carrito__lista">
          {carrito.map((item) => (
            <li key={item.productoId} className="carrito__item">
              <div className="carrito__item-imagen">
                <ImagenProducto valor={item.producto.emoji} alt={item.producto.nombre} />
              </div>

              <div className="carrito__item-info">
                <Link to={`/producto/${item.productoId}`} className="carrito__item-nombre">
                  {item.producto.nombre}
                </Link>
                <span className="carrito__item-precio">
                  ${item.producto.precio.toFixed(2)} / {item.producto.unidad}
                </span>
                {item.cantidad >= item.stockRestante && (
                  <span className="carrito__item-stock">Máximo disponible alcanzado</span>
                )}
              </div>

              <div className="carrito__item-cantidad">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(item.productoId, -1)}
                  aria-label={`Disminuir cantidad de ${item.producto.nombre}`}
                >
                  −
                </button>
                <span>{item.cantidad}</span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(item.productoId, 1)}
                  disabled={item.cantidad >= item.stockRestante}
                  aria-label={`Aumentar cantidad de ${item.producto.nombre}`}
                >
                  +
                </button>
              </div>

              <div className="carrito__item-subtotal">
                ${(item.producto.precio * item.cantidad).toFixed(2)}
              </div>

              <button
                type="button"
                className="carrito__item-eliminar"
                onClick={() => eliminarDelCarrito(item.productoId)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <aside className="carrito__resumen">
          <h2>Resumen</h2>
          <div className="carrito__resumen-linea">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="carrito__resumen-linea">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className="carrito__resumen-linea carrito__resumen-linea--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="button" className="carrito__generar" onClick={handleGenerarOrden}>
            Generar orden
          </button>
        </aside>
      </div>
    </section>
  )
}

export default Carrito
