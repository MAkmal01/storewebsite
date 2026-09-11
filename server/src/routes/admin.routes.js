import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import upload from '../middleware/upload.middleware.js';
import {
  loginAdmin,
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllReviews,
  deleteReview,
} from '../controllers/admin.controller.js';

const router = express.Router();

// Public: Admin login
router.post('/login', loginAdmin);

// Protected: All routes below require admin auth
router.use(adminAuth);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products CRUD
router.get('/products', getAllProducts);
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.patch('/products/:id/stock', updateStock);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Reviews
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
