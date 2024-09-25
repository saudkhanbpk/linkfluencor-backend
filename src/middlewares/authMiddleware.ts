import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AuthenticationError from '../errors/AuthenticationError';
import { DecodedToken } from '../types/interfaces';
import { verifyAccessToken } from '../utils/authUtils';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('No token, authorization denied'));
  }

  const token = authHeader.split(' ')[1];

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
