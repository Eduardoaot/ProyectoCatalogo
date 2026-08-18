import { useState } from 'react'
import './ImagenProducto.css'

const PATRON_URL = /^https?:\/\//i

// Muestra la imagen de un producto. El campo puede traer un emoji (🍎) o una
// URL de imagen (https://...) — se detecta automáticamente cuál es cuál.
// Si la URL falla al cargar (enlace roto, hotlink bloqueado, etc.) se
// muestra un emoji de respaldo en su lugar.
function ImagenProducto({ valor, alt }) {
  const [fallo, setFallo] = useState(false)
  const esUrl = typeof valor === 'string' && PATRON_URL.test(valor)

  if (!esUrl || fallo) {
    return (
      <span className="imagen-producto__emoji" role="img" aria-label={alt}>
        {fallo ? '🛒' : valor}
      </span>
    )
  }

  return (
    <img
      className="imagen-producto__foto"
      src={valor}
      alt={alt}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  )
}

export default ImagenProducto
