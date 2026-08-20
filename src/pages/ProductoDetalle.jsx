import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ImagenProducto from '../components/ImagenProducto'
import { useTienda } from '../context/TiendaContext'
import { PRODUCTOS } from '../data/productos'
import './ProductoDetalle.css'

function ProductoDetalle() {
  const { id } = useParams()
  const producto = PRODUCTOS.find((item) => item.id === Number(id))
  const { agregarAlCarrito, obtenerStockRestante } = useTienda()
  const [cantidad, setCantidad] = useState(1)
  const [errorCantidad, setErrorCantidad] = useState('')

  if (!producto) {
    return (
      <section className="producto-detalle">
        <p>Producto no encontrado.</p>
        <Link to="/">Volver al catálogo</Link>
      </section>
    )
  }

  const stockRestante = obtenerStockRestante(producto.id)
  const tieneDescuentoPropio = producto.precioOriginal > producto.precio

  // Permite escribir la cantidad a mano (no solo +/-), validando que nunca
  // supere el stock disponible ni baje de 1.
  const handleCantidadInput = (e) => {
    const valor = e.target.value
    if (valor === '') {
      setCantidad('')
      setErrorCantidad('')
      return
    }
    const numero = Math.floor(Number(valor))
    if (Number.isNaN(numero)) return
    if (numero > stockRestante) {
      setCantidad(stockRestante)
      setErrorCantidad(`Solo hay ${stockRestante} unidades disponibles.`)
      return
    }
    setErrorCantidad('')
    setCantidad(Math.max(1, numero))
  }

  const handleCantidadBlur = () => {
    if (cantidad === '' || cantidad < 1) {
      setCantidad(1)
      setErrorCantidad('')
    }
  }

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad === '' ? 1 : cantidad)
    setCantidad(1)
    setErrorCantidad('')
  }

  return (
    <section className="producto-detalle">
      <Link to="/" className="producto-detalle__volver">
        &larr; Volver al catálogo
      </Link>

      <div className="details">
        <div className="detail-img">
          <ImagenProducto valor={producto.emoji} alt={producto.nombre} />
        </div>
        <div className="detail-info">
          <div>
            <p className="detail-category">{producto.categoria}</p>
          </div>
          <h1 className="detail-name font-outfit">{producto.nombre}</h1>
          <div className="detail-precio-fila">
            <h2 className="detail-price font-outfit">${producto.precio.toFixed(2)}</h2>
            {tieneDescuentoPropio && (
              <span className="detail-price-original">${producto.precioOriginal.toFixed(2)}</span>
            )}
            <h4 className="detail-unit font-dmsans">por {producto.unidad}</h4>
          </div>
          <h4 className="detail-description-title font-dmsans">Descripción</h4>
          <p className="detail-description">{producto.descripcion}</p>

          <p className="detail-stock">
            {stockRestante > 0 ? `${stockRestante} disponibles` : 'Sin stock disponible'}
          </p>

          <div className="detail-agregar">
            <div className="detail-cantidad">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, (c === '' ? 1 : c) - 1))}
                disabled={cantidad <= 1}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <input
                type="number"
                className="detail-cantidad-input"
                min={1}
                max={stockRestante || 1}
                value={cantidad}
                onChange={handleCantidadInput}
                onBlur={handleCantidadBlur}
                aria-label="Cantidad"
              />
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(stockRestante, (c === '' ? 0 : c) + 1))}
                disabled={cantidad !== '' && cantidad >= stockRestante}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="detail-agregar-boton"
              onClick={handleAgregar}
              disabled={stockRestante <= 0 || cantidad === '' || cantidad < 1}
            >
              {stockRestante <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
          {errorCantidad && <p className="detail-cantidad-error">{errorCantidad}</p>}
        </div>
      </div>
    </section>
  )
}

export default ProductoDetalle
