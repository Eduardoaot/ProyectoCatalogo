import { IDIOMA_POR_DEFECTO } from './idiomas'
import diccionarios from './traducciones'

/**
 * Devuelve la función `t` de un idioma.
 *
 * Si a un idioma le falta una clave, cae al español en vez de mostrar la
 * clave cruda: así agregar textos nuevos nunca deja la interfaz rota.
 *
 * Los textos admiten variables con llaves:
 *     t('nav.hola', { nombre: 'Ana' })  ->  "Hola, Ana"
 */
export function crearTraductor(codigoIdioma) {
  const base = diccionarios[IDIOMA_POR_DEFECTO]
  const elegido = diccionarios[codigoIdioma] ?? base

  return function t(clave, variables) {
    const plantilla = elegido[clave] ?? base[clave]

    if (plantilla === undefined) {
      // Solo en desarrollo: en producción es mejor no ensuciar la consola.
      if (import.meta.env?.DEV) console.warn(`[i18n] falta la clave "${clave}"`)
      return clave
    }

    if (!variables) return plantilla

    return plantilla.replace(/\{(\w+)\}/g, (coincidencia, nombre) =>
      variables[nombre] !== undefined ? String(variables[nombre]) : coincidencia,
    )
  }
}

export { diccionarios }
