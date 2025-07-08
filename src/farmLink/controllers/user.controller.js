import { registerUser, loginUser } from '../services/user.service.js';
import { registerUserSchema } from '../requests/user.request.js';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { BadRequestException } from '../../lib/error-definitions.js';

export const registerController = asyncHandler(async (req, res) => {
  // Validate input
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    throw new BadRequestException(error.details[0].message);
  }

  // Call registration service
  const user = await registerUser(req.body);

  return res.status(201).json({
    success: true,
    message: 'User created. Please log in.',
    user,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  return res.status(200).json({
    success: true,
    message: `Login successful! Welcome ${user.username}`,
    token,
  });
});
