import { createContext, useContext } from 'react'

// Contexto de autenticación. La lógica y el estado viven en AuthProvider.jsx
// (este archivo se mantiene sin JSX para que React Fast Refresh no se queje
// por mezclar un componente con exports que no son componentes).
export const AuthContext = createContext(null)

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return contexto
}
