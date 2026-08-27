-- =============================================================
--  Migracion: unidad de compra en el detalle de la orden
-- =============================================================
--
--  El carrito ahora recuerda si la persona pidio "3 piezas" o "0.54 kg".
--  cantidad_orden_producto sigue siendo SIEMPRE la unidad de venta (es lo
--  que cobra el servidor y lo que descuenta stock, eso no cambia); la
--  columna nueva guarda aparte cuantas piezas eran, para que "Mis ordenes"
--  pueda repetir lo que el cliente eligio.
--
--  Se guarda el numero de piezas y no un simple "modo" a proposito:
--  factor_pieza puede cambiar en el futuro y una orden es un documento
--  historico, no debe moverse con el.
--
--  NULL = se compro por peso/volumen. Las ordenes que ya existen quedan en
--  NULL, que es exactamente lo que significaban antes de este cambio.
--
--      mysql -u root -p tienda < sql/migracion-piezas-orden.sql

USE tienda;

ALTER TABLE Maestra_orden_productos
  ADD COLUMN piezas_orden_producto DECIMAL(10,3) NULL DEFAULT NULL
  AFTER cantidad_orden_producto;

SELECT ID_maestra_orden_producto,
       ID_orden,
       ID_producto,
       cantidad_orden_producto,
       piezas_orden_producto
  FROM Maestra_orden_productos
 ORDER BY ID_maestra_orden_producto
 LIMIT 20;
