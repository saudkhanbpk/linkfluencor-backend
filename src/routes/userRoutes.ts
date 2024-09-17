import { Router } from 'express';
import { param } from 'express-validator';
import {
  getUser,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  subscribeUserController,
  getClicksLeftController,
  getClicksByIntervalAndUserController,
  getTotalClicksByUserController,
  getBestPerformingPlatformByUserController,
  getTop5BestPerformingPlatformsByUserController,
  getTopCountryByUserController,
  getBestCityByUserController,
  getBestAverageTimeToEngageByUserController,
  getClicksGranularityByUserController,
  updatePasswordController,
  getFormattedClicksByIntervalAndUserController,
  getProfileCompletionController,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import linkRoutes from './linkRoutes';

const router = Router();

router.get('/', getAllUsersController);
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
router.put(
  '/:id/password',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  updatePasswordController
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
router.get(
  '/:id/clicks-left',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getClicksLeftController
);
router.get(
  '/:id/clicks-by-interval',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getClicksByIntervalAndUserController
);
router.get(
  '/:id/clicks-by-user-interval',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getFormattedClicksByIntervalAndUserController
);
router.get(
  '/:id/total-clicks',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getTotalClicksByUserController
);
router.get(
  '/:id/best-performing-platform',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getBestPerformingPlatformByUserController
);
router.get(
  '/:id/top-5-best-performing-platforms',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getTop5BestPerformingPlatformsByUserController
);
router.get(
  '/:id/top-countries',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getTopCountryByUserController
);
router.get(
  '/:id/top-city',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getBestCityByUserController
);
router.get(
  '/:id/top-average-time-to-engage',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getBestAverageTimeToEngageByUserController
);
router.get(
  '/:id/clicks-granularity',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getClicksGranularityByUserController
);
router.get(
  '/:id/profile-completion',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  authMiddleware,
  getProfileCompletionController
);
router.use(
  '/:id/links',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  // authMiddleware,
  linkRoutes
);

export default router;
