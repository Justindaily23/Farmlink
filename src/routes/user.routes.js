import { Router } from 'express';
import {
  registerController,
  loginController,
} from '../farmLink/controllers/user.controller.js';
import { validateRequest } from '../middleware/request.validation.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../farmLink/requests/user.request.js';

const router = Router();

router.post(
  '/register',
  validateRequest(registerUserSchema),
  registerController
);

router.post('/login', validateRequest(loginUserSchema), loginController);

export default router;
