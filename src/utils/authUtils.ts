import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env';
import { AuthProvider } from '../types/enums';
import AuthenticationError from '../errors/AuthenticationError';

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

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.jwtSecret || '', {
    expiresIn: '1h',
  });
};

export const generateActivationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
