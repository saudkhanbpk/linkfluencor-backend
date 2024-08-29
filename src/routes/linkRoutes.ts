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
} from '../controllers/linkController';

const router = express.Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllLinksForUserController);
router.post('/', createShortLinkController);
router.delete('/:linkId', deleteLinkController);
router.delete('/', deleteMultipleLinksController);
router.post('/upload', upload.single('file'), bulkUpload);
router.put(
  '/:linkId',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  updateShortLinkController
);
router.get('/:linkId/clicks', getClicksForLinkController);
router.get('/:linkId/clicks-trend', getClicksTrendForLinkController);
router.get('/:linkId/top-country', getTopCountryByLinkController);
router.get('/:linkId/top-city', getTopCityByLinkController);
router.get(
  '/:linkId/top-average-time-to-engage',
  getBestAverageTimeToEngageByLinkController
);
router.get(
  '/:linkId/clicks-by-interval',
  getClicksByIntervalAndLinkIdController
);

export default router;
