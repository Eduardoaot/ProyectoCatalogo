-- =============================================================
--  Migracion: factor_pieza de los productos a granel
--  22 productos
-- =============================================================
--
--  El detalle del producto deja comprar por kilo o por pieza usando
--  Productos.factor_pieza (cuanto pesa UNA pieza en la unidad de venta:
--  1 manzana = 0.18 kg). La columna ya existia en tienda.sql pero todos
--  los productos estaban sembrados con 1, asi que las dos opciones
--  habrian hecho lo mismo.
--
--  Solo hace falta correr esto sobre una base YA cargada: el seed
--  completo (sql/datos-rosamark.sql) ya trae estos valores.
--
--      mysql -u root -p tienda < sql/migracion-factor-pieza.sql
--
--  Los productos que no aparecen aqui se quedan en 1 a proposito: el
--  arroz, el frijol o el azucar se venden por peso, no de a piezas.

USE tienda;

UPDATE Productos SET factor_pieza = 0.18 WHERE ID_producto = 1;  -- Manzana Roja
UPDATE Productos SET factor_pieza = 0.12 WHERE ID_producto = 2;  -- Plátano
UPDATE Productos SET factor_pieza = 0.2 WHERE ID_producto = 3;  -- Naranja
UPDATE Productos SET factor_pieza = 0.15 WHERE ID_producto = 4;  -- Tomate
UPDATE Productos SET factor_pieza = 0.25 WHERE ID_producto = 7;  -- Queso Manchego
UPDATE Productos SET factor_pieza = 0.45 WHERE ID_producto = 11;  -- Carne T-Bone
UPDATE Productos SET factor_pieza = 0.25 WHERE ID_producto = 12;  -- Pechuga de Pollo
UPDATE Productos SET factor_pieza = 0.5 WHERE ID_producto = 22;  -- Uva
UPDATE Productos SET factor_pieza = 0.2 WHERE ID_producto = 23;  -- Papa
UPDATE Productos SET factor_pieza = 0.15 WHERE ID_producto = 24;  -- Cebolla
UPDATE Productos SET factor_pieza = 0.05 WHERE ID_producto = 26;  -- Salchicha
UPDATE Productos SET factor_pieza = 0.5 WHERE ID_producto = 31;  -- Uva Verde
UPDATE Productos SET factor_pieza = 4 WHERE ID_producto = 32;  -- Sandía
UPDATE Productos SET factor_pieza = 0.2 WHERE ID_producto = 34;  -- Aguacate Hass
UPDATE Productos SET factor_pieza = 0.1 WHERE ID_producto = 35;  -- Zanahoria
UPDATE Productos SET factor_pieza = 0.4 WHERE ID_producto = 36;  -- Brócoli
UPDATE Productos SET factor_pieza = 0.25 WHERE ID_producto = 37;  -- Queso Manchego
UPDATE Productos SET factor_pieza = 0.4 WHERE ID_producto = 41;  -- Queso Panela
UPDATE Productos SET factor_pieza = 0.25 WHERE ID_producto = 50;  -- Pechuga de Pollo
UPDATE Productos SET factor_pieza = 0.2 WHERE ID_producto = 51;  -- Chuleta de Cerdo
UPDATE Productos SET factor_pieza = 0.25 WHERE ID_producto = 52;  -- Salmón Fresco
UPDATE Productos SET factor_pieza = 0.1 WHERE ID_producto = 55;  -- Chorizo

SELECT ID_producto, nombre_producto, factor_pieza
  FROM Productos
 WHERE factor_pieza <> 1
 ORDER BY ID_producto;
