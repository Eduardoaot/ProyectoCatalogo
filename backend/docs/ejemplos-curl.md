# Ejemplos con curl

Base de las peticiones: `http://localhost:3000` (las rutas también responden con
el prefijo `/api`).

En Windows usa **Git Bash** o **PowerShell con `curl.exe`** (el alias `curl` de
PowerShell es `Invoke-WebRequest` y no acepta estos parámetros).

Guarda el token en una variable para las rutas protegidas:

```bash
TOKEN="pega_aqui_el_token_del_login"
```

---

## Salud del servicio

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

---

## 1. Clientes y autenticación

### Registro

```bash
curl -X POST http://localhost:3000/clientes/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_cliente": "Ana Perez",
    "correo_cliente": "ana@correo.com",
    "contrasena_cliente": "MiClave12345"
  }'
```

Respuesta (`201`):

```json
{
  "ok": true,
  "data": {
    "cliente": { "ID_cliente": 2, "nombre_cliente": "Ana Perez", "correo_cliente": "ana@correo.com", "created_at": "2026-08-24 22:10:00" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

### Login

```bash
curl -X POST http://localhost:3000/clientes/login \
  -H "Content-Type: application/json" \
  -d '{ "correo_cliente": "ana@correo.com", "contrasena_cliente": "MiClave12345" }'
```

### Perfil del token

```bash
curl http://localhost:3000/clientes/me -H "Authorization: Bearer $TOKEN"
```

---

## 2. Categorías

```bash
# Listar
curl http://localhost:3000/categorias

# Detalle
curl http://localhost:3000/categorias/1

# Crear
curl -X POST http://localhost:3000/categorias \
  -H "Content-Type: application/json" \
  -d '{ "nombre_categoria": "Panaderia" }'

# Editar
curl -X PUT http://localhost:3000/categorias/4 \
  -H "Content-Type: application/json" \
  -d '{ "nombre_categoria": "Panaderia y tortillas" }'

# Borrar
curl -X DELETE http://localhost:3000/categorias/4
```

---

## 3. Unidades

```bash
curl http://localhost:3000/unidades
curl http://localhost:3000/unidades/1

curl -X POST http://localhost:3000/unidades \
  -H "Content-Type: application/json" \
  -d '{ "nombre_unidad": "paquete" }'

curl -X PUT http://localhost:3000/unidades/4 \
  -H "Content-Type: application/json" \
  -d '{ "nombre_unidad": "paquete de 6" }'

curl -X DELETE http://localhost:3000/unidades/4
```

---

## 4. Productos

```bash
# Todos (con categoría, unidad y descuento)
curl http://localhost:3000/productos

# Por categoría
curl "http://localhost:3000/productos?categoria=2"

# Solo destacados
curl "http://localhost:3000/productos?destacado=true"

# Búsqueda por nombre
curl "http://localhost:3000/productos?q=arroz"

# Combinado y paginado
curl "http://localhost:3000/productos?categoria=1&destacado=true&limit=10&offset=0"

# Detalle
curl http://localhost:3000/productos/1
```

Crear:

```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "ID_categoria": 1,
    "ID_unidad": 1,
    "ID_Descuento": 1,
    "nombre_producto": "Frijol negro 1kg",
    "precio_producto": 34.90,
    "imagen": "/img/frijol.webp",
    "descripcion": "Frijol negro seleccionado",
    "destacado": true,
    "cantidad_producto": 80,
    "factor_pieza": 1
  }'
```

Editar (acepta campos parciales) y borrar:

```bash
curl -X PUT http://localhost:3000/productos/4 \
  -H "Content-Type: application/json" \
  -d '{ "precio_producto": 32.50, "destacado": false }'

curl -X DELETE http://localhost:3000/productos/4
```

---

## 5. Descuentos

### Tipos (`Descuentos_tipos`)

```bash
curl http://localhost:3000/descuentos/tipos
curl http://localhost:3000/descuentos/tipos/1

curl -X POST http://localhost:3000/descuentos/tipos \
  -H "Content-Type: application/json" \
  -d '{ "tipo_descuento": "porcentaje" }'

curl -X PUT http://localhost:3000/descuentos/tipos/4 \
  -H "Content-Type: application/json" \
  -d '{ "tipo_descuento": "porcentaje_temporada" }'

curl -X DELETE http://localhost:3000/descuentos/tipos/4
```

### Valores (`Descuentos_valores`)

```bash
curl http://localhost:3000/descuentos/valores
curl http://localhost:3000/descuentos/valores/1

# Porcentaje
curl -X POST http://localhost:3000/descuentos/valores \
  -H "Content-Type: application/json" \
  -d '{
    "ID_descuento_tipo": 1,
    "nombre_descuento": "15% de temporada",
    "descuento_valor": 15,
    "fecha_inicio": "2026-08-01",
    "fecha_final": "2026-09-30"
  }'

# NxM (lleva 2, paga 1)
curl -X POST http://localhost:3000/descuentos/valores \
  -H "Content-Type: application/json" \
  -d '{
    "ID_descuento_tipo": 3,
    "nombre_descuento": "2x1 en limpieza",
    "descuento_valor": 0,
    "cantidad_lleva": 2,
    "cantidad_paga": 1,
    "fecha_inicio": "2026-08-01",
    "fecha_final": "2026-12-31"
  }'

curl -X PUT http://localhost:3000/descuentos/valores/3 \
  -H "Content-Type: application/json" \
  -d '{ "descuento_valor": 20 }'

curl -X DELETE http://localhost:3000/descuentos/valores/3
```

### Códigos (`Descuentos_codigo`)

```bash
curl http://localhost:3000/descuentos/codigos
curl http://localhost:3000/descuentos/codigos/1

curl -X POST http://localhost:3000/descuentos/codigos \
  -H "Content-Type: application/json" \
  -d '{
    "ID_descuento": 1,
    "texto_codigo": "VERANO15",
    "etiqueta_codigo": "15% de verano",
    "descripcion_codigo": "Valido en toda la tienda"
  }'

curl -X PUT http://localhost:3000/descuentos/codigos/2 \
  -H "Content-Type: application/json" \
  -d '{ "etiqueta_codigo": "15% de verano (ampliado)" }'

curl -X DELETE http://localhost:3000/descuentos/codigos/2
```

### Validar un código

```bash
curl -X POST http://localhost:3000/descuentos/validar-codigo \
  -H "Content-Type: application/json" \
  -d '{ "texto_codigo": "BIENVENIDA10" }'
```

Respuesta cuando existe y está vigente:

```json
{
  "ok": true,
  "data": {
    "valido": true,
    "ID_descuento_codigo": 1,
    "texto_codigo": "BIENVENIDA10",
    "etiqueta_codigo": "10% de bienvenida",
    "descripcion_codigo": "Descuento de bienvenida para clientes nuevos",
    "descuento": {
      "ID_descuento": 1,
      "tipo_descuento": "porcentaje",
      "tipo_normalizado": "porcentaje",
      "nombre_descuento": "10% de descuento",
      "descuento_valor": 10,
      "fecha_inicio": "2026-01-01",
      "fecha_final": "2026-12-31",
      "vigente": true
    }
  },
  "error": null
}
```

Si no existe responde `404`; si existe pero está fuera de fechas, `409`.

---

## 6. Ofertas

```bash
curl http://localhost:3000/ofertas
curl http://localhost:3000/ofertas/1

curl -X POST http://localhost:3000/ofertas \
  -H "Content-Type: application/json" \
  -d '{
    "ID_codigo_descuento": 1,
    "ID_categoria": 1,
    "titulo_oferta": "Semana de abarrotes",
    "descripcion_oferta": "Descuentos en toda la categoria",
    "descripcion_beneficio": "Hasta 15% menos",
    "imagen_oferta": "/img/banner-abarrotes.webp"
  }'

curl -X PUT http://localhost:3000/ofertas/2 \
  -H "Content-Type: application/json" \
  -d '{ "titulo_oferta": "Semana de abarrotes (ultimos dias)" }'

curl -X DELETE http://localhost:3000/ofertas/2
```

---

## 7. Órdenes (requieren token)

### Crear una orden

```bash
curl -X POST http://localhost:3000/ordenes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      { "ID_producto": 1, "cantidad": 2 },
      { "ID_producto": 2, "cantidad": 3 }
    ]
  }'
```

### Crear una orden con código de descuento

`texto_codigo` es opcional. Se valida contra la base y se aplica sobre los
renglones que le corresponden (el alcance por categoría se explica en el README):

```bash
curl -X POST http://localhost:3000/ordenes   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{
    "items": [ { "ID_producto": 1, "cantidad": 3 } ],
    "texto_codigo": "FRESCUERA"
  }'
```

La respuesta trae un bloque `codigo` con lo que se descontó:

```json
{
  "codigo": {
    "texto_codigo": "FRESCUERA",
    "etiqueta_codigo": "FRESCUERA",
    "ID_categoria": 1,
    "descuento_aplicado": 0.72,
    "detalle": "20% sobre 3.6"
  }
}
```

Si el código no existe responde `404`, y si no está vigente `409`; en ambos casos
se hace `rollback` y la orden no se crea.


Respuesta (`201`), con el precio congelado y el descuento aplicado:

```json
{
  "ok": true,
  "data": {
    "ID_orden": 1,
    "ID_cliente": 2,
    "fecha_orden": "2026-08-24 22:15:03",
    "total_orden": 95.30,
    "subtotal": 123.00,
    "descuento_total": 27.70,
    "productos": [
      {
        "ID_producto": 1,
        "nombre_producto": "Arroz 1kg",
        "cantidad_orden_producto": 2,
        "precio_orden_producto": 28.50,
        "subtotal": 57.00,
        "descuento_aplicado": 5.70,
        "total_renglon": 51.30,
        "descuento": { "tipo_normalizado": "porcentaje", "detalle": "10% sobre 2 unidad(es)", "vigente": true }
      },
      {
        "ID_producto": 2,
        "nombre_producto": "Refresco 2L",
        "cantidad_orden_producto": 3,
        "precio_orden_producto": 22.00,
        "subtotal": 66.00,
        "descuento_aplicado": 22.00,
        "total_renglon": 44.00,
        "descuento": { "tipo_normalizado": "NxM", "detalle": "3x2: pagas 2 de 3", "vigente": true }
      }
    ]
  },
  "error": null
}
```

### Sin stock suficiente → `409` y rollback

```bash
curl -X POST http://localhost:3000/ordenes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "items": [ { "ID_producto": 3, "cantidad": 9999 } ] }'
```

```json
{
  "ok": false,
  "data": null,
  "error": {
    "message": "Stock insuficiente de \"Jabon en barra\"",
    "details": { "ID_producto": 3, "solicitado": 9999, "disponible": 50 }
  }
}
```

No queda ninguna fila en `Ordenes` ni en `Maestra_orden_productos`, y el stock
no se toca.

### Producto inexistente → `404` y rollback

```bash
curl -X POST http://localhost:3000/ordenes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "items": [ { "ID_producto": 1, "cantidad": 1 }, { "ID_producto": 9999, "cantidad": 1 } ] }'
```

### Ver una orden con su detalle

```bash
curl http://localhost:3000/ordenes/1 -H "Authorization: Bearer $TOKEN"
```

### Órdenes de un cliente

```bash
curl http://localhost:3000/clientes/2/ordenes -H "Authorization: Bearer $TOKEN"
```

Si pides las órdenes de otro cliente, responde `403`.

---

## 8. Errores típicos

```bash
# Sin token -> 401
curl -X POST http://localhost:3000/ordenes \
  -H "Content-Type: application/json" -d '{ "items": [] }'

# Validación -> 422
curl -X POST http://localhost:3000/clientes/registro \
  -H "Content-Type: application/json" \
  -d '{ "nombre_cliente": "", "correo_cliente": "no-es-correo", "contrasena_cliente": "123" }'

# Ruta inexistente -> 404
curl http://localhost:3000/no-existe
```
