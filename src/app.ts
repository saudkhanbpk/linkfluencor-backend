import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { connectDB } from './config/db';
import mongoose from 'mongoose';
import errorHandler from './middlewares/errorHandler';
import routes from './routes/';

const app: Application = express();

app.set('trust proxy', true);

// Mongoose configuration
mongoose.set('strictQuery', true);

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: (_origin, callback) => {
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);
app.options('*', cors());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100000,
    message: 'Too many requests from this IP, please try again later.',
  })
);

// Middlewares
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, _res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.get('/test', (_req, res) => {
  res.status(200).json({ message: 'this is test api' });
});

connectDB();

app.use('/api', routes);
app.use(errorHandler);

export default app;
