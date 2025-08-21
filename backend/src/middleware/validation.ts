import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

// Custom validation options
const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

// Custom error messages
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

// Validation schemas
export const schemas = {
  // User validation schemas
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages(customMessages),
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
      .messages({
        ...customMessages,
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional().messages(customMessages),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().required().messages(customMessages),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional().messages(customMessages),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional().messages(customMessages),
    address: Joi.object({
      street: Joi.string().max(100).optional().messages(customMessages),
      city: Joi.string().max(50).optional().messages(customMessages),
      state: Joi.string().max(50).optional().messages(customMessages),
      zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional().messages(customMessages),
      country: Joi.string().max(50).optional().messages(customMessages),
    }).optional(),
  }),

  // Product validation schemas
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required().messages(customMessages),
    description: Joi.string().min(10).max(1000).required().messages(customMessages),
    price: Joi.number().min(0).precision(2).required().messages(customMessages),
    category: Joi.string().valid('coffee', 'tea', 'accessories', 'subscription').required().messages(customMessages),
    stock: Joi.number().integer().min(0).required().messages(customMessages),
    images: Joi.array().items(Joi.string().uri()).min(1).optional().messages(customMessages),
    tags: Joi.array().items(Joi.string()).optional().messages(customMessages),
    isActive: Joi.boolean().optional().messages(customMessages),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100).optional().messages(customMessages),
    description: Joi.string().min(10).max(1000).optional().messages(customMessages),
    price: Joi.number().min(0).precision(2).optional().messages(customMessages),
    category: Joi.string().valid('coffee', 'tea', 'accessories', 'subscription').optional().messages(customMessages),
    stock: Joi.number().integer().min(0).optional().messages(customMessages),
    images: Joi.array().items(Joi.string().uri()).optional().messages(customMessages),
    tags: Joi.array().items(Joi.string()).optional().messages(customMessages),
    isActive: Joi.boolean().optional().messages(customMessages),
  }),

  // Order validation schemas
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required().messages(customMessages),
        quantity: Joi.number().integer().min(1).required().messages(customMessages),
        price: Joi.number().min(0).precision(2).required().messages(customMessages),
      })
    ).min(1).required().messages(customMessages),
    shippingAddress: Joi.object({
      street: Joi.string().max(100).required().messages(customMessages),
      city: Joi.string().max(50).required().messages(customMessages),
      state: Joi.string().max(50).required().messages(customMessages),
      zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages(customMessages),
      country: Joi.string().max(50).required().messages(customMessages),
    }).required().messages(customMessages),
    paymentMethod: Joi.string().valid('razorpay', 'cod').required().messages(customMessages),
  }),

  // Payment validation schemas
  createPayment: Joi.object({
    orderId: Joi.string().required().messages(customMessages),
    amount: Joi.number().min(0).precision(2).required().messages(customMessages),
    currency: Joi.string().valid('INR', 'USD').default('INR').messages(customMessages),
    paymentMethod: Joi.string().valid('razorpay', 'cod').required().messages(customMessages),
  }),

  // Contact validation schemas
  contact: Joi.object({
    name: Joi.string().min(2).max(50).required().messages(customMessages),
    email: Joi.string().email().required().messages(customMessages),
    subject: Joi.string().min(5).max(100).required().messages(customMessages),
    message: Joi.string().min(10).max(1000).required().messages(customMessages),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional().messages(customMessages),
  }),

  // Pagination and filtering
  queryParams: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages(customMessages),
    limit: Joi.number().integer().min(1).max(100).default(10).messages(customMessages),
    sort: Joi.string().valid('asc', 'desc').default('desc').messages(customMessages),
    category: Joi.string().optional().messages(customMessages),
    search: Joi.string().max(100).optional().messages(customMessages),
    minPrice: Joi.number().min(0).optional().messages(customMessages),
    maxPrice: Joi.number().min(0).optional().messages(customMessages),
  }),
};

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, validationOptions);
    
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Alias for backward compatibility
export const validateRequest = validate;

// Query validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, validationOptions);
    
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }

    // Replace req.query with validated and sanitized data
    req.query = value;
    next();
  };
};

// Sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize string inputs
  const sanitizeString = (str: string): string => {
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  };

  // Recursively sanitize object
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitize request body, query, and params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};