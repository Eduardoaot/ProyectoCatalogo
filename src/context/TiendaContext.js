import { createContext, useContext } from 'react'

// Contexto de carrito, stock y órdenes. La lógica y el estado viven en
// TiendaProvider.jsx (este archivo se mantiene sin JSX para que React Fast
// Refresh no se queje por mezclar un componente con exports que no lo son).
export const TiendaContext = createContext(null)

export function useTienda() {
  const contexto = useContext(TiendaContext)
  if (!contexto) {
    throw new Error('useTienda debe usarse dentro de <TiendaProvider>')
  }
  return contexto
}
