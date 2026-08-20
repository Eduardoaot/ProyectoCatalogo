import { useCallback, useEffect, useRef, useState } from 'react'
import { OFERTAS } from '../data/ofertas'
import './Carousel.css'

const INTERVALO_MS = 4500

// Carrusel puramente decorativo con ofertas: no enlaza a ninguna otra
// pantalla, solo avanza automáticamente y se puede navegar con los puntos.
function Carousel() {
  const [indice, setIndice] = useState(0)
  const pausadoRef = useRef(false)

  const irA = useCallback((i) => {
    setIndice((i + OFERTAS.length) % OFERTAS.length)
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (!pausadoRef.current) {
        setIndice((actual) => (actual + 1) % OFERTAS.length)
      }
    }, INTERVALO_MS)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div
      className="carrusel"
      onMouseEnter={() => {
        pausadoRef.current = true
      }}
      onMouseLeave={() => {
        pausadoRef.current = false
      }}
    >
      <div
        className="carrusel__pista"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {OFERTAS.map((oferta) => (
          <div className="carrusel__slide" key={oferta.id}>
            <img className="carrusel__imagen" src={oferta.imagen} alt="" />
            <div className="carrusel__overlay">
              <span className="carrusel__etiqueta">Oferta</span>
              <h3 className="carrusel__titulo">{oferta.titulo}</h3>
              {oferta.codigo && (
                <div className="carrusel__cupon">
                  <span className="carrusel__cupon-beneficio">{oferta.beneficio}</span>
                  <span className="carrusel__cupon-codigo">Código: {oferta.codigo}</span>
                </div>
              )}
              <p className="carrusel__texto">{oferta.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="carrusel__puntos">
        {OFERTAS.map((oferta, i) => (
          <button
            key={oferta.id}
            type="button"
            className={i === indice ? 'carrusel__punto is-active' : 'carrusel__punto'}
            aria-label={`Ver oferta ${i + 1}`}
            onClick={() => irA(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
