# Rosamark API — e-commerce con Node.js + Express + MySQL

API REST para el catálogo Rosamark. Cubre el catálogo (categorías, unidades,
productos, descuentos y ofertas), el registro/login de clientes con JWT y el
alta de órdenes dentro de una transacción que congela precios y descuenta stock.

---

## 1. Requisitos

- **Node.js 18 o superior** (probado con Node 24).
- **MySQL 8.x** corriendo en local o remoto.
- npm.

## 2. Instalación

```bash
cd backend
npm install
```

## 3. Configurar el `.env`

Copia la plantilla y edita los valores:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux / Git Bash
cp .env.example .env
```

| Variable | Para qué sirve | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto donde escucha la API | `3000` |
| `NODE_ENV` | `development` o `production` | `development` |
| `CORS_ORIGIN` | Orígenes permitidos, separados por coma (`*` = todos) | `http://localhost:5173` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `mi_password` |
| `DB_NAME` | Base de datos | `tienda` |
| `DB_CONNECTION_LIMIT` | Conexiones máximas del pool | `10` |
| `JWT_SECRET` | Clave para firmar los tokens (**cámbiala**) | cadena larga y aleatoria |
| `JWT_EXPIRES_IN` | Vigencia del token | `2h` |
| `BCRYPT_SALT_ROUNDS` | Coste del hash de contraseñas | `10` |

> El `.env` está en `.gitignore`: nunca lo subas al repositorio.

## 4. Importar la base de datos

El archivo [`sql/tienda.sql`](sql/tienda.sql) crea la base `tienda` con sus
tablas y datos de ejemplo.

```bash
# Desde la carpeta backend
mysql -u root -p < sql/tienda.sql
```

Si prefieres MySQL Workbench: *Server → Data Import → Import from Self-Contained
File* y elige `sql/tienda.sql`.

> **Ojo:** el script empieza con `DROP DATABASE IF EXISTS tienda;`. Si ya tienes
> datos, borra esa línea antes de importar.

### Cargar el catálogo real de Rosamark

`sql/tienda.sql` solo deja tres productos de ejemplo. Para llenar la base con el
catálogo completo (los 29 productos que el frontend tenía en `src/data/`),
importa después [`sql/datos-rosamark.sql`](sql/datos-rosamark.sql):

```bash
mysql -u root -p < sql/datos-rosamark.sql
```

O en Workbench, el mismo *Import from Self-Contained File*.

Ese archivo **se genera**, no se escribe a mano. Si editas `src/data/`, vuelve a
generarlo:

```bash
npm run seed:sql
```

El generador ([`scripts/generar-seed.mjs`](scripts/generar-seed.mjs)) lee
`src/data/productos.js`, `ofertas.js` y `usuarios.js`, deduce categorías y
unidades, traduce los `precioOriginal` a descuentos de monto fijo, y hashea con
bcrypt las contraseñas de los usuarios de prueba. Los `ID_producto` se conservan
iguales a los `id` que tenían en `src/data`.

> El seed **vacía las tablas** antes de insertar, órdenes y clientes incluidos.
> Es un seed de desarrollo.

Usuarios que quedan listos para entrar:

| Correo | Contraseña |
| --- | --- |
| `diana@rosamark.com` | `rosamark123` |
| `eduardo@rosamark.com` | `rosamark123` |
| `demo@rosamark.com` | `demo1234` |

> El cliente `demo@correo.com` que trae `sql/tienda.sql` tiene un hash falso a
> propósito y **no puede iniciar sesión**; el seed de Rosamark lo reemplaza.

## 5. Levantar el servidor

```bash
npm run dev     # con nodemon, se reinicia al guardar
npm start       # modo normal
```

Al arrancar verifica la conexión con MySQL y falla rápido si el `.env` está mal:

```
Conectado a MySQL: localhost:3306/tienda
API escuchando en http://localhost:3000 (development)
```

Prueba rápida: `http://localhost:3000/health`

---

## 6. Estructura del proyecto

```
backend/
├── app.js                  # Express: CORS, JSON, rutas, manejo de errores
├── server.js               # Arranque, ping a MySQL y apagado ordenado
├── db.js                   # Pool mysql2/promise + helper de transacciones
├── config/env.js           # Lectura y validación de variables de entorno
├── routes/                 # Definición de rutas + validaciones
├── controllers/            # Lógica de cada recurso
├── middlewares/            # auth (JWT), validate, notFound, errorHandler
├── utils/                  # Errores, respuestas, reglas de descuento, CRUD genérico
├── scripts/generar-seed.mjs   # Convierte src/data/ en SQL (npm run seed:sql)
├── sql/tienda.sql             # Esquema + datos de ejemplo
├── sql/datos-rosamark.sql     # Catálogo real (generado)
└── docs/                      # Ejemplos curl y colección de Postman
```

## 7. Formato de respuesta

Todas las respuestas usan la misma envoltura:

```jsonc
// Éxito
{ "ok": true, "data": { }, "error": null }

// Error
{ "ok": false, "data": null, "error": { "message": "...", "details": [ ] } }
```

Códigos usados: `200` OK · `201` creado · `400` petición mal formada ·
`401` sin token o credenciales malas · `403` recurso de otro cliente ·
`404` no existe · `409` conflicto (duplicado, sin stock, en uso) ·
`422` validación · `503` sin conexión a MySQL.

## 8. Endpoints

Todas las rutas responden **con y sin** el prefijo `/api`:
`POST /ordenes` y `POST /api/ordenes` son equivalentes.

### Catálogo (públicos)

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET/POST | `/categorias` | Listar y crear categorías |
| GET/PUT/DELETE | `/categorias/:id` | Detalle, editar y borrar |
| GET/POST | `/unidades` | Listar y crear unidades |
| GET/PUT/DELETE | `/unidades/:id` | Detalle, editar y borrar |
| GET | `/productos` | Listado con filtros (ver abajo) |
| GET | `/productos/:id` | Detalle con categoría, unidad y descuento |
| POST | `/productos` | Crear producto |
| PUT / PATCH | `/productos/:id` | Editar producto (campos parciales) |
| DELETE | `/productos/:id` | Borrar producto |
| GET/POST | `/ofertas` | Listar y crear ofertas |
| GET/PUT/DELETE | `/ofertas/:id` | Detalle, editar y borrar |

**Filtros de `/productos`:**

| Parámetro | Ejemplo | Qué hace |
| --- | --- | --- |
| `ID_categoria` o `categoria` | `?categoria=2` | Filtra por categoría |
| `destacado` | `?destacado=true` | Solo destacados (o `false`) |
| `q` o `nombre` | `?q=arroz` | Busca por nombre (LIKE) |
| `con_descuento` | `?con_descuento=true` | Con o sin descuento asignado |
| `limit` / `offset` | `?limit=20&offset=40` | Paginación (máx. 200) |

Cada producto llega con `categoria`, `unidad`, `descuento` (incluye `vigente`) y
`precio_con_descuento` ya calculado para una unidad.

### Descuentos (públicos)

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET/POST | `/descuentos/tipos` | Tabla `Descuentos_tipos` |
| GET/PUT/DELETE | `/descuentos/tipos/:id` | |
| GET/POST | `/descuentos/valores` | Tabla `Descuentos_valores` |
| GET/PUT/DELETE | `/descuentos/valores/:id` | |
| GET/POST | `/descuentos/codigos` | Tabla `Descuentos_codigo` |
| GET/PUT/DELETE | `/descuentos/codigos/:id` | |
| POST | `/descuentos/validar-codigo` | Valida un `texto_codigo` y su vigencia |

### Clientes y órdenes

| Método | Ruta | Token | Descripción |
| --- | --- | --- | --- |
| POST | `/clientes/registro` | no | Alta con contraseña hasheada (bcrypt) |
| POST | `/clientes/login` | no | Devuelve `{ cliente, token }` |
| GET | `/clientes/me` | sí | Perfil del token |
| GET | `/clientes/:id/ordenes` | sí | Órdenes del cliente (solo las propias) |
| POST | `/ordenes` | sí | Crea la orden dentro de una transacción (acepta `texto_codigo`) |
| GET | `/ordenes/:id` | sí | Orden con su detalle (solo las propias) |

El token se manda en el encabezado:

```
Authorization: Bearer <token>
```

---

## 9. Cómo se aplican los descuentos

Un descuento se lee de `Descuentos_valores` + `Descuentos_tipos` y solo cuenta si
la fecha de hoy cae entre `fecha_inicio` y `fecha_final` (una fecha nula = sin
límite por ese extremo).

El texto de `tipo_descuento` se interpreta sin distinguir mayúsculas ni acentos:

| Tipo | Se reconoce por | Cálculo |
| --- | --- | --- |
| Porcentaje | contiene `porcent` | `precio × cantidad × (1 − valor/100)` |
| Monto fijo | contiene `monto` o `fijo` | se restan `valor` pesos **por unidad**, sin bajar de 0 |
| NxM | contiene `nxm` o algo como `3x2` | `grupos = floor(cantidad / lleva)`; se pagan `grupos × paga + resto` unidades |

Para NxM se usan `cantidad_lleva` / `cantidad_paga`; si vienen nulas, los números
se leen del propio texto del tipo (`"3x2"` → lleva 3, paga 2). Si la cantidad no
alcanza para un grupo completo, no hay descuento.

## 10. Detalles de la creación de órdenes

`POST /ordenes` corre completo dentro de `beginTransaction` / `commit` /
`rollback`. Paso a paso:

1. Se juntan los renglones repetidos del carrito y se ordenan por `ID_producto`
   (bloquear siempre en el mismo orden evita interbloqueos entre dos compras
   simultáneas).
2. Cada producto se lee con `SELECT ... FOR UPDATE`: la fila queda bloqueada
   hasta el commit, así dos compras no pueden vender el mismo stock.
3. Si el producto no existe → `404`; si el stock no alcanza → `409`, y en ambos
   casos se hace `rollback`.
4. Se toma el `precio_producto` actual y se guarda en `precio_orden_producto`:
   **el precio queda congelado** aunque después cambie la lista.
5. Se aplica el descuento vigente del producto para calcular el importe.
6. Se inserta la cabecera en `Ordenes`, los renglones en
   `Maestra_orden_productos`, se descuenta el stock con
   `WHERE cantidad_producto >= ?` (última red contra stock negativo) y se
   actualiza `total_orden`.

### Códigos de descuento en la orden

`POST /ordenes` acepta un `texto_codigo` opcional. El código se valida contra la
base (que exista y esté vigente) y se aplica **después** de los descuentos
propios de cada producto.

El alcance del código sale de la tabla `Ofertas`: si una oferta enlaza ese código
con una categoría, solo cuentan los renglones de esa categoría. Así es como
`FRESCUERA` descuenta 20% únicamente en frutas y verduras y `LLEVATEUNAVACA`
aplica el 2x1 solo a lácteos. Si ninguna oferta lo limita, aplica a toda la orden.

El importe **siempre lo calcula el servidor**: lo que mande el navegador no
influye en el total. El frontend hace la misma cuenta solo para mostrar el
desglose antes de confirmar.

**Sobre el total:** `precio_orden_producto` guarda el precio de lista congelado,
sin descuento, porque el esquema no tiene una columna para el descuento del
renglón. `total_orden` sí lleva los descuentos aplicados. Por eso las respuestas
incluyen `subtotal` (suma de `cantidad × precio`) y `descuento_total`
(`subtotal − total_orden`), que es lo que se ahorró el cliente.

## 11. Seguridad

- Las contraseñas se guardan **solo** como hash bcrypt y nunca se devuelven en
  ninguna respuesta.
- Login responde el mismo mensaje si el correo no existe o si la contraseña es
  incorrecta, para no revelar qué correos están registrados.
- El `ID_cliente` de una orden sale **del token**, nunca del cuerpo de la
  petición: un cliente no puede comprar a nombre de otro.
- `GET /ordenes/:id` y `GET /clientes/:id/ordenes` devuelven `403` si el recurso
  es de otro cliente.
- Todas las consultas usan parámetros preparados (`?`), nunca concatenación de
  valores del usuario.

## 12. Probar los endpoints

- [`docs/ejemplos-curl.md`](docs/ejemplos-curl.md) — un `curl` por endpoint.
- [`docs/rosamark.postman_collection.json`](docs/rosamark.postman_collection.json) —
  colección lista para importar en Postman. El login guarda el token en la
  variable `token` de la colección, así que las rutas protegidas funcionan solas.
