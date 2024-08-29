import express from 'express';
import multer from 'multer';
import { param } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createShortLinkController,
  updateShortLinkController,
  getAllLinksForUserController,
  bulkUpload,
} from '../controllers/linkController';

const router = express.Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllLinksForUserController);
router.post('/', createShortLinkController);
router.post('/upload', upload.single('file'), bulkUpload);
router.put(
  '/:linkId',
  param('linkId').isMongoId().withMessage('Invalid link ID'),
  validateRequest,
  updateShortLinkController
);

export default router;
