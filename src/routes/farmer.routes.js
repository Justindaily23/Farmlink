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

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterFarmer:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - phone
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           example: "Justin"
 *         last_name:
 *           type: string
 *           example: "Drill"
 *         email:
 *           type: string
 *           format: email
 *           example: "justin@example.com"
 *         phone:
 *           type: string
 *           example: "08012345678"
 *         password:
 *           type: string
 *           format: password
 *           example: "strongPassword123"
 *         confirm_password:
 *           type: string
 *           format: password
 *           example: "strongPassword123"
 *         produce_preferences:
 *           type: array
 *           items:
 *             type: string
 *           example: ["tomatoes", "yam"]
 *         location:
 *           type: string
 *           example: "Lagos, Nigeria"
 */
router.post(
  '/signup',
  validateRequest(registerFarmerSchema),
  registerFarmerController
);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginFarmer:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "justin@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "strongPassword123"
 */

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
