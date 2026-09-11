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
      const defaultHotelImages = [
        'hotels',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
      ];
      const defaultAirlineImages = [
        'airlines',
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=80'
      ];
      const defaultTravelImages = [
        'travel',
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
      ];

      if (count === 0) {
        await Service.bulkCreate([
          {
            id: 'hotels',
            badge: 'Premium Hospitality',
            title: 'ODST Hotels',
            description: 'Provides hospitality services close to the Holy sites. Our hotels offer comfort, convenience, and spiritual tranquility for many pilgrims. Experience refined stays with panoramic views of the Holy Mosque.',
            imageUrl: 'hotels',
            images: defaultHotelImages,
            imageLeft: false,
            link: '#hotels',
            phone: '+62 81111 202225',
            email: 'info@odst.id',
            address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740'
          },
          {
            id: 'airlines',
            badge: 'Aviation & Charter',
            title: 'ODST Airlines',
            description: 'Seamless journeys to the Holy Land. Dedicated charters and flight solutions with exceptional comfort, premium catering, and a deeply attentive service tailored for your spiritual journey.',
            imageUrl: 'airlines',
            images: defaultAirlineImages,
            imageLeft: true,
            link: '#airlines',
            phone: '+62 81111 202220',
            email: 'info@odst.id',
            address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740'
          },
          {
            id: 'travel',
            badge: 'Bespoke Journeys',
            title: 'ODST Tour & Travel',
            description: 'Complete pilgrim and package travel solutions for your needs. From guide grouping to highly personalized guided tours and excellent ground transportation, we handle every detail so you can focus on your spiritual fulfillment.',
            imageUrl: 'travel',
            images: defaultTravelImages,
            imageLeft: false,
            link: '#travel',
            phone: '+62 81111 203330',
            email: 'info@odst.id',
            address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740'
          }
        ]);
      } else {
        const hotels = await Service.findByPk('hotels');
        if (hotels && (!hotels.images || (Array.isArray(hotels.images) && hotels.images.length === 0))) {
          await Service.update({ images: defaultHotelImages }, { where: { id: 'hotels' } });
          await Service.update({ images: defaultAirlineImages }, { where: { id: 'airlines' } });
          await Service.update({ images: defaultTravelImages }, { where: { id: 'travel' } });
        }
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

  const ensureSchemaUpdates = async () => {
    try {
      const [tables] = await sequelize.query(`SHOW TABLES LIKE 'Services'`);
      if (tables && tables.length > 0) {
        const [imgCol] = await sequelize.query(`SHOW COLUMNS FROM Services LIKE 'images'`);
        if (!imgCol || imgCol.length === 0) {
          console.log("Adding missing 'images' column to 'Services' table...");
          await sequelize.query(`ALTER TABLE Services ADD COLUMN images JSON NULL`);
          console.log("Successfully added 'images' column to Services.");
        }

        const [phoneCol] = await sequelize.query(`SHOW COLUMNS FROM Services LIKE 'phone'`);
        if (!phoneCol || phoneCol.length === 0) {
          await sequelize.query(`ALTER TABLE Services ADD COLUMN phone VARCHAR(255) NULL`);
        }
        const [emailCol] = await sequelize.query(`SHOW COLUMNS FROM Services LIKE 'email'`);
        if (!emailCol || emailCol.length === 0) {
          await sequelize.query(`ALTER TABLE Services ADD COLUMN email VARCHAR(255) NULL`);
        }
        const [addrCol] = await sequelize.query(`SHOW COLUMNS FROM Services LIKE 'address'`);
        if (!addrCol || addrCol.length === 0) {
          await sequelize.query(`ALTER TABLE Services ADD COLUMN address TEXT NULL`);
        }
      }
    } catch (migErr) {
      console.log('Schema update notice:', migErr.message);
    }
  };

  let isSynced = false;
  const syncDatabase = async () => {
    if (isSynced) return;
    try {
      await connectDB();
      await ensureSchemaUpdates();
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

// Only listen if not running in a serverless environment (like Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });
}

export default app;
