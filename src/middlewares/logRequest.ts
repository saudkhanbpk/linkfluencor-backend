import { Request, Response, NextFunction } from 'express';
import log from '../utils/logger';

const logRequest = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const { method, url, headers, body } = req;
    log.info(`[${new Date().toISOString()}] ${method} ${url}`);
    log.debug(`Headers: ${headers}`);
    log.debug(`Body: ${body}`);
    next();
  } catch (error) {
    log.error(`Error logging request: ${error}`);
    next(error);
  }
};

export default logRequest;
