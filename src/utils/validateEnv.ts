import { cleanEnv, str, port, num } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 3000 }),
    MONGO_URI: str(),
    JWT_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    APP_URL: str(),
    SESSION_SECRET: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    FACEBOOK_APP_ID: str(),
    FACEBOOK_APP_SECRET: str(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    PLAN_FREE_PRICE: num(),
    PLAN_FREE_CLICKS_LIMIT: num(),
    PLAN_STARTER_PRICE: num(),
    PLAN_STARTER_CLICKS_LIMIT: num(),
    PLAN_GROW_PRICE: num(),
    PLAN_GROW_CLICKS_LIMIT: num(),
    PLAN_SCALE_PRICE: num(),
    PLAN_SCALE_CLICKS_LIMIT: num(),
    ALLOWED_ORIGINS: str(),
    LOG_LEVEL: str(),
    COOKIE_DOMAIN: str(),
  });
};

export default validateEnv;
