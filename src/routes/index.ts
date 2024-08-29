import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import { handleRedirect } from '../controllers/clickController';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.get('/:link', handleRedirect);

export default router;
