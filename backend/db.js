import mysql from 'mysql2/promise';
import { env } from './config/env.js';

/**
 * Pool de conexiones compartido por toda la aplicacion.
 * - decimalNumbers: DECIMAL llega como number y no como string.
 * - dateStrings: DATE/DATETIME llegan como texto listo para JSON.
 */
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: env.db.connectionLimit,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  decimalNumbers: true,
  dateStrings: true,
  timezone: 'local',
});

/** Verifica al arranque que las credenciales del .env son correctas. */
export async function probarConexion() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

/**
 * Ejecuta `fn(conn)` dentro de una transaccion.
 * Hace commit si termina bien y rollback ante cualquier error.
 */
export async function conTransaccion(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const resultado = await fn(conn);
    await conn.commit();
    return resultado;
  } catch (error) {
    // Si el rollback tambien falla, se conserva el error original.
    try {
      await conn.rollback();
    } catch (errorRollback) {
      console.error('Fallo el rollback:', errorRollback.message);
    }
    throw error;
  } finally {
    conn.release();
  }
}

export async function cerrarPool() {
  await pool.end();
}
