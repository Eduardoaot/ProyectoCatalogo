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
//
// Campos opcionales:
//   stock: number           -> unidades disponibles (si no se define, se usa
//                              un valor por defecto, ver TiendaProvider.jsx)
//   precioOriginal: number  -> si es mayor que "precio", el producto se
//                              muestra con el precio original tachado (el
//                              producto ya trae su propio descuento)
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
    precioOriginal: 1.5,
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
    emoji: 'https://saludinteractiva.mx/blog/wp-content/uploads/2022/05/beneficios_del_platano_istock.webp',
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
    precioOriginal: 38,
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
    precioOriginal: 12,
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
    precioOriginal: 65,
    unidad: 'kg',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/T-bone-raw-MCB.jpg/960px-T-bone-raw-MCB.jpg',
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
    emoji: 'https://kosherhouse.mx/cdn/shop/files/pechugadepollosinhueso.jpg?v=1691773142',
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
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Hackfleisch-1.jpg/960px-Hackfleisch-1.jpg',
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
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Champagne_bottles_in_a_bucket_-_8439.jpg/960px-Champagne_bottles_in_a_bucket_-_8439.jpg',
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
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Big-Cola-3L.jpg',
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
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bottle_of_Water.jpg/960px-Bottle_of_Water.jpg',
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
    emoji: 'https://orvagclf.com/cdn/shop/products/12fd7adaa7fd9d328a905abc61103b38.png?v=1692165820',
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
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Joy_pot_and_pan_detergent.jpg/960px-Joy_pot_and_pan_detergent.jpg',
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
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Ceramic_bowl_full_of_white_rice.jpg/960px-Ceramic_bowl_full_of_white_rice.jpg',
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
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Black_beans_%281126927794%29.jpg/960px-Black_beans_%281126927794%29.jpg',
    descripcion:
      'Frijol de excelente calidad para preparar tus comidas favoritas.',
    destacado: false,
  },

  // =========================
  // MÁS FRUTAS Y VERDURAS
  // =========================
  {
    id: 21,
    nombre: 'Fresa',
    categoria: 'Frutas y Verduras',
    precio: 45,
    unidad: 'kg',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Strawberry_image.jpg',
    descripcion:
      'Fresas frescas y dulces, perfectas para postres y licuados.',
    destacado: true,
  },
  {
    id: 22,
    nombre: 'Uva',
    categoria: 'Frutas y Verduras',
    precio: 55,
    unidad: 'kg',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Grapes%2C_Rostov-on-Don%2C_Russia.jpg/960px-Grapes%2C_Rostov-on-Don%2C_Russia.jpg',
    descripcion:
      'Uvas frescas y jugosas, ideales para picar o preparar postres.',
    destacado: false,
  },
  {
    id: 23,
    nombre: 'Papa',
    categoria: 'Frutas y Verduras',
    precio: 18,
    unidad: 'kg',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/960px-Patates.jpg',
    descripcion:
      'Papas frescas, versátiles para freír, hornear o hacer puré.',
    destacado: false,
  },
  {
    id: 24,
    nombre: 'Cebolla',
    categoria: 'Frutas y Verduras',
    precio: 16,
    unidad: 'kg',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/960px-Mixed_onions.jpg',
    descripcion:
      'Cebollas frescas, infaltables para dar sabor a tus platillos.',
    destacado: false,
  },

  // =========================
  // MÁS PANADERÍA
  // =========================
  {
    id: 25,
    nombre: 'Galletas de Chispas de Chocolate',
    categoria: 'Panadería',
    precio: 22,
    unidad: 'paquete',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Choc-Chip-Cookie.jpg/960px-Choc-Chip-Cookie.jpg',
    descripcion:
      'Galletas horneadas con chispas de chocolate, crujientes por fuera y suaves por dentro.',
    destacado: true,
  },

  // =========================
  // MÁS CARNES
  // =========================
  {
    id: 26,
    nombre: 'Salchicha',
    categoria: 'Carnes',
    precio: 48,
    unidad: 'kg',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Cervelat.jpg/960px-Cervelat.jpg',
    descripcion:
      'Salchichas ahumadas, listas para asar o cocinar.',
    destacado: false,
  },

  // =========================
  // MÁS BEBIDAS
  // =========================
  {
    id: 27,
    nombre: 'Café en Grano',
    categoria: 'Bebidas',
    precio: 65,
    unidad: 'paquete',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Coffee_Robusta_Arabica.jpg/960px-Coffee_Robusta_Arabica.jpg',
    descripcion:
      'Café en grano tostado, ideal para preparar un buen café recién molido.',
    destacado: true,
  },

  // =========================
  // MÁS LIMPIEZA
  // =========================
  {
    id: 28,
    nombre: 'Cloro',
    categoria: 'Limpieza',
    precio: 24,
    unidad: 'litro',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Clorox_Bleach_products.jpg',
    descripcion:
      'Cloro desinfectante para limpieza y desinfección del hogar.',
    destacado: false,
  },

  // =========================
  // MÁS ABARROTES
  // =========================
  {
    id: 29,
    nombre: 'Miel de Abeja',
    categoria: 'Abarrotes',
    precio: 60,
    unidad: 'frasco',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Runny_hunny.jpg/960px-Runny_hunny.jpg',
    descripcion:
      'Miel de abeja pura, natural y endulzante ideal para tus recetas.',
    destacado: true,
  },
]
