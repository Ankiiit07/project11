"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.validateQuery = exports.validateRequest = exports.validate = exports.schemas = void 0;
const joi_1 = __importDefault(require("joi"));
const AppError_1 = require("../utils/AppError");
const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
};
const customMessages = {
    'string.empty': '{{#label}} cannot be empty',
    'string.min': '{{#label}} must be at least {{#limit}} characters long',
    'string.max': '{{#label}} cannot exceed {{#limit}} characters',
    'string.email': 'Please provide a valid email address',
    'string.pattern.base': '{{#label}} format is invalid',
    'number.base': '{{#label}} must be a number',
    'number.min': '{{#label}} must be at least {{#limit}}',
    'number.max': '{{#label}} cannot exceed {{#limit}}',
    'array.min': '{{#label}} must have at least {{#limit}} items',
    'object.unknown': '{{#label}} contains invalid fields',
    'any.required': '{{#label}} is required',
};
exports.schemas = {
    register: joi_1.default.object({
        name: joi_1.default.string().min(2).max(50).required().messages(customMessages),
        email: joi_1.default.string().email().required().messages(customMessages),
        password: joi_1.default.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
            .messages({
            ...customMessages,
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
        phone: joi_1.default.string().pattern(/^\+?[\d\s-()]+$/).optional().messages(customMessages),
    }),
    login: joi_1.default.object({
        email: joi_1.default.string().email().required().messages(customMessages),
        password: joi_1.default.string().required().messages(customMessages),
    }),
    updateProfile: joi_1.default.object({
        name: joi_1.default.string().min(2).max(50).optional().messages(customMessages),
        phone: joi_1.default.string().pattern(/^\+?[\d\s-()]+$/).optional().messages(customMessages),
        address: joi_1.default.object({
            street: joi_1.default.string().max(100).optional().messages(customMessages),
            city: joi_1.default.string().max(50).optional().messages(customMessages),
            state: joi_1.default.string().max(50).optional().messages(customMessages),
            zipCode: joi_1.default.string().pattern(/^\d{5}(-\d{4})?$/).optional().messages(customMessages),
            country: joi_1.default.string().max(50).optional().messages(customMessages),
        }).optional(),
    }),
    createProduct: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required().messages(customMessages),
        description: joi_1.default.string().min(10).max(1000).required().messages(customMessages),
        price: joi_1.default.number().min(0).precision(2).required().messages(customMessages),
        category: joi_1.default.string().valid('coffee', 'tea', 'accessories', 'subscription').required().messages(customMessages),
        stock: joi_1.default.number().integer().min(0).required().messages(customMessages),
        images: joi_1.default.array().items(joi_1.default.string().uri()).min(1).optional().messages(customMessages),
        tags: joi_1.default.array().items(joi_1.default.string()).optional().messages(customMessages),
        isActive: joi_1.default.boolean().optional().messages(customMessages),
    }),
    updateProduct: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).optional().messages(customMessages),
        description: joi_1.default.string().min(10).max(1000).optional().messages(customMessages),
        price: joi_1.default.number().min(0).precision(2).optional().messages(customMessages),
        category: joi_1.default.string().valid('coffee', 'tea', 'accessories', 'subscription').optional().messages(customMessages),
        stock: joi_1.default.number().integer().min(0).optional().messages(customMessages),
        images: joi_1.default.array().items(joi_1.default.string().uri()).optional().messages(customMessages),
        tags: joi_1.default.array().items(joi_1.default.string()).optional().messages(customMessages),
        isActive: joi_1.default.boolean().optional().messages(customMessages),
    }),
    createOrder: joi_1.default.object({
        items: joi_1.default.array().items(joi_1.default.object({
            productId: joi_1.default.string().required().messages(customMessages),
            quantity: joi_1.default.number().integer().min(1).required().messages(customMessages),
            price: joi_1.default.number().min(0).precision(2).required().messages(customMessages),
        })).min(1).required().messages(customMessages),
        shippingAddress: joi_1.default.object({
            street: joi_1.default.string().max(100).required().messages(customMessages),
            city: joi_1.default.string().max(50).required().messages(customMessages),
            state: joi_1.default.string().max(50).required().messages(customMessages),
            zipCode: joi_1.default.string().pattern(/^\d{5}(-\d{4})?$/).required().messages(customMessages),
            country: joi_1.default.string().max(50).required().messages(customMessages),
        }).required().messages(customMessages),
        paymentMethod: joi_1.default.string().valid('razorpay', 'cod').required().messages(customMessages),
    }),
    createPayment: joi_1.default.object({
        orderId: joi_1.default.string().required().messages(customMessages),
        amount: joi_1.default.number().min(0).precision(2).required().messages(customMessages),
        currency: joi_1.default.string().valid('INR', 'USD').default('INR').messages(customMessages),
        paymentMethod: joi_1.default.string().valid('razorpay', 'cod').required().messages(customMessages),
    }),
    contact: joi_1.default.object({
        name: joi_1.default.string().min(2).max(50).required().messages(customMessages),
        email: joi_1.default.string().email().required().messages(customMessages),
        subject: joi_1.default.string().min(5).max(100).required().messages(customMessages),
        message: joi_1.default.string().min(10).max(1000).required().messages(customMessages),
        phone: joi_1.default.string().pattern(/^\+?[\d\s-()]+$/).optional().messages(customMessages),
    }),
    queryParams: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1).messages(customMessages),
        limit: joi_1.default.number().integer().min(1).max(100).default(10).messages(customMessages),
        sort: joi_1.default.string().valid('asc', 'desc').default('desc').messages(customMessages),
        category: joi_1.default.string().optional().messages(customMessages),
        search: joi_1.default.string().max(100).optional().messages(customMessages),
        minPrice: joi_1.default.number().min(0).optional().messages(customMessages),
        maxPrice: joi_1.default.number().min(0).optional().messages(customMessages),
    }),
};
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, validationOptions);
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            return next(new AppError_1.AppError(errorMessage, 400));
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
exports.validateRequest = exports.validate;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, validationOptions);
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            return next(new AppError_1.AppError(errorMessage, 400));
        }
        req.query = value;
        next();
    };
};
exports.validateQuery = validateQuery;
const sanitizeInput = (req, res, next) => {
    const sanitizeString = (str) => {
        return str
            .trim()
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '');
    };
    const sanitizeObject = (obj) => {
        if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitizeObject(value);
            }
            return sanitized;
        }
        return obj;
    };
    if (req.body)
        req.body = sanitizeObject(req.body);
    if (req.query)
        req.query = sanitizeObject(req.query);
    if (req.params)
        req.params = sanitizeObject(req.params);
    next();
};
exports.sanitizeInput = sanitizeInput;
//# sourceMappingURL=validation.js.map