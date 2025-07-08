import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Function to get environment variables or throw an error if missing
export const getEnvironmentVariable = (key) => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Environment variable ${key} is missing.`);
  }
  return value;
};
