import { Router } from 'express';
import { validateRequest } from '../middleware/request.validation.js';
import {
  registerBuyerSchema,
  loginBuyerSchema,
} from '../farmLink/requests/buyer.request.js';
import {
  registerBuyerController,
  loginBuyerController,
} from '../farmLink/controllers/buyer.controller.js';
import {
  requestBuyerPasswordResetSchema,
  resetBuyerPasswordSchema,
} from '../farmLink/requests/buyer.request.js';
import {
  forgotBuyerPasswordController,
  resetBuyerPasswordController,
} from '../farmLink/controllers/buyer.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterBuyer:
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

/**
 * @swagger
 * /buyers/signup:
 *   post:
 *     summary: Register a new buyer
 *     description: Register a new buyer with the required details.
 *     tags:
 *       - Buyers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBuyer'
 *     responses:
 *       '201':
 *         description: Buyer registered successfully
 */
router.post(
  '/signup',
  validateRequest(registerBuyerSchema),
  registerBuyerController
);

// Login a buyer
router.post('/login', validateRequest(loginBuyerSchema), loginBuyerController);

export default router;

// reset password for user
router.post(
  '/forgot-password',
  authMiddleware,
  validateRequest(requestBuyerPasswordResetSchema),
  forgotBuyerPasswordController
);
router.post(
  '/reset-password',
  authMiddleware,
  validateRequest(resetBuyerPasswordSchema),
  resetBuyerPasswordController
);
