import { Link } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ producto }) {
  const { id, nombre, categoria, precio, unidad, emoji, destacado } = producto

  return (
    <Link to={`/producto/${id}`} className="product-card">
      {destacado && <span className="product-card__badge">Destacado</span>}
      <div className="product-card__image" aria-hidden="true">
        {emoji}
      </div>
      <span className="product-card__categoria">{categoria}</span>
      <h3 className="product-card__nombre">{nombre}</h3>
      <p className="product-card__precio">
        ${precio.toFixed(2)} <span>/ {unidad}</span>
      </p>
    </Link>
  )
}

export default ProductCard
