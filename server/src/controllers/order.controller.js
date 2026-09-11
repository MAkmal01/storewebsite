import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc Place a new order
 * @route POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      paymentMethod = 'COD',
      discountCode = '',
      notes = '',
    } = req.body;

    if (!customer?.fullName || !customer?.phone || !customer?.email) {
      return res.status(400).json({
        success: false,
        message: 'Customer full name, email, and phone number are required',
      });
    }

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.province) {
      return res.status(400).json({
        success: false,
        message: 'Shipping street address, city, and province are required',
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      const itemTotal = product.price * Number(item.quantity || 1);
      subtotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: Number(item.quantity || 1),
        image: item.image || product.images[0],
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      });
    }

    // Free shipping threshold: Rs. 10,000, otherwise Rs. 250
    const FREE_SHIPPING_THRESHOLD = 10000;
    const STANDARD_SHIPPING_FEE = 250;
    let shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

    // Coupon discount codes
    let discount = 0;
    let validDiscountCode = '';
    if (discountCode) {
      const code = discountCode.trim().toUpperCase();
      if (code === 'DN10') {
        discount = Math.round(subtotal * 0.1);
        validDiscountCode = 'DN10 (10% OFF)';
      } else if (code === 'WELCOME') {
        discount = Math.min(500, subtotal);
        validDiscountCode = 'WELCOME (Rs. 500 OFF)';
      } else if (code === 'FREESHIP') {
        shippingFee = 0;
        validDiscountCode = 'FREESHIP';
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discount);

    // Generate unique order number (e.g. DN-59423)
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DN-${randomDigits}`;

    const order = await Order.create({
      orderNumber,
      customer,
      shippingAddress,
      items: validatedItems,
      subtotal,
      shippingFee,
      discount,
      discountCode: validDiscountCode,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      orderStatus: 'Confirmed',
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! APKA APNA DN STORE will contact you for confirmation.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Track order by order number or phone
 * @route GET /api/orders/track
 */
export const trackOrder = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an Order ID (e.g. DN-12345) or Phone Number',
      });
    }

    const cleanQuery = query.trim();
    const order = await Order.findOne({
      $or: [
        { orderNumber: new RegExp(`^${cleanQuery}$`, 'i') },
        { 'customer.phone': new RegExp(cleanQuery, 'i') },
      ],
    }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No order found matching "${cleanQuery}". Please check your order number or phone number.`,
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get order details by ID
 * @route GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
