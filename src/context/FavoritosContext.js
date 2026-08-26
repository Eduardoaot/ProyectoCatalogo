import { createContext, useContext } from 'react'

// Productos favoritos del cliente. El Provider está en
// FavoritosProvider.jsx (separado por React Fast Refresh).
export const FavoritosContext = createContext(null)

export function useFavoritos() {
  const valor = useContext(FavoritosContext)
  if (!valor) {
    throw new Error('useFavoritos debe usarse dentro de <FavoritosProvider>')
  }
  return valor
}
