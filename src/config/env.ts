import dotenv from 'dotenv';
import validateEnv from '../utils/validateEnv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
dotenv.config({ path: envFile });

validateEnv();

export const config = {
  appUrl: process.env.APP_URL,
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  planFreePrice: parseFloat(process.env.PLAN_FREE_PRICE || '0'),
  planFreeClicksLimit: parseInt(process.env.PLAN_FREE_CLICKS_LIMIT || '0', 10),
  planStarterPrice: parseFloat(process.env.PLAN_STARTER_PRICE || '49.99'),
  planStarterClicksLimit: parseInt(
    process.env.PLAN_STARTER_CLICKS_LIMIT || '50000',
    10
  ),
  planGrowPrice: parseFloat(process.env.PLAN_GROW_PRICE || '99.99'),
  planGrowClicksLimit: parseInt(
    process.env.PLAN_GROW_CLICKS_LIMIT || '100000',
    10
  ),
  planScalePrice: parseFloat(process.env.PLAN_SCALE_PRICE || '199.99'),
  planScaleClicksLimit: parseInt(
    process.env.PLAN_SCALE_CLICKS_LIMIT || '250000',
    10
  ),
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  logLevel: process.env.LOG_LEVEL,
  domain: process.env.DOMAIN,
};
