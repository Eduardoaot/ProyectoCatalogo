import { Link, useParams } from 'react-router-dom'
import ImagenProducto from '../components/ImagenProducto'
import { PRODUCTOS } from '../data/productos'
import './ProductoDetalle.css'

// ---------------------------------------------------------------------------
// PÁGINA: Detalle de producto
// ---------------------------------------------------------------------------
// Esta pantalla es solo la BASE de la ruta "/producto/:id".
// Ya deja resuelto lo esencial:
//   - La ruta está conectada en App.jsx
//   - Se obtiene el "id" desde la URL con useParams()
//   - Se busca el producto correspondiente en PRODUCTOS (src/data/productos.js)
//
// TODO (compañero): diseñar y construir el resto de la vista, por ejemplo:
//   - Mostrar imagen/emoji en grande, descripción completa, categoría, etc.
//   - Agregar botón "Agregar al carrito" (si aplica)
//   - Mostrar productos relacionados de la misma categoría
//   - Manejar mejor el caso de producto no encontrado
// ---------------------------------------------------------------------------

function ProductoDetalle() {
  const { id } = useParams()
  const producto = PRODUCTOS.find((item) => item.id === Number(id))

  if (!producto) {
    return (
      <section className="producto-detalle">
        <p>Producto no encontrado.</p>
        <Link to="/">Volver al catálogo</Link>
      </section>
    )
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
          <h1>{producto.nombre}</h1>
          <div>
            <p className="detail-category">{producto.categoria}</p>
          </div>
          <div>
            <h2 className="detail-price">${producto.precio}</h2>
            <h4 className="detail-unit">por {producto.unidad}</h4>
          </div>
          <p>{producto.descripcion}</p>
        </div>
      </div>
    </section>
  )
}

export default ProductoDetalle
