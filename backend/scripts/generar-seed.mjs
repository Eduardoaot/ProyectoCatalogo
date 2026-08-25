/**
 * Genera `sql/datos-rosamark.sql` a partir de los datos que el frontend
 * tenía quemados en `src/data/`.
 *
 *     npm run seed:sql
 *
 * El .sql resultante se importa tal cual en MySQL Workbench y deja la base
 * `tienda` con el catálogo real de Rosamark: 29 productos, sus categorías,
 * unidades, descuentos, códigos, ofertas y los clientes de demostración
 * (con la contraseña ya hasheada con bcrypt).
 *
 * Volver a correrlo después de editar `src/data/` regenera el .sql.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import bcrypt from 'bcrypt';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '..', '..');
const SALIDA = join(AQUI, '..', 'sql', 'datos-rosamark.sql');

const importarData = (archivo) =>
  import(pathToFileURL(join(RAIZ, 'src', 'data', archivo)).href);

const { CATEGORIAS, PRODUCTOS } = await importarData('productos.js');
const { OFERTAS } = await importarData('ofertas.js');
const { USUARIOS_SEED } = await importarData('usuarios.js');
const { CODIGOS_DESCUENTO } = await importarData('descuentos.js');

// Mismo valor que usaba TiendaProvider cuando el stock vivía en el navegador.
const STOCK_POR_DEFECTO = 30;
const SALT_ROUNDS = 10;

/**
 * Los códigos vienen de `src/data/descuentos.js`, ya descritos con la forma
 * que tienen en la base (tipo, valor, lleva/paga y la categoría que les da
 * alcance). Ese archivo es la única fuente: aquí solo se traduce a SQL.
 */
const CODIGOS = CODIGOS_DESCUENTO;

// --------------------------------------------------------------------
// Utilidades de escritura de SQL
// --------------------------------------------------------------------

/** Escapa una cadena para MySQL; null/undefined se vuelven NULL. */
function txt(valor) {
  if (valor === null || valor === undefined) return 'NULL';
  const escapado = String(valor)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    .replace(/\u0000/g, '');
  return `'${escapado}'`;
}

function num(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return 'NULL';
  return String(Number(valor));
}

function bloqueInsert(tabla, columnas, filas) {
  if (filas.length === 0) return `-- (sin datos para ${tabla})\n`;
  const valores = filas.map((fila) => `  (${fila.join(', ')})`).join(',\n');
  return `INSERT INTO ${tabla}\n  (${columnas.join(', ')})\nVALUES\n${valores};\n`;
}

function titulo(texto) {
  const linea = '-- ' + '='.repeat(60);
  return `${linea}\n--  ${texto}\n${linea}\n`;
}

// --------------------------------------------------------------------
// 1. Categorías y unidades
// --------------------------------------------------------------------

const idCategoria = new Map(CATEGORIAS.map((nombre, i) => [nombre, i + 1]));

// Las categorías que algún producto use pero no estén en CATEGORIAS también
// entran, si no el INSERT de Productos fallaría por la llave foránea.
for (const producto of PRODUCTOS) {
  if (!idCategoria.has(producto.categoria)) {
    idCategoria.set(producto.categoria, idCategoria.size + 1);
    console.warn(`Aviso: la categoría "${producto.categoria}" no está en CATEGORIAS; se agrega igual.`);
  }
}

const idUnidad = new Map();
for (const producto of PRODUCTOS) {
  if (!idUnidad.has(producto.unidad)) idUnidad.set(producto.unidad, idUnidad.size + 1);
}

// --------------------------------------------------------------------
// 2. Tipos de descuento
// --------------------------------------------------------------------

const TIPOS = ['porcentaje', 'monto_fijo', 'NxM'];
const idTipo = new Map(TIPOS.map((nombre, i) => [nombre, i + 1]));

// --------------------------------------------------------------------
// 3. Descuentos de producto (los que vienen de `precioOriginal`)
//
// En src/data un producto "en oferta" trae precioOriginal > precio. En la
// base eso se modela como un descuento de monto fijo: precio_producto guarda
// el precio de lista (precioOriginal) y el descuento resta la diferencia, de
// modo que la API devuelve exactamente el mismo precio final que antes.
// Los productos que comparten el mismo monto comparten la misma fila.
// --------------------------------------------------------------------

const descuentosValores = [];
const idDescuentoPorMonto = new Map();

for (const producto of PRODUCTOS) {
  const original = producto.precioOriginal;
  if (!(original > producto.precio)) continue;

  const monto = Number((original - producto.precio).toFixed(2));
  if (idDescuentoPorMonto.has(monto)) continue;

  const id = descuentosValores.length + 1;
  idDescuentoPorMonto.set(monto, id);
  descuentosValores.push({
    id,
    tipo: 'monto_fijo',
    nombre: `$${monto.toFixed(2)} de descuento`,
    valor: monto,
    lleva: null,
    paga: null,
  });
}

// --------------------------------------------------------------------
// 4. Descuentos de los códigos del carrito
// --------------------------------------------------------------------

const codigos = CODIGOS.map((codigo) => {
  const id = descuentosValores.length + 1;
  descuentosValores.push({
    id,
    tipo: codigo.tipo,
    nombre: codigo.descripcion,
    valor: codigo.valor,
    lleva: codigo.lleva ?? null,
    paga: codigo.paga ?? null,
  });
  return { ...codigo, ID_descuento: id, ID_descuento_codigo: CODIGOS.indexOf(codigo) + 1 };
});

const idCodigoPorTexto = new Map(codigos.map((c) => [c.texto, c]));

// --------------------------------------------------------------------
// 5. Clientes de demostración (contraseña hasheada de verdad)
// --------------------------------------------------------------------

const clientes = [];
for (const [i, usuario] of USUARIOS_SEED.entries()) {
  clientes.push({
    id: i + 1,
    nombre: usuario.nombre,
    correo: usuario.email.trim().toLowerCase(),
    hash: await bcrypt.hash(usuario.password, SALT_ROUNDS),
    passwordEnClaro: usuario.password,
  });
}

// --------------------------------------------------------------------
// 6. Armado del archivo
// --------------------------------------------------------------------

const partes = [];

partes.push(`-- =============================================================
--  DATOS DE ROSAMARK  (generado automáticamente)
--
--  NO EDITES ESTE ARCHIVO A MANO: se regenera con
--      cd backend && npm run seed:sql
--  a partir de src/data/ (productos.js, ofertas.js, usuarios.js).
--
--  Generado: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
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

TRUNCATE TABLE Favoritos;
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
`);

partes.push(titulo('Categorías'));
partes.push(
  bloqueInsert(
    'Categorias',
    ['ID_categoria', 'nombre_categoria'],
    [...idCategoria.entries()].map(([nombre, id]) => [num(id), txt(nombre)]),
  ),
);

partes.push(titulo('Unidades'));
partes.push(
  bloqueInsert(
    'Unidades',
    ['ID_unidad', 'nombre_unidad'],
    [...idUnidad.entries()].map(([nombre, id]) => [num(id), txt(nombre)]),
  ),
);

partes.push(titulo('Tipos de descuento'));
partes.push(
  bloqueInsert(
    'Descuentos_tipos',
    ['ID_descuento_tipo', 'tipo_descuento'],
    TIPOS.map((nombre) => [num(idTipo.get(nombre)), txt(nombre)]),
  ),
);

partes.push(titulo('Valores de descuento'));
partes.push(`-- Los primeros son los descuentos propios de cada producto
-- (equivalen al precioOriginal tachado del catálogo); los últimos son los
-- que respaldan los códigos del carrito. Sin fechas = siempre vigentes.
`);
partes.push(
  bloqueInsert(
    'Descuentos_valores',
    [
      'ID_descuento',
      'ID_descuento_tipo',
      'nombre_descuento',
      'descuento_valor',
      'cantidad_lleva',
      'cantidad_paga',
      'fecha_inicio',
      'fecha_final',
    ],
    descuentosValores.map((d) => [
      num(d.id),
      num(idTipo.get(d.tipo)),
      txt(d.nombre),
      num(d.valor),
      num(d.lleva),
      num(d.paga),
      'NULL',
      'NULL',
    ]),
  ),
);

partes.push(titulo('Códigos de descuento'));
partes.push(
  bloqueInsert(
    'Descuentos_codigo',
    ['ID_descuento_codigo', 'ID_descuento', 'texto_codigo', 'etiqueta_codigo', 'descripcion_codigo'],
    codigos.map((c) => [
      num(c.ID_descuento_codigo),
      num(c.ID_descuento),
      txt(c.texto),
      txt(c.etiqueta),
      txt(c.descripcion),
    ]),
  ),
);

partes.push(titulo(`Productos (${PRODUCTOS.length})`));
partes.push(`-- El ID_producto se conserva igual que el id de src/data/productos.js,
-- así las rutas /producto/:id que ya estaban compartidas siguen sirviendo.
`);
partes.push(
  bloqueInsert(
    'Productos',
    [
      'ID_producto',
      'ID_categoria',
      'ID_unidad',
      'ID_Descuento',
      'nombre_producto',
      'precio_producto',
      'imagen',
      'descripcion',
      'destacado',
      'cantidad_producto',
      'factor_pieza',
    ],
    PRODUCTOS.map((p) => {
      const tieneDescuento = p.precioOriginal > p.precio;
      const monto = tieneDescuento ? Number((p.precioOriginal - p.precio).toFixed(2)) : null;
      return [
        num(p.id),
        num(idCategoria.get(p.categoria)),
        num(idUnidad.get(p.unidad)),
        tieneDescuento ? num(idDescuentoPorMonto.get(monto)) : 'NULL',
        txt(p.nombre),
        // precio_producto guarda el precio de lista; el descuento hace el resto.
        num(tieneDescuento ? p.precioOriginal : p.precio),
        txt(p.emoji ?? null),
        txt(p.descripcion ?? null),
        p.destacado ? 'TRUE' : 'FALSE',
        num(p.stock ?? STOCK_POR_DEFECTO),
        num(1),
      ];
    }),
  ),
);

partes.push(titulo('Ofertas del carrusel'));
partes.push(`-- ID_categoria es lo que le da alcance al código: POST /ordenes lo lee
-- de aquí para saber que FRESCUERA solo aplica a frutas y verduras.
`);
partes.push(
  bloqueInsert(
    'Ofertas',
    [
      'ID_oferta',
      'ID_codigo_descuento',
      'ID_categoria',
      'titulo_oferta',
      'descripcion_oferta',
      'descripcion_beneficio',
      'imagen_oferta',
    ],
    OFERTAS.map((oferta) => {
      const codigo = oferta.codigo ? idCodigoPorTexto.get(oferta.codigo) : null;
      const categoria = codigo ? idCategoria.get(codigo.categoria) : null;
      return [
        num(oferta.id),
        codigo ? num(codigo.ID_descuento_codigo) : 'NULL',
        categoria ? num(categoria) : 'NULL',
        txt(oferta.titulo),
        txt(oferta.texto ?? null),
        txt(oferta.beneficio ?? null),
        txt(oferta.imagen ?? null),
      ];
    }),
  ),
);

partes.push(titulo('Clientes de demostración'));
partes.push(
  `-- Contraseñas hasheadas con bcrypt (${SALT_ROUNDS} rondas) al generar este archivo.
-- Para entrar a la app:
${clientes.map((c) => `--   ${c.correo}  /  ${c.passwordEnClaro}`).join('\n')}
`,
);
partes.push(
  bloqueInsert(
    'Clientes',
    ['ID_cliente', 'nombre_cliente', 'correo_cliente', 'contrasena_cliente'],
    clientes.map((c) => [num(c.id), txt(c.nombre), txt(c.correo), txt(c.hash)]),
  ),
);

partes.push(`
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
`);

mkdirSync(dirname(SALIDA), { recursive: true });
writeFileSync(SALIDA, partes.join('\n'), 'utf8');

console.log(`Generado: ${SALIDA}`);
console.log(
  `  ${idCategoria.size} categorías · ${idUnidad.size} unidades · ` +
    `${descuentosValores.length} descuentos · ${codigos.length} códigos · ` +
    `${PRODUCTOS.length} productos · ${OFERTAS.length} ofertas · ${clientes.length} clientes`,
);
