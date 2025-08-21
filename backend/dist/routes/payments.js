"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const createOrderValidation = [
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .isFloat({ min: 1 })
        .withMessage('Amount must be a positive number'),
    (0, express_validator_1.body)('currency')
        .optional()
        .isIn(['INR', 'USD'])
        .withMessage('Currency must be INR or USD'),
];
const verifyPaymentValidation = [
    (0, express_validator_1.body)('razorpay_order_id')
        .notEmpty()
        .withMessage('Razorpay order ID is required'),
    (0, express_validator_1.body)('razorpay_payment_id')
        .notEmpty()
        .withMessage('Razorpay payment ID is required'),
    (0, express_validator_1.body)('razorpay_signature')
        .notEmpty()
        .withMessage('Razorpay signature is required'),
];
const createOrderFromCartValidation = [
    (0, express_validator_1.body)('items')
        .isArray({ min: 1 })
        .withMessage('Items array is required and must not be empty'),
    (0, express_validator_1.body)('customerInfo.name')
        .trim()
        .notEmpty()
        .withMessage('Customer name is required'),
    (0, express_validator_1.body)('customerInfo.email')
        .isEmail()
        .withMessage('Valid customer email is required'),
    (0, express_validator_1.body)('shippingAddress.street')
        .trim()
        .notEmpty()
        .withMessage('Shipping address street is required'),
    (0, express_validator_1.body)('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('Shipping address city is required'),
    (0, express_validator_1.body)('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('Shipping address state is required'),
    (0, express_validator_1.body)('shippingAddress.zipCode')
        .trim()
        .notEmpty()
        .withMessage('Shipping address zip code is required'),
    (0, express_validator_1.body)('paymentMethod')
        .isIn(['online', 'cod'])
        .withMessage('Payment method must be online or cod'),
];
const refundValidation = [
    (0, express_validator_1.body)('paymentId')
        .notEmpty()
        .withMessage('Payment ID is required'),
    (0, express_validator_1.body)('amount')
        .optional()
        .isNumeric()
        .isFloat({ min: 0.01 })
        .withMessage('Refund amount must be a positive number'),
];
router.post('/webhook', paymentController_1.handleWebhook);
router.post('/create-order', paymentController_1.createOrder);
router.use(auth_1.protect);
router.post('/verify', paymentController_1.verifyPayment);
router.post('/create-order-from-cart', paymentController_1.createOrderFromCart);
router.get('/status/:paymentId', paymentController_1.getPaymentStatus);
router.post('/refund', (0, auth_1.restrictTo)('admin'), paymentController_1.refundPayment);
exports.default = router;
//# sourceMappingURL=payments.js.map