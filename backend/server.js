import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import sequelize, { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import User from './models/User.js';
import Service from './models/Service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Determine mode. On Vercel or production hosting, we use in-memory direct routing.
const VERCEL_MODE = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

if (!VERCEL_MODE) {
  // ==========================================
  // 1. LOCAL MODE: Proxy to independent ports
  // ==========================================
  console.log('API Gateway running in Local Microservices Mode');

  const SERVICES = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    contact: process.env.CONTACT_SERVICE_URL || 'http://localhost:5002',
    newsletter: process.env.NEWSLETTER_SERVICE_URL || 'http://localhost:5003',
    content: process.env.CONTENT_SERVICE_URL || 'http://localhost:5004'
  };

  const forwardRequest = (serviceUrl) => async (req, res) => {
    const url = `${serviceUrl}${req.originalUrl}`;
    try {
      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers['authorization'] || ''
        },
        body: req.method !== 'GET' && req.method !== 'DELETE' ? JSON.stringify(req.body) : undefined
      });
      
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err) {
      res.status(500).json({ 
        message: `Gateway error: Unable to reach microservice at ${serviceUrl}`, 
        error: err.message 
      });
    }
  };

  app.use('/api/auth', forwardRequest(SERVICES.auth));
  app.use('/api/contacts', forwardRequest(SERVICES.contact));
  app.use('/api/newsletters', forwardRequest(SERVICES.newsletter));
  app.use('/api/services', forwardRequest(SERVICES.content));

} else {
  // ==========================================
  // 2. VERCEL MODE: In-memory Virtual routing
  // ==========================================
  console.log('API Gateway running in Serverless Direct Mode');

  const seedServices = async () => {
    try {
      const count = await Service.count();
      if (count === 0) {
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
      }
    } catch (error) {
      console.error(`Failed to seed default services: ${error.message}`);
    }
  };

  const seedAdminUser = async () => {
    try {
      const count = await User.count();
      if (count === 0) {
        await User.create({
          username: 'admin',
          email: 'admin@odst.id',
          password: 'password123',
          role: 'admin'
        });
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
      await sequelize.sync({ alter: false });
      await seedServices();
      await seedAdminUser();
      isSynced = true;
    } catch (err) {
      console.error(`Database sync failed: ${err.message}`);
      throw err;
    }
  };

  app.use(async (req, res, next) => {
    try {
      await syncDatabase();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/contacts', contactRoutes);
  app.use('/api/newsletters', newsletterRoutes);
  app.use('/api/services', serviceRoutes);
}

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: `API Gateway is running (Vercel Mode: ${VERCEL_MODE})` 
  });
});

app.use(notFound);
app.use(errorHandler);

// Only listen locally
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });
}

export default app;
