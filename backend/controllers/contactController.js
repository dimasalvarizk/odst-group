import Contact from '../models/Contact.js';

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
