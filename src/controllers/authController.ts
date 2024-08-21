import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { validationResult } from 'express-validator';

export const registerController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, password, authProvider, role,  } = req.body;
    const { token, user } = await registerUser(firstName, lastName, email, password, authProvider, role);

    res.status(201).json({ token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
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
    const { token, user } = await loginUser(email, password);

    res.status(200).json({ token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Login failed' });
  }

  return;
};