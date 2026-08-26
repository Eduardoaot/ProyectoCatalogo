import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import ImagenProducto from '../../common/ImagenProducto'
import { useAuth } from '../../context/AuthContext'
import { useCatalogo } from '../../context/CatalogoContext'
import { usePreferencias } from '../../context/PreferenciasContext'
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
  const { buscarProducto } = useCatalogo()
  const { t } = usePreferencias()
  // id de la orden con el detalle expandido (solo una a la vez), o null.
  const [ordenAbierta, setOrdenAbierta] = useState(null)

  // Al recargar la página la sesión tarda un instante en confirmarse contra
  // la API; sin esta espera se redirigiría a /login teniendo sesión válida.
  if (cargandoSesion) {
    return (
      <section className="ordenes">
        <h1>{t('ordenes.titulo')}</h1>
        <p className="ordenes__vacio">{t('cuenta.cargando')}</p>
      </section>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: '/ordenes' }} replace />
  }

  const alternarDetalle = (id) => {
    setOrdenAbierta((actual) => (actual === id ? null : id))
  }

  return (
    <section className="ordenes">
      <h1>{t('ordenes.titulo')}</h1>

      {cargandoOrdenes ? (
        <p className="ordenes__vacio">{t('ordenes.cargando')}</p>
      ) : ordenes.length === 0 ? (
        <p className="ordenes__vacio">{t('ordenes.vacio')}</p>
      ) : (
        <ul className="ordenes__lista">
          {ordenes.map((orden) => {
            const abierta = ordenAbierta === orden.id
            return (
              <li key={orden.id} className="ordenes__orden">
                <div className="ordenes__orden-cabecera">
                  <span className="ordenes__orden-id">{t('ordenes.orden', { id: orden.id })}</span>
                  <span className="ordenes__orden-fecha">{formatearFecha(orden.fecha)}</span>
                </div>

                {abierta ? (
                  // Detalle expandido: mismo lenguaje visual que el carrito
                  // (imagen, nombre, precio, subtotal), pero de solo lectura.
                  <ul className="ordenes__detalle">
                    {orden.items.map((item) => {
                      const producto = buscarProducto(item.productoId)
                      return (
                        <li key={item.productoId} className="ordenes__detalle-item">
                          <div className="ordenes__detalle-imagen">
                            <ImagenProducto valor={producto?.emoji || '🛒'} alt={item.nombre} />
                          </div>
                          <div className="ordenes__detalle-info">
                            {producto ? (
                              <Link to={`/producto/${item.productoId}`} className="ordenes__detalle-nombre">
                                {item.nombre}
                              </Link>
                            ) : (
                              <span className="ordenes__detalle-nombre">{item.nombre}</span>
                            )}
                            <span className="ordenes__detalle-precio">
                              {item.cantidad}× ${item.precio.toFixed(2)}
                            </span>
                          </div>
                          <div className="ordenes__detalle-subtotal">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
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
                )}

                {/* precio_orden_producto guarda el precio de lista congelado, así
                    que sin este desglose los renglones no cuadrarían con el total. */}
                {orden.descuentoTotal > 0 && (
                  <>
                    <div className="ordenes__orden-linea">
                      <span>{t('carrito.subtotal')}</span>
                      <span>${orden.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="ordenes__orden-linea ordenes__orden-linea--descuento">
                      <span>{t('ordenes.descuentos')}</span>
                      <span>−${orden.descuentoTotal.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  className="ordenes__ver-detalle"
                  onClick={() => alternarDetalle(orden.id)}
                >
                  {abierta ? t('ordenes.ocultarDetalle') : t('ordenes.verDetalle')}
                </button>

                <div className="ordenes__orden-total">
                  {t('ordenes.total')}: ${orden.total.toFixed(2)}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default Ordenes
