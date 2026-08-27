import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// En una SPA no hay carga real de página, así que el navegador conserva el
// scroll al cambiar de ruta: si entrabas al detalle de un producto desde el
// fondo del catálogo, la página nueva arrancaba a esa misma altura y lo
// primero que veías era el footer. Cada cambio de ruta vuelve a empezar
// arriba, como en cualquier sitio normal.
//
// Solo mira `pathname` a propósito: cambiar los query params (?buscar=...,
// ?categoria=...) es filtrar dentro de la misma página, y de ese scroll se
// encarga Home.jsx llevando la vista al título del catálogo.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Forma de dos argumentos a propósito: es siempre instantánea y no
    // depende de que el navegador acepte `behavior: 'instant'`.
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
