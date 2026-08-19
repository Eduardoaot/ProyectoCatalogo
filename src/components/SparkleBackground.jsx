import { useCallback, useState } from 'react'
import './SparkleBackground.css'

const CANTIDAD_DESTELLOS = 26

// Cada destello dura ~3s de forma dispareja (no todos sincronizados),
// aparece, se mantiene un momento y se desvanece.
function crearDestello(id) {
  return {
    id,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 6 + Math.random() * 12,
    duration: 4.4 + Math.random() * 1.4,
    delay: Math.random() * 3,
  }
}

function crearDestellosIniciales() {
  return Array.from({ length: CANTIDAD_DESTELLOS }, (_, index) => crearDestello(index))
}

// Fondo decorativo de destellos tipo "estrellas" que titilan.
// Cada vez que un destello termina su ciclo de animación se reubica al azar,
// dando la sensación de que desaparece y aparece otro en un lugar distinto.
// Puramente visual: no interactúa con el usuario (aria-hidden + pointer-events: none).
function SparkleBackground() {
  const [destellos, setDestellos] = useState(crearDestellosIniciales)

  const reubicar = useCallback((id) => {
    setDestellos((actuales) =>
      actuales.map((destello) => (destello.id === id ? crearDestello(id) : destello)),
    )
  }, [])

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
          onAnimationIteration={() => reubicar(destello.id)}
        />
      ))}
    </div>
  )
}

export default SparkleBackground
