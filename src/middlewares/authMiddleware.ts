import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config/env';
import AuthenticationError from '../errors/AuthenticationError';

interface CustomRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new AuthenticationError('No token, authorization denied');
  }

  try {
    const decoded: any = jwt.verify(token, config.jwtSecret || '');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    next(error);
  }
  return;
};
