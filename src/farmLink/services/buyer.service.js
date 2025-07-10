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
  try {
    // 1. Check user
    const user = await Buyer.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('No user with that email');

    // 2. Generate token + expiry
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // 3. Update DB
    await user.update({
      reset_password_token: hashedToken,
      reset_password_expires: expires,
    });

    // 4. Construct email
    const resetLink = `${getEnvironmentVariable('FRONTEND_URL')}/reset-password?token=${token}`;
    const plainTextFallback = `Click this link to reset your password: ${resetLink}`;
    const htmlContent = `
      <p>Hello ${user.first_name || 'User'},</p>
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetLink}" target="_blank" rel="noopener noreferrer">here</a> to reset your password.</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn’t request this, you can safely ignore it.</p>
    `;

    // 5. Send Email
    await sendEmail(
      user.email,
      'Reset Your Password',
      htmlContent,
      plainTextFallback
    );

    // 6. Done
    return { message: 'Reset link sent to your email' };
  } catch (err) {
    console.error('Password reset error:', err.message);
    throw new Error('Failed to initiate password reset. Please try again.');
  }
};

export const resetBuyerPasswordService = async (token, newPassword) => {
  const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');
  const buyer = await Buyer.findOne({
    where: {
      reset_password_token: hashedtoken,
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
};
