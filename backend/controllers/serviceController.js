import Service from '../models/Service.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      order: [['createdAt', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin Only)
export const updateService = async (req, res, next) => {
  try {
    const { badge, title, description, imageUrl, imageLeft, link, phone, email, address } = req.body;
    const service = await Service.findByPk(req.params.id);

    if (service) {
      if (badge !== undefined) service.badge = badge;
      if (title !== undefined) service.title = title;
      if (description !== undefined) service.description = description;
      if (imageUrl !== undefined) service.imageUrl = imageUrl;
      if (imageLeft !== undefined) service.imageLeft = imageLeft;
      if (link !== undefined) service.link = link;
      if (phone !== undefined) service.phone = phone;
      if (email !== undefined) service.email = email;
      if (address !== undefined) service.address = address;

      const updatedService = await service.save();
      res.json(updatedService);
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
    const { id, badge, title, description, imageUrl, imageLeft, link, phone, email, address } = req.body;

    if (!id || !badge || !title || !description || !link) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const serviceExists = await Service.findByPk(id);
    if (serviceExists) {
      res.status(400);
      throw new Error('Service with this ID already exists');
    }

    const service = await Service.create({
      id,
      badge,
      title,
      description,
      imageUrl,
      imageLeft,
      link,
      phone,
      email,
      address,
    });

    res.status(201).json(service);
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
