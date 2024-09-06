import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { validationResult } from 'express-validator';
import { activateUser, getUserById } from '../services/userService';
import ValidationError from '../errors/ValidationError';

import { NextFunction } from 'express';
import {
  generateAccessToken,
  sendTokens,
  verifyAccessToken,
} from '../utils/authUtils';
import { JwtPayload } from 'jsonwebtoken';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, authProvider, authProviderId, role, brandName } =
      req.body;
    const { user, accessToken, refreshToken } = await registerUser(
      email,
      password,
      authProvider,
      authProviderId,
      role,
      brandName
    );

    sendTokens(res, accessToken, refreshToken);

    res.status(201).json(user);
  } catch (error: any) {
    next(new ValidationError(error.message));
  }

  return;
};

export const activateAccountController = async (
  req: Request,
  res: Response
) => {
  const { token } = req.params;

  try {
    const { user, accessToken, refreshToken } = await activateUser(token);

    if (!user) {
      return res.status(400).json({ message: 'Invalid activation token' });
    }

    sendTokens(res, accessToken, refreshToken);

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Activation failed' });
  }
  return;
};

export const loginController = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    sendTokens(res, accessToken, refreshToken);

    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Login failed' });
  }

  return;
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to get user' });
  }
  return;
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = verifyAccessToken(refreshToken) as JwtPayload;
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user.id);

    sendTokens(res, newAccessToken, refreshToken);

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
  return;
};

export const logoutController = (_req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  res.status(200).json({ message: 'Logged out successfully' });
};
