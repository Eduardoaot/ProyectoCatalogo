-- =============================================================
--  BASE DE DATOS: tienda  (e-commerce)
--  Corregida y normalizada para MySQL 8.x
--  Motor: InnoDB   Charset: utf8mb4 (soporta acentos y emojis)
-- =============================================================

DROP DATABASE IF EXISTS tienda;
CREATE DATABASE tienda
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE tienda;

SET NAMES utf8mb4;

-- =============================================================
--  1. CATÁLOGO
-- =============================================================

CREATE TABLE Categorias (
    ID_categoria      INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    nombre_categoria  VARCHAR(100)  NOT NULL,
    PRIMARY KEY (ID_categoria)
) ENGINE=InnoDB;

CREATE TABLE Unidades (
    ID_unidad     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_unidad VARCHAR(50)  NOT NULL,   -- ej. "kg", "pieza", "litro"
    PRIMARY KEY (ID_unidad)
) ENGINE=InnoDB;

-- =============================================================
--  2. DESCUENTOS
-- =============================================================

CREATE TABLE Descuentos_tipos (
    ID_descuento_tipo INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tipo_descuento    VARCHAR(50)  NOT NULL,  -- ej. "porcentaje", "monto_fijo", "2x1"
    PRIMARY KEY (ID_descuento_tipo)
) ENGINE=InnoDB;

CREATE TABLE Descuentos_valores (
    ID_descuento      INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    ID_descuento_tipo INT UNSIGNED   NOT NULL,
    nombre_descuento  VARCHAR(100)   NOT NULL,
    descuento_valor   DECIMAL(10,2)  NOT NULL DEFAULT 0,   -- % o monto según el tipo
    cantidad_lleva    INT UNSIGNED   NULL,                 -- para promos NxM (ej. lleva 3)
    cantidad_paga     INT UNSIGNED   NULL,                 -- (ej. paga 2)
    fecha_inicio      DATE           NULL,                 -- vigencia
    fecha_final       DATE           NULL,
    PRIMARY KEY (ID_descuento),
    CONSTRAINT fk_descval_tipo
        FOREIGN KEY (ID_descuento_tipo)
        REFERENCES Descuentos_tipos (ID_descuento_tipo)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE Descuentos_codigo (
    ID_descuento_codigo INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    ID_descuento        INT UNSIGNED  NOT NULL,
    texto_codigo        VARCHAR(50)   NOT NULL,   -- el código que teclea el cliente
    etiqueta_codigo     VARCHAR(100)  NULL,
    descripcion_codigo  VARCHAR(255)  NULL,
    PRIMARY KEY (ID_descuento_codigo),
    UNIQUE KEY uq_texto_codigo (texto_codigo),
    CONSTRAINT fk_desccod_valor
        FOREIGN KEY (ID_descuento)
        REFERENCES Descuentos_valores (ID_descuento)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
--  3. PRODUCTOS
-- =============================================================

CREATE TABLE Productos (
    ID_producto       INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    ID_categoria      INT UNSIGNED   NOT NULL,
    ID_unidad         INT UNSIGNED   NOT NULL,
    ID_Descuento      INT UNSIGNED   NULL,          -- producto puede no tener descuento
    nombre_producto   VARCHAR(150)   NOT NULL,
    precio_producto   DECIMAL(10,2)  NOT NULL DEFAULT 0,
    imagen            VARCHAR(255)   NULL,          -- ruta / URL de la imagen
    descripcion       TEXT           NULL,
    destacado         BOOLEAN        NOT NULL DEFAULT FALSE,
    cantidad_producto DECIMAL(10,3)  NOT NULL DEFAULT 0,   -- stock
    factor_pieza      DECIMAL(10,3)  NOT NULL DEFAULT 1,
    created_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID_producto),
    CONSTRAINT fk_prod_categoria
        FOREIGN KEY (ID_categoria) REFERENCES Categorias (ID_categoria)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_prod_unidad
        FOREIGN KEY (ID_unidad) REFERENCES Unidades (ID_unidad)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_prod_descuento
        FOREIGN KEY (ID_Descuento) REFERENCES Descuentos_valores (ID_descuento)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
--  4. OFERTAS  (banners / promos vinculadas a categoría o código)
-- =============================================================

CREATE TABLE Ofertas (
    ID_oferta            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    ID_codigo_descuento  INT UNSIGNED  NULL,
    ID_categoria         INT UNSIGNED  NULL,
    titulo_oferta        VARCHAR(150)  NOT NULL,
    descripcion_oferta   VARCHAR(255)  NULL,
    descripcion_beneficio VARCHAR(255) NULL,
    imagen_oferta        VARCHAR(255)  NULL,        -- ruta / URL
    PRIMARY KEY (ID_oferta),
    CONSTRAINT fk_oferta_codigo
        FOREIGN KEY (ID_codigo_descuento) REFERENCES Descuentos_codigo (ID_descuento_codigo)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_oferta_categoria
        FOREIGN KEY (ID_categoria) REFERENCES Categorias (ID_categoria)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
--  5. CLIENTES
-- =============================================================

CREATE TABLE Clientes (
    ID_cliente         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    nombre_cliente     VARCHAR(150)  NOT NULL,
    correo_cliente     VARCHAR(255)  NOT NULL,
    contrasena_cliente VARCHAR(255)  NOT NULL,   -- guardar SIEMPRE el hash (bcrypt), nunca texto plano
    created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID_cliente),
    UNIQUE KEY uq_correo_cliente (correo_cliente)
) ENGINE=InnoDB;

-- =============================================================
--  6. ÓRDENES
-- =============================================================

CREATE TABLE Ordenes (
    ID_orden    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
    ID_cliente  INT UNSIGNED   NOT NULL,
    fecha_orden DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_orden DECIMAL(10,2)  NOT NULL DEFAULT 0,
    PRIMARY KEY (ID_orden),
    CONSTRAINT fk_orden_cliente
        FOREIGN KEY (ID_cliente) REFERENCES Clientes (ID_cliente)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE Maestra_orden_productos (
    ID_maestra_orden_producto INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    ID_orden                  INT UNSIGNED  NOT NULL,
    ID_producto               INT UNSIGNED  NOT NULL,
    cantidad_orden_producto   DECIMAL(10,3) NOT NULL,  -- SIEMPRE en la unidad de venta
    -- Cuantas piezas pidio el cliente, si compro de a piezas (NULL = compro
    -- por peso/volumen). Se guarda el numero de piezas y no solo un "modo"
    -- porque factor_pieza puede cambiar despues y la orden no debe cambiar
    -- con el: es un documento historico.
    piezas_orden_producto     DECIMAL(10,3) NULL DEFAULT NULL,
    precio_orden_producto     DECIMAL(10,2) NOT NULL,   -- precio en el momento de la compra
    PRIMARY KEY (ID_maestra_orden_producto),
    CONSTRAINT fk_det_orden
        FOREIGN KEY (ID_orden) REFERENCES Ordenes (ID_orden)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_det_producto
        FOREIGN KEY (ID_producto) REFERENCES Productos (ID_producto)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
--  7. FAVORITOS
--  (Tabla agregada en la v3.0 para el apartado "Mis favoritos".
--   Es aditiva: no cambia ninguna tabla ni columna del esquema original.)
-- =============================================================

CREATE TABLE Favoritos (
    ID_favorito INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ID_cliente  INT UNSIGNED NOT NULL,
    ID_producto INT UNSIGNED NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID_favorito),
    -- Un cliente no puede tener dos veces el mismo producto en favoritos.
    UNIQUE KEY uq_favorito_cliente_producto (ID_cliente, ID_producto),
    CONSTRAINT fk_fav_cliente
        FOREIGN KEY (ID_cliente) REFERENCES Clientes (ID_cliente)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_fav_producto
        FOREIGN KEY (ID_producto) REFERENCES Productos (ID_producto)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
--  DATOS DE ROSAMARK
--
--  Catálogo real (no un ejemplo de juguete): mismo contenido que
--  sql/datos-rosamark.sql, pegado aquí VERBATIM (copiado por script, no a
--  mano) para que un solo script arme la base entera de una sentada. Ese
--  otro archivo sigue existiendo y sigue siendo la fuente que se
--  regenera con `cd backend && npm run seed:sql` a partir de src/data/ --
--  si vuelves a correr ese comando, vuelve a correr también
--  scripts/consolidar-tienda.mjs (o pide que se regenere) para que esta
--  copia no se desactualice.
-- =============================================================
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
  (1, 1, 1, 1, 'Manzana Roja', 1.5, 'https://elegifruta.com.ar/wp-content/uploads/2017/07/manzana_roja.jpg', 'Manzanas rojas frescas y crujientes, ideales para cualquier momento del día.', TRUE, 30, 0.18),
  (2, 1, 1, NULL, 'Plátano', 1.5, 'https://saludinteractiva.mx/blog/wp-content/uploads/2022/05/beneficios_del_platano_istock.webp', 'Plátanos frescos y dulces, perfectos para desayunos y licuados.', FALSE, 30, 0.12),
  (3, 1, 1, NULL, 'Naranja', 1.8, 'https://tse4.mm.bing.net/th/id/OIP.7uvRp-iBdY04IQa-WpeJNgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Naranjas frescas y jugosas ideales para preparar deliciosos jugos.', TRUE, 30, 0.2),
  (4, 1, 1, NULL, 'Tomate', 2.2, 'https://tse2.mm.bing.net/th/id/OIP.gi9KS8sqHTQMH_iGrjLX0wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Tomates frescos para ensaladas, salsas y todo tipo de comidas.', FALSE, 30, 0.15),
  (5, 2, 2, 2, 'Nutri-leche', 38, 'https://cdn.shopify.com/s/files/1/0080/1076/0255/products/LECHE-NUTRILECHE-1-LT_4fb01653-6ed2-4ad6-a784-bba71e7c0171_1200x1200_crop_center.jpg?v=1654034176', 'Leche fresca de la marca Nutri-leche.', TRUE, 30, 1),
  (6, 2, 3, NULL, 'Yogurt griego', 18, 'https://www.yoplait.com.mx/public/app/uploads/2022/07/GRIEGO_NATURAL_120g_271x300px.png', 'Yogur griego cremoso, ideal para desayunos y snacks.', FALSE, 30, 1),
  (7, 2, 1, NULL, 'Queso Americano', 85, 'https://www.grillhouse.mx/cdn/shop/products/8147VLLTamericano175gSIM21.png?v=1753148155', 'Queso Americano de excelente calidad y gran sabor.', TRUE, 30, 0.25),
  (8, 3, 3, 3, 'Pan Francés', 12, 'https://media.istockphoto.com/id/485821784/photo/various-of-french-baguette-isolated-on-white-background.jpg?s=170667a&w=0&k=20&c=HYhQoHiNnS5HpHEQZQSsD05yNLwJ-97bjgII7_46jws=', 'Pan francés recién horneado y crujiente.', TRUE, 30, 1),
  (9, 3, 4, NULL, 'Pan de Caja', 42, 'https://tse2.mm.bing.net/th/id/OIP.R4BDVq4Vsy1vz2ai2unP9AHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'Pan de caja suave, perfecto para preparar sandwiches.', FALSE, 30, 1),
  (10, 3, 3, NULL, 'Dona de Chocolate', 15, 'https://www.chocolatesturin.com.mx/cdn-cgi/image/width=1360,height=583,f=auto,quality=90/sites/g/files/fnmzdf5476/files/2024-12/06%20Donas%20de%20choclate11476_retoque.jpg', 'Dona esponjosa cubierta con delicioso chocolate.', TRUE, 30, 1),
  (11, 4, 1, 4, 'Carne T-Bone', 65, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/T-bone-raw-MCB.jpg/960px-T-bone-raw-MCB.jpg', 'Corte T-Bone preparado y listo para cocinar.', TRUE, 30, 0.45),
  (12, 4, 1, NULL, 'Nuggets de Pollo', 75, 'https://i5-mx.walmartimages.com/mg/gm/3pp/asr/06002a44-7bfa-4520-9e26-c3ea6d75de32.2cd88ba9d49c834deef08f47d8f0c7e8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 'Nuggets de pollo frescos y listos para preparar.', FALSE, 30, 0.25),
  (13, 4, 1, NULL, 'Carne Molida', 95, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Hackfleisch-1.jpg/960px-Hackfleisch-1.jpg', 'Carne molida de res fresca para hamburguesas y guisos.', TRUE, 30, 1),
  (14, 5, 5, NULL, 'Champagne', 100, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Champagne_bottles_in_a_bucket_-_8439.jpg/960px-Champagne_bottles_in_a_bucket_-_8439.jpg', 'Champagne para disfrutar en una ocasión especial.', TRUE, 30, 1),
  (15, 5, 2, NULL, 'Refresco de Cola', 25, 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Big-Cola-3L.jpg', 'Refresco de cola frío y refrescante.', FALSE, 30, 1),
  (16, 5, 5, NULL, 'Agua Natural', 15, 'https://chefmart.com.mx/cdn/shop/files/FRONT-AGUA-MIA_1600x.jpg?v=1751993617', 'Agua natural para mantenerte hidratado durante el día.', FALSE, 30, 1),
  (17, 6, 3, NULL, 'Escoba', 40, 'https://orvagclf.com/cdn/shop/products/12fd7adaa7fd9d328a905abc61103b38.png?v=1692165820', 'Escoba tradicional para el aseo de tu hogar.', TRUE, 30, 1),
  (18, 6, 2, NULL, 'Jabón Zote', 32, 'https://cleansy.mx/wp-content/uploads/2024/08/PAGINA-WEB-PRODUCTOS-2025-09-19T094625.794.png', 'Jabón Zote en barra para eliminar grasa y suciedad.', FALSE, 30, 1),
  (19, 7, 1, NULL, 'Arroz', 28, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Ceramic_bowl_full_of_white_rice.jpg/960px-Ceramic_bowl_full_of_white_rice.jpg', 'Arroz blanco de grano largo para acompañar tus comidas.', TRUE, 30, 1),
  (20, 7, 1, NULL, 'Frijol', 35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Black_beans_%281126927794%29.jpg/960px-Black_beans_%281126927794%29.jpg', 'Frijol de excelente calidad para preparar tus comidas favoritas.', FALSE, 30, 1),
  (21, 1, 1, NULL, 'Mango', 45, 'https://www.mango.org/wp-content/uploads/2024/06/plu-honey-mango_v2.png', 'Mangos frescos y dulces, perfectos para postres y licuados.', TRUE, 30, 1),
  (22, 1, 1, NULL, 'Uva', 55, 'https://tecolotito.elsiglodedurango.com.mx/cdn-cgi/image/format=auto,width=1024/i/2018/05/694949.jpeg', 'Uvas frescas y jugosas, ideales para picar o preparar postres.', FALSE, 30, 0.5),
  (23, 1, 1, NULL, 'Papa', 18, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/960px-Patates.jpg', 'Papas frescas, versátiles para freír, hornear o hacer puré.', FALSE, 30, 0.2),
  (24, 1, 1, NULL, 'Cebolla', 16, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/960px-Mixed_onions.jpg', 'Cebollas frescas, infaltables para dar sabor a tus platillos.', FALSE, 30, 0.15),
  (25, 3, 4, NULL, 'Galletas de Chispas de Chocolate', 22, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Choc-Chip-Cookie.jpg/960px-Choc-Chip-Cookie.jpg', 'Galletas horneadas con chispas de chocolate, crujientes por fuera y suaves por dentro.', TRUE, 30, 1),
  (26, 4, 1, NULL, 'Salchicha', 48, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Cervelat.jpg/960px-Cervelat.jpg', 'Salchichas ahumadas, listas para asar o cocinar.', FALSE, 30, 0.05),
  (27, 5, 4, NULL, 'Café en Grano', 65, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIe_EyPH2MoqmcF-O7Jr1vcIO7eOp5naxLRCzAtYqVQ5Mplmf4f4GzaFI&s=10', 'Café en grano tostado, ideal para preparar un buen café recién molido.', TRUE, 30, 1),
  (28, 6, 2, NULL, 'Cloro', 24, 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Clorox_Bleach_products.jpg', 'Cloro desinfectante para limpieza y desinfección del hogar.', FALSE, 30, 1),
  (29, 7, 6, NULL, 'Miel de Abeja', 60, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Runny_hunny.jpg/960px-Runny_hunny.jpg', 'Miel de abeja pura, natural y endulzante ideal para tus recetas.', TRUE, 30, 1),
  (30, 1, 1, 5, 'Fresa', 55, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWR8ZoOP52TrXBpKorMCkQA2qe4eC9MflZ7Gzd58O3xWGHrgOHyo3_XMCK&s=10', 'Fresas frescas de temporada, dulces y aromáticas.', TRUE, 40, 1),
  (31, 1, 1, NULL, 'Uva Verde', 52, 'https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/seedless_green_grapes.jpg', 'Uva verde sin semilla, crujiente y refrescante.', FALSE, 30, 0.5),
  (32, 1, 1, NULL, 'Sandía', 18, 'https://soycomocomo.es/media/2016/06/sandia-2.gif', 'Sandía jugosa, perfecta para los días de calor.', FALSE, 30, 4),
  (33, 1, 3, NULL, 'Piña', 25, 'https://dashboard.oftalvist.es/public/blog/294/pi%C3%B1a-beneficios-ojos.jpg', 'Piña miel madura, dulce y perfumada.', FALSE, 30, 1),
  (34, 1, 1, NULL, 'Aguacate Hass', 78, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGFksBbSslYei2H8F89H0a9YH-DXjYkwdchWgL7602DA&s=10', 'Aguacate hass cremoso, listo para el guacamole.', TRUE, 25, 0.2),
  (35, 1, 1, NULL, 'Zanahoria', 16, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfzMuNKgOUrl6PGQ340cmtHmSO-92lm8xtkDaYlwrb7DDBKI1qcGTccgx&s=10', 'Zanahoria fresca, ideal para sopas y ensaladas.', FALSE, 30, 0.1),
  (36, 1, 1, NULL, 'Brócoli', 32, 'https://static.nationalgeographicla.com/files/styles/image_3200/public/brocoli-2.jpg?w=1600&h=1063', 'Brócoli verde y firme, cosechado esta semana.', FALSE, 30, 0.4),
  (37, 2, 1, 4, 'Queso Manchego', 110, 'https://supermode.com.mx/cdn/shop/products/4716_2708d1ad-9634-4e96-a520-e7e2381fd52f.jpg?v=1698796056', 'Queso manchego semicurado, ideal para gratinar.', TRUE, 20, 0.25),
  (38, 2, 2, NULL, 'Yogurt Natural', 24, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDpgkNFjqdKX_OhSZ-OlR9ZEEdoUw4N58sGdekQ6vY7Vexz71Y0LdpEDY&s=10', 'Yogur natural sin azúcar añadida.', FALSE, 30, 1),
  (39, 2, 4, NULL, 'Mantequilla', 48, 'https://i5.walmartimages.com/asr/19cc3c96-5536-44e8-adb2-aaa63b82ad67.d44b8cd1eeba1a84c63d86878cd6a612.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 'Mantequilla sin sal de 225 g.', FALSE, 30, 1),
  (40, 2, 6, NULL, 'Crema Ácida', 36, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPe0BW9RFtrW25ZQvcltEKye6nzhdlOtDoVePb30_KFm2Kl886-AnhLxZa&s=10', 'Crema ácida espesa para tus antojos.', FALSE, 30, 1),
  (41, 2, 1, NULL, 'Queso Panela', 82, 'https://www.lyncott.mx/wp-content/uploads/2021/11/Panela.jpg', 'Queso panela fresco, bajo en grasa.', FALSE, 30, 0.4),
  (42, 2, 2, NULL, 'Leche Deslactosada', 34, 'https://arteli.vtexassets.com/arquivos/ids/268825-800-auto?v=638853487275430000&width=800&height=auto&aspect=true', 'Leche deslactosada entera de 1 litro.', FALSE, 30, 1),
  (43, 2, 4, NULL, 'Huevo Blanco', 68, 'https://static.wixstatic.com/media/de7407_31164d7e28214a8dac53b9e11990281c~mv2.png/v1/fit/w_500,h_500,q_90/file.png', 'Paquete de 12 huevos frescos de granja.', TRUE, 45, 1),
  (44, 3, 3, NULL, 'Croissant', 18, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Croissant-Petr_Kratochvil.jpg/330px-Croissant-Petr_Kratochvil.jpg', 'Croissant de mantequilla horneado en casa.', TRUE, 30, 1),
  (45, 3, 3, NULL, 'Bagel', 22, 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/02/16/0/FNM_030122-Homemade-Bagels_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1645023418907.webp', 'Bagel artesanal, perfecto para el desayuno.', FALSE, 30, 1),
  (46, 3, 4, NULL, 'Pan para hot dog', 42, 'https://lagranbodega.vteximg.com.br/arquivos/ids/304201-1000-1000/7501000111503.jpg?v=638881971369770000', 'Pan para hot dog, 340 g.', FALSE, 30, 1),
  (47, 3, 3, NULL, 'Dona Glaseada', 15, 'https://cdn7.kiwilimon.com/brightcove/11162/640x640/11162.jpg.webp', 'Dona glaseada recién hecha.', FALSE, 30, 1),
  (48, 3, 3, 6, 'Pastel de Chocolate', 220, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn_QVcL_ale8eVTTrkG74QND3z-PXAk2K4UKb4XQgdsrNsWaR5pbqDvIk&s=10', 'Pastel de chocolate para 8 porciones.', TRUE, 12, 1),
  (49, 3, 4, NULL, 'Galletas de Avena', 38, 'https://cuk-it.com/wp-content/uploads/2017/06/galletas-avena-04.webp', 'Galletas de avena con pasas, 300 g.', FALSE, 30, 1),
  (50, 4, 1, NULL, 'Pechuga de Pollo', 88, 'https://kosherhouse.mx/cdn/shop/files/pechugadepollosinhueso.jpg?v=1691773142', 'Pechuga de pollo sin hueso ni piel.', TRUE, 35, 0.25),
  (51, 4, 1, NULL, 'Chuleta de Cerdo', 105, 'https://i5-mx.walmartimages.com/samsmx/images/product-images/img_large/000036423-2l.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 'Chuleta de cerdo con hueso, corte grueso.', FALSE, 30, 0.2),
  (52, 4, 1, 7, 'Salmón Fresco', 340, 'https://ingredienta.com/wp-content/uploads/2024/11/SALMONCANALOMO-800x800.png', 'Filete de salmón fresco del Atlántico.', TRUE, 15, 0.25),
  (53, 4, 1, NULL, 'Camarón Mediano', 245, 'https://theshrimpnet.com/37-large_default/camaron-mediano-del-golfo.jpg', 'Camarón mediano limpio.', FALSE, 30, 1),
  (54, 4, 4, NULL, 'Tocino', 72, 'https://i5.walmartimages.com/seo/Great-Value-Hickory-Smoked-Bacon-Mega-Pack-24-oz_d974295f-18e4-4445-a61b-565a15031651.b3695a12031e158791f6870fe9a99bcc.jpeg', 'Tocino ahumado en rebanadas, 680 g.', FALSE, 30, 1),
  (55, 4, 1, NULL, 'Chorizo', 68, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvkan_cSEm33WmYd8afcuZeBfNr1Tek9lG-skPPAED03_fWydrMedb-Oc&s=10', 'Chorizo artesanal, ideal para el desayuno.', FALSE, 30, 0.1),
  (56, 5, 2, NULL, 'Jugo de Naranja', 32, 'https://www.smartnfinal.com.mx/wp-content/uploads/2024/02/125416-JUGO-DE-NARANJA-ORIGINAL-SIMPLY-ORANGE-1.5-L.jpg', 'Jugo de naranja 100% natural, sin azúcar añadida.', TRUE, 30, 1),
  (57, 5, 5, NULL, 'Agua Mineral', 18, 'https://m.media-amazon.com/images/I/81FkyrPtnHL.jpg', 'Agua mineral con gas, 1 litro.', FALSE, 30, 1),
  (58, 5, 5, 5, 'Cerveza corona', 58, 'https://mundogourmet.com.mx/tienda/wp-content/uploads/2020/09/cerveza-corona-355ml.jpg', 'Cerveza corona, 355 ml.', TRUE, 30, 1),
  (59, 5, 5, NULL, 'Vino Tinto', 245, 'https://bodegasalianza.vtexassets.com/arquivos/ids/181489/24244-1-.jpg?v=638938217078000000', 'Vino tinto de mesa, cosecha reciente.', FALSE, 30, 1),
  (60, 5, 5, NULL, 'Té Helado', 26, 'https://media.justo.mx/products/7501055358885-1.jpg', 'Té helado de limón, 600 ml.', FALSE, 30, 1),
  (61, 5, 4, NULL, 'Café Molido', 125, 'https://supermode.com.mx/cdn/shop/products/100008467_b738477b-13bc-4f25-b143-9ebe71ceab09.jpg?v=1698802921', 'Café molido de altura, 500 g.', FALSE, 30, 1),
  (62, 6, 2, NULL, 'Detergente Líquido', 85, 'https://i5.walmartimages.com/asr/b5d3b6d2-0824-46a2-ade8-acb97f2f5212.b974429853025a53aaa9441c84fa7f6d.jpeg', 'Detergente líquido concentrado para ropa.', TRUE, 30, 1),
  (63, 6, 5, NULL, 'Jabón para Trastes', 38, 'https://lagranbodega.vteximg.com.br/arquivos/ids/304677-1000-1000/75045838.jpg?v=638920833020530000', 'Jabón líquido para trastes con aroma a limón.', FALSE, 30, 1),
  (64, 6, 4, 8, 'Papel Higiénico', 115, 'https://m.media-amazon.com/images/I/81cHPJM1t4L._AC_UF350,350_QL80_.jpg', 'Paquete de 12 rollos de doble hoja libre de Muros.', TRUE, 50, 1),
  (65, 6, 5, NULL, 'Limpiador Multiusos', 44, 'https://d1zc67o3u1epb0.cloudfront.net/media/catalog/product/1/2/1206_1__3.jpg?width=265&height=390&store=tienda&image-type=image', 'Limpiador multiusos desinfectante.', FALSE, 30, 1),
  (66, 6, 4, NULL, 'Bolsas para Basura', 52, 'https://cdn.homedepot.com.mx/productos/210765/210765-za1.jpg', 'Bolsas para basura, 50 piezas.', FALSE, 30, 1),
  (67, 7, 5, 9, 'Aceite de Oliva', 195, 'https://ines.com.mx/wp-content/uploads/2025/01/1_Oliva-100-puro_1L_1000x1000.jpg', 'Aceite de oliva extra virgen, 1 lts.', TRUE, 22, 1),
  (68, 7, 4, NULL, 'Pasta Spaghetti', 22, 'https://www.carozzimeencanta.cl/assets/img/productos/paquete-spaghetti-5-carozzi.jpg', 'Pasta spaghetti, 400 g.', FALSE, 30, 1),
  (69, 7, 3, NULL, 'Atún en Lata', 26, 'https://i5-mx.walmartimages.com/mg/gm/3pp/asr/d1673453-db20-4c2e-970f-d3c5371888f4.2a6471b4d6c0ef2a95c3c65558a13c68.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 'Atún en agua, lata de 140 g.', FALSE, 30, 1),
  (70, 7, 1, NULL, 'Frijol Negro', 38, 'https://i.blogs.es/3739cc/oferta-frijoles-verde-valle-negro-amazon-mexico/840_560.jpeg', 'Frijol negro seleccionado a granel.', FALSE, 30, 1),
  (71, 7, 1, NULL, 'Azúcar Refinada', 28, 'https://www.costco.com.mx/medias/sys_master/products/h9a/h4f/82432991035422.jpg', 'Azúcar refinada de caña, 1 kg.', FALSE, 30, 1),
  (72, 7, 4, NULL, 'Sal de Mesa', 14, 'https://i5.walmartimages.com/asr/7c7be410-732d-4bda-af41-13b94723a0a7.0ab155efadace07293d676b4355cea46.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 'Sal de mesa yodada, 1 kg.', FALSE, 30, 1),
  (73, 7, 4, NULL, 'Cereal de Maíz', 64, 'https://images.kglobalservices.com/www.kelloggs.com.mx/es_mx/product/kic-3670/kicproductimage-119149_k226083000_c1c1_es_mx.jpg', 'Cereal de maíz tostado, 440 g.', FALSE, 30, 1);

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
  (1, 'Diana Wiling', 'diana@rosamark.com', '$2b$10$W2sGwszewjaQlARvNIwPq.4ihm2WHT.j5rt8a7t7DzgsQ3MXPdhwa'),
  (2, 'Eduardo Ortiz', 'eduardo@rosamark.com', '$2b$10$lZY3kQpM3OVPMlsau5685.8Kkf1GyERINMPLKJ72efDe7a1nxqoma'),
  (3, 'Usuaria Demo', 'demo@rosamark.com', '$2b$10$pO2CE/CJVJut6O3RF6D/3uAtD17CvyvbnSieTt4ZenPN8o/25FU.m');


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
