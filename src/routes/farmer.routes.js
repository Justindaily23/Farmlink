import { Router } from 'express';
import { validateRequest } from '../middleware/request.validation.js';
import {
  registerFarmerSchema,
  loginFarmerSchema,
  resetFarmerPasswordSchema,
  requestFarmerPasswordResetSchema,
} from '../farmLink/requests/farmer.request.js';
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
 *         farm_produce:
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
 * /api/v1/farmers/signup:
 *   post:
 *     summary: Register a new farmer
 *     description: Register a new farmer with the required details.
 *     tags:
 *       - Farmers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterFarmer'
 *     responses:
 *       '201':
 *         description: Farmer registered successfully
 *       '400':
 *         description: Bad request — missing or invalid fields
 *       '409':
 *         description: Email already exists
 *       '500':
 *         description: Server error
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

/**
 * @swagger
 * /api/v1/farmers/login:
 *   post:
 *     summary: Logs in a farmer
 *     description: Log in as a registered farmer with required registered details
 *     tags:
 *       - Farmers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginFarmer'
 *     responses:
 *       '200':
 *         description: Login successful! Welcome {user}
 *       '400':
 *         description: Bad request — invalid email or password
 *       '500':
 *         description: Server error
 */
router.post(
  '/login',
  validateRequest(loginFarmerSchema),
  loginFarmerController
);

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
 *           example: "justin99@gmail.com"
 */

/**
 * @swagger
 * /api/v1/farmers/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Forgot password
 *     tags:
 *       - Farmers
 *     security:
 *       - bearerAuth: []
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
  validateRequest(requestFarmerPasswordResetSchema),
  forgotFarmerPasswordController
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
 *         token:
 *           type: string
 *           format: token
 *           example: ded28c7a4057746b930b9b41307b36b1bfd1ade1430b857e61183496b70465c8
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
 * /api/v1/Farmers/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Reset Password
 *     tags:
 *       - Farmers
 *     security:
 *       - bearerAuth: []
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
  validateRequest(resetFarmerPasswordSchema),
  resetFarmerPasswordController
);

export default router;
