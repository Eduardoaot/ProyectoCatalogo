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
    emoji: 'https://elegifruta.com.ar/wp-content/uploads/2017/07/manzana_roja.jpg',
    descripcion:
      'Manzanas rojas frescas y crujientes, ideales para cualquier momento del día.',
    destacado: true,
  },
  {
    id: 2,
    nombre: 'Plátano',
    categoria: 'Frutas y Verduras',
    precio: 1.5,
    unidad: 'kg',
    emoji: 'https://th.bing.com/th/id/R.0e171c6d47d6f1b504c777c1a8308983?rik=c9jQ6sAvtFiIDw&riu=http%3a%2f%2f3.bp.blogspot.com%2f-wbO46JPH0y0%2fUrT88uFtw0I%2fAAAAAAAAHNU%2f6DPRUQ_5qaM%2fs1600%2fplatanos.jpg&ehk=rQsOzXxdo1k3gD%2bj6NedspVgXC754xThYbWRUhCYTp0%3d&risl=&pid=ImgRaw&r=0',
    descripcion:
      'Plátanos frescos y dulces, perfectos para desayunos y licuados.',
    destacado: false,
  },
  {
    id: 3,
    nombre: 'Naranja',
    categoria: 'Frutas y Verduras',
    precio: 1.8,
    unidad: 'kg',
    emoji: 'https://tse4.mm.bing.net/th/id/OIP.7uvRp-iBdY04IQa-WpeJNgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    descripcion:
      'Naranjas frescas y jugosas ideales para preparar deliciosos jugos.',
    destacado: true,
  },
  {
    id: 4,
    nombre: 'Tomate',
    categoria: 'Frutas y Verduras',
    precio: 2.2,
    unidad: 'kg',
    emoji: 'https://tse2.mm.bing.net/th/id/OIP.gi9KS8sqHTQMH_iGrjLX0wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    descripcion:
      'Tomates frescos para ensaladas, salsas y todo tipo de comidas.',
    destacado: false,
  },

  // =========================
  // LÁCTEOS
  // =========================
  {
    id: 5,
    nombre: 'Nutri-leche',
    categoria: 'Lácteos',
    precio: 30,
    unidad: 'litro',
    emoji: 'https://cdn.shopify.com/s/files/1/0080/1076/0255/products/LECHE-NUTRILECHE-1-LT_4fb01653-6ed2-4ad6-a784-bba71e7c0171_1200x1200_crop_center.jpg?v=1654034176',
    descripcion:
      'Leche fresca de la marca Nutri-leche.',
    destacado: true,
  },
  {
    id: 6,
    nombre: 'Yogur Natural',
    categoria: 'Lácteos',
    precio: 18,
    unidad: 'pieza',
    emoji: 'https://tse3.mm.bing.net/th/id/OIP.ic0LVusiDlRRBB_iZBIjmgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    descripcion:
      'Yogur natural cremoso, ideal para desayunos y snacks.',
    destacado: false,
  },
  {
    id: 7,
    nombre: 'Queso Manchego',
    categoria: 'Lácteos',
    precio: 85,
    unidad: 'kg',
    emoji: 'https://i5-mx.walmartimages.com/gr/images/product-images/img_large/00750104120155L.jpg',
    descripcion:
      'Queso manchego de excelente calidad y gran sabor.',
    destacado: true,
  },

  // =========================
  // PANADERÍA
  // =========================
  {
    id: 8,
    nombre: 'Pan Francés',
    categoria: 'Panadería',
    precio: 9,
    unidad: 'pieza',
    emoji: 'https://media.istockphoto.com/id/485821784/photo/various-of-french-baguette-isolated-on-white-background.jpg?s=170667a&w=0&k=20&c=HYhQoHiNnS5HpHEQZQSsD05yNLwJ-97bjgII7_46jws=',
    descripcion:
      'Pan francés recién horneado y crujiente.',
    destacado: true,
  },
  {
    id: 9,
    nombre: 'Pan de Caja',
    categoria: 'Panadería',
    precio: 42,
    unidad: 'paquete',
    emoji: 'https://tse2.mm.bing.net/th/id/OIP.R4BDVq4Vsy1vz2ai2unP9AHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    descripcion:
      'Pan de caja suave, perfecto para preparar sandwiches.',
    destacado: false,
  },
  {
    id: 10,
    nombre: 'Dona de Chocolate',
    categoria: 'Panadería',
    precio: 15,
    unidad: 'pieza',
    emoji: 'https://www.chocolatesturin.com.mx/cdn-cgi/image/width=1360,height=583,f=auto,quality=90/sites/g/files/fnmzdf5476/files/2024-12/06%20Donas%20de%20choclate11476_retoque.jpg',
    descripcion:
      'Dona esponjosa cubierta con delicioso chocolate.',
    destacado: true,
  },

  // =========================
  // CARNES
  // =========================
  {
    id: 11,
    nombre: 'Carne T-Bone',
    categoria: 'Carnes',
    precio: 50,
    unidad: 'kg',
    emoji: '🥩',
    descripcion:
      'Corte T-Bone preparado y listo para cocinar.',
    destacado: true,
  },
  {
    id: 12,
    nombre: 'Pechuga de Pollo',
    categoria: 'Carnes',
    precio: 75,
    unidad: 'kg',
    emoji: '🍗',
    descripcion:
      'Pechuga de pollo fresca y lista para preparar.',
    destacado: false,
  },
  {
    id: 13,
    nombre: 'Carne Molida',
    categoria: 'Carnes',
    precio: 95,
    unidad: 'kg',
    emoji: '🥩',
    descripcion:
      'Carne molida de res fresca para hamburguesas y guisos.',
    destacado: true,
  },

  // =========================
  // BEBIDAS
  // =========================
  {
    id: 14,
    nombre: 'Champagne',
    categoria: 'Bebidas',
    precio: 100,
    unidad: 'botella',
    emoji: '🍾',
    descripcion:
      'Champagne para disfrutar en una ocasión especial.',
    destacado: true,
  },
  {
    id: 15,
    nombre: 'Refresco de Cola',
    categoria: 'Bebidas',
    precio: 25,
    unidad: 'litro',
    emoji: '🥤',
    descripcion:
      'Refresco de cola frío y refrescante.',
    destacado: false,
  },
  {
    id: 16,
    nombre: 'Agua Natural',
    categoria: 'Bebidas',
    precio: 15,
    unidad: 'botella',
    emoji: '💧',
    descripcion:
      'Agua natural para mantenerte hidratado durante el día.',
    destacado: false,
  },

  // =========================
  // LIMPIEZA
  // =========================
  {
    id: 17,
    nombre: 'Escoba',
    categoria: 'Limpieza',
    precio: 40,
    unidad: 'pieza',
    emoji: '🧹',
    descripcion:
      'Escoba tradicional para el aseo de tu hogar.',
    destacado: true,
  },
  {
    id: 18,
    nombre: 'Jabón para Trastes',
    categoria: 'Limpieza',
    precio: 32,
    unidad: 'litro',
    emoji: '🧽',
    descripcion:
      'Jabón líquido para eliminar grasa y suciedad de los trastes.',
    destacado: false,
  },

  // =========================
  // ABARROTES
  // =========================
  {
    id: 19,
    nombre: 'Arroz',
    categoria: 'Abarrotes',
    precio: 28,
    unidad: 'kg',
    emoji: '🍚',
    descripcion:
      'Arroz blanco de grano largo para acompañar tus comidas.',
    destacado: true,
  },
  {
    id: 20,
    nombre: 'Frijol',
    categoria: 'Abarrotes',
    precio: 35,
    unidad: 'kg',
    emoji: '🫘',
    descripcion:
      'Frijol de excelente calidad para preparar tus comidas favoritas.',
    destacado: false,
  },
]
