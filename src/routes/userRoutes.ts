import { Router } from 'express';
import {
  getUser,
  getAllUsersController,
  updateUserController,
  deleteUserController,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import linkRoutes from './linkRoutes';

const router = Router();

router.get('/:id', authMiddleware, getUser);
router.get('/', getAllUsersController);
router.put('/:id', authMiddleware, updateUserController);
router.delete('/:id', authMiddleware, deleteUserController);
router.use('/:id/links', linkRoutes);

export default router;
