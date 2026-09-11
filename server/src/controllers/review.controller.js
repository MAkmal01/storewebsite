import Review from '../models/Review.js';
import Product from '../models/Product.js';

/**
 * @desc Get all reviews for a product
 * @route GET /api/reviews/:productId
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    let avgRating = 5.0;

    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = Number((sum / totalReviews).toFixed(1));
    }

    res.json({
      success: true,
      totalReviews,
      avgRating,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Submit a review for a product
 * @route POST /api/reviews
 */
export const createReview = async (req, res, next) => {
  try {
    const { productId, authorName, rating, title, content } = req.body;

    if (!productId || !authorName || !rating || !content) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, author name, rating, and review content are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const review = await Review.create({
      productId,
      authorName: authorName.trim(),
      rating: Number(rating),
      title: title ? title.trim() : '',
      content: content.trim(),
      verifiedBuyer: true,
    });

    // Update product rating and reviews count
    const allReviews = await Review.find({ productId });
    const count = allReviews.length;
    const avg = count > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1) : 5.0;

    product.rating = Number(avg);
    product.reviewsCount = count;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for reviewing DN Store.',
      review,
      productRating: product.rating,
      productReviewsCount: product.reviewsCount,
    });
  } catch (error) {
    next(error);
  }
};
