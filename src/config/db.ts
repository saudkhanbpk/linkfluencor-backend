import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './env';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri || '');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const err = error as Error;

    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
