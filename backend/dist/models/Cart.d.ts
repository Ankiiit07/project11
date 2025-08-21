import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}> & ICart & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map