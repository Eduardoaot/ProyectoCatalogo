import { useEffect, useState } from 'react'
import * as api from '../api/auth'
import { leerToken } from '../api/cliente'
import { AuthContext } from './AuthContext'

/**
 * Sesión real contra la API: el registro y el login pegan a
 * /clientes/registro y /clientes/login, la contraseña se hashea con bcrypt
 * en el servidor y aquí solo se guarda el JWT que devuelve.
 *
 * Al recargar la página se recupera la sesión pidiendo /clientes/me con ese
 * token; si expiró o es inválido, se descarta y se vuelve a "sin sesión".
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  // Mientras se valida el token guardado no se sabe si hay sesión o no, y
  // las pantallas protegidas no deben redirigir a /login todavía.
  const [cargandoSesion, setCargandoSesion] = useState(Boolean(leerToken()))

  useEffect(() => {
    if (!leerToken()) return

    let cancelado = false
    api
      .obtenerPerfil()
      .then((cliente) => {
        if (!cancelado) setUsuario(cliente)
      })
      .catch(() => {
        // Token vencido, inválido o backend caído: se empieza sin sesión.
        api.cerrarSesion()
      })
      .finally(() => {
        if (!cancelado) setCargandoSesion(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const iniciarSesion = async ({ email, password }) => {
    try {
      setUsuario(await api.iniciarSesion({ email, password }))
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  const registrarUsuario = async ({ nombre, email, password }) => {
    try {
      setUsuario(await api.registrar({ nombre, email, password }))
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  const cerrarSesion = () => {
    api.cerrarSesion()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{ usuario, cargandoSesion, iniciarSesion, registrarUsuario, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  )
}
