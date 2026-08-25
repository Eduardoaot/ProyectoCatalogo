import { createContext, useContext } from 'react'

// Catálogo (productos, categorías y ofertas) traído de la API.
// El Provider está en CatalogoProvider.jsx — separado para que
// React Fast Refresh no se queje, igual que Auth y Tienda.
export const CatalogoContext = createContext(null)

export function useCatalogo() {
  const valor = useContext(CatalogoContext)
  if (!valor) {
    throw new Error('useCatalogo debe usarse dentro de <CatalogoProvider>')
  }
  return valor
}
