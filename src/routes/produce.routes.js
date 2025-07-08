import { Router } from 'express';
import {
  createProduce,
  deleteProduce,
  getAllProduce,
  getProduce,
  updateProduce,
} from '../farmLink/controllers/produce.controller.js';
import validateProduce from '../middleware/validate.produce.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.js';
import { ensureFarmer } from '../middleware/ensureFarmer.js';

const router = Router();

router.post(
  '/create',
  authMiddleware,
  ensureFarmer,
  upload.single('image'), // <-- multer middleware with Cloudinary storage
  validateProduce,
  createProduce
);

router.get('/', getAllProduce);
router.get('/:id', getProduce);
router.patch('/:id', authMiddleware, ensureFarmer, updateProduce);
router.delete(':id', authMiddleware, ensureFarmer, deleteProduce);

export default router;
