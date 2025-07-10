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
 * /api/v1/buyers/signup:
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
 *       '400':
 *         description: Bad request — missing or invalid fields
 *       '409':
 *         description: Email already exists
 *       '500':
 *         description: Server error
 */
router.post(
  '/signup',
  validateRequest(registerBuyerSchema),
  registerBuyerController
);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBuyer:
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

/**
 * @swagger
 * /api/v1/buyers/login:
 *   post:
 *     summary: Logs in a buyer
 *     description: Log in as a registered buyer with required registered details
 *     tags:
 *       - Buyers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBuyer'
 *     responses:
 *       '200':
 *         description: Login successful! Welcome {user}
 *       '400':
 *         description: Bad request — invalid email or password
 *       '500':
 *         description: Server error
 */
router.post('/login', validateRequest(loginBuyerSchema), loginBuyerController);

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPassword:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "justin@example.com"
 */

/**
 * @swagger
 * /api/v1/buyers/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Forgot password
 *     tags:
 *       - Buyers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       '200':
 *         description: Reset link sent to your email
 *       '400':
 *         description: Bad request — invalid email
 *       '500':
 *         description: Invalid or expired token
 */
router.post(
  '/forgot-password',
  authMiddleware,
  validateRequest(requestBuyerPasswordResetSchema),
  forgotBuyerPasswordController
);

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPassword:
 *       type: object
 *       required:
 *         - password
 *         - confirm_password
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           example: "strongPassword1234"
 *         confirm_password:
 *           type: string
 *           format: password
 *           example: "strongPassword1234"
 */

/**
 * @swagger
 * /api/v1/buyers/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Reset Password
 *     tags:
 *       - Buyers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       '200':
 *         description: Password reset successful
 *       '400':
 *         description: Bad request — password does not match
 *       '500':
 *         description: Invalid or expired token
 */
router.post(
  '/reset-password',
  authMiddleware,
  validateRequest(resetBuyerPasswordSchema),
  resetBuyerPasswordController
);

export default router;
