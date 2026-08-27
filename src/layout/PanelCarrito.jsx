import { useState } from 'react'
import { Link } from 'react-router-dom'
import ModalConfirmacion from '../common/ModalConfirmacion'
import { usePreferencias } from '../context/PreferenciasContext'
import { useTienda } from '../context/TiendaContext'
import ImagenProducto from '../common/ImagenProducto'
import { etiquetaCantidad, formatearCantidad } from '../data/unidades'
import { IconoX } from '../common/iconos'
import './PanelCarrito.css'

// Panel lateral (derecha) tipo Amazon: se abre solo cada vez que se agrega
// un producto al carrito (ver TiendaProvider.agregarAlCarrito) y muestra
// los productos ya agregados con imagen, precio y controles de cantidad.
function PanelCarrito() {
  const { carrito, totalUnidades, total, panelAbierto, cerrarPanel, cambiarCantidad, eliminarDelCarrito } =
    useTienda()
  const { t } = usePreferencias()
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
          <span>{t('panelCarrito.titulo', { n: formatearCantidad(totalUnidades) })}</span>
          <button
            type="button"
            className="panel-carrito__cerrar"
            onClick={cerrarPanel}
            aria-label={t('nav.carrito')}
          >
            <IconoX className="panel-carrito__icono-cerrar" />
          </button>
        </div>

        {carrito.length === 0 ? (
          <p className="panel-carrito__vacio">{t('carrito.vacio')}</p>
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
                      aria-label={t('producto.disminuir')}
                    >
                      −
                    </button>
                    <span className="panel-carrito__item-cantidad">
                      {etiquetaCantidad(item.cantidad, item.producto, item.modo, t)}
                    </span>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(item.productoId, 1)}
                      disabled={!item.puedeAumentar}
                      aria-label={t('producto.aumentar')}
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
                      {t('carrito.eliminar')}
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
              <span>{t('carrito.total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/carrito" className="panel-carrito__ver" onClick={cerrarPanel}>
              {t('panelCarrito.verCompleto')}
            </Link>
          </div>
        )}
      </aside>

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo={t('carrito.confirmarEliminarTitulo')}
        mensaje={t('carrito.confirmarEliminarTexto', { nombre: aEliminar?.nombre })}
        textoConfirmar={t('carrito.eliminar')}
        textoCancelar={t('carrito.cancelar')}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}

export default PanelCarrito
