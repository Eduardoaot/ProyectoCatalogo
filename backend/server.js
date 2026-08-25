import { app } from './app.js';
import { env } from './config/env.js';
import { cerrarPool, probarConexion } from './db.js';

async function iniciar() {
  try {
    await probarConexion();
    console.log(`Conectado a MySQL: ${env.db.host}:${env.db.port}/${env.db.database}`);
  } catch (error) {
    console.error('No se pudo conectar a MySQL. Revisa las variables del .env');
    console.error(error.message);
    process.exit(1);
  }

  const servidor = app.listen(env.port, () => {
    console.log(`API escuchando en http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const apagar = async (senal) => {
    console.log(`\n${senal} recibido, cerrando servidor...`);
    servidor.close(async () => {
      await cerrarPool();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => apagar('SIGINT'));
  process.on('SIGTERM', () => apagar('SIGTERM'));
}

iniciar();
