// Mapper for environment variables
import { config } from 'dotenv';
import { existsSync } from 'fs';

if (existsSync('.env')) {
  config();
  const {
    NODE_ENV, PORT,
    DB_DIR, DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_USER_PASSWORD,
    CORS_URL,
    ACCESS_TOKEN_VALIDITY_SEC, REFRESH_TOKEN_VALIDITY_SEC, TOKEN_ISSUER, TOKEN_AUDIENCE, TOKEN_SECRET,
    LOG_DIR,
  } = process.env;
  if (!PORT || !DB_DIR || !DB_NAME || !DB_HOST || !DB_USER || !DB_USER_PASSWORD || !TOKEN_SECRET) {
    throw new Error('Please, provide all environment variables');
  }
} else {
  throw new Error('Please, provide environment variables to .env');
}

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const dbDir = process.env.DB_DIR;
export const getDbConfig = () => ({
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_USER_PASSWORD || '',
});
export const corsUrl = process.env.CORS_URL;
export const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0', 10),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0', 10),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
};
export const logDirectory = process.env.LOG_DIR;

export enum USER_COMPANY_ROLE {
  companyAdmin = 'companyAdmin',
  worker = 'worker'
}
