import { Request, Response } from 'express';
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../services/userService';
import { subscribe, getClicksLeft } from '../services/subscriptionService';

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const subscribeUserController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return await subscribe(user._id, req.body.plan);
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};

export const getClicksLeftController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const clicksLeft = await getClicksLeft(user._id);
    res.json({ clicksLeft });
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return;
};
