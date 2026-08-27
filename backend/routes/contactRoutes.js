import express from 'express';
import {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public submission, and Admin list
router.route('/')
  .post(submitContact)
  .get(protect, getContacts);

// Admin operations on specific inquiries
router.route('/:id')
  .get(protect, getContactById)
  .put(protect, updateContactStatus)
  .delete(protect, deleteContact);

export default router;
