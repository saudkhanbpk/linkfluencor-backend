import { Request, Response, NextFunction } from 'express';
import log from '../utils/logger'; // Importer le logger

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  log.error(
    `Status: ${statusCode}, Message: ${err.message}, Stack: ${err.stack}`
  );

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
