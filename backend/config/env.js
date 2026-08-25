import 'dotenv/config';

function requerido(nombre, porDefecto) {
  const valor = process.env[nombre] ?? porDefecto;
  if (valor === undefined || valor === '') {
    throw new Error(
      `Falta la variable de entorno ${nombre}. Copia .env.example a .env y completala.`,
    );
  }
  return valor;
}

function numero(nombre, porDefecto) {
  const valor = Number(process.env[nombre] ?? porDefecto);
  if (!Number.isFinite(valor)) {
    throw new Error(`La variable de entorno ${nombre} debe ser numerica.`);
  }
  return valor;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: numero('PORT', 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  db: {
    host: requerido('DB_HOST', 'localhost'),
    port: numero('DB_PORT', 3306),
    user: requerido('DB_USER', 'root'),
    password: process.env.DB_PASSWORD ?? '',
    database: requerido('DB_NAME', 'tienda'),
    connectionLimit: numero('DB_CONNECTION_LIMIT', 10),
  },
  jwt: {
    secret: requerido('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
  },
  bcryptSaltRounds: numero('BCRYPT_SALT_ROUNDS', 10),
};
