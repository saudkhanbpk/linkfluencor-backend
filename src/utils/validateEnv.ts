import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';

dotenv.config();

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 3000 }),
    MONGO_URI: str(),
    JWT_SECRET: str(),
    APP_URL: str(),
  });
};

export default validateEnv;
