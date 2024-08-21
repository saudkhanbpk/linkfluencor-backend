import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const err = error as Error;

    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
