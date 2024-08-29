import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import { handleRedirect } from '../controllers/clickController';
import logRequest from '../middlewares/logRequest';

const router = Router();

router.use('/auth', logRequest, authRoutes);
router.use('/users', logRequest, userRoutes);
router.get('/:link', logRequest, handleRedirect);

export default router;
