// middlewares/authMiddleware.js
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AuthenticationError from '../errors/AuthenticationError';
import { DecodedToken } from '../types/interfaces';
import { verifyAccessToken } from '../utils/authUtils';

interface CustomRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return next(new AuthenticationError('No token, authorization denied'));
  }

  try {
    const decoded = verifyAccessToken(token) as DecodedToken;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(
        new AuthenticationError('User not found, authorization denied')
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new AuthenticationError('Invalid token, authorization denied')
      );
    }
    next(error);
  }
};
