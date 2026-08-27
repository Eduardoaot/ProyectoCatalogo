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
//   factorPieza: number     -> cuanto pesa/mide UNA pieza suelta en la unidad
//                              de venta (1 manzana = 0.18 kg). Solo tiene
//                              sentido en lo que se vende a granel: es lo que
//                              deja comprar "por kilo" o "por pieza" en el
//                              detalle. Si no se define vale 1.
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
    factorPieza: 0.18,
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
    factorPieza: 0.12,
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
    factorPieza: 0.2,
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
    factorPieza: 0.15,
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
    nombre: 'Yogurt griego',
    categoria: 'Lácteos',
    precio: 18,
    unidad: 'pieza',
    emoji: 'https://www.yoplait.com.mx/public/app/uploads/2022/07/GRIEGO_NATURAL_120g_271x300px.png',
    descripcion:
      'Yogur griego cremoso, ideal para desayunos y snacks.',
    destacado: false,
  },
  {
    id: 7,
    nombre: 'Queso Americano',
    categoria: 'Lácteos',
    precio: 85,
    unidad: 'kg',
    factorPieza: 0.25,
    emoji: 'https://www.grillhouse.mx/cdn/shop/products/8147VLLTamericano175gSIM21.png?v=1753148155',
    descripcion:
      'Queso Americano de excelente calidad y gran sabor.',
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
    factorPieza: 0.45,
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/T-bone-raw-MCB.jpg/960px-T-bone-raw-MCB.jpg',
    descripcion:
      'Corte T-Bone preparado y listo para cocinar.',
    destacado: true,
  },
  {
    id: 12,
    nombre: 'Nuggets de Pollo',
    categoria: 'Carnes',
    precio: 75,
    unidad: 'kg',
    factorPieza: 0.25,
    emoji: 'https://i5-mx.walmartimages.com/mg/gm/3pp/asr/06002a44-7bfa-4520-9e26-c3ea6d75de32.2cd88ba9d49c834deef08f47d8f0c7e8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
    descripcion:
      'Nuggets de pollo frescos y listos para preparar.',
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
    emoji: 'https://chefmart.com.mx/cdn/shop/files/FRONT-AGUA-MIA_1600x.jpg?v=1751993617',
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
    nombre: 'Jabón Zote',
    categoria: 'Limpieza',
    precio: 32,
    unidad: 'litro',
    emoji: 'https://cleansy.mx/wp-content/uploads/2024/08/PAGINA-WEB-PRODUCTOS-2025-09-19T094625.794.png',
    descripcion:
      'Jabón Zote en barra para eliminar grasa y suciedad.',
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
    nombre: 'Mango',
    categoria: 'Frutas y Verduras',
    precio: 45,
    unidad: 'kg',
    emoji: 'https://www.mango.org/wp-content/uploads/2024/06/plu-honey-mango_v2.png',
    descripcion:
      'Mangos frescos y dulces, perfectos para postres y licuados.',
    destacado: true,
  },
  {
    id: 22,
    nombre: 'Uva',
    categoria: 'Frutas y Verduras',
    precio: 55,
    unidad: 'kg',
    factorPieza: 0.5,
    emoji: 'https://tecolotito.elsiglodedurango.com.mx/cdn-cgi/image/format=auto,width=1024/i/2018/05/694949.jpeg',
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
    factorPieza: 0.2,
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
    factorPieza: 0.15,
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
    factorPieza: 0.05,
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
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIe_EyPH2MoqmcF-O7Jr1vcIO7eOp5naxLRCzAtYqVQ5Mplmf4f4GzaFI&s=10',
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

  // =========================
  // MÁS FRUTAS Y VERDURAS
  // =========================
  {
    id: 30,
    nombre: 'Fresa',
    categoria: 'Frutas y Verduras',
    precio: 45,
    precioOriginal: 55,
    unidad: 'kg',
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWR8ZoOP52TrXBpKorMCkQA2qe4eC9MflZ7Gzd58O3xWGHrgOHyo3_XMCK&s=10',
    descripcion:
      'Fresas frescas de temporada, dulces y aromáticas.',
    destacado: true,
    stock: 40,
  },
  {
    id: 31,
    nombre: 'Uva Verde',
    categoria: 'Frutas y Verduras',
    precio: 52,
    unidad: 'kg',
    factorPieza: 0.5,
    emoji: 'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/seedless_green_grapes.jpg',
    descripcion:
      'Uva verde sin semilla, crujiente y refrescante.',
    destacado: false,
  },
  {
    id: 32,
    nombre: 'Sandía',
    categoria: 'Frutas y Verduras',
    precio: 18,
    unidad: 'kg',
    factorPieza: 4,
    emoji: 'https://soycomocomo.es/media/2016/06/sandia-2.gif',
    descripcion:
      'Sandía jugosa, perfecta para los días de calor.',
    destacado: false,
  },
  {
    id: 33,
    nombre: 'Piña',
    categoria: 'Frutas y Verduras',
    precio: 25,
    unidad: 'pieza',
    emoji: 'https://dashboard.oftalvist.es/public/blog/294/pi%C3%B1a-beneficios-ojos.jpg',
    descripcion:
      'Piña miel madura, dulce y perfumada.',
    destacado: false,
  },
  {
    id: 34,
    nombre: 'Aguacate Hass',
    categoria: 'Frutas y Verduras',
    precio: 78,
    unidad: 'kg',
    factorPieza: 0.2,
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGFksBbSslYei2H8F89H0a9YH-DXjYkwdchWgL7602DA&s=10',
    descripcion:
      'Aguacate hass cremoso, listo para el guacamole.',
    destacado: true,
    stock: 25,
  },
  {
    id: 35,
    nombre: 'Zanahoria',
    categoria: 'Frutas y Verduras',
    precio: 16,
    unidad: 'kg',
    factorPieza: 0.1,
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfzMuNKgOUrl6PGQ340cmtHmSO-92lm8xtkDaYlwrb7DDBKI1qcGTccgx&s=10',
    descripcion:
      'Zanahoria fresca, ideal para sopas y ensaladas.',
    destacado: false,
  },
  {
    id: 36,
    nombre: 'Brócoli',
    categoria: 'Frutas y Verduras',
    precio: 32,
    unidad: 'kg',
    factorPieza: 0.4,
    emoji: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/brocoli-2.jpg?w=1600&h=1063',
    descripcion:
      'Brócoli verde y firme, cosechado esta semana.',
    destacado: false,
  },

  // =========================
  // MÁS LÁCTEOS
  // =========================
  {
    id: 37,
    nombre: 'Queso Manchego',
    categoria: 'Lácteos',
    precio: 95,
    precioOriginal: 110,
    unidad: 'kg',
    factorPieza: 0.25,
    emoji: 'https://supermode.com.mx/cdn/shop/products/4716_2708d1ad-9634-4e96-a520-e7e2381fd52f.jpg?v=1698796056',
    descripcion:
      'Queso manchego semicurado, ideal para gratinar.',
    destacado: true,
    stock: 20,
  },
  {
    id: 38,
    nombre: 'Yogurt Natural',
    categoria: 'Lácteos',
    precio: 24,
    unidad: 'litro',
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDpgkNFjqdKX_OhSZ-OlR9ZEEdoUw4N58sGdekQ6vY7Vexz71Y0LdpEDY&s=10',
    descripcion:
      'Yogur natural sin azúcar añadida.',
    destacado: false,
  },
  {
    id: 39,
    nombre: 'Mantequilla',
    categoria: 'Lácteos',
    precio: 48,
    unidad: 'paquete',
    emoji: 'https://i5.walmartimages.com/asr/19cc3c96-5536-44e8-adb2-aaa63b82ad67.d44b8cd1eeba1a84c63d86878cd6a612.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
    descripcion:
      'Mantequilla sin sal de 225 g.',
    destacado: false,
  },
  {
    id: 40,
    nombre: 'Crema Ácida',
    categoria: 'Lácteos',
    precio: 36,
    unidad: 'frasco',
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPe0BW9RFtrW25ZQvcltEKye6nzhdlOtDoVePb30_KFm2Kl886-AnhLxZa&s=10',
    descripcion:
      'Crema ácida espesa para tus antojos.',
    destacado: false,
  },
  {
    id: 41,
    nombre: 'Queso Panela',
    categoria: 'Lácteos',
    precio: 82,
    unidad: 'kg',
    factorPieza: 0.4,
    emoji: 'https://www.lyncott.mx/wp-content/uploads/2021/11/Panela.jpg',
    descripcion:
      'Queso panela fresco, bajo en grasa.',
    destacado: false,
  },
  {
    id: 42,
    nombre: 'Leche Deslactosada',
    categoria: 'Lácteos',
    precio: 34,
    unidad: 'litro',
    emoji: 'https://arteli.vtexassets.com/arquivos/ids/268825-800-auto?v=638853487275430000&width=800&height=auto&aspect=true',
    descripcion:
      'Leche deslactosada entera de 1 litro.',
    destacado: false,
  },
  {
    id: 43,
    nombre: 'Huevo Blanco',
    categoria: 'Lácteos',
    precio: 68,
    unidad: 'paquete',
    emoji: 'https://static.wixstatic.com/media/de7407_31164d7e28214a8dac53b9e11990281c~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    descripcion:
      'Paquete de 12 huevos frescos de granja.',
    destacado: true,
    stock: 45,
  },

  // =========================
  // MÁS PANADERÍA
  // =========================
  {
    id: 44,
    nombre: 'Croissant',
    categoria: 'Panadería',
    precio: 18,
    unidad: 'pieza',
    emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Croissant-Petr_Kratochvil.jpg/330px-Croissant-Petr_Kratochvil.jpg',
    descripcion:
      'Croissant de mantequilla horneado en casa.',
    destacado: true,
  },
  {
    id: 45,
    nombre: 'Bagel',
    categoria: 'Panadería',
    precio: 22,
    unidad: 'pieza',
    emoji: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/02/16/0/FNM_030122-Homemade-Bagels_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1645023418907.webp',
    descripcion:
      'Bagel artesanal, perfecto para el desayuno.',
    destacado: false,
  },
  {
    id: 46,
    nombre: 'Pan para hot dog',
    categoria: 'Panadería',
    precio: 42,
    unidad: 'paquete',
    emoji: 'https://lagranbodega.vteximg.com.br/arquivos/ids/304201-1000-1000/7501000111503.jpg?v=638881971369770000',
    descripcion:
      'Pan para hot dog, 340 g.',
    destacado: false,
  },
  {
    id: 47,
    nombre: 'Dona Glaseada',
    categoria: 'Panadería',
    precio: 15,
    unidad: 'pieza',
    emoji: 'https://cdn7.kiwilimon.com/brightcove/11162/640x640/11162.jpg.webp',
    descripcion:
      'Dona glaseada recién hecha.',
    destacado: false,
  },
  {
    id: 48,
    nombre: 'Pastel de Chocolate',
    categoria: 'Panadería',
    precio: 185,
    precioOriginal: 220,
    unidad: 'pieza',
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn_QVcL_ale8eVTTrkG74QND3z-PXAk2K4UKb4XQgdsrNsWaR5pbqDvIk&s=10',
    descripcion:
      'Pastel de chocolate para 8 porciones.',
    destacado: true,
    stock: 12,
  },
  {
    id: 49,
    nombre: 'Galletas de Avena',
    categoria: 'Panadería',
    precio: 38,
    unidad: 'paquete',
    emoji: 'https://cuk-it.com/wp-content/uploads/2017/06/galletas-avena-04.webp',
    descripcion:
      'Galletas de avena con pasas, 300 g.',
    destacado: false,
  },

  // =========================
  // MÁS CARNES
  // =========================
  {
    id: 50,
    nombre: 'Pechuga de Pollo',
    categoria: 'Carnes',
    precio: 88,
    unidad: 'kg',
    factorPieza: 0.25,
    emoji: 'https://kosherhouse.mx/cdn/shop/files/pechugadepollosinhueso.jpg?v=1691773142',
    descripcion:
      'Pechuga de pollo sin hueso ni piel.',
    destacado: true,
    stock: 35,
  },
  {
    id: 51,
    nombre: 'Chuleta de Cerdo',
    categoria: 'Carnes',
    precio: 105,
    unidad: 'kg',
    factorPieza: 0.2,
    emoji: 'https://i5-mx.walmartimages.com/samsmx/images/product-images/img_large/000036423-2l.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
    descripcion:
      'Chuleta de cerdo con hueso, corte grueso.',
    destacado: false,
  },
  {
    id: 52,
    nombre: 'Salmón Fresco',
    categoria: 'Carnes',
    precio: 290,
    precioOriginal: 340,
    unidad: 'kg',
    factorPieza: 0.25,
    emoji: 'https://ingredienta.com/wp-content/uploads/2024/11/SALMONCANALOMO-800x800.png',
    descripcion:
      'Filete de salmón fresco del Atlántico.',
    destacado: true,
    stock: 15,
  },
  {
    id: 53,
    nombre: 'Camarón Mediano',
    categoria: 'Carnes',
    precio: 245,
    unidad: 'kg',
    emoji: 'https://theshrimpnet.com/37-large_default/camaron-mediano-del-golfo.jpg',
    descripcion:
      'Camarón mediano limpio.',
    destacado: false,
  },
  {
    id: 54,
    nombre: 'Tocino',
    categoria: 'Carnes',
    precio: 72,
    unidad: 'paquete',
    emoji: 'https://i5.walmartimages.com/seo/Great-Value-Hickory-Smoked-Bacon-Mega-Pack-24-oz_d974295f-18e4-4445-a61b-565a15031651.b3695a12031e158791f6870fe9a99bcc.jpeg',
    descripcion:
      'Tocino ahumado en rebanadas, 680 g.',
    destacado: false,
  },
  {
    id: 55,
    nombre: 'Chorizo',
    categoria: 'Carnes',
    precio: 68,
    unidad: 'kg',
    factorPieza: 0.1,
    emoji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvkan_cSEm33WmYd8afcuZeBfNr1Tek9lG-skPPAED03_fWydrMedb-Oc&s=10',
    descripcion:
      'Chorizo artesanal, ideal para el desayuno.',
    destacado: false,
  },

  // =========================
  // MÁS BEBIDAS
  // =========================
  {
    id: 56,
    nombre: 'Jugo de Naranja',
    categoria: 'Bebidas',
    precio: 32,
    unidad: 'litro',
    emoji: 'https://www.smartnfinal.com.mx/wp-content/uploads/2024/02/125416-JUGO-DE-NARANJA-ORIGINAL-SIMPLY-ORANGE-1.5-L.jpg',
    descripcion:
      'Jugo de naranja 100% natural, sin azúcar añadida.',
    destacado: true,
  },
  {
    id: 57,
    nombre: 'Agua Mineral',
    categoria: 'Bebidas',
    precio: 18,
    unidad: 'botella',
    emoji: 'https://m.media-amazon.com/images/I/81FkyrPtnHL.jpg',
    descripcion:
      'Agua mineral con gas, 1 litro.',
    destacado: false,
  },
  {
    id: 58,
    nombre: 'Cerveza corona',
    categoria: 'Bebidas',
    precio: 48,
    precioOriginal: 58,
    unidad: 'botella',
    emoji: 'https://mundogourmet.com.mx/tienda/wp-content/uploads/2020/09/cerveza-corona-355ml.jpg',
    descripcion:
      'Cerveza corona, 355 ml.',
    destacado: true,
    stock: 30,
  },
  {
    id: 59,
    nombre: 'Vino Tinto',
    categoria: 'Bebidas',
    precio: 245,
    unidad: 'botella',
    emoji: 'https://bodegasalianza.vtexassets.com/arquivos/ids/181489/24244-1-.jpg?v=638938217078000000',
    descripcion:
      'Vino tinto de mesa, cosecha reciente.',
    destacado: false,
  },
  {
    id: 60,
    nombre: 'Té Helado',
    categoria: 'Bebidas',
    precio: 26,
    unidad: 'botella',
    emoji: 'https://media.justo.mx/products/7501055358885-1.jpg',
    descripcion:
      'Té helado de limón, 600 ml.',
    destacado: false,
  },
  {
    id: 61,
    nombre: 'Café Molido',
    categoria: 'Bebidas',
    precio: 125,
    unidad: 'paquete',
    emoji: 'https://supermode.com.mx/cdn/shop/products/100008467_b738477b-13bc-4f25-b143-9ebe71ceab09.jpg?v=1698802921',
    descripcion:
      'Café molido de altura, 500 g.',
    destacado: false,
  },

  // =========================
  // MÁS LIMPIEZA
  // =========================
  {
    id: 62,
    nombre: 'Detergente Líquido',
    categoria: 'Limpieza',
    precio: 85,
    unidad: 'litro',
    emoji: 'https://i5.walmartimages.com/asr/b5d3b6d2-0824-46a2-ade8-acb97f2f5212.b974429853025a53aaa9441c84fa7f6d.jpeg',
    descripcion:
      'Detergente líquido concentrado para ropa.',
    destacado: true,
  },
  {
    id: 63,
    nombre: 'Jabón para Trastes',
    categoria: 'Limpieza',
    precio: 38,
    unidad: 'botella',
    emoji: 'https://lagranbodega.vteximg.com.br/arquivos/ids/304677-1000-1000/75045838.jpg?v=638920833020530000',
    descripcion:
      'Jabón líquido para trastes con aroma a limón.',
    destacado: false,
  },
  {
    id: 64,
    nombre: 'Papel Higiénico',
    categoria: 'Limpieza',
    precio: 96,
    precioOriginal: 115,
    unidad: 'paquete',
    emoji: 'https://m.media-amazon.com/images/I/81cHPJM1t4L._AC_UF350,350_QL80_.jpg',
    descripcion:
      'Paquete de 12 rollos de doble hoja libre de Muros.',
    destacado: true,
    stock: 50,
  },
  {
    id: 65,
    nombre: 'Limpiador Multiusos',
    categoria: 'Limpieza',
    precio: 44,
    unidad: 'botella',
    emoji: 'https://d1zc67o3u1epb0.cloudfront.net/media/catalog/product/1/2/1206_1__3.jpg?width=265&height=390&store=tienda&image-type=image',
    descripcion:
      'Limpiador multiusos desinfectante.',
    destacado: false,
  },
  {
    id: 66,
    nombre: 'Bolsas para Basura',
    categoria: 'Limpieza',
    precio: 52,
    unidad: 'paquete',
    emoji: 'https://cdn.homedepot.com.mx/productos/210765/210765-za1.jpg',
    descripcion:
      'Bolsas para basura, 50 piezas.',
    destacado: false,
  },

  // =========================
  // MÁS ABARROTES
  // =========================
  {
    id: 67,
    nombre: 'Aceite de Oliva',
    categoria: 'Abarrotes',
    precio: 165,
    precioOriginal: 195,
    unidad: 'botella',
    emoji: 'https://ines.com.mx/wp-content/uploads/2025/01/1_Oliva-100-puro_1L_1000x1000.jpg',
    descripcion:
      'Aceite de oliva extra virgen, 1 lts.',
    destacado: true,
    stock: 22,
  },
  {
    id: 68,
    nombre: 'Pasta Spaghetti',
    categoria: 'Abarrotes',
    precio: 22,
    unidad: 'paquete',
    emoji: 'https://www.carozzimeencanta.cl/assets/img/productos/paquete-spaghetti-5-carozzi.jpg',
    descripcion:
      'Pasta spaghetti, 400 g.',
    destacado: false,
  },
  {
    id: 69,
    nombre: 'Atún en Lata',
    categoria: 'Abarrotes',
    precio: 26,
    unidad: 'pieza',
    emoji: 'https://i5-mx.walmartimages.com/mg/gm/3pp/asr/d1673453-db20-4c2e-970f-d3c5371888f4.2a6471b4d6c0ef2a95c3c65558a13c68.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
    descripcion:
      'Atún en agua, lata de 140 g.',
    destacado: false,
  },
  {
    id: 70,
    nombre: 'Frijol Negro',
    categoria: 'Abarrotes',
    precio: 38,
    unidad: 'kg',
    emoji: 'https://i.blogs.es/3739cc/oferta-frijoles-verde-valle-negro-amazon-mexico/840_560.jpeg',
    descripcion:
      'Frijol negro seleccionado a granel.',
    destacado: false,
  },
  {
    id: 71,
    nombre: 'Azúcar Refinada',
    categoria: 'Abarrotes',
    precio: 28,
    unidad: 'kg',
    emoji: 'https://www.costco.com.mx/medias/sys_master/products/h9a/h4f/82432991035422.jpg',
    descripcion:
      'Azúcar refinada de caña, 1 kg.',
    destacado: false,
  },
  {
    id: 72,
    nombre: 'Sal de Mesa',
    categoria: 'Abarrotes',
    precio: 14,
    unidad: 'paquete',
    emoji: 'https://i5.walmartimages.com/asr/7c7be410-732d-4bda-af41-13b94723a0a7.0ab155efadace07293d676b4355cea46.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
    descripcion:
      'Sal de mesa yodada, 1 kg.',
    destacado: false,
  },
  {
    id: 73,
    nombre: 'Cereal de Maíz',
    categoria: 'Abarrotes',
    precio: 64,
    unidad: 'paquete',
    emoji: 'https://images.kglobalservices.com/www.kelloggs.com.mx/es_mx/product/kic-3670/kicproductimage-119149_k226083000_c1c1_es_mx.jpg',
    descripcion:
      'Cereal de maíz tostado, 440 g.',
    destacado: false,
  },
]
