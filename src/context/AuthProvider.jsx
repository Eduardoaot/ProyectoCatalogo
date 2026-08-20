import { useEffect, useState } from 'react'
import { USUARIOS_SEED } from '../data/usuarios'
import { AuthContext } from './AuthContext'

const CLAVE_USUARIOS = 'rosamark:usuarios'
const CLAVE_SESION = 'rosamark:sesionUsuarioId'

function leerLocalStorage(clave, valorPorDefecto) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

// Autenticación de demostración: no hay backend. Los usuarios "existentes"
// son el seed de src/data/usuarios.js; los que se registran desde la app se
// agregan a esa misma lista y se persisten en localStorage. La sesión solo
// guarda el id del usuario logueado (no sus datos), así que si sus datos
// cambiaran seguirían reflejándose al instante.
export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(() => leerLocalStorage(CLAVE_USUARIOS, USUARIOS_SEED))
  const [usuarioId, setUsuarioId] = useState(() => leerLocalStorage(CLAVE_SESION, null))

  useEffect(() => {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
  }, [usuarios])

  useEffect(() => {
    if (usuarioId) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuarioId))
    } else {
      localStorage.removeItem(CLAVE_SESION)
    }
  }, [usuarioId])

  const usuarioGuardado = usuarios.find((u) => u.id === usuarioId) ?? null
  // Se expone sin la contraseña: nada que la use fuera de este provider
  // debería siquiera tenerla a mano.
  const usuario = usuarioGuardado
    ? { id: usuarioGuardado.id, nombre: usuarioGuardado.nombre, email: usuarioGuardado.email }
    : null

  const iniciarSesion = ({ email, password }) => {
    const correo = email.trim().toLowerCase()
    const encontrado = usuarios.find(
      (u) => u.email.toLowerCase() === correo && u.password === password,
    )
    if (!encontrado) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' }
    }
    setUsuarioId(encontrado.id)
    return { ok: true }
  }

  const registrarUsuario = ({ nombre, email, password }) => {
    const correo = email.trim().toLowerCase()
    if (usuarios.some((u) => u.email.toLowerCase() === correo)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
    }
    const nuevo = {
      id: `u${Date.now()}`,
      nombre: nombre.trim(),
      email: email.trim(),
      password,
    }
    setUsuarios((actual) => [...actual, nuevo])
    setUsuarioId(nuevo.id)
    return { ok: true }
  }

  const cerrarSesion = () => {
    setUsuarioId(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, registrarUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}
