import express from 'express';
import {
  subscribeNewsletter,
  getSubscribers,
  unsubscribeNewsletter,
} from '../controllers/newsletterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public subscription, and Admin view list
router.route('/')
  .post(subscribeNewsletter)
  .get(protect, getSubscribers);

// Admin unsubscribe/delete subscriber
router.route('/:id')
  .delete(protect, unsubscribeNewsletter);

export default router;
