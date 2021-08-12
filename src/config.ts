// Mapper for environment variables
import { config } from 'dotenv';

config();
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const dbDir = process.env.DB_DIR;
export const dbConfig = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_USER_PWD || '',
};
export const corsUrl = process.env.CORS_URL;
export const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0', 10),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0', 10),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
};
export const logDirectory = process.env.LOG_DIR;
const offersArr: string[] = JSON.parse(process.env.OFFERS_ARRAY);
const offers = <const> [...offersArr];

export enum USER_ROLE {
  admin = 'admin',
  user = 'user',
  customer = 'customer',
  companyAdmin = 'company_admin'
}

export type OFFER_NAME = typeof offers[number];
