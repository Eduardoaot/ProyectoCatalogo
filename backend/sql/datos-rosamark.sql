-- =============================================================
--  DATOS DE ROSAMARK  (generado automáticamente)
--
--  NO EDITES ESTE ARCHIVO A MANO: se regenera con
--      cd backend && npm run seed:sql
--  a partir de src/data/ (productos.js, ofertas.js, usuarios.js).
--
--  Generado: 2026-08-25 05:25:38
--
--  ATENCIÓN: vacía las tablas antes de insertar, incluidas Ordenes y
--  Clientes. Es un seed de desarrollo, no lo corras sobre datos reales.
--
--  Requiere que la base "tienda" ya exista (impórtala antes con
--  sql/tienda.sql).
-- =============================================================

USE tienda;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Maestra_orden_productos;
TRUNCATE TABLE Ordenes;
TRUNCATE TABLE Ofertas;
TRUNCATE TABLE Productos;
TRUNCATE TABLE Descuentos_codigo;
TRUNCATE TABLE Descuentos_valores;
TRUNCATE TABLE Descuentos_tipos;
TRUNCATE TABLE Categorias;
TRUNCATE TABLE Unidades;
TRUNCATE TABLE Clientes;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  Categorías
-- ============================================================

INSERT INTO Categorias
  (ID_categoria, nombre_categoria)
VALUES
  (1, 'Frutas y Verduras'),
  (2, 'Lácteos'),
  (3, 'Panadería'),
  (4, 'Carnes'),
  (5, 'Bebidas'),
  (6, 'Limpieza'),
  (7, 'Abarrotes');

-- ============================================================
--  Unidades
-- ============================================================

INSERT INTO Unidades
  (ID_unidad, nombre_unidad)
VALUES
  (1, 'kg'),
  (2, 'litro'),
  (3, 'pieza'),
  (4, 'paquete'),
  (5, 'botella'),
  (6, 'frasco');

-- ============================================================
--  Tipos de descuento
-- ============================================================

INSERT INTO Descuentos_tipos
  (ID_descuento_tipo, tipo_descuento)
VALUES
  (1, 'porcentaje'),
  (2, 'monto_fijo'),
  (3, 'NxM');

-- ============================================================
--  Valores de descuento
-- ============================================================

-- Los primeros son los descuentos propios de cada producto
-- (equivalen al precioOriginal tachado del catálogo); los últimos son los
-- que respaldan los códigos del carrito. Sin fechas = siempre vigentes.

INSERT INTO Descuentos_valores
  (ID_descuento, ID_descuento_tipo, nombre_descuento, descuento_valor, cantidad_lleva, cantidad_paga, fecha_inicio, fecha_final)
VALUES
  (1, 2, '$0.30 de descuento', 0.3, NULL, NULL, NULL, NULL),
  (2, 2, '$8.00 de descuento', 8, NULL, NULL, NULL, NULL),
  (3, 2, '$3.00 de descuento', 3, NULL, NULL, NULL, NULL),
  (4, 2, '$15.00 de descuento', 15, NULL, NULL, NULL, NULL),
  (5, 2, '$10.00 de descuento', 10, NULL, NULL, NULL, NULL),
  (6, 2, '$35.00 de descuento', 35, NULL, NULL, NULL, NULL),
  (7, 2, '$50.00 de descuento', 50, NULL, NULL, NULL, NULL),
  (8, 2, '$19.00 de descuento', 19, NULL, NULL, NULL, NULL),
  (9, 2, '$30.00 de descuento', 30, NULL, NULL, NULL, NULL),
  (10, 1, '20% de descuento en frutas y verduras', 20, NULL, NULL, NULL, NULL),
  (11, 3, '2x1 en lácteos', 0, 2, 1, NULL, NULL),
  (12, 1, '15% de descuento en carnes y pescados', 15, NULL, NULL, NULL, NULL),
  (13, 3, '3x2 en bebidas', 0, 3, 2, NULL, NULL);

-- ============================================================
--  Códigos de descuento
-- ============================================================

INSERT INTO Descuentos_codigo
  (ID_descuento_codigo, ID_descuento, texto_codigo, etiqueta_codigo, descripcion_codigo)
VALUES
  (1, 10, 'FRESCUERA', 'FRESCUERA', '20% de descuento en frutas y verduras'),
  (2, 11, 'LLEVATEUNAVACA', 'LlevateUnaVaca', '2x1 en lácteos'),
  (3, 12, 'PARRILLADA', 'PARRILLADA', '15% de descuento en carnes y pescados'),
  (4, 13, 'REFRESCATE', 'REFRESCATE', '3x2 en bebidas');

-- ============================================================
--  Productos (73)
-- ============================================================

-- El ID_producto se conserva igual que el id de src/data/productos.js,
-- así las rutas /producto/:id que ya estaban compartidas siguen sirviendo.

INSERT INTO Productos
  (ID_producto, ID_categoria, ID_unidad, ID_Descuento, nombre_producto, precio_producto, imagen, descripcion, destacado, cantidad_producto, factor_pieza)
VALUES
  (1, 1, 1, 1, 'Manzana Roja', 1.5, 'https://elegifruta.com.ar/wp-content/uploads/2017/07/manzana_roja.jpg', 'Manzanas rojas frescas y crujientes, ideales para cualquier momento del día.', TRUE, 30, 1),
  (2, 1, 1, NULL, 'Plátano', 1.5, 'https://saludinteractiva.mx/blog/wp-content/uploads/2022/05/beneficios_del_platano_istock.webp', 'Plátanos frescos y dulces, perfectos para desayunos y licuados.', FALSE, 30, 1),
  (3, 1, 1, NULL, 'Naranja', 1.8, 'https://tse4.mm.bing.net/th/id/OIP.7uvRp-iBdY04IQa-WpeJNgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Naranjas frescas y jugosas ideales para preparar deliciosos jugos.', TRUE, 30, 1),
  (4, 1, 1, NULL, 'Tomate', 2.2, 'https://tse2.mm.bing.net/th/id/OIP.gi9KS8sqHTQMH_iGrjLX0wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Tomates frescos para ensaladas, salsas y todo tipo de comidas.', FALSE, 30, 1),
  (5, 2, 2, 2, 'Nutri-leche', 38, 'https://cdn.shopify.com/s/files/1/0080/1076/0255/products/LECHE-NUTRILECHE-1-LT_4fb01653-6ed2-4ad6-a784-bba71e7c0171_1200x1200_crop_center.jpg?v=1654034176', 'Leche fresca de la marca Nutri-leche.', TRUE, 30, 1),
  (6, 2, 3, NULL, 'Yogur Natural', 18, 'https://tse3.mm.bing.net/th/id/OIP.ic0LVusiDlRRBB_iZBIjmgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Yogur natural cremoso, ideal para desayunos y snacks.', FALSE, 30, 1),
  (7, 2, 1, NULL, 'Queso Manchego', 85, 'https://i5-mx.walmartimages.com/gr/images/product-images/img_large/00750104120155L.jpg', 'Queso manchego de excelente calidad y gran sabor.', TRUE, 30, 1),
  (8, 3, 3, 3, 'Pan Francés', 12, 'https://media.istockphoto.com/id/485821784/photo/various-of-french-baguette-isolated-on-white-background.jpg?s=170667a&w=0&k=20&c=HYhQoHiNnS5HpHEQZQSsD05yNLwJ-97bjgII7_46jws=', 'Pan francés recién horneado y crujiente.', TRUE, 30, 1),
  (9, 3, 4, NULL, 'Pan de Caja', 42, 'https://tse2.mm.bing.net/th/id/OIP.R4BDVq4Vsy1vz2ai2unP9AHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Pan de caja suave, perfecto para preparar sandwiches.', FALSE, 30, 1),
  (10, 3, 3, NULL, 'Dona de Chocolate', 15, 'https://www.chocolatesturin.com.mx/cdn-cgi/image/width=1360,height=583,f=auto,quality=90/sites/g/files/fnmzdf5476/files/2024-12/06%20Donas%20de%20choclate11476_retoque.jpg', 'Dona esponjosa cubierta con delicioso chocolate.', TRUE, 30, 1),
  (11, 4, 1, 4, 'Carne T-Bone', 65, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/T-bone-raw-MCB.jpg/960px-T-bone-raw-MCB.jpg', 'Corte T-Bone preparado y listo para cocinar.', TRUE, 30, 1),
  (12, 4, 1, NULL, 'Pechuga de Pollo', 75, 'https://kosherhouse.mx/cdn/shop/files/pechugadepollosinhueso.jpg?v=1691773142', 'Pechuga de pollo fresca y lista para preparar.', FALSE, 30, 1),
  (13, 4, 1, NULL, 'Carne Molida', 95, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Hackfleisch-1.jpg/960px-Hackfleisch-1.jpg', 'Carne molida de res fresca para hamburguesas y guisos.', TRUE, 30, 1),
  (14, 5, 5, NULL, 'Champagne', 100, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Champagne_bottles_in_a_bucket_-_8439.jpg/960px-Champagne_bottles_in_a_bucket_-_8439.jpg', 'Champagne para disfrutar en una ocasión especial.', TRUE, 30, 1),
  (15, 5, 2, NULL, 'Refresco de Cola', 25, 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Big-Cola-3L.jpg', 'Refresco de cola frío y refrescante.', FALSE, 30, 1),
  (16, 5, 5, NULL, 'Agua Natural', 15, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bottle_of_Water.jpg/960px-Bottle_of_Water.jpg', 'Agua natural para mantenerte hidratado durante el día.', FALSE, 30, 1),
  (17, 6, 3, NULL, 'Escoba', 40, 'https://orvagclf.com/cdn/shop/products/12fd7adaa7fd9d328a905abc61103b38.png?v=1692165820', 'Escoba tradicional para el aseo de tu hogar.', TRUE, 30, 1),
  (18, 6, 2, NULL, 'Jabón para Trastes', 32, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Joy_pot_and_pan_detergent.jpg/960px-Joy_pot_and_pan_detergent.jpg', 'Jabón líquido para eliminar grasa y suciedad de los trastes.', FALSE, 30, 1),
  (19, 7, 1, NULL, 'Arroz', 28, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Ceramic_bowl_full_of_white_rice.jpg/960px-Ceramic_bowl_full_of_white_rice.jpg', 'Arroz blanco de grano largo para acompañar tus comidas.', TRUE, 30, 1),
  (20, 7, 1, NULL, 'Frijol', 35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Black_beans_%281126927794%29.jpg/960px-Black_beans_%281126927794%29.jpg', 'Frijol de excelente calidad para preparar tus comidas favoritas.', FALSE, 30, 1),
  (21, 1, 1, NULL, 'Fresa', 45, 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Strawberry_image.jpg', 'Fresas frescas y dulces, perfectas para postres y licuados.', TRUE, 30, 1),
  (22, 1, 1, NULL, 'Uva', 55, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Grapes%2C_Rostov-on-Don%2C_Russia.jpg/960px-Grapes%2C_Rostov-on-Don%2C_Russia.jpg', 'Uvas frescas y jugosas, ideales para picar o preparar postres.', FALSE, 30, 1),
  (23, 1, 1, NULL, 'Papa', 18, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/960px-Patates.jpg', 'Papas frescas, versátiles para freír, hornear o hacer puré.', FALSE, 30, 1),
  (24, 1, 1, NULL, 'Cebolla', 16, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/960px-Mixed_onions.jpg', 'Cebollas frescas, infaltables para dar sabor a tus platillos.', FALSE, 30, 1),
  (25, 3, 4, NULL, 'Galletas de Chispas de Chocolate', 22, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Choc-Chip-Cookie.jpg/960px-Choc-Chip-Cookie.jpg', 'Galletas horneadas con chispas de chocolate, crujientes por fuera y suaves por dentro.', TRUE, 30, 1),
  (26, 4, 1, NULL, 'Salchicha', 48, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Cervelat.jpg/960px-Cervelat.jpg', 'Salchichas ahumadas, listas para asar o cocinar.', FALSE, 30, 1),
  (27, 5, 4, NULL, 'Café en Grano', 65, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Coffee_Robusta_Arabica.jpg/960px-Coffee_Robusta_Arabica.jpg', 'Café en grano tostado, ideal para preparar un buen café recién molido.', TRUE, 30, 1),
  (28, 6, 2, NULL, 'Cloro', 24, 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Clorox_Bleach_products.jpg', 'Cloro desinfectante para limpieza y desinfección del hogar.', FALSE, 30, 1),
  (29, 7, 6, NULL, 'Miel de Abeja', 60, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Runny_hunny.jpg/960px-Runny_hunny.jpg', 'Miel de abeja pura, natural y endulzante ideal para tus recetas.', TRUE, 30, 1),
  (30, 1, 1, 5, 'Fresa', 55, 'https://loremflickr.com/400/400/strawberry,food/all', 'Fresas frescas de temporada, dulces y aromáticas.', TRUE, 40, 1),
  (31, 1, 1, NULL, 'Uva Verde', 52, 'https://loremflickr.com/400/400/green-grapes,food/all', 'Uva verde sin semilla, crujiente y refrescante.', FALSE, 30, 1),
  (32, 1, 1, NULL, 'Sandía', 18, 'https://loremflickr.com/400/400/watermelon,food/all', 'Sandía jugosa, perfecta para los días de calor.', FALSE, 30, 1),
  (33, 1, 3, NULL, 'Piña', 25, 'https://loremflickr.com/400/400/pineapple,food/all', 'Piña miel madura, dulce y perfumada.', FALSE, 30, 1),
  (34, 1, 1, NULL, 'Aguacate Hass', 78, 'https://loremflickr.com/400/400/avocado,food/all', 'Aguacate hass cremoso, listo para el guacamole.', TRUE, 25, 1),
  (35, 1, 1, NULL, 'Zanahoria', 16, 'https://loremflickr.com/400/400/carrot,food/all', 'Zanahoria fresca, ideal para sopas y ensaladas.', FALSE, 30, 1),
  (36, 1, 1, NULL, 'Brócoli', 32, 'https://loremflickr.com/400/400/broccoli,food/all', 'Brócoli verde y firme, cosechado esta semana.', FALSE, 30, 1),
  (37, 2, 1, 4, 'Queso Manchego', 110, 'https://loremflickr.com/400/400/cheese,food/all', 'Queso manchego semicurado, ideal para gratinar.', TRUE, 20, 1),
  (38, 2, 2, NULL, 'Yogur Natural', 24, 'https://loremflickr.com/400/400/yogurt,food/all', 'Yogur natural sin azúcar añadida.', FALSE, 30, 1),
  (39, 2, 4, NULL, 'Mantequilla', 48, 'https://loremflickr.com/400/400/butter,food/all', 'Mantequilla sin sal de 225 g.', FALSE, 30, 1),
  (40, 2, 6, NULL, 'Crema Ácida', 36, 'https://loremflickr.com/400/400/sour-cream,food/all', 'Crema ácida espesa para tus antojos.', FALSE, 30, 1),
  (41, 2, 1, NULL, 'Queso Panela', 82, 'https://loremflickr.com/400/400/fresh-cheese,food/all', 'Queso panela fresco, bajo en grasa.', FALSE, 30, 1),
  (42, 2, 2, NULL, 'Leche Deslactosada', 34, 'https://loremflickr.com/400/400/milk,food/all', 'Leche deslactosada entera de 1 litro.', FALSE, 30, 1),
  (43, 2, 4, NULL, 'Huevo Blanco', 68, 'https://loremflickr.com/400/400/white-egg,food/all', 'Paquete de 18 huevos frescos de granja.', TRUE, 45, 1),
  (44, 3, 3, NULL, 'Croissant', 18, 'https://loremflickr.com/400/400/croissant,food/all', 'Croissant de mantequilla horneado en casa.', TRUE, 30, 1),
  (45, 3, 3, NULL, 'Bagel', 22, 'https://loremflickr.com/400/400/bagel,food/all', 'Bagel artesanal, perfecto para el desayuno.', FALSE, 30, 1),
  (46, 3, 4, NULL, 'Pan de Caja Integral', 42, 'https://loremflickr.com/400/400/sliced-bread,food/all', 'Pan integral de caja, 680 g.', FALSE, 30, 1),
  (47, 3, 3, NULL, 'Dona Glaseada', 15, 'https://loremflickr.com/400/400/donut,food/all', 'Dona glaseada recién hecha.', FALSE, 30, 1),
  (48, 3, 3, 6, 'Pastel de Chocolate', 220, 'https://loremflickr.com/400/400/chocolate-cake,food/all', 'Pastel de chocolate para 8 porciones.', TRUE, 12, 1),
  (49, 3, 4, NULL, 'Galletas de Avena', 38, 'https://loremflickr.com/400/400/oatmeal-cookie,food/all', 'Galletas de avena con pasas, 300 g.', FALSE, 30, 1),
  (50, 4, 1, NULL, 'Pechuga de Pollo', 88, 'https://loremflickr.com/400/400/raw-chicken-breast,food/all', 'Pechuga de pollo sin hueso ni piel.', TRUE, 35, 1),
  (51, 4, 1, NULL, 'Chuleta de Cerdo', 105, 'https://loremflickr.com/400/400/pork-chop,food/all', 'Chuleta de cerdo con hueso, corte grueso.', FALSE, 30, 1),
  (52, 4, 1, 7, 'Salmón Fresco', 340, 'https://loremflickr.com/400/400/raw-salmon,food/all', 'Filete de salmón fresco del Atlántico.', TRUE, 15, 1),
  (53, 4, 1, NULL, 'Camarón Mediano', 245, 'https://loremflickr.com/400/400/raw-shrimp,food/all', 'Camarón mediano limpio y sin cabeza.', FALSE, 30, 1),
  (54, 4, 4, NULL, 'Tocino', 72, 'https://loremflickr.com/400/400/bacon,food/all', 'Tocino ahumado en rebanadas, 250 g.', FALSE, 30, 1),
  (55, 4, 1, NULL, 'Chorizo', 68, 'https://loremflickr.com/400/400/chorizo,food/all', 'Chorizo artesanal, ideal para el desayuno.', FALSE, 30, 1),
  (56, 5, 2, NULL, 'Jugo de Naranja', 32, 'https://loremflickr.com/400/400/orange-juice,drink/all', 'Jugo de naranja 100% natural, sin azúcar añadida.', TRUE, 30, 1),
  (57, 5, 5, NULL, 'Agua Mineral', 18, 'https://loremflickr.com/400/400/mineral-water,drink/all', 'Agua mineral con gas, 1 litro.', FALSE, 30, 1),
  (58, 5, 5, 5, 'Cerveza Artesanal', 58, 'https://loremflickr.com/400/400/craft-beer,drink/all', 'Cerveza artesanal estilo IPA, 355 ml.', TRUE, 30, 1),
  (59, 5, 5, NULL, 'Vino Tinto', 245, 'https://loremflickr.com/400/400/red-wine,drink/all', 'Vino tinto de mesa, cosecha reciente.', FALSE, 30, 1),
  (60, 5, 5, NULL, 'Té Helado', 26, 'https://loremflickr.com/400/400/iced-tea,drink/all', 'Té helado de limón, 600 ml.', FALSE, 30, 1),
  (61, 5, 4, NULL, 'Café Molido', 125, 'https://loremflickr.com/400/400/ground-coffee,drink/all', 'Café molido de altura, 500 g.', FALSE, 30, 1),
  (62, 6, 2, NULL, 'Detergente Líquido', 85, 'https://loremflickr.com/400/400/laundry-detergent/all', 'Detergente líquido concentrado para ropa.', TRUE, 30, 1),
  (63, 6, 5, NULL, 'Jabón para Trastes', 38, 'https://loremflickr.com/400/400/dish-soap/all', 'Jabón líquido para trastes con aroma a limón.', FALSE, 30, 1),
  (64, 6, 4, 8, 'Papel Higiénico', 115, 'https://loremflickr.com/400/400/toilet-paper/all', 'Paquete de 12 rollos de doble hoja.', TRUE, 50, 1),
  (65, 6, 5, NULL, 'Limpiador Multiusos', 44, 'https://loremflickr.com/400/400/cleaning-spray/all', 'Limpiador multiusos desinfectante.', FALSE, 30, 1),
  (66, 6, 4, NULL, 'Bolsas para Basura', 52, 'https://loremflickr.com/400/400/trash-bag/all', 'Bolsas para basura de 90 litros, 20 piezas.', FALSE, 30, 1),
  (67, 7, 5, 9, 'Aceite de Oliva', 195, 'https://loremflickr.com/400/400/olive-oil,food/all', 'Aceite de oliva extra virgen, 500 ml.', TRUE, 22, 1),
  (68, 7, 4, NULL, 'Pasta Spaghetti', 22, 'https://loremflickr.com/400/400/raw-spaghetti,food/all', 'Pasta spaghetti de sémola, 500 g.', FALSE, 30, 1),
  (69, 7, 3, NULL, 'Atún en Lata', 26, 'https://loremflickr.com/400/400/canned-tuna,food/all', 'Atún en agua, lata de 140 g.', FALSE, 30, 1),
  (70, 7, 1, NULL, 'Frijol Negro', 38, 'https://loremflickr.com/400/400/black-beans,food/all', 'Frijol negro seleccionado a granel.', FALSE, 30, 1),
  (71, 7, 1, NULL, 'Azúcar Refinada', 28, 'https://loremflickr.com/400/400/white-sugar,food/all', 'Azúcar refinada de caña, 1 kg.', FALSE, 30, 1),
  (72, 7, 4, NULL, 'Sal de Mesa', 14, 'https://loremflickr.com/400/400/salt-shaker,food/all', 'Sal de mesa yodada, 1 kg.', FALSE, 30, 1),
  (73, 7, 4, NULL, 'Cereal de Maíz', 64, 'https://loremflickr.com/400/400/corn-flakes,food/all', 'Cereal de maíz tostado, 500 g.', FALSE, 30, 1);

-- ============================================================
--  Ofertas del carrusel
-- ============================================================

-- ID_categoria es lo que le da alcance al código: POST /ordenes lo lee
-- de aquí para saber que FRESCUERA solo aplica a frutas y verduras.

INSERT INTO Ofertas
  (ID_oferta, ID_codigo_descuento, ID_categoria, titulo_oferta, descripcion_oferta, descripcion_beneficio, imagen_oferta)
VALUES
  (1, 1, 1, 'Frutas y verduras frescas', 'Aplica en frutas y verduras seleccionadas', '20% OFF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Produce_section_at_Publix.jpg/1280px-Produce_section_at_Publix.jpg'),
  (2, NULL, NULL, 'Panadería recién horneada', 'Pan y pastelería todos los días', NULL, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Korb_mit_Br%C3%B6tchen.JPG/1280px-Korb_mit_Br%C3%B6tchen.JPG'),
  (3, 2, 2, 'Lácteos y quesos', 'Aplica en lácteos seleccionados', '2x1', 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Cheese_platter.jpg'),
  (4, NULL, NULL, 'Delicias listas para llevar', 'Nuevos platillos preparados cada semana', NULL, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prepared_food_display_in_an_Italian_deli_in_Rome.jpg/1280px-Prepared_food_display_in_an_Italian_deli_in_Rome.jpg'),
  (5, 3, 4, 'Fin de semana de parrilla', 'Aplica en cortes, pollo y pescados', '15% OFF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Meat_at_the_butcher_shop.JPG/1280px-Meat_at_the_butcher_shop.JPG'),
  (6, 4, 5, 'Refréscate este verano', 'Aplica en toda la sección de bebidas', '3x2', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Soft_drink_shelf.JPG/1280px-Soft_drink_shelf.JPG'),
  (7, NULL, NULL, 'Despensa completa', 'Todo lo que necesitas para la semana, en un solo lugar', NULL, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Supermarket_shelves.jpg/1280px-Supermarket_shelves.jpg');

-- ============================================================
--  Clientes de demostración
-- ============================================================

-- Contraseñas hasheadas con bcrypt (10 rondas) al generar este archivo.
-- Para entrar a la app:
--   diana@rosamark.com  /  rosamark123
--   eduardo@rosamark.com  /  rosamark123
--   demo@rosamark.com  /  demo1234

INSERT INTO Clientes
  (ID_cliente, nombre_cliente, correo_cliente, contrasena_cliente)
VALUES
  (1, 'Diana Wiling', 'diana@rosamark.com', '$2b$10$1HOdDYypUQj9TP9zaylF.OnQ3sXBghj17H7lLayyi8usR1Qhz1AYK'),
  (2, 'Eduardo Ortiz', 'eduardo@rosamark.com', '$2b$10$jtnEM7oN1RqlnViEbcoGteCZFTaPO6kfWy8P5hx4rsoScvHD7JkA2'),
  (3, 'Usuaria Demo', 'demo@rosamark.com', '$2b$10$g5SlTfnuc532EralXeU.i.H8yqDcvkdomepuSbXLnRARD.gpvDy7O');


-- =============================================================
--  Comprobación rápida
-- =============================================================
SELECT
  (SELECT COUNT(*) FROM Categorias)         AS categorias,
  (SELECT COUNT(*) FROM Unidades)           AS unidades,
  (SELECT COUNT(*) FROM Descuentos_valores) AS descuentos,
  (SELECT COUNT(*) FROM Descuentos_codigo)  AS codigos,
  (SELECT COUNT(*) FROM Productos)          AS productos,
  (SELECT COUNT(*) FROM Ofertas)            AS ofertas,
  (SELECT COUNT(*) FROM Clientes)           AS clientes;
