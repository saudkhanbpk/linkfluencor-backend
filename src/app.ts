import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { connectDB } from './config/db';
import mongoose from 'mongoose';
import errorHandler from './middlewares/errorHandler';
import routes from './routes/';

const app: Application = express();



mongoose.set('strictQuery', true);

app.use(errorHandler);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use(routes);

// Error Handling Middleware
app.use(errorHandler);

export default app;