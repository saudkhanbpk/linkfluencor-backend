import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { DecodedToken } from '../types/interfaces';
import { verifyAccessToken } from '../utils/authUtils';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyAccessToken(token) as DecodedToken;

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res
          .status(404)
          .json({ message: 'User not found, authorization denied' });
      }

      req.user = user;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ message: 'Token expired, please log in again' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ message: 'Invalid token, authorization denied' });
      } else {
        return res
          .status(500)
          .json({ message: 'Server error while verifying token' });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
