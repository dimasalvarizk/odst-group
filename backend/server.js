import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import Service from './models/Service.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load env vars
dotenv.config();
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

// Connect to Database & Sync models
connectDB().then(() => {
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('MySQL Database schema synced successfully');
      seedServices();
    })
    .catch((err) => console.error(`MySQL Database sync failed: ${err.message}`));
});

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/services', serviceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ODST Backend API is running' });
});

// Root fallback route
app.get('/', (req, res) => {
  res.send('ODST Group API Gateway (MySQL Edition)');
});

// Error handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
