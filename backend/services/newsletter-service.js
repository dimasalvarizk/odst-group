import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectDB } from '../config/db.js';
import newsletterRoutes from '../routes/newsletterRoutes.js';
import Newsletter from '../models/Newsletter.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.NEWSLETTER_SERVICE_PORT || 5003;

let isSynced = false;
const syncDatabase = async () => {
  if (isSynced) return;
  try {
    await connectDB();
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Newsletter Database schema synced successfully');
    isSynced = true;
  } catch (err) {
    console.error(`Newsletter Database sync failed: ${err.message}`);
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

app.use('/api/newsletters', newsletterRoutes);

app.get('/api/newsletters/health', (req, res) => {
  res.json({ status: 'OK', message: 'Newsletter Service is running' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Newsletter Service running on port ${PORT}`);
});

export default app;
