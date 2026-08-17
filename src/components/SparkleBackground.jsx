import { useMemo } from 'react'
import './SparkleBackground.css'

const CANTIDAD_DESTELLOS = 26

// Genera una sola vez (por montaje) una lista de destellos con
// posición, tamaño y tiempos de animación aleatorios.
function generarDestellos() {
  return Array.from({ length: CANTIDAD_DESTELLOS }, (_, index) => ({
    id: index,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 6 + Math.random() * 12,
    duration: 2.2 + Math.random() * 3,
    delay: Math.random() * 4,
  }))
}

// Fondo decorativo de destellos tipo "estrellas" que titilan.
// Puramente visual: no interactúa con el usuario (aria-hidden + pointer-events: none).
function SparkleBackground() {
  const destellos = useMemo(() => generarDestellos(), [])

  return (
    <div className="sparkle-bg" aria-hidden="true">
      {destellos.map((destello) => (
        <span
          key={destello.id}
          className="sparkle"
          style={{
            top: `${destello.top}%`,
            left: `${destello.left}%`,
            width: `${destello.size}px`,
            height: `${destello.size}px`,
            animationDuration: `${destello.duration}s`,
            animationDelay: `${destello.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default SparkleBackground
