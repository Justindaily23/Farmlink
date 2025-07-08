import { asyncHandler } from '../../utils/asyncHandler.js';
import { BadRequestException } from '../../lib/error-definitions.js';
import { registerFarmerSchema } from '../requests/famer.request.js';
import { loginFarmer, registerFarmer } from '../services/farmer.service.js';
import {
  requestFarmerPasswordReset,
  resetFarmerPasswordService,
} from '../services/farmer.service.js';

export const registerFarmerController = asyncHandler(async (req, res) => {
  // Validate input
  const { error } = registerFarmerSchema.validate(req.body);
  if (error) {
    throw new BadRequestException(error.details[0].message);
  }

  // Call registration service
  const farmer = await registerFarmer(req.body);

  return res.status(201).json({
    success: true,
    message: 'Successful. Please log in.',
    farmer,
  });
});

export const loginFarmerController = asyncHandler(async (req, res) => {
  const { farmer, token } = await loginFarmer(req.body);
  return res.status(200).json({
    success: true,
    message: `Login successful! Welcome ${farmer.first_name}`,
    token,
  });
});

export const forgotFarmerPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await requestFarmerPasswordReset(email);
  res.status(200).json(result);
});

export const resetFarmerPasswordController = asyncHandler(async (req, res) => {
  const { token, password, confirm_password } = req.body;

  // Basic validation
  if (!token || !password || !confirm_password) {
    return res
      .status(400)
      .json({ message: 'Token and passwords are required' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  const result = await resetFarmerPasswordService(token, password);
  res.status(200).json(result);
});
