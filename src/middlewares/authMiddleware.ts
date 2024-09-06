// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Assurez-vous que IUser est correctement importé depuis votre modèle
import AuthenticationError from '../errors/AuthenticationError';
import { DecodedToken } from '../types/interfaces';
import { config } from '../config/env'; // Contient jwtSecret et autres configurations nécessaires

// Middleware d'authentification qui lit le token depuis les cookies
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Récupérer l'Access Token depuis les cookies
  const token = req.cookies.accessToken;

  // Vérifier si le token est absent
  if (!token) {
    return next(new AuthenticationError('No token, authorization denied'));
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, config.jwtSecret || '') as DecodedToken;

    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(
        new AuthenticationError('User not found, authorization denied')
      );
    }

    // Attacher l'utilisateur à la requête pour une utilisation ultérieure
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
