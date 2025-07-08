import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import {
  ConflictException,
  UnauthorizedException,
} from '../../lib/error-definitions.js';
import { getEnvironmentVariable } from '../../config/dotenvConfig.js';
import jwt from 'jsonwebtoken';
import Buyer from '../models/buyer.model.js';
import crypto from 'crypto';
import { sendEmail } from '../../utils/email.util.js';

// Register buyer
export const registerBuyer = async (Data) => {
  const { email, password } = Data;

  const existingBuyer = await Buyer.findOne({
    where: {
      [Op.or]: [{ email }], // Find a record where email equals the provided email
    },
  });

  if (existingBuyer) {
    throw new ConflictException(
      'Buyer with this email or username already exists'
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(getEnvironmentVariable('SALT_ROUNDS'), 10)
  );

  const newBuyer = await Buyer.create({
    ...Data,
    password: hashedPassword,
  });

  const { password: _, ...buyerWithoutPassword } = newBuyer.toJSON();

  return buyerWithoutPassword;
};

// Login buyer
export const loginBuyer = async ({ email, password }) => {
  const buyer = await Buyer.findOne({ where: { email } });

  if (!buyer) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, buyer.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload = {
    id: buyer.id,
    email: buyer.email,
    first_name: buyer.first_name,
    last_name: buyer.last_name,
  };

  const token = jwt.sign(payload, getEnvironmentVariable('JWT_SECRET'), {
    expiresIn: getEnvironmentVariable('EXPIRES_IN'),
  });

  const { password: _, ...buyerWithoutPassword } = buyer.toJSON();

  return { buyer: buyerWithoutPassword, token };
};

export const requestBuyerPasswordReset = async (email) => {
  const user = await Buyer.findOne({ where: { email } });
  if (!user) throw new UnauthorizedException('No user with that email');

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await user.update({
    reset_password_token: token,
    reset_password_expires: expires,
  });

  const resetLink = `${getEnvironmentVariable('APP_BASE_URL')}/api/v1/buyers/reset-password?token=${token}`;
  await sendEmail(
    user.email,
    'Reset your password',
    `Click here to reset: ${resetLink}`
  );

  return { message: 'Reset link sent to your email' };
};

export const resetBuyerPasswordService = async (token, newPassword) => {
  const buyer = await Buyer.findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: { [Op.gt]: new Date() }, // Ensure token is still valid
    },
  });

  if (!buyer) {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  // Hash and save new password
  const hashed = await bcrypt.hash(
    newPassword,
    parseInt(getEnvironmentVariable('SALT_ROUNDS'), 10)
  );
  buyer.password = hashed;
  buyer.reset_password_token = null;
  buyer.reset_password_expires = null;
  await buyer.save();

  return { message: 'Password has been reset successfully' };
};
