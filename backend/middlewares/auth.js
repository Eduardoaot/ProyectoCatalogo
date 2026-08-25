import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Exige un JWT valido en `Authorization: Bearer <token>`.
 * Deja el cliente autenticado en `req.cliente`.
 */
export function auth(req, _res, next) {
  const cabecera = req.headers.authorization ?? '';
  const [esquema, token] = cabecera.split(' ');

  if (esquema !== 'Bearer' || !token) {
    return next(ApiError.unauthorized('Falta el encabezado Authorization: Bearer <token>'));
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.cliente = {
      ID_cliente: Number(payload.sub ?? payload.ID_cliente),
      correo_cliente: payload.correo_cliente,
      nombre_cliente: payload.nombre_cliente,
    };
    return next();
  } catch (error) {
    const mensaje =
      error.name === 'TokenExpiredError' ? 'El token expiro' : 'Token invalido';
    return next(ApiError.unauthorized(mensaje));
  }
}

/** Solo el dueño del recurso puede verlo (compara :id con el token). */
export function mismoCliente(param = 'id') {
  return (req, _res, next) => {
    const solicitado = Number(req.params[param]);
    if (!req.cliente || req.cliente.ID_cliente !== solicitado) {
      return next(ApiError.forbidden('Solo puedes consultar tu propia informacion'));
    }
    return next();
  };
}
