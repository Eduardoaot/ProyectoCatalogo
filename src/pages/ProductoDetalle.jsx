import { Link, useParams } from 'react-router-dom'
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

      {/* TODO (compañero): reemplazar este contenido mínimo por el diseño final */}
      
      <div className="details">
        <div className = "detail-img">
          <img src={producto.emoji} alt="Imagen del producto" />
          {/*<p>{producto.emoji}</p>*/}
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
        </div>
      </div>
    </section>
  )
}

export default ProductoDetalle
