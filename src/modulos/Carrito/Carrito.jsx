import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ImagenProducto from '../../common/ImagenProducto'
import ModalConfirmacion from '../../common/ModalConfirmacion'
import { useAuth } from '../../context/AuthContext'
import { useTienda } from '../../context/TiendaContext'
import './Carrito.css'

// Página del carrito: columna izquierda con los productos (aumentar,
// disminuir, eliminar, vaciar todo) y columna derecha con el código de
// descuento, el desglose de precios y "Generar orden".
function Carrito() {
  const { usuario } = useAuth()
  const {
    carrito,
    subtotalLista,
    subtotal,
    descuentoProductos,
    codigoAplicado,
    descuentoCodigo,
    total,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    aplicarCodigo,
    quitarCodigo,
    generarOrden,
  } = useTienda()
  const navigate = useNavigate()

  const [codigoTexto, setCodigoTexto] = useState('')
  const [mensajeCodigo, setMensajeCodigo] = useState('')
  const [aplicandoCodigo, setAplicandoCodigo] = useState(false)
  const [generando, setGenerando] = useState(false)
  const [errorOrden, setErrorOrden] = useState('')
  // null, { tipo: 'vaciar' } o { tipo: 'eliminar', productoId, nombre }
  const [confirmacion, setConfirmacion] = useState(null)

  const confirmar = () => {
    if (confirmacion?.tipo === 'vaciar') {
      vaciarCarrito()
    } else if (confirmacion?.tipo === 'eliminar') {
      eliminarDelCarrito(confirmacion.productoId)
    }
    setConfirmacion(null)
  }

  // Ahora el código se valida contra la base (existencia y vigencia), así
  // que la operación es asíncrona y puede fallar por red.
  const handleAplicarCodigo = async (e) => {
    e.preventDefault()
    if (!codigoTexto.trim() || aplicandoCodigo) return
    setAplicandoCodigo(true)
    const resultado = await aplicarCodigo(codigoTexto)
    setAplicandoCodigo(false)
    if (resultado.ok) {
      setMensajeCodigo('')
      setCodigoTexto('')
    } else {
      setMensajeCodigo(resultado.error)
    }
  }

  // Si no hay sesión, "Generar orden" manda primero a iniciar sesión (o
  // registrarse) y de vuelta al carrito — el carrito no se toca en ningún
  // momento de este viaje (ver TiendaProvider: solo se fusiona/reemplaza al
  // cambiar de usuario, nunca se vacía por navegar).
  // La orden se crea en el servidor dentro de una transacción: si otro
  // cliente se llevó el stock mientras tanto, el backend responde con el
  // error y aquí no se navega a ningún lado.
  const handleGenerarOrden = async () => {
    if (!usuario) {
      navigate('/login', { state: { from: '/carrito' } })
      return
    }
    if (generando) return

    setErrorOrden('')
    setGenerando(true)
    const resultado = await generarOrden()
    setGenerando(false)

    if (resultado.ok) {
      navigate('/ordenes')
    } else {
      setErrorOrden(resultado.error)
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
        <div className="carrito__columna-izquierda">
          <div className="carrito__acciones">
            <button
              type="button"
              className="carrito__vaciar"
              onClick={() => setConfirmacion({ tipo: 'vaciar' })}
            >
              Vaciar carrito
            </button>
          </div>

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
                    {item.producto.precioOriginal > item.producto.precio && (
                      <span className="carrito__item-precio-original">
                        ${item.producto.precioOriginal.toFixed(2)}
                      </span>
                    )}
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
                  onClick={() =>
                    setConfirmacion({
                      tipo: 'eliminar',
                      productoId: item.productoId,
                      nombre: item.producto.nombre,
                    })
                  }
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="carrito__resumen">
          <form className="carrito__codigo" onSubmit={handleAplicarCodigo}>
            <label htmlFor="codigo-descuento" className="carrito__codigo-etiqueta">
              Código de descuento
            </label>
            {codigoAplicado ? (
              <div className="carrito__codigo-aplicado">
                <span>
                  {codigoAplicado.etiqueta} — {codigoAplicado.descripcion}
                </span>
                <button type="button" onClick={quitarCodigo} aria-label="Quitar código">
                  ×
                </button>
              </div>
            ) : (
              <div className="carrito__codigo-input">
                <input
                  id="codigo-descuento"
                  type="text"
                  placeholder="Ej. FRESCUERA"
                  value={codigoTexto}
                  onChange={(e) => setCodigoTexto(e.target.value)}
                  disabled={aplicandoCodigo}
                />
                <button type="submit" disabled={aplicandoCodigo}>
                  {aplicandoCodigo ? 'Validando…' : 'Aplicar'}
                </button>
              </div>
            )}
            {mensajeCodigo && <p className="carrito__codigo-mensaje">{mensajeCodigo}</p>}
          </form>

          <h2>Resumen</h2>
          <div className="carrito__resumen-linea">
            <span>Precio de lista</span>
            <span>${subtotalLista.toFixed(2)}</span>
          </div>
          {descuentoProductos > 0 && (
            <div className="carrito__resumen-linea carrito__resumen-linea--descuento">
              <span>Descuento en productos</span>
              <span>−${descuentoProductos.toFixed(2)}</span>
            </div>
          )}
          {codigoAplicado && (
            <div className="carrito__resumen-linea carrito__resumen-linea--descuento">
              <span>Código {codigoAplicado.etiqueta}</span>
              <span>−${descuentoCodigo.toFixed(2)}</span>
            </div>
          )}
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
          <button
            type="button"
            className="carrito__generar"
            onClick={handleGenerarOrden}
            disabled={generando}
          >
            {generando ? 'Generando orden…' : 'Generar orden'}
          </button>
          {errorOrden && <p className="carrito__error-orden">{errorOrden}</p>}
        </aside>
      </div>

      <ModalConfirmacion
        abierto={confirmacion !== null}
        titulo={confirmacion?.tipo === 'vaciar' ? '¿Vaciar el carrito?' : '¿Eliminar producto?'}
        mensaje={
          confirmacion?.tipo === 'vaciar'
            ? 'Se quitarán todos los productos de tu carrito. Esta acción no se puede deshacer.'
            : `Se quitará "${confirmacion?.nombre}" de tu carrito.`
        }
        textoConfirmar={confirmacion?.tipo === 'vaciar' ? 'Vaciar carrito' : 'Eliminar'}
        onConfirmar={confirmar}
        onCancelar={() => setConfirmacion(null)}
      />
    </section>
  )
}

export default Carrito
