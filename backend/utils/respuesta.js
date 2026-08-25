/** Respuestas JSON consistentes: { ok, data, error }. */

export function enviarOk(res, data, status = 200) {
  return res.status(status).json({ ok: true, data, error: null });
}

export function enviarCreado(res, data) {
  return enviarOk(res, data, 201);
}

export function enviarError(res, status, message, details = null) {
  return res.status(status).json({
    ok: false,
    data: null,
    error: details ? { message, details } : { message },
  });
}
