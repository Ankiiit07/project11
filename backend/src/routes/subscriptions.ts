import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import Subscription from '../models/Subscription';
import Product from '../models/Product';
import { APIFeatures } from '../utils/apiFeatures';

const router = express.Router();

// Get user subscriptions
export const getUserSubscriptions = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(
    Subscription.find({ user: req.user.id }).populate('products.product'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const subscriptions = await features.query;
  const totalSubscriptions = await Subscription.countDocuments({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    totalResults: totalSubscriptions,
    data: {
      subscriptions,
    },
  });
});

// Get single subscription
export const getSubscription = catchAsync(async (req: any, res: any) => {
  const subscription = await Subscription.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate('products.product');

  if (!subscription) {
    throw new AppError('No subscription found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

// Create subscription
export const createSubscription = catchAsync(async (req: any, res: any) => {
  const {
    products,
    frequency,
    shippingAddress,
    paymentMethod,
  } = req.body;

  // Validate products exist and calculate total
  let totalAmount = 0;
  const validatedProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new AppError(`Product not found: ${item.product}`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const itemPrice = product.price * 0.85; // 15% subscription discount
    totalAmount += itemPrice * item.quantity;

    validatedProducts.push({
      product: product._id,
      quantity: item.quantity,
    });
  }

  // Calculate next delivery date based on frequency
  const nextDelivery = new Date();
  switch (frequency) {
    case 'weekly':
      nextDelivery.setDate(nextDelivery.getDate() + 7);
      break;
    case 'biweekly':
      nextDelivery.setDate(nextDelivery.getDate() + 14);
      break;
    case 'monthly':
      nextDelivery.setMonth(nextDelivery.getMonth() + 1);
      break;
  }

  const subscription = await Subscription.create({
    user: req.user.id,
    products: validatedProducts,
    frequency,
    nextDelivery,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  await subscription.populate('products.product');

  res.status(201).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

// Update subscription
export const updateSubscription = catchAsync(async (req: any, res: any) => {
  const allowedUpdates = ['frequency', 'shippingAddress', 'products'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new AppError('Invalid updates', 400);
  }

  const subscription = await Subscription.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!subscription) {
    throw new AppError('No subscription found with that ID', 404);
  }

  if (subscription.status === 'cancelled') {
    throw new AppError('Cannot update cancelled subscription', 400);
  }

  // Update fields
  updates.forEach(update => {
    (subscription as any)[update] = req.body[update];
  });

  // Recalculate next delivery if frequency changed
  if (req.body.frequency) {
    const nextDelivery = new Date();
    switch (req.body.frequency) {
      case 'weekly':
        nextDelivery.setDate(nextDelivery.getDate() + 7);
        break;
      case 'biweekly':
        nextDelivery.setDate(nextDelivery.getDate() + 14);
        break;
      case 'monthly':
        nextDelivery.setMonth(nextDelivery.getMonth() + 1);
        break;
    }
    subscription.nextDelivery = nextDelivery;
  }

  // Recalculate total if products changed
  if (req.body.products) {
    let totalAmount = 0;
    for (const item of req.body.products) {
      const product = await Product.findById(item.product);
      if (product) {
        const itemPrice = product.price * 0.85; // 15% subscription discount
        totalAmount += itemPrice * item.quantity;
      }
    }
    subscription.totalAmount = totalAmount;
  }

  await subscription.save();
  await subscription.populate('products.product');

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

// Pause subscription
export const pauseSubscription = catchAsync(async (req: any, res: any) => {
  const { pausedUntil } = req.body;

  const subscription = await Subscription.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!subscription) {
    throw new AppError('No subscription found with that ID', 404);
  }

  if (subscription.status !== 'active') {
    throw new AppError('Only active subscriptions can be paused', 400);
  }

  subscription.status = 'paused';
  subscription.pausedUntil = pausedUntil ? new Date(pausedUntil) : undefined;

  await subscription.save();

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

// Resume subscription
export const resumeSubscription = catchAsync(async (req: any, res: any) => {
  const subscription = await Subscription.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!subscription) {
    throw new AppError('No subscription found with that ID', 404);
  }

  if (subscription.status !== 'paused') {
    throw new AppError('Only paused subscriptions can be resumed', 400);
  }

  subscription.status = 'active';
  subscription.pausedUntil = undefined;

  // Update next delivery date
  const nextDelivery = new Date();
  switch (subscription.frequency) {
    case 'weekly':
      nextDelivery.setDate(nextDelivery.getDate() + 7);
      break;
    case 'biweekly':
      nextDelivery.setDate(nextDelivery.getDate() + 14);
      break;
    case 'monthly':
      nextDelivery.setMonth(nextDelivery.getMonth() + 1);
      break;
  }
  subscription.nextDelivery = nextDelivery;

  await subscription.save();

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

// Cancel subscription
export const cancelSubscription = catchAsync(async (req: any, res: any) => {
  const { reason } = req.body;

  const subscription = await Subscription.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!subscription) {
    throw new AppError('No subscription found with that ID', 404);
  }

  if (subscription.status === 'cancelled') {
    throw new AppError('Subscription is already cancelled', 400);
  }

  subscription.status = 'cancelled';
  subscription.cancellationReason = reason;
  subscription.endDate = new Date();

  await subscription.save();

  res.status(200).json({
    status: 'success',
    data: {
      subscription,
    },
  });
});

// Admin routes
export const getAllSubscriptions = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(
    Subscription.find().populate('user products.product'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const subscriptions = await features.query;
  const totalSubscriptions = await Subscription.countDocuments();

  res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    totalResults: totalSubscriptions,
    data: {
      subscriptions,
    },
  });
});

// Validation rules
const createSubscriptionValidation = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.product')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('products.*.quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  body('frequency')
    .isIn(['weekly', 'biweekly', 'monthly'])
    .withMessage('Frequency must be weekly, biweekly, or monthly'),
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required'),
];

const pauseSubscriptionValidation = [
  body('pausedUntil')
    .optional()
    .isISO8601()
    .withMessage('Pause until date must be a valid date'),
];

const cancelSubscriptionValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason must be less than 500 characters'),
];

// Routes
router.use(protect); // All routes require authentication

// User routes
router.get('/', getUserSubscriptions);
router.post('/', createSubscription);
router.get('/:id', getSubscription);
router.patch('/:id', updateSubscription);
router.patch('/:id/pause', pauseSubscription);
router.patch('/:id/resume', resumeSubscription);
router.delete('/:id', cancelSubscription);

// Admin routes
router.use(restrictTo('admin'));
router.get('/admin/all', getAllSubscriptions);

export default router;