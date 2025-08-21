import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'concentrate' | 'tube' | 'flavored' | 'tea';
  images: string[];
  mainImage: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    caffeine: number;
    sugar: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  instructions: string[];
  badges: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['concentrate', 'tube', 'flavored', 'tea'],
  },
  images: [{
    type: String,
    required: true,
  }],
  mainImage: {
    type: String,
    required: [true, 'Main product image is required'],
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  nutrition: {
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    caffeine: {
      type: Number,
      required: true,
      min: 0,
    },
    sugar: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      min: 0,
    },
    carbs: {
      type: Number,
      min: 0,
    },
    fat: {
      type: Number,
      min: 0,
    },
  },
  instructions: [{
    type: String,
    required: true,
  }],
  badges: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  weight: {
    type: Number,
    min: 0,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  tags: [{
    type: String,
    lowercase: true,
  }],
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

// Indexes for better query performance
// Create a text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Create compound indexes for common query patterns
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ rating: -1, isActive: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IProduct>('Product', productSchema);