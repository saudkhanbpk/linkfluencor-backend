import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import BadRequestError from '../errors/BadRequestError';

export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(`Validation failed ${errors.array()}`);
    }
    next();
    return;
  } catch (error) {
    next(error);
  }
};
