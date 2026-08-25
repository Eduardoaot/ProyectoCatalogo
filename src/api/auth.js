// Registro, login y perfil contra la API. El token JWT se guarda en
// localStorage; la contraseña nunca se guarda en ningún lado del navegador.

import { guardarToken, pedir } from './cliente'

function adaptarCliente(fila) {
  return {
    id: fila.ID_cliente,
    nombre: fila.nombre_cliente,
    email: fila.correo_cliente,
  }
}

export async function registrar({ nombre, email, password }) {
  const data = await pedir('/clientes/registro', {
    metodo: 'POST',
    cuerpo: {
      nombre_cliente: nombre.trim(),
      correo_cliente: email.trim(),
      contrasena_cliente: password,
    },
  })
  guardarToken(data.token)
  return adaptarCliente(data.cliente)
}

export async function iniciarSesion({ email, password }) {
  const data = await pedir('/clientes/login', {
    metodo: 'POST',
    cuerpo: { correo_cliente: email.trim(), contrasena_cliente: password },
  })
  guardarToken(data.token)
  return adaptarCliente(data.cliente)
}

/** Recupera la sesión al recargar la página, usando el token guardado. */
export async function obtenerPerfil() {
  return adaptarCliente(await pedir('/clientes/me', { autenticado: true }))
}

export function cerrarSesion() {
  guardarToken(null)
}
