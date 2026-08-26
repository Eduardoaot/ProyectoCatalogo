import { useState } from 'react'
import './SparkleBackground.css'

const CANTIDAD_DESTELLOS = 50

function crearDestello(id) {
  return {
    id,
    top: 5 + Math.random() * 90,
    left: 3 + Math.random() * 94,
    size: 10 + Math.random() * 10,
    duration: 3 + Math.random() * 7,
    delay: Math.random() * 12,
  }
}

function crearDestellosIniciales() {
  return Array.from(
    { length: CANTIDAD_DESTELLOS },
    (_, index) => crearDestello(index),
  )
}

function SparkleBackground() {
  const [destellos] = useState(crearDestellosIniciales)

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
