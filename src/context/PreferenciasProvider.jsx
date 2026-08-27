import { useEffect, useMemo, useState } from 'react'
import { crearTraductor } from '../i18n'
import { buscarIdioma, IDIOMA_POR_DEFECTO, idiomaDelNavegador, IDIOMAS } from '../i18n/idiomas'
import { PreferenciasContext } from './PreferenciasContext'

/**
 * Preferencias de la persona que usa la app: tema, tamaño de texto e idioma.
 *
 * Se guardan en localStorage y se aplican como atributos en <html>, de modo
 * que el CSS pueda reaccionar (`[data-tema="oscuro"]`, `[data-fuente="grande"]`)
 * sin que ningún componente tenga que enterarse.
 */

const CLAVE = 'rosamark:preferencias'

export const TEMAS = ['claro', 'oscuro']
export const TAMANOS_TEXTO = ['pequeno', 'normal', 'grande', 'enorme']

function temaDelSistema() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'claro'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

function leerGuardadas() {
  let guardado = {}
  try {
    guardado = JSON.parse(localStorage.getItem(CLAVE) ?? '{}')
  } catch {
    guardado = {}
  }

  return {
    // Sin preferencia guardada se respeta lo que pide el sistema operativo.
    tema: TEMAS.includes(guardado.tema) ? guardado.tema : temaDelSistema(),
    tamanoTexto: TAMANOS_TEXTO.includes(guardado.tamanoTexto) ? guardado.tamanoTexto : 'normal',
    idioma: IDIOMAS.some((i) => i.codigo === guardado.idioma)
      ? guardado.idioma
      : idiomaDelNavegador(),
  }
}

export function PreferenciasProvider({ children }) {
  const [preferencias, setPreferencias] = useState(leerGuardadas)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(preferencias))
    } catch {
      // Modo privado: la app funciona igual, solo no se recuerda.
    }

    const raiz = document.documentElement
    const idioma = buscarIdioma(preferencias.idioma)

    raiz.dataset.tema = preferencias.tema
    raiz.dataset.fuente = preferencias.tamanoTexto
    raiz.lang = idioma.codigo
    raiz.dir = idioma.dir
    // Para que los controles nativos (scrollbars, inputs) sigan el tema.
    raiz.style.colorScheme = preferencias.tema === 'oscuro' ? 'dark' : 'light'
  }, [preferencias])

  const valor = useMemo(() => {
    const idioma = buscarIdioma(preferencias.idioma)
    return {
      ...preferencias,
      idiomaActual: idioma,
      idiomas: IDIOMAS,
      t: crearTraductor(preferencias.idioma),
      esOscuro: preferencias.tema === 'oscuro',
      cambiarTema: (tema) => setPreferencias((p) => ({ ...p, tema })),
      alternarTema: () =>
        setPreferencias((p) => ({ ...p, tema: p.tema === 'oscuro' ? 'claro' : 'oscuro' })),
      cambiarTamanoTexto: (tamanoTexto) => setPreferencias((p) => ({ ...p, tamanoTexto })),
      cambiarIdioma: (codigo) => setPreferencias((p) => ({ ...p, idioma: codigo })),
      // El idioma se fija en español a propósito (no el del navegador):
      // "restablecer" debe volver siempre al mismo punto de partida,
      // predecible, sin importar en qué idioma haya quedado la sesión.
      restablecer: () =>
        setPreferencias({
          tema: temaDelSistema(),
          tamanoTexto: 'normal',
          idioma: IDIOMA_POR_DEFECTO,
        }),
    }
  }, [preferencias])

  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>
}
