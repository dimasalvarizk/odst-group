import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Make sure env is loaded
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'odst_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Turn off sql logging in console for cleaner logs
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connected successfully via Sequelize');
  } catch (error) {
    console.error(`MySQL connection error: ${error.message}`);
    throw error;
  }
};

export default sequelize;
