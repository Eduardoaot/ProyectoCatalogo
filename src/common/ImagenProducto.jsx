import { useCallback, useState } from 'react'
import './ImagenProducto.css'

const PATRON_URL = /^https?:\/\//i

// Muestra la imagen de un producto. El campo puede traer un emoji (🍎) o una
// URL de imagen (https://...) — se detecta automáticamente cuál es cuál.
// Mientras la foto viaja se ve un placeholder animado (degradado "slime"
// intermitente + brillo que barre) con un spinner circular encima, y si la
// URL falla al cargar (enlace roto, hotlink bloqueado, etc.) se muestra un
// emoji de respaldo en su lugar.
function ImagenProducto({ valor, alt }) {
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'lista' | 'fallo'
  const esUrl = typeof valor === 'string' && PATRON_URL.test(valor)

  // El componente se reutiliza cuando cambia el producto sin desmontarse (por
  // ejemplo al navegar de /producto/3 a /producto/4): sin resetear el estado
  // aquí, la foto nueva heredaría el "ya cargué" de la anterior.
  const [valorPrevio, setValorPrevio] = useState(valor)
  if (valorPrevio !== valor) {
    setValorPrevio(valor)
    setEstado('cargando')
  }

  // Una imagen que ya estaba en caché puede terminar de cargar antes de que
  // React llegue a enganchar el onLoad; sin esta comprobación al montar, el
  // spinner se quedaría girando encima de una foto que ya está visible.
  const alMontarImagen = useCallback((img) => {
    if (img && img.complete) {
      setEstado(img.naturalWidth > 0 ? 'lista' : 'fallo')
    }
  }, [])

  if (!esUrl || estado === 'fallo') {
    return (
      <span className="imagen-producto__emoji" role="img" aria-label={alt}>
        {esUrl ? '🛒' : valor}
      </span>
    )
  }

  return (
    <span className="imagen-producto">
      <img
        ref={alMontarImagen}
        className={
          estado === 'lista' ? 'imagen-producto__foto is-lista' : 'imagen-producto__foto'
        }
        src={valor}
        alt={alt}
        loading="lazy"
        onLoad={() => setEstado('lista')}
        onError={() => setEstado('fallo')}
      />
      {estado !== 'lista' && (
        <span className="imagen-producto__cargando" aria-hidden="true">
          <span className="imagen-producto__spinner" />
        </span>
      )}
    </span>
  )
}

export default ImagenProducto
