import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectDB } from '../config/db.js';
import authRoutes from '../routes/authRoutes.js';
import User from '../models/User.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.AUTH_SERVICE_PORT || 5001;

const seedAdminUser = async () => {
  try {
    const count = await User.count();
    if (count === 0) {
      console.log('No admin users found in database. Seeding default admin...');
      await User.create({
        username: 'admin',
        email: 'admin@odst.id',
        password: 'password123',
        role: 'admin'
      });
      console.log('Default admin user seeded successfully.');
    }
  } catch (error) {
    console.error(`Failed to seed default admin user: ${error.message}`);
  }
};

let isSynced = false;
const syncDatabase = async () => {
  if (isSynced) return;
  try {
    await connectDB();
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Auth Database schema synced successfully');
    await seedAdminUser();
    isSynced = true;
  } catch (err) {
    console.error(`Auth Database sync failed: ${err.message}`);
    throw err;
  }
};

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use(async (req, res, next) => {
  try {
    await syncDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRoutes);

app.get('/api/auth/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auth Service is running' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

export default app;
