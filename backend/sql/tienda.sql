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
    cantidad_orden_producto   DECIMAL(10,3) NOT NULL,
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
--  DATOS DE EJEMPLO (opcional, para probar)
-- =============================================================

INSERT INTO Categorias (nombre_categoria) VALUES
  ('Abarrotes'), ('Bebidas'), ('Limpieza');

INSERT INTO Unidades (nombre_unidad) VALUES
  ('pieza'), ('kg'), ('litro');

INSERT INTO Descuentos_tipos (tipo_descuento) VALUES
  ('porcentaje'), ('monto_fijo'), ('NxM');

INSERT INTO Descuentos_valores
  (ID_descuento_tipo, nombre_descuento, descuento_valor, cantidad_lleva, cantidad_paga, fecha_inicio, fecha_final)
VALUES
  (1, '10% de descuento', 10.00, NULL, NULL, '2026-01-01', '2026-12-31'),
  (3, '3x2 en bebidas',    0.00, 3,    2,    '2026-01-01', '2026-06-30');

INSERT INTO Clientes (nombre_cliente, correo_cliente, contrasena_cliente) VALUES
  ('Cliente Demo', 'demo@correo.com', '$2b$10$hashDeEjemploReemplazarEnLaApp');

INSERT INTO Productos
  (ID_categoria, ID_unidad, ID_Descuento, nombre_producto, precio_producto, destacado, cantidad_producto, factor_pieza)
VALUES
  (1, 2, 1, 'Arroz 1kg',       28.50, TRUE,  100, 1),
  (2, 3, 2, 'Refresco 2L',     22.00, TRUE,  200, 1),
  (3, 1, NULL,'Jabón en barra', 12.00, FALSE, 50,  1);

-- -------------------------------------------------------------
--  Datos extra para probar códigos y ofertas desde la API.
--  (No forman parte del esquema original.)
-- -------------------------------------------------------------

INSERT INTO Descuentos_codigo (ID_descuento, texto_codigo, etiqueta_codigo, descripcion_codigo) VALUES
  (1, 'BIENVENIDA10', '10% de bienvenida', 'Descuento de bienvenida para clientes nuevos');

INSERT INTO Ofertas (ID_codigo_descuento, ID_categoria, titulo_oferta, descripcion_oferta, descripcion_beneficio) VALUES
  (1, 2, '3x2 en bebidas', 'Lleva 3 y paga 2 en toda la categoría', 'Ahorra una bebida completa');
