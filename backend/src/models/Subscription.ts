import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  user: mongoose.Types.ObjectId | string;
  products: Array<{
    product: mongoose.Types.ObjectId | string;
    quantity: number;
  }>;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  status: 'active' | 'paused' | 'cancelled';
  nextDelivery: Date;
  lastDelivery?: Date;
  totalAmount: number;
  discount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  startDate: Date;
  endDate?: Date;
  pausedUntil?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  frequency: {
    type: String,
    required: true,
    enum: ['weekly', 'biweekly', 'monthly'],
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
  },
  nextDelivery: {
    type: Date,
    required: true,
  },
  lastDelivery: Date,
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 15, // 15% subscription discount
    min: 0,
    max: 100,
  },
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'India',
    },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: Date,
  pausedUntil: Date,
  cancellationReason: String,
}, {
  timestamps: true,
});

// Indexes
// Create compound indexes for common query patterns
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ status: 1, nextDelivery: 1 });

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);