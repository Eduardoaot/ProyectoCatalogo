/**
 * Envuelve un controlador async para que cualquier rechazo termine
 * en el manejador central de errores en lugar de colgar la peticion.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
