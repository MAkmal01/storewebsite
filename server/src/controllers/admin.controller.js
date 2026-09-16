import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { generateToken } from '../middleware/adminAuth.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'store_products' },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
// POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = generateToken(admin._id);
    res.json({ token, username: admin.username, message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stockQuantity: { $lte: 5 } });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const revenue = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['Cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalReviews,
      lowStockProducts,
      ordersByStatus: { pending: pendingOrders, confirmed: confirmedOrders, shipped: shippedOrders, delivered: deliveredOrders },
      revenue: revenue[0]?.total || 0,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (e) {}
    return val
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

// POST /api/admin/products
export const createProduct = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? [...req.body.images] : [req.body.images];
    }
    
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file));
      const newUrls = await Promise.all(uploadPromises);
      imageUrls = [...imageUrls, ...newUrls];
    }
    
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const productData = { 
      ...req.body, 
      slug, 
      images: imageUrls,
      details: parseList(req.body.details),
      careInstructions: parseList(req.body.careInstructions),
    };
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/admin/products/:id
export const updateProduct = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? [...req.body.images] : [req.body.images];
    }
    
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file));
      const newUrls = await Promise.all(uploadPromises);
      imageUrls = [...imageUrls, ...newUrls];
    }
    
    if (req.body.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    const productData = { ...req.body, images: imageUrls.length > 0 ? imageUrls : req.body.images };
    if (req.body.details !== undefined) {
      productData.details = parseList(req.body.details);
    }
    if (req.body.careInstructions !== undefined) {
      productData.careInstructions = parseList(req.body.careInstructions);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/admin/products/:id/stock
export const updateStock = async (req, res) => {
  try {
    const { stockQuantity, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stockQuantity, inStock: inStock !== undefined ? inStock : stockQuantity > 0 },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    await Review.deleteMany({ productId: req.params.id });
    res.json({ message: 'Product and associated reviews deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/admin/reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate({ path: 'productId', select: 'title slug images' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.json({ message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
