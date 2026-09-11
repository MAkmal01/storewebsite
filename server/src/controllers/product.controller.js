import Product from '../models/Product.js';

/**
 * @desc Get all products with filters, search, sort, pagination
 * @route GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      featured,
      combo,
      badge,
      minPrice,
      maxPrice,
      search,
      sort,
      inStock,
      page = 1,
      limit = 40,
    } = req.query;

    const query = {};

    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (combo === 'true') {
      query.isCombo = true;
    }

    if (badge) {
      query.badge = badge.toUpperCase();
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'featured') {
      sortOptions = { isFeatured: -1, createdAt: -1 };
    } else if (sort === 'title-asc') {
      sortOptions = { title: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single product by id or slug
 * @route GET /api/products/:idOrSlug
 */
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .sort({ rating: -1 });

    res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all distinct categories and product counts
 * @route GET /api/products/categories/meta
 */
export const getCategoriesMeta = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ['$images', 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const totalProducts = await Product.countDocuments();
    const comboCount = await Product.countDocuments({ isCombo: true });

    res.json({
      success: true,
      totalProducts,
      comboCount,
      categories: categories.map((c) => ({
        name: c._id,
        count: c.count,
        image: c.image,
      })),
    });
  } catch (error) {
    next(error);
  }
};
