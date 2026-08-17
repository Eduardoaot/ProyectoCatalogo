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
      <h1>{producto.nombre}</h1>
      <p>{producto.categoria}</p>
    </section>
  )
}

export default ProductoDetalle
