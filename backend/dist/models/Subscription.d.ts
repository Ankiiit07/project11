import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ISubscription, {}, {}, {}, mongoose.Document<unknown, {}, ISubscription, {}> & ISubscription & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Subscription.d.ts.map