import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';

dotenv.config();

const products = [
  {
    name: 'Cafe at Once Latte',
    description: 'Rich, bold espresso concentrate perfect for your daily coffee ritual. Made from premium Arabica beans.',
    price: 199,
    originalPrice: 235,
    category: 'concentrate',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
    ],
    mainImage: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 120,
      sugar: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 4-6 oz of hot or cold water',
      'Stir and enjoy your perfect espresso',
    ],
    badges: ['No Sugar', 'Gluten Free', 'Organic'],
    rating: 4.8,
    reviewCount: 234,
    stock: 100,
    sku: 'CAO-LATTE-001',
    isFeatured: true,
    tags: ['coffee', 'latte', 'concentrate', 'arabica'],
  },
  {
    name: 'Cafe at Once Americano',
    description: 'Smooth and balanced Americano concentrate for the perfect cup every time.',
    price: 199,
    originalPrice: 235,
    category: 'concentrate',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
    ],
    mainImage: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 95,
      sugar: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 6-8 oz of hot or cold water',
      'Stir and enjoy your perfect Americano',
    ],
    badges: ['No Sugar', 'Gluten Free'],
    rating: 4.7,
    reviewCount: 189,
    stock: 100,
    sku: 'CAO-AMER-002',
    isFeatured: true,
    tags: ['coffee', 'americano', 'concentrate', 'arabica'],
  },
  {
    name: 'Cafe at Once Tea & Coffee',
    description: 'Smooth, refreshing cold brew concentrate with low acidity and natural sweetness.',
    price: 199,
    originalPrice: 235,
    category: 'concentrate',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
    ],
    mainImage: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 110,
      sugar: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 6-8 oz of cold water or milk',
      'Add ice and enjoy your cold brew',
    ],
    badges: ['No Sugar', 'Organic', 'Cold Brew'],
    rating: 4.9,
    reviewCount: 312,
    stock: 100,
    sku: 'CAO-TCOF-003',
    isFeatured: true,
    tags: ['coffee', 'tea', 'concentrate', 'cold-brew'],
  },
  {
    name: 'Cafe at Once Mocha',
    description: 'Rich chocolate and coffee blend in a convenient tube format.',
    price: 199,
    originalPrice: 235,
    category: 'tube',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
    ],
    mainImage: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
    ingredients: ['Arabica Coffee', 'Natural Cocoa', 'Natural Flavors'],
    nutrition: {
      calories: 15,
      caffeine: 85,
      sugar: 2,
    },
    instructions: [
      'Peel the tube',
      'Press into 6 oz of hot milk or water',
      'Stir well for the perfect mocha',
    ],
    badges: ['No Added Sugar', 'Real Cocoa'],
    rating: 4.6,
    reviewCount: 156,
    stock: 100,
    sku: 'CAO-MOCH-004',
    isFeatured: false,
    tags: ['coffee', 'mocha', 'chocolate', 'tube'],
  },
  {
    name: 'Cafe at Once Espresso',
    description: 'Creamy vanilla latte with natural Espresso extract and premium coffee.',
    price: 379,
    originalPrice: 447,
    category: 'flavored',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
    ],
    mainImage: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
    ingredients: ['Arabica Coffee', 'Natural Espresso Extract', 'Natural Flavors'],
    nutrition: {
      calories: 20,
      caffeine: 90,
      sugar: 3,
    },
    instructions: [
      'Peel the tube',
      'Press into 6 oz of hot milk',
      'Stir and enjoy your vanilla latte',
    ],
    badges: ['Real Espresso', 'No Artificial Flavors'],
    rating: 4.5,
    reviewCount: 143,
    stock: 100,
    sku: 'CAO-ESPR-005',
    isFeatured: true,
    tags: ['coffee', 'espresso', 'premium', 'flavored'],
  },
  {
    name: 'Cafe at Once Cold Brew II',
    description: 'Sweet and smooth caramel macchiato with rich espresso and natural caramel.',
    price: 199,
    originalPrice: 235,
    category: 'flavored',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
    ],
    mainImage: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
    ingredients: ['Arabica Coffee', 'Natural Caramel', 'Natural Flavors'],
    nutrition: {
      calories: 25,
      caffeine: 95,
      sugar: 4,
    },
    instructions: [
      'Peel the tube',
      'Press into 6 oz of steamed milk',
      'Create beautiful latte art if desired',
    ],
    badges: ['Real Caramel', 'Premium Coffee', 'Coming Soon'],
    rating: 4.7,
    reviewCount: 198,
    stock: 100,
    sku: 'CAO-CBRU-006',
    isFeatured: false,
    tags: ['coffee', 'cold-brew', 'caramel', 'flavored'],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();