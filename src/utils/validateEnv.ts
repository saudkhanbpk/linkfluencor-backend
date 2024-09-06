import { cleanEnv, str, port } from 'envalid';

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
    PLAN_FREE_PRICE: str(),
    PLAN_FREE_CLICKS_LIMIT: str(),
    PLAN_STARTER_PRICE: str(),
    PLAN_STARTER_CLICKS_LIMIT: str(),
    PLAN_GROW_PRICE: str(),
    PLAN_GROW_CLICKS_LIMIT: str(),
    PLAN_SCALE_PRICE: str(),
    PLAN_SCALE_CLICKS_LIMIT: str(),
    ALLOWED_ORIGINS: str(),
    LOG_LEVEL: str(),
  });
};

export default validateEnv;
