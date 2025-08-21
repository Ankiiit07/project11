import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, query } from 'express-validator';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import Order from '../models/Order';
import { APIFeatures } from '../utils/apiFeatures';
import { sendEmail } from '../services/emailService';

const router = express.Router();

// Get all orders for user
export const getUserOrders = catchAsync(async (req: any, res: any) => {
  const features = new APIFeatures(
    Order.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;
  const totalOrders = await Order.countDocuments({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    totalResults: totalOrders,
    data: {
      orders,
    },
  });
});

// Get single order
export const getOrder = catchAsync(async (req: any, res: any) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

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

// Track order by order number
export const trackOrder = catchAsync(async (req: any, res: any) => {
  const { orderNumber } = req.params;
  
  const order = await Order.findOne({
    orderNumber,
    $or: [
      { user: req.user.id },
      { 'customerInfo.email': req.user.email }
    ]
  });

  if (!order) {
    throw new AppError('No order found with that order number', 404);
  }

  // Create tracking info
  const trackingInfo = {
    orderNumber: order.orderNumber,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    estimatedDelivery: order.estimatedDelivery,
    actualDelivery: order.actualDelivery,
    trackingNumber: order.trackingNumber,
    timeline: [
      {
        status: 'pending',
        date: order.createdAt,
        description: 'Order placed successfully',
        completed: true,
      },
      {
        status: 'confirmed',
        date: order.orderStatus !== 'pending' ? order.updatedAt : null,
        description: 'Order confirmed and being prepared',
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus),
      },
      {
        status: 'processing',
        date: order.orderStatus === 'processing' ? order.updatedAt : null,
        description: 'Order is being processed',
        completed: ['processing', 'shipped', 'delivered'].includes(order.orderStatus),
      },
      {
        status: 'shipped',
        date: order.orderStatus === 'shipped' ? order.updatedAt : null,
        description: 'Order has been shipped',
        completed: ['shipped', 'delivered'].includes(order.orderStatus),
      },
      {
        status: 'delivered',
        date: order.actualDelivery,
        description: 'Order delivered successfully',
        completed: order.orderStatus === 'delivered',
      },
    ],
  };

  res.status(200).json({
    status: 'success',
    data: {
      tracking: trackingInfo,
    },
  });
});

// Cancel order
export const cancelOrder = catchAsync(async (req: any, res: any) => {
  const { reason } = req.body;
  
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) {
    throw new AppError('No order found with that ID', 404);
  }

  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason;
  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Admin routes
export const getAllOrders = catchAsync(async (req: any, res: any) => {
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

export const updateOrderStatus = catchAsync(async (req: any, res: any) => {
  const { orderStatus, trackingNumber } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      orderStatus,
      trackingNumber,
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

// Validation rules
const cancelOrderValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason must be less than 500 characters'),
];

const updateOrderStatusValidation = [
  body('orderStatus')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters'),
];

// Create order (no authentication required for COD orders)
export const createOrder = catchAsync(async (req: any, res: any) => {
  const {
    items,
    customerInfo,
    shippingAddress,
    paymentMethod,
    paymentDetails
  } = req.body;

  // Validate required fields
  if (!items || !customerInfo || !shippingAddress || !paymentMethod) {
    throw new AppError('Missing required order information', 400);
  }

  // Generate order number
  const orderNumber = `CAO${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  // Calculate totals
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal >= 1000 ? 0 : 50; // Free shipping above ₹1000
  const total = subtotal + tax + shipping;

  // Create order
  const orderData = {
    orderNumber,
    items: items.map((item: any) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      sku: item.id || item.product
    })),
    customerInfo,
    shippingAddress,
    subtotal,
    tax,
    shipping,
    discount: 0,
    total,
    paymentMethod,
    paymentDetails: paymentDetails || {},
    orderStatus: 'pending',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    user: req.user?.id || null, // Optional user ID if authenticated
  };

  const order = await Order.create(orderData);

  // Send order confirmation email to customer
  try {
    await sendEmail({
      email: customerInfo.email,
      subject: `Order Confirmation - ${orderNumber}`,
      template: 'orderConfirmation',
      data: {
        customerName: customerInfo.name,
        orderNumber: orderNumber,
        items: items,
        total: total,
        paymentMethod: paymentMethod,
        estimatedDelivery: orderData.estimatedDelivery,
        shippingAddress: shippingAddress
      }
    });
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError);
    // Don't fail the order creation if email fails
  }

  // Send order notification email to admin
  try {
    await sendEmail({
      email: 'cafeatonce@gmail.com',
      subject: `New Order Received - ${orderNumber}`,
      template: 'orderNotification',
      data: {
        orderNumber: orderNumber,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: items,
        total: total,
        paymentMethod: paymentMethod,
        orderStatus: orderData.orderStatus,
        shippingAddress: shippingAddress,
        orderDate: new Date()
      }
    });
  } catch (emailError) {
    console.error('Failed to send order notification email to admin:', emailError);
    // Don't fail the order creation if email fails
  }

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Routes
// Create order (no authentication required)
router.post('/', createOrder);

// Protected routes
router.use(protect); // All routes below require authentication

// User routes
router.get('/', getUserOrders);
router.get('/track/:orderNumber', trackOrder);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

// Admin routes
router.use(restrictTo('admin'));
router.get('/admin/all', getAllOrders);
router.patch('/admin/:id/status', updateOrderStatus);

export default router;