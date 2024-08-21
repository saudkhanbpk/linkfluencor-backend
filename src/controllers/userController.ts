import { Request, Response } from 'express';
import { getUserById, getAllUsers, createUser, updateUser, deleteUser } from '../services/userService';

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
  console.log('getAllUsersController')
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const savedUser = await createUser(req.body);
    res.status(201).json(savedUser);
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