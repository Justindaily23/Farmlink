import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '../models/user.model.js';
import {
  ConflictException,
  UnauthorizedException,
} from '../../lib/error-definitions.js';
import { getEnvironmentVariable } from '../../config/dotenvConfig.js';
import jwt from 'jsonwebtoken';

// register user
export const registerUser = async (userData) => {
  const { email, username, password } = userData;

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new ConflictException(
      'User with this email or username already exists'
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(getEnvironmentVariable('SALT_ROUNDS'))
  );

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = newUser.toJSON();

  return userWithoutPassword;
};

// Login user
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload = {
    id: user.id,
    email: user.email,
    user_type: user.user_type,
    username: user.username,
  };

  const token = jwt.sign(payload, getEnvironmentVariable('JWT_SECRET'), {
    expiresIn: getEnvironmentVariable('EXPIRES_IN'),
  });

  const { password: _, ...userWithoutPassword } = user.toJSON();

  return { user: userWithoutPassword, token };
};
