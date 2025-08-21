import mongoose, { Document } from 'mongoose';
export interface INewsletter extends Document {
    _id: string;
    email: string;
    isActive: boolean;
    subscribedAt: Date;
    unsubscribedAt?: Date;
    lastEmailSent?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<INewsletter, {}, {}, {}, mongoose.Document<unknown, {}, INewsletter, {}> & INewsletter & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Newsletter.d.ts.map