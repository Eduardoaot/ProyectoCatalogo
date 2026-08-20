import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext'
import ImagenProducto from './ImagenProducto'
import './ProductCard.css'

function ProductCard({ producto }) {
  const { id, nombre, categoria, precio, unidad, emoji, destacado } = producto
  const { agregarAlCarrito, obtenerStockRestante } = useTienda()
  const stockRestante = obtenerStockRestante(id)

  // El botón vive dentro del <Link> de la tarjeta: hay que frenar la
  // navegación y la propagación para que "Agregar" no abra el detalle.
  const handleAgregar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    agregarAlCarrito(producto, 1)
  }

  return (
    <Link to={`/producto/${id}`} className="product-card">
      {destacado && <span className="product-card__badge">Destacado</span>}
      <div className="product-card__image">
        <ImagenProducto valor={emoji} alt={nombre} />
      </div>
      <span className="product-card__categoria">{categoria}</span>
      <h3 className="product-card__nombre">{nombre}</h3>
      <p className="product-card__precio">
        ${precio.toFixed(2)} <span>/ {unidad}</span>
      </p>
      <button
        type="button"
        className="product-card__agregar"
        onClick={handleAgregar}
        disabled={stockRestante <= 0}
      >
        {stockRestante <= 0 ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </Link>
  )
}

export default ProductCard
