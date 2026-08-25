import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/** Corta la peticion con 422 si express-validator encontro errores. */
export function validate(req, _res, next) {
  const resultado = validationResult(req);
  if (resultado.isEmpty()) return next();

  const details = resultado.array().map((e) => ({
    campo: e.path ?? e.param,
    mensaje: e.msg,
    valor: e.value,
  }));
  return next(ApiError.unprocessable('Datos de entrada invalidos', details));
}
