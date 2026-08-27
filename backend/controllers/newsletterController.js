import Newsletter from '../models/Newsletter.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletters
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { fullName, phone, email } = req.body;

    if (!fullName || !phone || !email) {
      res.status(400);
      throw new Error('Please enter all required fields');
    }

    // Check if email already subscribed in MySQL
    const emailExists = await Newsletter.findOne({
      where: { email: email.toLowerCase() }
    });

    if (emailExists) {
      res.status(400);
      throw new Error('Email is already subscribed to the newsletter');
    }

    const subscriber = await Newsletter.create({
      fullName,
      phone,
      email: email.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: 'Subscribed to newsletter successfully',
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletters
// @access  Private (Admin Only)
export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe / Delete newsletter subscriber
// @route   DELETE /api/newsletters/:id
// @access  Private (Admin Only)
export const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findByPk(req.params.id);

    if (subscriber) {
      await subscriber.destroy();
      res.json({ message: 'Subscriber unsubscribed/removed successfully' });
    } else {
      res.status(404);
      throw new Error('Subscriber not found');
    }
  } catch (error) {
    next(error);
  }
};
