import Service from '../models/Service.js';
import sequelize from '../config/db.js';

// Helper to format service output with normalized images array
const formatService = (service) => {
  const plain = service.get ? service.get({ plain: true }) : { ...service };
  let images = plain.images;

  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch {
      images = images ? [images] : [];
    }
  }

  if (!Array.isArray(images) || images.length === 0) {
    images = plain.imageUrl ? [plain.imageUrl] : [];
  }

  return {
    ...plain,
    images,
    imageUrl: plain.imageUrl || (images.length > 0 ? images[0] : ''),
  };
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      order: [['createdAt', 'ASC']]
    });
    res.json(services.map(formatService));
  } catch (error) {
    // Self-healing migration fallback if column 'images' is missing in existing DB
    if (error.message && (error.message.includes('Unknown column') || error.message.includes('images'))) {
      try {
        console.log("Self-healing: adding 'images' column to 'Services' table...");
        await sequelize.query(`ALTER TABLE Services ADD COLUMN images JSON NULL`);
        const services = await Service.findAll({
          order: [['createdAt', 'ASC']]
        });
        return res.json(services.map(formatService));
      } catch (retryErr) {
        return next(retryErr);
      }
    }
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin Only)
export const updateService = async (req, res, next) => {
  try {
    const { badge, title, description, imageUrl, images, imageLeft, link, phone, email, address } = req.body;
    const service = await Service.findByPk(req.params.id);

    if (service) {
      if (badge !== undefined) service.badge = badge;
      if (title !== undefined) service.title = title;
      if (description !== undefined) service.description = description;
      
      // Update images array and sync with imageUrl
      if (images !== undefined) {
        service.images = Array.isArray(images) ? images : (images ? [images] : []);
        if (imageUrl === undefined) {
          service.imageUrl = service.images.length > 0 ? service.images[0] : '';
        }
      }
      
      if (imageUrl !== undefined) {
        service.imageUrl = imageUrl;
        if (images === undefined && (!service.images || service.images.length === 0)) {
          service.images = imageUrl ? [imageUrl] : [];
        }
      }

      if (imageLeft !== undefined) service.imageLeft = imageLeft;
      if (link !== undefined) service.link = link;
      if (phone !== undefined) service.phone = phone;
      if (email !== undefined) service.email = email;
      if (address !== undefined) service.address = address;

      const updatedService = await service.save();
      res.json(formatService(updatedService));
    } else {
      res.status(404);
      throw new Error('Service not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin Only)
export const createService = async (req, res, next) => {
  try {
    const { id, badge, title, description, imageUrl, images, imageLeft, link, phone, email, address } = req.body;

    if (!id || !badge || !title || !description || !link) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const serviceExists = await Service.findByPk(id);
    if (serviceExists) {
      res.status(400);
      throw new Error('Service with this ID already exists');
    }

    const normalizedImages = Array.isArray(images) ? images : (imageUrl ? [imageUrl] : []);
    const normalizedImageUrl = imageUrl || (normalizedImages.length > 0 ? normalizedImages[0] : '');

    const service = await Service.create({
      id,
      badge,
      title,
      description,
      imageUrl: normalizedImageUrl,
      images: normalizedImages,
      imageLeft,
      link,
      phone,
      email,
      address,
    });

    res.status(201).json(formatService(service));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin Only)
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (service) {
      await service.destroy();
      res.json({ message: 'Service removed successfully' });
    } else {
      res.status(404);
      throw new Error('Service not found');
    }
  } catch (error) {
    next(error);
  }
};
