import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const schemas: {
    register: Joi.ObjectSchema<any>;
    login: Joi.ObjectSchema<any>;
    updateProfile: Joi.ObjectSchema<any>;
    createProduct: Joi.ObjectSchema<any>;
    updateProduct: Joi.ObjectSchema<any>;
    createOrder: Joi.ObjectSchema<any>;
    createPayment: Joi.ObjectSchema<any>;
    contact: Joi.ObjectSchema<any>;
    queryParams: Joi.ObjectSchema<any>;
};
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRequest: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const sanitizeInput: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map