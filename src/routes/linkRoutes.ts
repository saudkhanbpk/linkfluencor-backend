import express from 'express';
import multer from 'multer';
import { param } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createShortLinkController,
  updateShortLinkController,
  getAllLinksForUserController,
  bulkUpload,
  getClicksForLinkController,
  getClicksTrendForLinkController,
  getTopCountryByLinkController,
  getTopCityByLinkController,
  getBestAverageTimeToEngageByLinkController,
  getClicksByIntervalAndLinkIdController,
  deleteLinkController,
  deleteMultipleLinksController,
  getTotalClicksByUserController,
  getTopTargetSitesController,
} from '../controllers/linkController';

const router = express.Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllLinksForUserController);
router.post('/', createShortLinkController);
router.delete(
  '/:linkId',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  deleteLinkController
);
router.delete('/', deleteMultipleLinksController);
router.post('/upload', upload.single('file'), bulkUpload);
router.get('/top-apps', validateRequest, getTopTargetSitesController);
router.put(
  '/:linkId',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  updateShortLinkController
);

router.get(
  '/:linkId/clicks',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  getClicksForLinkController
);
router.get(
  '/:linkId/total-clicks',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  getTotalClicksByUserController
);
router.get(
  '/:linkId/clicks-trend',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  getClicksTrendForLinkController
);
router.get(
  '/:linkId/top-country',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  getTopCountryByLinkController
);
router.get(
  '/:linkId/top-city',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  getTopCityByLinkController
);
router.get(
  '/:linkId/top-average-time-to-engage',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  getBestAverageTimeToEngageByLinkController
);
router.get(
  '/:linkId/clicks-by-interval',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  getClicksByIntervalAndLinkIdController
);

export default router;
