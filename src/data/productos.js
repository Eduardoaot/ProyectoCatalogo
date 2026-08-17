// Catálogo de productos de Rosamark.
// Todos los productos se definen aquí como datos constantes (no dinámicos).
// Para agregar un producto nuevo, copia un objeto de ejemplo y agrégalo al arreglo PRODUCTOS.
//
// Estructura de cada producto:
// {
//   id: number            -> identificador único (usado en la ruta /producto/:id)
//   nombre: string         -> nombre del producto
//   categoria: string      -> categoría a la que pertenece
//   precio: number         -> precio en dólares
//   unidad: string         -> unidad de venta (ej. "kg", "unidad", "litro")
//   emoji: string          -> ícono representativo (se usa en vez de una foto)
//   descripcion: string    -> breve descripción del producto
//   destacado: boolean     -> si aparece marcado como oferta/destacado
// }

export const CATEGORIAS = [
  'Frutas y Verduras',
  'Lácteos',
  'Panadería',
  'Carnes',
  'Bebidas',
  'Limpieza',
  'Abarrotes',
]

export const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Manzana Roja',
    categoria: 'Frutas y Verduras',
    precio: 1.2,
    unidad: 'kg',
    emoji: '🍎',
    descripcion: 'Manzanas rojas frescas y crujientes, ideales para cualquier momento del día.',
    destacado: true,
  },
]
