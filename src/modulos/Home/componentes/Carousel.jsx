import { useCallback, useEffect, useRef, useState } from 'react'
import { OFERTAS } from '../../../data/ofertas'
import './Carousel.css'

const INTERVALO_MS = 4500
// Fracción del ancho que hay que arrastrar para que cuente como "cambiar
// de slide"; si se suelta antes de eso, vuelve a acomodarse solo.
const UMBRAL_ARRASTRE = 0.15

// Carrusel puramente decorativo con ofertas: no enlaza a ninguna otra
// pantalla, solo avanza automáticamente, se puede navegar con los puntos
// y también se puede arrastrar con el mouse (o el dedo, vía Pointer Events).
function Carousel() {
  const [indice, setIndice] = useState(0)
  const [arrastreX, setArrastreX] = useState(0)
  const [arrastrando, setArrastrando] = useState(false)
  const pausadoRef = useRef(false)
  const contenedorRef = useRef(null)
  const inicioXRef = useRef(0)

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

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    setArrastrando(true)
    pausadoRef.current = true
    inicioXRef.current = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!arrastrando) return
    setArrastreX(e.clientX - inicioXRef.current)
  }

  const soltarArrastre = () => {
    if (!arrastrando) return
    const ancho = contenedorRef.current?.offsetWidth || 1
    const fraccion = arrastreX / ancho
    if (fraccion <= -UMBRAL_ARRASTRE) {
      irA(indice + 1)
    } else if (fraccion >= UMBRAL_ARRASTRE) {
      irA(indice - 1)
    }
    setArrastrando(false)
    setArrastreX(0)
    pausadoRef.current = false
  }

  const transformPista = arrastrando
    ? `translateX(calc(-${indice * 100}% + ${arrastreX}px))`
    : `translateX(-${indice * 100}%)`

  return (
    <div
      className="carrusel"
      ref={contenedorRef}
      onMouseEnter={() => {
        pausadoRef.current = true
      }}
      onMouseLeave={() => {
        if (!arrastrando) pausadoRef.current = false
      }}
    >
      <div
        className={
          arrastrando ? 'carrusel__pista carrusel__pista--arrastrando' : 'carrusel__pista'
        }
        style={{ transform: transformPista }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={soltarArrastre}
        onPointerCancel={soltarArrastre}
      >
        {OFERTAS.map((oferta) => (
          <div className="carrusel__slide" key={oferta.id}>
            <img
              className="carrusel__imagen"
              src={oferta.imagen}
              alt=""
              draggable="false"
            />
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
