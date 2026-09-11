import Subscriber from '../models/Subscriber.js';

/**
 * @desc Subscribe to newsletter
 * @route POST /api/newsletter
 */
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({
        success: true,
        message: 'You are already subscribed to DN Store VIP drops! Use promo code DN10 at checkout.',
        discountCode: 'DN10',
      });
    }

    await Subscriber.create({ email: cleanEmail });

    res.status(201).json({
      success: true,
      message: 'Welcome to APKA APNA DN STORE! Use coupon code DN10 for 10% off your first order.',
      discountCode: 'DN10',
    });
  } catch (error) {
    next(error);
  }
};
