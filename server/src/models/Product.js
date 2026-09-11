import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subcategory: {
      type: String,
      default: '',
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    variants: {
      sizes: [
        {
          type: String,
        },
      ],
      colors: [
        {
          name: String,
          hex: String,
        },
      ],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isCombo: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 50,
    },
    tags: [
      {
        type: String,
      },
    ],
    badge: {
      type: String,
      default: '', // 'SALE', 'BESTSELLER', 'HOT', 'LIMITED'
    },
    details: [
      {
        type: String,
      },
    ],
    careInstructions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
export default Product;
