import { Router } from 'express';
import { validateRequest } from '../middleware/request.validation.js';
import {
  registerFarmerSchema,
  loginFarmerSchema,
  resetFarmerPasswordSchema,
  requestFarmerPasswordResetSchema,
} from '../farmLink/requests/famer.request.js';
import {
  registerFarmerController,
  loginFarmerController,
  forgotFarmerPasswordController,
  resetFarmerPasswordController,
} from '../farmLink/controllers/farmer.controller.js';

const router = Router();

router.post(
  '/signup',
  validateRequest(registerFarmerSchema),
  registerFarmerController
);

router.post(
  '/login',
  validateRequest(loginFarmerSchema),
  loginFarmerController
);

export default router;

// routes.js
router.post(
  '/forgot-password',
  validateRequest(requestFarmerPasswordResetSchema),
  forgotFarmerPasswordController
);
router.post(
  '/reset-password',
  validateRequest(resetFarmerPasswordSchema),
  resetFarmerPasswordController
);
