// Cliente HTTP contra la API de Rosamark (backend/).
//
// La API siempre responde { ok, data, error }. Aquí se desenvuelve: si ok es
// true se devuelve `data` pelado, y si no se lanza un ErrorApi con el mensaje
// que mandó el servidor, para que cada pantalla lo muestre tal cual.

// `import.meta.env` solo existe cuando lo compila Vite; el `?.` deja que
// estos módulos también se puedan importar desde Node para probarlos.
const BASE = (import.meta.env?.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

const CLAVE_TOKEN = 'rosamark:token'

export class ErrorApi extends Error {
  constructor(mensaje, status, detalles = null) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.status = status
    this.detalles = detalles
  }
}

export function leerToken() {
  try {
    return localStorage.getItem(CLAVE_TOKEN)
  } catch {
    return null
  }
}

export function guardarToken(token) {
  try {
    if (token) localStorage.setItem(CLAVE_TOKEN, token)
    else localStorage.removeItem(CLAVE_TOKEN)
  } catch {
    // Navegar en modo privado no debería romper la app.
  }
}

/**
 * @param {string} ruta      Ej. '/productos'
 * @param {object} opciones  { metodo, cuerpo, query, autenticado }
 */
export async function pedir(ruta, { metodo = 'GET', cuerpo, query, autenticado = false } = {}) {
  const url = new URL(BASE + ruta)
  if (query) {
    Object.entries(query).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') {
        url.searchParams.set(clave, valor)
      }
    })
  }

  const cabeceras = {}
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json'
  if (autenticado) {
    const token = leerToken()
    if (!token) throw new ErrorApi('Necesitas iniciar sesión.', 401)
    cabeceras.Authorization = `Bearer ${token}`
  }

  let respuesta
  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    })
  } catch {
    // fetch solo falla así cuando no se pudo llegar al servidor.
    throw new ErrorApi(
      `No se pudo conectar con la API en ${BASE}. ¿Está corriendo el backend?`,
      0,
    )
  }

  let json
  try {
    json = await respuesta.json()
  } catch {
    throw new ErrorApi(`Respuesta inesperada del servidor (${respuesta.status}).`, respuesta.status)
  }

  if (!respuesta.ok || json?.ok === false) {
    const mensaje = json?.error?.message ?? `Error ${respuesta.status}`
    throw new ErrorApi(mensaje, respuesta.status, json?.error?.details ?? null)
  }

  return json.data
}
