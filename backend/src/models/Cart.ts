import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId | string;
  quantity: number;
  type: 'single' | 'subscription';
}

export interface ICart extends Document {
  _id: string;
  user?: mongoose.Types.ObjectId | string;
  sessionId?: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  type: {
    type: String,
    enum: ['single', 'subscription'],
    default: 'single',
  },
});

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionId: {
    type: String,
  },
  items: [cartItemSchema],
}, {
  timestamps: true,
});

// Ensure either user or sessionId is present
// Create compound index for session expiry
cartSchema.index({ sessionId: 1, updatedAt: 1 });
cartSchema.index({ user: 1, updatedAt: 1 });

// Remove expired guest carts (older than 30 days)
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model<ICart>('Cart', cartSchema);