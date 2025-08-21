import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validation';
import Joi from 'joi';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { APIFeatures } from '../utils/apiFeatures';

const router = express.Router();

// User management
export const getAllUsers = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: 'success',
    results: users.length,
    totalResults: totalUsers,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req: any, res: any) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req: any, res: any) => {
  const { name, email, role, isEmailVerified } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isEmailVerified },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req: any, res: any) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Product management
export const createProduct = catchAsync(async (req: any, res: any) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const updateProduct = catchAsync(async (req: any, res: any) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const deleteProduct = catchAsync(async (req: any, res: any) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Order management
export const getAllOrdersAdmin = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;
  const totalOrders = await Order.countDocuments();

  res.status(200).json({
    status: 'success',
    results: orders.length,
    totalResults: totalOrders,
    data: {
      orders,
    },
  });
});

export const updateOrderAdmin = catchAsync(async (req: any, res: any) => {
  const { orderStatus, trackingNumber, notes } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      orderStatus,
      trackingNumber,
      notes,
      ...(orderStatus === 'delivered' && { actualDelivery: new Date() })
    },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// System settings
export const getSystemSettings = catchAsync(async (req: any, res: any) => {
  // This would typically come from a settings collection
  const settings = {
    siteName: 'Cafe at Once',
    currency: 'INR',
    taxRate: 18,
    freeShippingThreshold: 1000,
    codCharges: 25,
    expressDeliveryCharges: 50,
    subscriptionDiscount: 15,
  };

  res.status(200).json({
    status: 'success',
    data: {
      settings,
    },
  });
});

export const updateSystemSettings = catchAsync(async (req: any, res: any) => {
  // This would typically update a settings collection
  const settings = req.body;

  res.status(200).json({
    status: 'success',
    data: {
      settings,
    },
  });
});

// Validation schemas
const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('customer', 'admin').optional(),
  isEmailVerified: Joi.boolean().optional(),
});

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('concentrate', 'tube', 'flavored', 'tea').required(),
  stock: Joi.number().integer().min(0).required(),
  sku: Joi.string().min(3).max(20).required(),
});

const updateOrderSchema = Joi.object({
  orderStatus: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').optional(),
  trackingNumber: Joi.string().min(5).max(50).optional(),
  notes: Joi.string().max(1000).optional(),
});

// Routes - Admin only
router.use(protect);
router.use(restrictTo('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product management
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrdersAdmin);
router.patch('/orders/:id', updateOrderAdmin);

// System settings
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);

export default router;