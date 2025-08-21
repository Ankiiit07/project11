import express from 'express';
import {
  createOrder,
  verifyPayment,
  createOrderFromCart,
  getPaymentStatus,
  refundPayment,
  handleWebhook,
} from '../controllers/paymentController';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD'])
    .withMessage('Currency must be INR or USD'),
];

const verifyPaymentValidation = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
];

const createOrderFromCartValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items array is required and must not be empty'),
  body('customerInfo.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('customerInfo.email')
    .isEmail()
    .withMessage('Valid customer email is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Shipping address street is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Shipping address city is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('Shipping address state is required'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Shipping address zip code is required'),
  body('paymentMethod')
    .isIn(['online', 'cod'])
    .withMessage('Payment method must be online or cod'),
];

const refundValidation = [
  body('paymentId')
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('amount')
    .optional()
    .isNumeric()
    .isFloat({ min: 0.01 })
    .withMessage('Refund amount must be a positive number'),
];

// Public routes
router.post('/webhook', handleWebhook);
router.post('/create-order', createOrder);

// Protected routes
router.use(protect);

router.post('/verify', verifyPayment);
router.post('/create-order-from-cart', createOrderFromCart);
router.get('/status/:paymentId', getPaymentStatus);

// Admin only routes
router.post('/refund', restrictTo('admin'), refundPayment);

export default router;