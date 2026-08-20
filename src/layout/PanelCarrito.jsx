import { useState } from 'react'
import { Link } from 'react-router-dom'
import ModalConfirmacion from '../common/ModalConfirmacion'
import { useTienda } from '../context/TiendaContext'
import ImagenProducto from '../common/ImagenProducto'
import { IconoX } from '../common/iconos'
import './PanelCarrito.css'

// Panel lateral (derecha) tipo Amazon: se abre solo cada vez que se agrega
// un producto al carrito (ver TiendaProvider.agregarAlCarrito) y muestra
// los productos ya agregados con imagen, precio y controles de cantidad.
function PanelCarrito() {
  const { carrito, totalUnidades, total, panelAbierto, cerrarPanel, cambiarCantidad, eliminarDelCarrito } =
    useTienda()
  // null o { productoId, nombre } del producto que se va a eliminar
  const [aEliminar, setAEliminar] = useState(null)

  const confirmarEliminar = () => {
    if (aEliminar) eliminarDelCarrito(aEliminar.productoId)
    setAEliminar(null)
  }

  return (
    <>
      <div
        className={panelAbierto ? 'panel-carrito__fondo panel-carrito__fondo--visible' : 'panel-carrito__fondo'}
        onClick={cerrarPanel}
        aria-hidden="true"
      />

      <aside
        className={panelAbierto ? 'panel-carrito panel-carrito--abierto' : 'panel-carrito'}
        aria-hidden={!panelAbierto}
      >
        <div className="panel-carrito__cabecera">
          <span>Tu carrito ({totalUnidades})</span>
          <button
            type="button"
            className="panel-carrito__cerrar"
            onClick={cerrarPanel}
            aria-label="Cerrar carrito"
          >
            <IconoX className="panel-carrito__icono-cerrar" />
          </button>
        </div>

        {carrito.length === 0 ? (
          <p className="panel-carrito__vacio">Todavía no has agregado productos.</p>
        ) : (
          <ul className="panel-carrito__lista">
            {carrito.map((item) => (
              <li key={item.productoId} className="panel-carrito__item">
                <div className="panel-carrito__item-imagen">
                  <ImagenProducto valor={item.producto.emoji} alt={item.producto.nombre} />
                </div>
                <div className="panel-carrito__item-info">
                  <span className="panel-carrito__item-nombre">{item.producto.nombre}</span>
                  <span className="panel-carrito__item-precio">
                    ${item.producto.precio.toFixed(2)}
                  </span>
                  <div className="panel-carrito__item-controles">
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
                    <button
                      type="button"
                      className="panel-carrito__item-eliminar"
                      onClick={() =>
                        setAEliminar({ productoId: item.productoId, nombre: item.producto.nombre })
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {carrito.length > 0 && (
          <div className="panel-carrito__pie">
            <div className="panel-carrito__total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/carrito" className="panel-carrito__ver" onClick={cerrarPanel}>
              Ver carrito completo
            </Link>
          </div>
        )}
      </aside>

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo="¿Eliminar producto?"
        mensaje={`Se quitará "${aEliminar?.nombre}" de tu carrito.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}

export default PanelCarrito
