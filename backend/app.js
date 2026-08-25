import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import rutas from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

// CORS_ORIGIN admite "*" o una lista separada por comas.
const origenes = env.corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);
const esLocal = (origen) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origen);

app.use(
  cors({
    origin(origen, callback) {
      // Peticiones sin Origin (curl, Postman, el propio servidor) pasan.
      if (!origen) return callback(null, true);
      if (origenes.includes('*') || origenes.includes(origen)) return callback(null, true);
      // En desarrollo, cualquier puerto de localhost: Vite cambia de puerto
      // solo si el 5173 esta ocupado, y no vale la pena romper la app por eso.
      if (env.nodeEnv !== 'production' && esLocal(origen)) return callback(null, true);
      return callback(new Error(`Origen no permitido por CORS: ${origen}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, data: { estado: 'arriba', entorno: env.nodeEnv }, error: null });
});

// Las rutas responden con y sin el prefijo /api:
// POST /ordenes y POST /api/ordenes son equivalentes.
app.use(['/api', '/'], rutas);

app.use(notFound);
app.use(errorHandler);

export default app;
