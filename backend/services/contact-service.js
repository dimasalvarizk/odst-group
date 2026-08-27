import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectDB } from '../config/db.js';
import contactRoutes from '../routes/contactRoutes.js';
import Contact from '../models/Contact.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.CONTACT_SERVICE_PORT || 5002;

let isSynced = false;
const syncDatabase = async () => {
  if (isSynced) return;
  try {
    await connectDB();
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Contact Database schema synced successfully');
    isSynced = true;
  } catch (err) {
    console.error(`Contact Database sync failed: ${err.message}`);
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

app.use('/api/contacts', contactRoutes);

app.get('/api/contacts/health', (req, res) => {
  res.json({ status: 'OK', message: 'Contact Service is running' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Contact Service running on port ${PORT}`);
});

export default app;
