import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { enviarError } from '../utils/respuesta.js';

/** Traduce los errores de MySQL a codigos HTTP con mensaje util. */
function traducirErrorMysql(error) {
  switch (error.code) {
    case 'ER_DUP_ENTRY':
      return new ApiError(409, 'Ya existe un registro con ese valor unico', error.sqlMessage);
    case 'ER_NO_REFERENCED_ROW':
    case 'ER_NO_REFERENCED_ROW_2':
      return new ApiError(400, 'Alguna referencia (ID) no existe en su tabla origen', error.sqlMessage);
    case 'ER_ROW_IS_REFERENCED':
    case 'ER_ROW_IS_REFERENCED_2':
      return new ApiError(409, 'No se puede eliminar: el registro esta en uso por otras tablas', error.sqlMessage);
    case 'ER_DATA_TOO_LONG':
    case 'ER_TRUNCATED_WRONG_VALUE':
    case 'ER_WARN_DATA_OUT_OF_RANGE':
    case 'WARN_DATA_TRUNCATED':
      return new ApiError(400, 'Algun valor no cabe o no tiene el formato de la columna', error.sqlMessage);
    case 'ER_BAD_FIELD_ERROR':
    case 'ER_NO_SUCH_TABLE':
      return new ApiError(500, 'La base de datos no coincide con el esquema esperado', error.sqlMessage);
    case 'ER_ACCESS_DENIED_ERROR':
    case 'ER_BAD_DB_ERROR':
    case 'ECONNREFUSED':
    case 'PROTOCOL_CONNECTION_LOST':
      return new ApiError(503, 'No hay conexion con la base de datos', error.sqlMessage ?? error.message);
    default:
      return null;
  }
}

// Express identifica el manejador de errores por sus 4 parametros.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _req, res, _next) {
  let err = error;

  if (!(err instanceof ApiError)) {
    if (err?.type === 'entity.parse.failed') {
      err = ApiError.badRequest('El cuerpo de la peticion no es un JSON valido');
    } else {
      err = traducirErrorMysql(error) ?? err;
    }
  }

  if (err instanceof ApiError) {
    if (err.status >= 500) console.error(error);
    return enviarError(res, err.status, err.message, err.details);
  }

  console.error(error);
  return enviarError(
    res,
    500,
    'Error interno del servidor',
    env.nodeEnv === 'production' ? null : error.message,
  );
}
