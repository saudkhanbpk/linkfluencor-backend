import express from 'express';
import {
  createShortLinkController,
  updateShortLinkController,
  getAllLinksForUserController,
} from '../controllers/linkController';

const router = express.Router({ mergeParams: true });

router.get('/', getAllLinksForUserController);
router.post('/', createShortLinkController);
router.put('/:linkId', updateShortLinkController);

export default router;
