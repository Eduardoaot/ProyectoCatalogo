import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { enviarCreado, enviarOk } from '../utils/respuesta.js';

/** El hash nunca sale de la base: se arma siempre el objeto publico. */
function clientePublico(fila) {
  return {
    ID_cliente: fila.ID_cliente,
    nombre_cliente: fila.nombre_cliente,
    correo_cliente: fila.correo_cliente,
    created_at: fila.created_at,
  };
}

function firmarToken(cliente) {
  return jwt.sign(
    {
      sub: cliente.ID_cliente,
      ID_cliente: cliente.ID_cliente,
      correo_cliente: cliente.correo_cliente,
      nombre_cliente: cliente.nombre_cliente,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn },
  );
}

/** POST /clientes/registro */
export const registrar = asyncHandler(async (req, res) => {
  const nombre = String(req.body.nombre_cliente).trim();
  const correo = String(req.body.correo_cliente).trim().toLowerCase();

  const [existentes] = await pool.execute(
    'SELECT ID_cliente FROM Clientes WHERE correo_cliente = ?',
    [correo],
  );
  if (existentes.length > 0) {
    throw ApiError.conflict('Ese correo ya esta registrado');
  }

  const hash = await bcrypt.hash(req.body.contrasena_cliente, env.bcryptSaltRounds);
  const [resultado] = await pool.execute(
    `INSERT INTO Clientes (nombre_cliente, correo_cliente, contrasena_cliente)
     VALUES (?, ?, ?)`,
    [nombre, correo, hash],
  );

  const [filas] = await pool.execute(
    'SELECT ID_cliente, nombre_cliente, correo_cliente, created_at FROM Clientes WHERE ID_cliente = ?',
    [resultado.insertId],
  );
  const cliente = clientePublico(filas[0]);

  return enviarCreado(res, { cliente, token: firmarToken(cliente) });
});

/** POST /clientes/login */
export const login = asyncHandler(async (req, res) => {
  const correo = String(req.body.correo_cliente).trim().toLowerCase();

  const [filas] = await pool.execute(
    `SELECT ID_cliente, nombre_cliente, correo_cliente, contrasena_cliente, created_at
       FROM Clientes WHERE correo_cliente = ?`,
    [correo],
  );

  // Mismo mensaje si el correo no existe o la contrasena no coincide:
  // asi no se revela que correos estan registrados.
  const generico = ApiError.unauthorized('Correo o contrasena incorrectos');
  if (filas.length === 0) throw generico;

  const coincide = await bcrypt.compare(
    req.body.contrasena_cliente,
    filas[0].contrasena_cliente,
  );
  if (!coincide) throw generico;

  const cliente = clientePublico(filas[0]);
  return enviarOk(res, { cliente, token: firmarToken(cliente) });
});

/**
 * PUT /clientes/me/contrasena  { contrasena_actual, contrasena_nueva }
 *
 * Exige la contraseña actual aunque ya haya token: si alguien deja la sesión
 * abierta, que no pueda cambiarla sin conocerla.
 */
export const cambiarContrasena = asyncHandler(async (req, res) => {
  const [filas] = await pool.execute(
    'SELECT contrasena_cliente FROM Clientes WHERE ID_cliente = ?',
    [req.cliente.ID_cliente],
  );
  if (filas.length === 0) throw ApiError.notFound('Cliente no encontrado');

  const coincide = await bcrypt.compare(req.body.contrasena_actual, filas[0].contrasena_cliente);
  if (!coincide) throw ApiError.unauthorized('La contraseña actual no es correcta');

  const esLaMisma = await bcrypt.compare(req.body.contrasena_nueva, filas[0].contrasena_cliente);
  if (esLaMisma) {
    throw ApiError.badRequest('La contraseña nueva debe ser distinta de la actual');
  }

  const hash = await bcrypt.hash(req.body.contrasena_nueva, env.bcryptSaltRounds);
  await pool.execute('UPDATE Clientes SET contrasena_cliente = ? WHERE ID_cliente = ?', [
    hash,
    req.cliente.ID_cliente,
  ]);

  return enviarOk(res, { actualizada: true });
});

/** GET /clientes/me (requiere token) */
export const perfil = asyncHandler(async (req, res) => {
  const [filas] = await pool.execute(
    'SELECT ID_cliente, nombre_cliente, correo_cliente, created_at FROM Clientes WHERE ID_cliente = ?',
    [req.cliente.ID_cliente],
  );
  if (filas.length === 0) throw ApiError.notFound('Cliente no encontrado');
  return enviarOk(res, clientePublico(filas[0]));
});
