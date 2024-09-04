import { Request, Response, NextFunction } from 'express';
import log from '../utils/logger';
import CustomError from '../errors/CustomError';

const errorHandler = (
  err: Error | CustomError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;

  log.error(
    `Status: ${statusCode}, Message: ${err.message}, Stack: ${err.stack}`
  );

  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorHandler;
