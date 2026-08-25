// Slides del carrusel de ofertas.
//
// Como el resto de `src/data/`, la app ya no lee este archivo: las ofertas
// viven en la tabla `Ofertas` y se piden a la API. Esto es la fuente desde la
// que `backend/npm run seed:sql` genera ese INSERT.
//
// `codigo` y `beneficio` son opcionales: si un slide trae `codigo`, el
// carrusel muestra un cupón grande y destacado (ver Carousel.jsx), y el
// generador enlaza la oferta con ese código y con su categoría — que es lo
// que le da alcance al descuento al momento de comprar.
export const OFERTAS = [
  {
    id: 1,
    titulo: 'Frutas y verduras frescas',
    texto: 'Aplica en frutas y verduras seleccionadas',
    codigo: 'FRESCUERA',
    beneficio: '20% OFF',
    imagen:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Produce_section_at_Publix.jpg/1280px-Produce_section_at_Publix.jpg',
  },
  {
    id: 2,
    titulo: 'Panadería recién horneada',
    texto: 'Pan y pastelería todos los días',
    imagen:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/1280px-Korb_mit_Br%C3%B6tchen.JPG',
  },
  {
    id: 3,
    titulo: 'Lácteos y quesos',
    texto: 'Aplica en lácteos seleccionados',
    codigo: 'LLEVATEUNAVACA',
    beneficio: '2x1',
    imagen: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Cheese_platter.jpg',
  },
  {
    id: 4,
    titulo: 'Delicias listas para llevar',
    texto: 'Nuevos platillos preparados cada semana',
    imagen:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prepared_food_display_in_an_Italian_deli_in_Rome.jpg/1280px-Prepared_food_display_in_an_Italian_deli_in_Rome.jpg',
  },
  {
    id: 5,
    titulo: 'Fin de semana de parrilla',
    texto: 'Aplica en cortes, pollo y pescados',
    codigo: 'PARRILLADA',
    beneficio: '15% OFF',
    imagen:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Meat_at_the_butcher_shop.JPG/1280px-Meat_at_the_butcher_shop.JPG',
  },
  {
    id: 6,
    titulo: 'Refréscate este verano',
    texto: 'Aplica en toda la sección de bebidas',
    codigo: 'REFRESCATE',
    beneficio: '3x2',
    imagen:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Soft_drink_shelf.JPG/1280px-Soft_drink_shelf.JPG',
  },
  {
    id: 7,
    titulo: 'Despensa completa',
    texto: 'Todo lo que necesitas para la semana, en un solo lugar',
    imagen:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Supermarket_shelves.jpg/1280px-Supermarket_shelves.jpg',
  },
]
