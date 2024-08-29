import express from 'express';
import multer from 'multer';
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
router.put('/:linkId', updateShortLinkController);

export default router;
