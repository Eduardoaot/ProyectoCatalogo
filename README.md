# Rosamark

Catálogo de supermercado hecho con React + Vite. Incluye catálogo con filtros
y búsqueda, detalle de producto, carrito con stock y códigos de descuento,
sesión de usuario (login/registro) y órdenes.

Desde la v3.0 la app funciona contra una **API REST propia** en
[`backend/`](backend/) (Node.js + Express + MySQL): el catálogo, las categorías,
las ofertas, los códigos de descuento, las cuentas y las órdenes salen de la base
de datos. Ya no hay datos quemados en pantalla.

## Stack

- **React 19** + **Vite**
- **react-router-dom** para el ruteo
- **React Context** para el estado global (sesión y tienda), sin librerías externas
- CSS plano por componente (sin frameworks de estilos)

## Cómo correr el proyecto

Hacen falta **dos cosas corriendo**: la API (con MySQL detrás) y el frontend.

**1. La base de datos y la API** — instrucciones completas en
[`backend/README.md`](backend/README.md):

```bash
cd backend
npm install
cp .env.example .env               # y pon tu password de MySQL y un JWT_SECRET
mysql -u root -p < sql/tienda.sql          # crea el esquema
mysql -u root -p < sql/datos-rosamark.sql  # carga el catálogo de Rosamark
npm run dev                        # queda en http://localhost:3000
```

**2. El frontend**, en otra terminal y desde la raíz:

```bash
npm install
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # build de producción
npm run lint      # eslint
npm run preview   # sirve el build de producción localmente
```

Si la API no está en `http://localhost:3000`, copia `.env.example` a `.env` en la
raíz y cambia `VITE_API_URL`. Sin la API arriba, el catálogo muestra un aviso con
un botón de reintentar en vez de productos.

Para entrar puedes usar `diana@rosamark.com` / `rosamark123`, o registrar una
cuenta nueva desde la pestaña "Registrarse".

## Estructura de carpetas

```
src/
├── main.jsx              # punto de entrada: <App/> envuelto en BrowserRouter + AuthProvider + TiendaProvider
├── App.jsx / App.css      # layout general y las rutas (<Routes>)
├── index.css              # variables de la paleta (colores, fuentes) y estilos base globales
│
├── modulos/                       ← una carpeta por PÁGINA/ruta
│   ├── Home/                      → "/"  (el catálogo)
│   │   ├── Home.jsx / .css
│   │   └── componentes/           ← piezas que SOLO usa Home
│   │       ├── Carousel.jsx / .css      (carrusel de ofertas)
│   │       └── ProductCard.jsx / .css   (cada tarjeta de producto)
│   ├── ProductoDetalle/           → "/producto/:id"
│   ├── Login/                     → "/login"
│   ├── Cuenta/                    → "/cuenta"
│   ├── Ordenes/                   → "/ordenes"
│   └── Carrito/                   → "/carrito"
│
├── layout/                ← el "chrome" fijo de la app, no pertenece a ninguna ruta
│   ├── Navbar.jsx / .css          (barra de arriba, se oculta al bajar el scroll)
│   ├── MenuLateral.jsx / .css     (drawer del ☰)
│   ├── PanelCarrito.jsx / .css    (panel lateral derecho al agregar algo al carrito)
│   ├── Footer.jsx / .css
│   ├── SplashScreen.jsx / .css    (pantalla de bienvenida al cargar)
│   └── SparkleBackground.jsx / .css (destellos animados de fondo)
│
├── common/                 ← piezas reutilizadas por VARIOS módulos (o por layout/)
│   ├── ImagenProducto.jsx / .css  (detecta si el producto trae emoji o URL de imagen)
│   ├── ModalConfirmacion.jsx / .css (modal genérico de "¿seguro?", vía portal a document.body)
│   └── iconos.jsx                 (todos los íconos SVG: menú, carrito, usuario, etc.)
│
├── context/                ← estado global (React Context)
│   ├── AuthContext.js / AuthProvider.jsx         (sesión: login contra la API + JWT)
│   ├── CatalogoContext.js / CatalogoProvider.jsx (catálogo traído de la API)
│   └── TiendaContext.js / TiendaProvider.jsx     (carrito, órdenes, códigos)
│
├── api/                    ← todo lo que habla con el backend
│   ├── cliente.js    (fetch + token + desenvuelve { ok, data, error })
│   ├── catalogo.js   (productos, categorías, ofertas, códigos)
│   ├── auth.js       (registro, login, perfil)
│   └── ordenes.js    (crear y leer órdenes)
│
├── data/                   ← YA NO la usa la app: es la fuente del seed SQL
│   ├── productos.js  (catálogo + categorías)
│   ├── usuarios.js   (cuentas de prueba)
│   ├── ofertas.js    (slides del carrusel)
│   └── descuentos.js (códigos FRESCUERA / LLEVATEUNAVACA)
│
│   Estos archivos ya no se importan desde ningún componente. Siguen aquí
│   porque `backend/npm run seed:sql` los lee para generar el .sql que se
│   importa en MySQL. Para cambiar el catálogo: edítalos, regenera el .sql
│   e impórtalo — o edita los datos directamente en la base.
│
└── assets/
    └── RosaLogo.webp
```

### ¿Dónde va un archivo nuevo?

| Si el componente... | va en... |
|---|---|
| solo lo usa una página | `modulos/<Pagina>/componentes/` |
| es una página completa (tiene su propia ruta) | `modulos/<NuevaPagina>/` |
| lo usan 2+ módulos, o es un widget genérico (ícono, modal) | `common/` |
| es parte del "esqueleto" que se ve en *todas* las páginas (nav, footer, drawers) | `layout/` |
| es un dato fijo (catálogo, usuarios de prueba, textos) | `data/` |
| es estado que varias partes de la app necesitan leer/modificar | `context/` |

El patrón `Xyz.js` (sin JSX) + `XyzProvider.jsx` dentro de `context/` es para que
React Fast Refresh no se queje: el `.js` exporta el `Context` y el hook
(`useAuth`, `useTienda`), el `.jsx` tiene el componente `Provider` con la
lógica y el estado.

## Sesión, carrito y stock (resumen rápido)

- **AuthProvider**: `iniciarSesion` y `registrarUsuario` pegan a
  `/clientes/login` y `/clientes/registro`. La contraseña se hashea con bcrypt
  **en el servidor** y nunca se guarda en el navegador; lo único que se guarda
  es el JWT. Al recargar la página, la sesión se recupera pidiendo
  `/clientes/me` con ese token.
- **CatalogoProvider**: pide productos, categorías, ofertas y códigos una vez al
  arrancar. Después de generar una orden vuelve a leerlos, para que el stock en
  pantalla refleje lo que el backend acaba de descontar.
- **TiendaProvider**: el carrito sigue en `localStorage` **por usuario** (o bajo
  `"invitado"`) porque el esquema de la base no tiene tabla de carritos; si un
  invitado agrega productos y luego inicia sesión, su carrito se **fusiona** con
  el del usuario. El stock, los precios, los descuentos y las órdenes ya no
  viven aquí: vienen de la API.
- **El total de la orden lo calcula siempre el servidor**, dentro de una
  transacción que valida stock, congela precios y aplica los descuentos. Lo que
  se ve en el carrito antes de confirmar es solo una vista previa.

## Backend (API REST)

La API vive en [`backend/`](backend/), con su propio `package.json`, y habla con
una base MySQL llamada `tienda`.

```bash
cd backend
npm install
cp .env.example .env      # y edita tus credenciales de MySQL y el JWT_SECRET
mysql -u root -p < sql/tienda.sql
npm run dev               # queda en http://localhost:3000
```

Qué expone:

- CRUD de `Categorias`, `Unidades`, `Productos`, `Descuentos_tipos`,
  `Descuentos_valores`, `Descuentos_codigo` y `Ofertas`.
- Productos con filtros por categoría, destacado y búsqueda por nombre, ya con
  el JOIN a categoría, unidad y descuento aplicable.
- Registro y login de clientes con bcrypt + JWT.
- `POST /ordenes` dentro de una transacción: valida stock, congela el precio en
  `precio_orden_producto`, aplica el descuento vigente y descuenta existencias.
- `POST /descuentos/validar-codigo` para los códigos que teclea el cliente.

Documentación completa, ejemplos de curl y colección de Postman en
[`backend/README.md`](backend/README.md).

## Ramas

- `main` — versión estable.
- `develop/Version2.0` — integración de la v2 (usuarios, carrito, checkout).
- `feature/Usuarios/Avance` — desarrollo de la v2.
- `develop/Version3.0` — integración de la v3, parte de `develop/Version2.0`.
- `feature/integracionDataBase` — API REST con MySQL (backend de la v3).
