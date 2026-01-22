import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export const config = {
  server: {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    corsOrigin: process.env.CORS_ORIGIN,
  },

  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DB_NAME,
  },

  security: {
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    passResetSecret: process.env.JWT_PASS_RESET_SECRET,

    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    passResetExpiresIn: process.env.JWT_PASS_RESET_EXPIRES_IN,
  },

  smtp: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASS,
  },
};
