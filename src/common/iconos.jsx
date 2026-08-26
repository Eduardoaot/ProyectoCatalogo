// Íconos SVG livianos, sin depender de ninguna librería externa.
// Todos aceptan `className` para poder controlar tamaño/color desde CSS
// (usan `currentColor`, así que heredan el color de texto del elemento padre).

export function IconoMenu({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function IconoX({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function IconoUsuario({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  )
}

export function IconoCarrito({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21.5 7H6" />
    </svg>
  )
}

export function IconoBuscar({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function IconoPanelLateral({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="14.5" y1="4" x2="14.5" y2="20" />
    </svg>
  )
}

export function IconoAlerta({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5 22 20.5H2Z" />
      <line x1="12" y1="10" x2="12" y2="14.5" />
      <circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconoChevron({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function IconoSol({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function IconoLuna({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

// `relleno` pinta el corazón sólido: se usa cuando el producto ya es favorito.
export function IconoCorazon({ className, relleno = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={relleno ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 21.4l8.8-8.4a5.2 5.2 0 0 0 0-7.4Z" />
    </svg>
  )
}

export function IconoOjo({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 12S5.2 5.5 12 5.5 22.5 12 22.5 12 18.8 18.5 12 18.5 1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

export function IconoOjoTachado({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.9 5.7A9.9 9.9 0 0 1 12 5.5c6.8 0 10.5 6.5 10.5 6.5a17.6 17.6 0 0 1-3.4 4.2M6.3 6.4A17.4 17.4 0 0 0 1.5 12S5.2 18.5 12 18.5a9.8 9.8 0 0 0 4.2-.9" />
      <path d="M9.8 9.9a3.2 3.2 0 0 0 4.4 4.4" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  )
}

export function IconoIdioma({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  )
}

export function IconoAjustes({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.9-1.5-2-3.5-2.3.6a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.4 2.6a7.6 7.6 0 0 0-2.6 1.5l-2.3-.6-2 3.5L4.6 10.5a7.6 7.6 0 0 0 0 3L2.7 15l2 3.5 2.3-.6a7.6 7.6 0 0 0 2.6 1.5L10 22h4l.4-2.6a7.6 7.6 0 0 0 2.6-1.5l2.3.6 2-3.5-1.9-1.5Z" />
    </svg>
  )
}

// --- Íconos de categoría (usados en los chips de filtro del catálogo) ---

export function IconoTodas({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  )
}

export function IconoFrutas({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 9.2c4 0 6.5 2.6 6.5 6.2 0 3.5-2.7 6.6-6.5 6.6s-6.5-3.1-6.5-6.6c0-3.6 2.5-6.2 6.5-6.2Z" />
      <path d="M12 9.2c0-2.4 1-4.3 3-5.4M12 9.2c0-2.4-1-4.3-3-5.4" />
    </svg>
  )
}

export function IconoLacteos({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 2.5h6v4l2.4 3.4c.4.5.6 1.2.6 1.8V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 20v-8.3c0-.6.2-1.3.6-1.8L10 6.5v-4Z" />
      <path d="M7.3 13.5h9.4" />
    </svg>
  )
}

export function IconoPanaderia({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 13c0-4 3.6-7.5 8-7.5s8 3.5 8 7.5-3.6 6.5-8 6.5-8-2.5-8-6.5Z" />
      <path d="M7 11.5c.6-1 1.8-1.6 3-1.2M13.5 10.8c1-.6 2.4-.4 3.2.5" />
    </svg>
  )
}

export function IconoCarnes({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.5 14.5c-3-3-3.2-7.4-.5-10 2.6-2.6 6.8-2.4 9.7.5 3 3 3.1 7.2.5 9.7-1.2 1.2-2.9 1.7-4.6 1.5" />
      <path d="M9.5 14.5 4 20M6.3 16.8 4 20l3.2-2.3" />
    </svg>
  )
}

export function IconoBebidas({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2.5h12l-1.4 6.6a2 2 0 0 1-2 1.6h-5.2a2 2 0 0 1-2-1.6L6 2.5Z" />
      <path d="M12 10.7V21M8 21h8" />
    </svg>
  )
}

export function IconoLimpieza({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 3.5 20 9l-8.5 8.5-6-6Z" />
      <path d="M9 12.5 3.5 18c-1 1-1 2.4 0 3s2.4.5 3.4-.5L12 15" />
    </svg>
  )
}

export function IconoAbarrotes({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5.5 8.5h13l-1.1 10.3a2 2 0 0 1-2 1.7H8.6a2 2 0 0 1-2-1.7L5.5 8.5Z" />
      <path d="M8.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  )
}

export function IconoTexto({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 19 8.5 5 14 19M4.8 14.6h7.4" />
      <path d="M15.5 19 19 9.5 22.5 19M16.6 16.4h4.8" />
    </svg>
  )
}
