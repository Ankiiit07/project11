import mongoose from 'mongoose';
import request from 'supertest';
export declare const testUtils: {
    createTestUser: (userData?: any) => Promise<any>;
    createTestProduct: (productData?: any) => Promise<any>;
    loginAndGetToken: (email: string, password: string) => Promise<any>;
    authenticatedRequest: (token: string) => import("supertest/lib/agent")<request.SuperTestStatic.Test>;
    generateTestData: {
        user: (overrides?: any) => any;
        product: (overrides?: any) => any;
        order: (overrides?: any) => any;
    };
    db: {
        clearCollection: (collectionName: string) => Promise<void>;
        insertTestData: (collectionName: string, data: any[]) => Promise<mongoose.mongo.InsertManyResult<mongoose.AnyObject>>;
        getCollectionCount: (collectionName: string) => Promise<number>;
        findDocuments: (collectionName: string, query?: any) => Promise<mongoose.mongo.WithId<mongoose.AnyObject>[]>;
    };
    validation: {
        testRequiredFields: (endpoint: string, data: any, requiredFields: string[]) => Promise<void>;
        testFieldValidation: (endpoint: string, data: any, fieldTests: any[]) => Promise<void>;
    };
    performance: {
        measureResponseTime: (requestFn: () => Promise<any>) => Promise<{
            response: any;
            duration: number;
        }>;
        testResponseTime: (requestFn: () => Promise<any>, maxTime?: number) => Promise<{
            response: any;
            duration: number;
        }>;
    };
};
export default testUtils;
//# sourceMappingURL=setup.d.ts.map