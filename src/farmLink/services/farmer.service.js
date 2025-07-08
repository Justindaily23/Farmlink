import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import Farmer from '../models/farmer.model.js';
import {
  ConflictException,
  UnauthorizedException,
} from '../../lib/error-definitions.js';
import { getEnvironmentVariable } from '../../config/dotenvConfig.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../../utils/email.util.js';

// Register farmer
export const registerFarmer = async (Data) => {
  const { email, password } = Data;

  const existingFarmer = await Farmer.findOne({
    where: {
      [Op.or]: [{ email }], // Find a record where email equals the provided email
    },
  });

  if (existingFarmer) {
    throw new ConflictException(
      'Farmer with this email or username already exists'
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(getEnvironmentVariable('SALT_ROUNDS'))
  );

  const { confirm_password, ...farmerData } = Data;

  const newFarmer = await Farmer.create({
    ...farmerData,
    password: hashedPassword,
  });

  const { password: _, ...farmerWithoutPassword } = newFarmer.toJSON();

  return farmerWithoutPassword;
};

// Login Farmer
export const loginFarmer = async ({ email, password }) => {
  const farmer = await Farmer.findOne({ where: { email } });

  if (!farmer) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, farmer.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload = {
    id: farmer.id,
    email: farmer.email,
    first_name: farmer.first_name,
    last_name: farmer.last_name,
  };

  const token = jwt.sign(payload, getEnvironmentVariable('JWT_SECRET'), {
    expiresIn: getEnvironmentVariable('EXPIRES_IN'),
  });

  const { password: _, ...farmerWithoutPassword } = farmer.toJSON();

  return { farmer: farmerWithoutPassword, token };
};

export const requestFarmerPasswordReset = async (email) => {
  const user = await Farmer.findOne({ where: { email } });
  if (!user) throw new UnauthorizedException('No user with that email');

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await user.update({
    reset_password_token: token,
    reset_password_expires: expires,
  });

  const resetLink = `${getEnvironmentVariable('APP_BASE_URL')}/api/v1/farmers/reset-password?token=${token}`;
  await sendEmail(
    user.email,
    'Reset your password',
    `Click here to reset: ${resetLink}`
  );

  return { message: 'Reset link sent to your email' };
};

export const resetFarmerPasswordService = async (token, newPassword) => {
  const farmer = await Farmer.findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: { [Op.gt]: new Date() }, // Ensure token is still valid
    },
  });

  if (!farmer) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  // Hash and save new password
  const hashed = await bcrypt.hash(
    newPassword,
    parseInt(getEnvironmentVariable('SALT_ROUNDS'), 10)
  );
  farmer.password = hashed;
  farmer.reset_password_token = null;
  farmer.reset_password_expires = null;
  await farmer.save();

  return { message: 'Password has been reset successfully' };
};
