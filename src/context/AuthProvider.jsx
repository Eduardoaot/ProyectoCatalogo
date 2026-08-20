import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'

const CLAVE_USUARIO = 'rosamark:usuario'

function leerUsuarioGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIO)
    return guardado ? JSON.parse(guardado) : null
  } catch {
    return null
  }
}

// Autenticación de demostración: no hay backend, así que "iniciar sesión"
// solo guarda un nombre y correo en memoria + localStorage (persiste al
// recargar la página, pero no valida contraseña contra ningún servidor).
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado)

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
    } else {
      localStorage.removeItem(CLAVE_USUARIO)
    }
  }, [usuario])

  const iniciarSesion = ({ nombre, email }) => {
    setUsuario({ nombre, email })
  }

  const cerrarSesion = () => {
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}
