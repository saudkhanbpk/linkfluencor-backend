import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env';
import { AuthProvider } from '../types/enums';
import AuthenticationError from '../errors/AuthenticationError';
import { Schema } from 'mongoose';

export const handlePasswordHashing = async (
  password: string,
  authProvider: AuthProvider
) => {
  if (authProvider === AuthProvider.Local) {
    if (!password) {
      throw new AuthenticationError(
        'Password is required for internal authentication'
      );
    }
    return await hashPassword(password);
  }
  return null;
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateActivationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateAccessToken = (userId: Schema.Types.ObjectId) => {
  return jwt.sign({ id: userId }, config.jwtSecret || '', { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: Schema.Types.ObjectId) => {
  return jwt.sign({ id: userId }, config.jwtRefreshSecret || '', {
    expiresIn: '30d',
  });
};

export const sendTokens = (
  res: any,
  accessToken: string,
  refreshToken: string
) => {
  return res.status(200).json({
    accessToken,
    refreshToken,
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret || '');
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret || '');
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
};
