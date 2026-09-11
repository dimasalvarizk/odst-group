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
      console.log('No services found in database. Seeding defaults with multi-image arrays...');
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
      console.log('Default services seeded successfully.');
    } else {
      // Check if existing records are missing images array or contact details
      const hotels = await Service.findByPk('hotels');
      if (hotels && (!hotels.images || (Array.isArray(hotels.images) && hotels.images.length === 0))) {
        console.log('Migrating existing services to multi-image array defaults...');
        await Service.update(
          { 
            images: defaultHotelImages,
            phone: hotels.phone || '+62 81111 202225', 
            email: hotels.email || 'info@odst.id', 
            address: hotels.address || 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740' 
          },
          { where: { id: 'hotels' } }
        );
        await Service.update(
          { 
            images: defaultAirlineImages,
            phone: '+62 81111 202220', 
            email: 'info@odst.id', 
            address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740' 
          },
          { where: { id: 'airlines' } }
        );
        await Service.update(
          { 
            images: defaultTravelImages,
            phone: '+62 81111 203330', 
            email: 'info@odst.id', 
            address: 'Graha Al Badgel Jl. Hajjah Tutty Alawiyah No.7, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740' 
          },
          { where: { id: 'travel' } }
        );
        console.log('Existing services updated with multi-image arrays and contact info.');
      }
    }
  } catch (error) {
    console.error(`Failed to seed default services: ${error.message}`);
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
    console.log('Schema update notice in content service:', migErr.message);
  }
};

let isSynced = false;
const syncDatabase = async () => {
  if (isSynced) return;
  try {
    await connectDB();
    await ensureSchemaUpdates();
    await sequelize.sync({ alter: false });
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
