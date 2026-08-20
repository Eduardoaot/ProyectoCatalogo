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

  if (!producto) {
    return (
      <section className="producto-detalle">
        <p>Producto no encontrado.</p>
        <Link to="/">Volver al catálogo</Link>
      </section>
    )
  }

  const stockRestante = obtenerStockRestante(producto.id)

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad)
    setCantidad(1)
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
          <div>
            <h2 className="detail-price font-outfit">${producto.precio}</h2>
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
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span>{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(stockRestante, c + 1))}
                disabled={cantidad >= stockRestante}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="detail-agregar-boton"
              onClick={handleAgregar}
              disabled={stockRestante <= 0}
            >
              {stockRestante <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductoDetalle
