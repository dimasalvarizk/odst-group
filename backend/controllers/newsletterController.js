import Newsletter from '../models/Newsletter.js';
import mailchimp from '@mailchimp/mailchimp_marketing';

// Helper to get configured mailchimp client if key is present
const getMailchimpClient = () => {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey || apiKey === 'disabled') return null;

  const server = process.env.MAILCHIMP_SERVER_PREFIX || (apiKey.includes('-') ? apiKey.split('-')[1] : 'us11');
  try {
    mailchimp.setConfig({
      apiKey,
      server,
    });
    return mailchimp;
  } catch (err) {
    console.warn('Mailchimp configuration error:', err.message);
    return null;
  }
};

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

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if already subscribed in local Database
    const existingSubscriber = await Newsletter.findOne({
      where: { email: normalizedEmail }
    });

    if (existingSubscriber) {
      res.status(400);
      throw new Error('Email is already subscribed to the newsletter');
    }

    // 2. Save subscriber into local MySQL Database
    const subscriber = await Newsletter.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: normalizedEmail,
    });

    // 3. Sync to Mailchimp as best-effort if configured
    const client = getMailchimpClient();
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID || '88e3c0fded';

    if (client && audienceId) {
      try {
        await client.lists.addListMember(audienceId, {
          email_address: normalizedEmail,
          status: 'subscribed',
          merge_fields: {
            FNAME: fullName.trim(),
            PHONE: phone.trim(),
          },
        });
        console.log(`Synced subscriber ${normalizedEmail} to Mailchimp successfully.`);
      } catch (mcError) {
        console.warn(`Mailchimp sync warning (${normalizedEmail}): ${mcError.message || mcError.detail}`);
      }
    }

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
    // 1. Always get all subscribers from local Database
    const dbSubscribers = await Newsletter.findAll({
      order: [['createdAt', 'DESC']],
    });

    let subscribers = dbSubscribers.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      phone: item.phone,
      email: item.email,
      createdAt: item.createdAt,
    }));

    // 2. Optionally merge any additional Mailchimp subscribers if reachable
    const client = getMailchimpClient();
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (client && audienceId) {
      try {
        const response = await client.lists.getListMembersInfo(audienceId, { count: 100 });
        const existingEmails = new Set(subscribers.map((s) => s.email.toLowerCase()));

        (response.members || []).forEach((member) => {
          const mEmail = member.email_address.toLowerCase();
          if (!existingEmails.has(mEmail)) {
            subscribers.push({
              id: member.id,
              fullName: member.merge_fields.FNAME || 'Subscriber',
              phone: member.merge_fields.PHONE || 'N/A',
              email: member.email_address,
              createdAt: member.timestamp_opt || member.last_changed || new Date(),
            });
            existingEmails.add(mEmail);
          }
        });
      } catch (mcErr) {
        console.warn('Mailchimp fetch subscribers notice:', mcErr.message);
      }
    }

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
    const subscriberId = req.params.id;

    // 1. Find and delete from local Database
    const subscriber = await Newsletter.findByPk(subscriberId);
    let subscriberEmail = null;

    if (subscriber) {
      subscriberEmail = subscriber.email;
      await subscriber.destroy();
    }

    // 2. Also try deleting from Mailchimp if configured
    const client = getMailchimpClient();
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (client && audienceId) {
      try {
        await client.lists.deleteListMember(audienceId, subscriberId);
      } catch (mcErr) {
        // Mailchimp might fail if id is UUID instead of MD5 hash, ignore
      }
    }

    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    next(error);
  }
};

