import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Helper function to send email notification to the administrator
const sendNotificationEmail = async (contactData) => {
  // If SMTP host is not configured, skip email sending
  if (!process.env.SMTP_HOST) {
    console.log('SMTP_HOST is not configured. Skipping email notification.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587/other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${contactData.fullName} via ODST Inquiry" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_NOTIFICATION_EMAIL || 'info@odst.id',
      replyTo: contactData.email,
      subject: `New ODST Inquiry - Division: ${contactData.department}`,
      text: `You have received a new contact inquiry from the ODST website.
      
Detail Visitor:
- Name: ${contactData.fullName}
- Email: ${contactData.email}
- Phone: ${contactData.phone}
- Division/Department: ${contactData.department}

Message:
"${contactData.message}"

This email is sent automatically from the ODST Portal.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 8px;">
          <h2 style="color: #0c1a30; border-bottom: 2px solid #ea580c; padding-bottom: 10px; font-weight: bold;">New Contact Inquiry</h2>
          <p>You have received a new contact inquiry from the ODST website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; width: 150px; border: 1px solid #e2e8f0;">Name</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${contactData.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Email</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${contactData.email}">${contactData.email}</a></td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Phone</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="tel:${contactData.phone}">${contactData.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Division</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">${contactData.department}</td>
            </tr>
          </table>
          
          <h3 style="color: #0c1a30; margin-top: 20px;">Message:</h3>
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #ea580c; font-style: italic; white-space: pre-wrap; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
            "${contactData.message}"
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            This email is sent automatically from the ODST Portal.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Notification email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send notification email: ${error.message}`);
    // Do not throw the error, we want the controller to still succeed
  }
};

// @desc    Submit a new contact inquiry
// @route   POST /api/contacts
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { fullName, email, phone, department, message } = req.body;

    if (!fullName || !email || !phone || !department || !message) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const contact = await Contact.create({
      fullName,
      email,
      phone,
      department,
      message,
    });

    // Send email notification in the background
    sendNotificationEmail(contact);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contacts
// @access  Private (Admin Only)
export const getContacts = async (req, res, next) => {
  try {
    // Sort by newest first in MySQL
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact inquiry by ID
// @route   GET /api/contacts/:id
// @access  Private (Admin Only)
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (contact) {
      // If contact is unread, automatically mark as read when viewed
      if (contact.status === 'unread') {
        contact.status = 'read';
        await contact.save();
      }
      res.json(contact);
    } else {
      res.status(404);
      throw new Error('Contact inquiry not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact inquiry status
// @route   PUT /api/contacts/:id
// @access  Private (Admin Only)
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }

    const contact = await Contact.findByPk(req.params.id);

    if (contact) {
      contact.status = status;
      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404);
      throw new Error('Contact inquiry not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact inquiry
// @route   DELETE /api/contacts/:id
// @access  Private (Admin Only)
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (contact) {
      await contact.destroy();
      res.json({ message: 'Contact inquiry removed successfully' });
    } else {
      res.status(404);
      throw new Error('Contact inquiry not found');
    }
  } catch (error) {
    next(error);
  }
};
