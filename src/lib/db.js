import sequelize from '../config/sequelize.Config.js';
import User from '../farmLink/models/user.model.js';

// Connect to database
export async function connectToDb() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}
