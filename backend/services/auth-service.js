import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import sequelize, { connectDB } from '../config/db.js';
import authRoutes from '../routes/authRoutes.js';
import User from '../models/User.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.AUTH_SERVICE_PORT || 5001;

const seedAdminUser = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'info@odst.id').trim().toLowerCase();
    const adminUsername = (process.env.ADMIN_USERNAME || 'info@odst.id').trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

    let user = await User.findOne({
      where: {
        [Op.or]: [
          { email: adminEmail },
          { username: adminUsername },
          { username: 'admin' },
          { email: 'admin@odst.id' }
        ]
      }
    });

    if (!user) {
      user = await User.findOne({ where: { role: 'admin' } });
    }

    if (!user) {
      console.log('No admin users found in database. Seeding default admin...');
      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`Default admin user seeded successfully (${adminEmail}).`);
    } else {
      let isModified = false;
      if (!user.password) {
        user.password = adminPassword;
        isModified = true;
      }
      if (isModified) {
        await user.save();
        console.log(`Admin user password initialized.`);
      }
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
