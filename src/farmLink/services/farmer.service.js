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

  // Check if user exists in the database
  const existingFarmer = await Farmer.findOne({
    where: {
      [Op.or]: [{ email }], // Find a record where email equals the provided email
    },
  });

  // Throw error if user exists
  if (existingFarmer) {
    throw new ConflictException(
      'Farmer with this email or username already exists'
    );
  }

  // If user does not exist Hash the password
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(getEnvironmentVariable('SALT_ROUNDS'))
  );

  // Extract the fields without the confirm password and save it to farmerData
  const { confirm_password, ...farmerData } = Data;

  // Save to database
  const newFarmer = await Farmer.create({
    ...farmerData,
    password: hashedPassword,
  });

  // Collect the datas to be returned and save to farmerWithoutPassword, ignoring password not to be returned with the data
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
  // Get the instance of the user from the database and throw error if user does not exist
  const user = await Farmer.findOne({ where: { email } });
  if (!user) throw new UnauthorizedException('No user with that email');

  // If user exists, create a token and hash the token
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  // update database
  await user.update({
    reset_password_token: hashedToken,
    reset_password_expires: expires,
  });

  // construct email
  const resetLink = `${getEnvironmentVariable('FRONTEND_URL')}/reset-password?token=${token}`;
  const plainTextFallback = `Click this link to reset your password: ${resetLink}`;

  await sendEmail(
    user.email,
    'Reset your password',
    `<p>Click <a href="${resetLink}" target="_blank" rel="noopener noreferrer">here</a> to reset your password.</p>
            <p>This link will expire in 1 hour.</p>`,
    plainTextFallback
  );
};

export const resetFarmerPasswordService = async (token, newPassword) => {
  // Hash the token received to be verified against stored token
  const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');

  // Find farmer with token and check if it exists in database and throw error if it does not
  const farmer = await Farmer.findOne({
    where: {
      reset_password_token: hashedtoken,
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
};
