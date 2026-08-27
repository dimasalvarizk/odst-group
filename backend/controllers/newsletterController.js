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

// @desc    Get all newsletter subscribers from Mailchimp
// @route   GET /api/newsletters
// @access  Private (Admin Only)
export const getSubscribers = async (req, res, next) => {
  try {
    const response = await mailchimp.lists.getListMembersInfo(process.env.MAILCHIMP_AUDIENCE_ID || '88e3c0fded', {
      count: 100,
    });
    
    // Map Mailchimp members to match the structure the frontend expects
    const subscribers = (response.members || []).map((member) => ({
      id: member.id, // Mailchimp MD5 hash of email
      fullName: member.merge_fields.FNAME || 'Subscriber',
      phone: member.merge_fields.PHONE || 'N/A',
      email: member.email_address,
      createdAt: member.timestamp_opt || member.last_changed || new Date(),
    }));

    res.json(subscribers);
  } catch (error) {
    console.error('Mailchimp fetch subscribers failed, falling back to empty list:', error);
    res.json([]);
  }
};

// @desc    Unsubscribe / Delete newsletter subscriber from Mailchimp
// @route   DELETE /api/newsletters/:id
// @access  Private (Admin Only)
export const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const subscriberId = req.params.id; // Mailchimp MD5 hash
    
    await mailchimp.lists.deleteListMember(process.env.MAILCHIMP_AUDIENCE_ID || '88e3c0fded', subscriberId);
    
    res.json({ message: 'Subscriber removed successfully from Mailchimp' });
  } catch (error) {
    next(error);
  }
};
