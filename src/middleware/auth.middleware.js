import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../lib/error-definitions.js';
import { getEnvironmentVariable } from '../config/dotenvConfig.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedException('No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getEnvironmentVariable('JWT_SECRET'));
    req.user = decoded; // Attach user info to the request

    next();
  } catch (error) {
    return next(new UnauthorizedException('Invalid or expired token'));
  }
};

export default authMiddleware;
