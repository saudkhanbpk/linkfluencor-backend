import { Router } from 'express';
import { param } from 'express-validator';
import {
  getUser,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  subscribeUserController,
  getClicksLeftController,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import linkRoutes from './linkRoutes';

const router = Router();

router.get('/', authMiddleware, getAllUsersController);
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getUser
);
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  updateUserController
);
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  deleteUserController
);
router.post(
  '/:id/subscribe',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  subscribeUserController
);
router.post(
  '/:id/clicks-left',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getClicksLeftController
);
router.use(
  '/:id/links',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  linkRoutes
);

export default router;
