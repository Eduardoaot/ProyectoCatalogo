// Idiomas disponibles en la app.
//
// Para agregar uno nuevo:
//   1. Crea `src/i18n/traducciones/<codigo>.js` copiando `es.js` y traduce
//      los valores (las claves no se tocan).
//   2. Impórtalo en `src/i18n/traducciones/index.js`.
//   3. Agrega su entrada aquí abajo.
//
// `dir` es la dirección de escritura: 'rtl' para los idiomas que se leen de
// derecha a izquierda (árabe, hebreo…). El CSS ya usa propiedades lógicas
// donde importa, así que basta con marcarlo aquí.

export const IDIOMAS = [
  { codigo: 'es', nombre: 'Español', bandera: '🇪🇸', dir: 'ltr' },
  { codigo: 'en', nombre: 'English', bandera: '🇬🇧', dir: 'ltr' },
  { codigo: 'pt', nombre: 'Português', bandera: '🇧🇷', dir: 'ltr' },
  { codigo: 'fr', nombre: 'Français', bandera: '🇫🇷', dir: 'ltr' },
  { codigo: 'it', nombre: 'Italiano', bandera: '🇮🇹', dir: 'ltr' },
  { codigo: 'de', nombre: 'Deutsch', bandera: '🇩🇪', dir: 'ltr' },
  { codigo: 'ca', nombre: 'Català', bandera: '🏴', dir: 'ltr' },
  { codigo: 'ru', nombre: 'Русский', bandera: '🇷🇺', dir: 'ltr' },
  { codigo: 'ja', nombre: '日本語', bandera: '🇯🇵', dir: 'ltr' },
  { codigo: 'zh', nombre: '中文', bandera: '🇨🇳', dir: 'ltr' },
  { codigo: 'ko', nombre: '한국어', bandera: '🇰🇷', dir: 'ltr' },
  { codigo: 'ar', nombre: 'العربية', bandera: '🇸🇦', dir: 'rtl' },
]

export const IDIOMA_POR_DEFECTO = 'es'

export function buscarIdioma(codigo) {
  return IDIOMAS.find((i) => i.codigo === codigo) ?? IDIOMAS[0]
}

/** Elige el idioma del navegador si lo tenemos traducido; si no, español. */
export function idiomaDelNavegador() {
  if (typeof navigator === 'undefined') return IDIOMA_POR_DEFECTO
  for (const preferido of navigator.languages ?? [navigator.language ?? '']) {
    const base = String(preferido).slice(0, 2).toLowerCase()
    if (IDIOMAS.some((i) => i.codigo === base)) return base
  }
  return IDIOMA_POR_DEFECTO
}
