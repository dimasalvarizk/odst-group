import Newsletter from '../models/Newsletter.js';
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || '3a6e7ab430939fad6216bd7683797375-us11',
  server: process.env.MAILCHIMP_SERVER_PREFIX || 'us11',
});

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

    // Send directly to Mailchimp only
    try {
      const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID || '88e3c0fded', {
        email_address: email.toLowerCase(),
        status: 'subscribed',
        merge_fields: {
          FNAME: fullName,
          PHONE: phone
        }
      });
      
      console.log(`Mailchimp subscription successful for: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Subscribed to newsletter successfully',
        data: response,
      });
    } catch (mcError) {
      console.error(`Mailchimp subscription failed:`, mcError);
      
      // Extract Mailchimp error details
      const status = mcError.status || 400;
      res.status(status);
      
      if (mcError.title === 'Member Exists') {
        throw new Error('Email is already subscribed to the newsletter');
      } else {
        throw new Error(mcError.detail || mcError.message || 'Mailchimp subscription failed');
      }
    }
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
