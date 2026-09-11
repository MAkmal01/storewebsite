import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import Admin from './models/Admin.js';

dotenv.config();

const MOCK_PRODUCTS = [
  // WATCHES
  {
    title: 'Royal Chronograph Elite',
    description: 'Precision-engineered luxury chronograph watch featuring a scratch-resistant sapphire crystal and genuine leather strap.',
    price: 45000,
    comparePrice: 65000,
    category: 'watches',
    inStock: true,
    stockQuantity: 12,
    badge: 'LUXURY',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Rose Gold / Black', hex: '#b76e79' },
        { name: 'Silver / Navy', hex: '#c0c0c0' }
      ]
    },
    details: ['Case Size: 42mm', 'Movement: Automatic', 'Water Resistance: 5 ATM', 'Crystal: Sapphire'],
    careInstructions: ['Wipe gently with a soft cloth.', 'Avoid exposure to strong magnetic fields.']
  },
  {
    title: 'Minimalist Signature Timepiece',
    description: 'A sleek, minimalist watch designed for the modern executive. Ultra-thin profile with a stainless steel mesh band.',
    price: 18500,
    comparePrice: 22000,
    category: 'watches',
    inStock: true,
    stockQuantity: 30,
    badge: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1508656934053-61400bc7daae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e32a6adcae16?q=80&w=800&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Matte Black', hex: '#222222' },
        { name: 'Brushed Silver', hex: '#d1d1d1' }
      ]
    },
    details: ['Case Size: 38mm', 'Movement: Quartz', 'Water Resistance: 3 ATM'],
  },

  // WALLETS
  {
    title: 'Executive Bi-Fold Leather Wallet',
    description: 'Handcrafted from premium full-grain leather, featuring RFID protection and 8 card slots.',
    price: 6500,
    comparePrice: 8000,
    category: 'wallets',
    inStock: true,
    stockQuantity: 45,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=800&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Chestnut Brown', hex: '#5c4033' },
        { name: 'Midnight Black', hex: '#111111' }
      ]
    },
    details: ['Material: 100% Full-grain Leather', 'Dimensions: 4.5" x 3.5"', '8 Card Slots, 2 Bill Compartments', 'RFID Blocking'],
  },
  {
    title: 'Slim Front Pocket Cardholder',
    description: 'Minimalist cardholder designed to easily slip into your front pocket. Holds up to 6 cards and folded bills.',
    price: 3200,
    category: 'wallets',
    inStock: true,
    stockQuantity: 60,
    badge: 'ESSENTIAL',
    images: [
      'https://images.unsplash.com/photo-1605810753556-9e6e44b58e72?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554160350-f8cc0414abcc?q=80&w=800&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Tan', hex: '#d2b48c' },
        { name: 'Black', hex: '#000000' }
      ]
    },
  },

  // PERFUMES
  {
    title: 'Oud Al Maliki Extrait de Parfum',
    description: 'A mesmerizing and intense fragrance featuring pure agarwood, spicy saffron, and rich amber notes.',
    price: 12500,
    comparePrice: 15000,
    category: 'perfumes',
    inStock: true,
    stockQuantity: 25,
    badge: 'HOT',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop'
    ],
    variants: { sizes: ['50ml', '100ml'] },
    details: ['Top Notes: Saffron, Rose', 'Heart Notes: Agarwood (Oud), Patchouli', 'Base Notes: Amber, Musk', 'Longevity: 12+ hours'],
  },
  {
    title: 'Oceanic Breeze Eau de Parfum',
    description: 'A fresh, aquatic fragrance perfect for daily wear, blending citrus bursts with deep sea salt and cedarwood.',
    price: 8500,
    category: 'perfumes',
    inStock: true,
    stockQuantity: 40,
    images: [
      'https://images.unsplash.com/photo-1595535593816-085e34b92b67?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'
    ],
    variants: { sizes: ['100ml'] },
    details: ['Top Notes: Bergamot, Sea Salt', 'Heart Notes: Rosemary, Sage', 'Base Notes: Cedarwood, Vetiver'],
  },

  // JEWELLERY
  {
    title: '18K Gold Plated Tennis Bracelet',
    description: 'A stunning tennis bracelet adorned with brilliant-cut cubic zirconia, set in heavy 18K gold plating.',
    price: 15000,
    comparePrice: 22000,
    category: 'jewellery',
    inStock: true,
    stockQuantity: 15,
    badge: 'SALE',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'
    ],
    details: ['Material: Brass with 18K Gold Plating', 'Stone: AAA Cubic Zirconia', 'Length: 7.5 inches', 'Clasp: Secure box catch'],
    careInstructions: ['Keep away from water and perfumes.', 'Store in the provided velvet pouch.']
  },
  {
    title: 'Sterling Silver Minimalist Ring',
    description: 'An elegant, everyday sterling silver ring featuring a subtle hammered texture finish.',
    price: 4500,
    category: 'jewellery',
    inStock: true,
    stockQuantity: 35,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b6548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a8f7d6f081c?q=80&w=800&auto=format&fit=crop'
    ],
    variants: { sizes: ['6', '7', '8', '9'] },
    details: ['Material: 925 Sterling Silver', 'Finish: Hammered texture'],
  },

  // GIFT ITEMS
  {
    title: 'Royal Executive Gift Set',
    description: 'The ultimate gift set containing our signature leather wallet, a premium rollerball pen, and a classic keychain.',
    price: 14500,
    comparePrice: 18000,
    category: 'gifts',
    inStock: true,
    stockQuantity: 20,
    isCombo: true,
    images: [
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop'
    ],
    details: ['Includes: Leather Wallet, Metal Pen, Keychain', 'Packaging: Premium magnetic closure gift box'],
  },
  {
    title: 'Scented Candle & Diffuser Duo',
    description: 'Create a luxurious ambiance with our signature home fragrance set featuring natural soy wax and essential oils.',
    price: 7500,
    category: 'gifts',
    inStock: true,
    stockQuantity: 50,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop'
    ],
    variants: {
      colors: [
        { name: 'Vanilla Sandalwood', hex: '#f3e5ab' },
        { name: 'Midnight Jasmine', hex: '#ffffff' }
      ]
    },
  },

  // MOBILE ACCESSORIES
  {
    title: 'Premium Leather Phone Case',
    description: 'Protect your device in style with our full-grain leather case featuring a microfiber lining and raised bezels.',
    price: 4500,
    category: 'mobile-accessories',
    inStock: true,
    stockQuantity: 80,
    badge: 'NEW',
    images: [
      'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop'
    ],
    variants: {
      sizes: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 14 Pro Max', 'Galaxy S24 Ultra'],
      colors: [
        { name: 'Saddle Brown', hex: '#8b4513' },
        { name: 'Navy Blue', hex: '#000080' }
      ]
    },
  },
  {
    title: 'Magnetic Wireless Power Bank',
    description: 'Sleek, aluminum-encased 10,000mAh magnetic wireless charger for on-the-go power.',
    price: 8500,
    comparePrice: 10000,
    category: 'mobile-accessories',
    inStock: true,
    stockQuantity: 40,
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop'
    ],
    details: ['Capacity: 10,000mAh', 'Output: 15W Wireless / 20W USB-C', 'Material: Aerospace-grade aluminum'],
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    console.log('Inserting Royal Choice products...');
    const productsWithSlugs = MOCK_PRODUCTS.map(p => ({
      ...p,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
    const insertedProducts = await Product.insertMany(productsWithSlugs);
    console.log(`${insertedProducts.length} products inserted!`);

    // Add some reviews to the first product (Watch)
    if (insertedProducts.length > 0) {
      const watch = insertedProducts[0];
      const reviews = [
        {
          productId: watch._id,
          authorName: 'Faisal R.',
          rating: 5,
          title: 'Exceptional Quality',
          content: 'The finish on this watch is incredible for the price. Feels very premium on the wrist.',
          verifiedBuyer: true
        },
        {
          productId: watch._id,
          authorName: 'Usman T.',
          rating: 4,
          title: 'Beautiful but slightly heavy',
          content: 'A stunning timepiece. It has a bit of weight to it, which some may like, but it took me a day to get used to it.',
          verifiedBuyer: true
        }
      ];
      await Review.insertMany(reviews);
      console.log('Mock reviews inserted!');
    }

    // Seed admin user
    await Admin.deleteMany({});
    const admin = new Admin({ username: 'admin', password: 'admin123' });
    await admin.save();
    console.log('Admin user created (username: admin, password: admin123)');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
