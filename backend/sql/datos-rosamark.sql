-- =============================================================
--  DATOS DE ROSAMARK  (generado automáticamente)
--
--  NO EDITES ESTE ARCHIVO A MANO: se regenera con
--      cd backend && npm run seed:sql
--  a partir de src/data/ (productos.js, ofertas.js, usuarios.js).
--
--  Generado: 2026-08-25 04:45:48
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
  (5, 1, '20% de descuento en frutas y verduras', 20, NULL, NULL, NULL, NULL),
  (6, 3, '2x1 en lácteos', 0, 2, 1, NULL, NULL);

-- ============================================================
--  Códigos de descuento
-- ============================================================

INSERT INTO Descuentos_codigo
  (ID_descuento_codigo, ID_descuento, texto_codigo, etiqueta_codigo, descripcion_codigo)
VALUES
  (1, 5, 'FRESCUERA', 'FRESCUERA', '20% de descuento en frutas y verduras'),
  (2, 6, 'LLEVATEUNAVACA', 'LlevateUnaVaca', '2x1 en lácteos');

-- ============================================================
--  Productos (29)
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
  (29, 7, 6, NULL, 'Miel de Abeja', 60, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Runny_hunny.jpg/960px-Runny_hunny.jpg', 'Miel de abeja pura, natural y endulzante ideal para tus recetas.', TRUE, 30, 1);

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
  (4, NULL, NULL, 'Delicias listas para llevar', 'Nuevos platillos preparados cada semana', NULL, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prepared_food_display_in_an_Italian_deli_in_Rome.jpg/1280px-Prepared_food_display_in_an_Italian_deli_in_Rome.jpg');

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
  (1, 'Diana Wiling', 'diana@rosamark.com', '$2b$10$D16zSxUGxMV/ggCt8vlMreBEPiGo0GkSSLpEh8.WWDAAoDSWw9fC6'),
  (2, 'Eduardo Ortiz', 'eduardo@rosamark.com', '$2b$10$wgXyp1CVH0SPj0ur8OI.7uWNCL7bchKzFY3lQArJQ5LXnnYba./xa'),
  (3, 'Usuaria Demo', 'demo@rosamark.com', '$2b$10$u5kLkKmA9NiR0klWSdgZtuMmULmigccGhwZpyszb6cis9oI0mQbcK');


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
