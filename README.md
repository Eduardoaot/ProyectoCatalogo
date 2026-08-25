# Rosamark

Catálogo de supermercado hecho con React + Vite. Incluye catálogo con filtros
y búsqueda, detalle de producto, carrito con stock y códigos de descuento,
sesión de usuario (login/registro) y órdenes.

Desde la v3.0 el repositorio incluye además una **API REST propia** en
[`backend/`](backend/) (Node.js + Express + MySQL). El frontend todavía **no la
consume**: sigue trabajando del lado del cliente con los datos de `src/data/` y
`localStorage`. Conectar ambos es el trabajo pendiente de la v3.0.

## Stack

- **React 19** + **Vite**
- **react-router-dom** para el ruteo
- **React Context** para el estado global (sesión y tienda), sin librerías externas
- CSS plano por componente (sin frameworks de estilos)

## Cómo correr el proyecto

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run lint       # eslint
npm run preview    # sirve el build de producción localmente
```

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
│   ├── AuthContext.js / AuthProvider.jsx     (sesión de usuario)
│   └── TiendaContext.js / TiendaProvider.jsx (carrito, órdenes, stock, descuentos)
│
├── data/                   ← "base de datos" hardcodeada del proyecto
│   ├── productos.js  (catálogo + categorías; los productos son constantes, no dinámicos)
│   ├── usuarios.js   (seed de cuentas de prueba para el login)
│   ├── ofertas.js    (slides del carrusel)
│   └── descuentos.js (códigos FRESCUERA / LLEVATEUNAVACA)
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

- **AuthProvider**: valida `iniciarSesion({email, password})` contra el seed
  de `usuarios.js` + los registrados (`registrarUsuario`); la sesión solo
  guarda el `id` del usuario en `localStorage`, nunca la contraseña en claro
  fuera de la lista de usuarios.
- **TiendaProvider**: carrito, órdenes y código de descuento se guardan **por
  usuario** (o bajo `"invitado"` si no hay sesión). El stock es global. Si un
  invitado agrega productos y luego inicia sesión o se registra, su carrito
  se **fusiona** con el del usuario en vez de perderse.

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
