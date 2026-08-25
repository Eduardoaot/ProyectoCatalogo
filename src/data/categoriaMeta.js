import {
  IconoAbarrotes,
  IconoBebidas,
  IconoCarnes,
  IconoFrutas,
  IconoLacteos,
  IconoLimpieza,
  IconoPanaderia,
  IconoTodas,
} from '../common/iconos'

// Ícono por categoría, para los chips de filtro del catálogo. La clave es el
// nombre de categoría tal cual viene de la API (mismo valor que ya se usa
// para filtrar y armar la URL ?categoria=...); la traducción de la etiqueta
// visible vive en src/i18n/traducciones/*.js bajo 'cat.<nombre>'.
export const ICONO_POR_CATEGORIA = {
  'Frutas y Verduras': IconoFrutas,
  Lácteos: IconoLacteos,
  Panadería: IconoPanaderia,
  Carnes: IconoCarnes,
  Bebidas: IconoBebidas,
  Limpieza: IconoLimpieza,
  Abarrotes: IconoAbarrotes,
}

// Ícono para el filtro sintético "Todas" (no es una categoría real).
export const ICONO_TODAS = IconoTodas
