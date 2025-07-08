import { Sequelize } from 'sequelize';
import { getEnvironmentVariable } from './dotenvConfig.js';

// Initialize a new Sequelize instance using environment variables
const sequelize = new Sequelize(
  getEnvironmentVariable('DB_NAME'),
  getEnvironmentVariable('DB_USER'),
  getEnvironmentVariable('DB_PASSWORD'),
  {
    host: getEnvironmentVariable('DB_HOST'),
    port: Number(getEnvironmentVariable('DB_PORT')),
    dialect: 'postgres',
  }
);

export default sequelize;
