import winston from 'winston';
import { getEnvironmentVariable } from '../config/dotenvConfig.js';

// Define tranport base environment
const transports = [];

// In development
if (getEnvironmentVariable('NODE_ENV') === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );

  // in Production
} else {
  transports.push(
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),

    new winston.transports.File({
      filename: 'logs/combine.log',
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

export default logger;
