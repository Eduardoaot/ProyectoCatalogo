import { createContext, useContext } from 'react'

// Tema, tamaño de texto e idioma. El Provider está en
// PreferenciasProvider.jsx (separado por React Fast Refresh).
export const PreferenciasContext = createContext(null)

export function usePreferencias() {
  const valor = useContext(PreferenciasContext)
  if (!valor) {
    throw new Error('usePreferencias debe usarse dentro de <PreferenciasProvider>')
  }
  return valor
}

/** Atajo para traducir: `const t = useTexto()` y luego `t('nav.carrito')`. */
export function useTexto() {
  return usePreferencias().t
}
