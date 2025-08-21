import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}> & IProduct & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map