import express from 'express';
import {
  createOrder,
  trackOrder,
  getOrderById,
} from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/track', trackOrder);
router.get('/:id', getOrderById);

export default router;
