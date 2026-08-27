import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectDB } from '../config/db.js';
import serviceRoutes from '../routes/serviceRoutes.js';
import Service from '../models/Service.js';
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.CONTENT_SERVICE_PORT || 5004;

// Default services seed function
const seedServices = async () => {
  try {
    const count = await Service.count();
    if (count === 0) {
      console.log('No services found in database. Seeding defaults...');
      await Service.bulkCreate([
        {
          id: 'hotels',
          badge: 'Premium Hospitality',
          title: 'ODST Hotels',
          description: 'Provides hospitality services close to the Holy sites. Our hotels offer comfort, convenience, and spiritual tranquility for many pilgrims. Experience refined stays with panoramic views of the Holy Mosque.',
          imageUrl: 'hotels',
          imageLeft: false,
          link: '#hotels',
          phone: '+62 811 1202 225',
          email: 'info@odst.id',
          address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125'
        },
        {
          id: 'airlines',
          badge: 'Aviation & Charter',
          title: 'ODST Airlines',
          description: 'Seamless journeys to the Holy Land. Dedicated charters and flight solutions with exceptional comfort, premium catering, and a deeply attentive service tailored for your spiritual journey.',
          imageUrl: 'airlines',
          imageLeft: true,
          link: '#airlines',
          phone: '+62 811 1202 230',
          email: 'info@odst.id',
          address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125'
        },
        {
          id: 'travel',
          badge: 'Bespoke Journeys',
          title: 'ODST Tour & Travel',
          description: 'Complete pilgrim and package travel solutions for your needs. From guide grouping to highly personalized guided tours and excellent ground transportation, we handle every detail so you can focus on your spiritual fulfillment.',
          imageUrl: 'travel',
          imageLeft: false,
          link: '#travel',
          phone: '+62 811 1203 332',
          email: 'info@odst.id',
          address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125'
        }
      ]);
      console.log('Default services seeded successfully.');
    } else {
      // Check if existing records are missing the contact info
      const hotels = await Service.findByPk('hotels');
      if (hotels && !hotels.phone) {
        console.log('Updating existing services with default contact details...');
        await Service.update(
          { phone: '+62 811 1202 225', email: 'info@odst.id', address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125' },
          { where: { id: 'hotels' } }
        );
        await Service.update(
          { phone: '+62 811 1202 230', email: 'info@odst.id', address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125' },
          { where: { id: 'airlines' } }
        );
        await Service.update(
          { phone: '+62 811 1203 332', email: 'info@odst.id', address: 'CBC Tower Lt. 8, Cengkareng Business City Jl. Rp. Soewarno, Benda, Tangerang, Banten 15125' },
          { where: { id: 'travel' } }
        );
        console.log('Existing services updated with contact info.');
      }
    }
  } catch (error) {
    console.error(`Failed to seed default services: ${error.message}`);
  }
};

let isSynced = false;
const syncDatabase = async () => {
  if (isSynced) return;
  try {
    await connectDB();
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Content Database schema synced successfully');
    await seedServices();
    isSynced = true;
  } catch (err) {
    console.error(`Content Database sync failed: ${err.message}`);
    throw err;
  }
};

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(async (req, res, next) => {
  try {
    await syncDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/services', serviceRoutes);

app.get('/api/services/health', (req, res) => {
  res.json({ status: 'OK', message: 'Content Service is running' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Content Service running on port ${PORT}`);
});

export default app;
