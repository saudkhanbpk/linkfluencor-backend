import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { validationResult } from 'express-validator';
import { activateUser } from '../services/userService';

export const registerController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, password, authProvider, role } =
      req.body;
    const { token, user } = await registerUser(
      firstName,
      lastName,
      email,
      password,
      authProvider,
      role
    );

    res.status(201).json({ token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }

  return;
};

export const activateAccountController = async (
  req: Request,
  res: Response
) => {
  const { token } = req.params;

  try {
    const user = await activateUser(token);

    if (!user) {
      return res.status(400).json({ message: 'Invalid activation token' });
    }

    res.status(200).json({ message: 'Account activated successfully' });
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
    const { token, user } = await loginUser(email, password);

    res.status(200).json({ token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Login failed' });
  }

  return;
};
