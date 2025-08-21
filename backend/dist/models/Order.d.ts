import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    sku: string;
}
export interface IShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
}
export interface IOrder extends Document {
    _id: string;
    orderNumber: string;
    user?: string;
    customerInfo: {
        name: string;
        email: string;
        phone?: string;
    };
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    paymentMethod: 'online' | 'cod';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentDetails?: {
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
        transactionId?: string;
    };
    orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: IShippingAddress;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    notes?: string;
    cancellationReason?: string;
    refundAmount?: number;
    refundStatus?: 'none' | 'requested' | 'processing' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}> & IOrder & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map