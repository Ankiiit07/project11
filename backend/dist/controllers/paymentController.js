"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderFromCart = exports.handleWebhook = exports.refundPayment = exports.getPaymentStatus = exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const AppError_1 = require("../utils/AppError");
const catchAsync_1 = require("../utils/catchAsync");
const emailService_1 = require("../services/emailService");
let razorpay = null;
const initializeRazorpay = () => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
            console.warn('⚠️  Razorpay credentials not found. Payment functionality will be limited.');
            console.warn('Please set RAZORPAY_KEY_ID and RAZORPAY_SECRET in your .env file');
            return null;
        }
        const instance = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        console.log('✅ Razorpay initialized successfully');
        return instance;
    }
    catch (error) {
        console.error('❌ Failed to initialize Razorpay:', error);
        return null;
    }
};
razorpay = initializeRazorpay();
const getRazorpay = () => {
    if (!razorpay) {
        razorpay = initializeRazorpay();
    }
    return razorpay;
};
exports.createOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
        throw new AppError_1.AppError('Payment service not available. Please check server configuration.', 503);
    }
    const { amount, currency = 'INR', receipt, notes } = req.body;
    if (!amount || amount <= 0) {
        throw new AppError_1.AppError('Invalid amount provided', 400);
    }
    const options = {
        amount: Math.round(amount),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {},
    };
    const order = await razorpayInstance.orders.create(options);
    res.status(201).json({
        status: 'success',
        data: {
            order,
        },
    });
});
exports.verifyPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
        throw new AppError_1.AppError('Payment service not available. Please check server configuration.', 503);
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new AppError_1.AppError('Missing payment verification parameters', 400);
    }
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto_1.default
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');
    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
        throw new AppError_1.AppError('Payment verification failed', 400);
    }
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    res.status(200).json({
        status: 'success',
        data: {
            isAuthentic: true,
            payment,
        },
    });
});
exports.getPaymentStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
        throw new AppError_1.AppError('Payment service not available. Please check server configuration.', 503);
    }
    const { paymentId } = req.params;
    const payment = await razorpayInstance.payments.fetch(paymentId);
    res.status(200).json({
        status: 'success',
        data: {
            payment,
        },
    });
});
exports.refundPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
        throw new AppError_1.AppError('Payment service not available. Please check server configuration.', 503);
    }
    const { paymentId, amount, reason } = req.body;
    if (!paymentId) {
        throw new AppError_1.AppError('Payment ID is required', 400);
    }
    const refund = await razorpayInstance.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined,
        notes: {
            reason: reason || 'Customer request',
        },
    });
    res.status(200).json({
        status: 'success',
        data: {
            refund,
        },
    });
});
exports.handleWebhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new AppError_1.AppError('Webhook secret not configured', 500);
    }
    const expectedSignature = crypto_1.default
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
    if (webhookSignature !== expectedSignature) {
        throw new AppError_1.AppError('Invalid webhook signature', 400);
    }
    const event = req.body;
    switch (event.event) {
        case 'payment.captured':
            await handlePaymentCaptured(event.payload.payment.entity);
            break;
        case 'payment.failed':
            await handlePaymentFailed(event.payload.payment.entity);
            break;
        case 'refund.processed':
            await handleRefundProcessed(event.payload.refund.entity);
            break;
        default:
            console.log(`Unhandled webhook event: ${event.event}`);
    }
    res.status(200).json({ status: 'success' });
});
const handlePaymentCaptured = async (payment) => {
    const order = await Order_1.default.findOne({
        'paymentDetails.razorpayOrderId': payment.order_id,
    });
    if (order) {
        order.paymentStatus = 'completed';
        order.paymentDetails = {
            ...order.paymentDetails,
            razorpayPaymentId: payment.id,
        };
        await order.save();
    }
};
const handlePaymentFailed = async (payment) => {
    const order = await Order_1.default.findOne({
        'paymentDetails.razorpayOrderId': payment.order_id,
    });
    if (order) {
        order.paymentStatus = 'failed';
        await order.save();
    }
};
const handleRefundProcessed = async (refund) => {
    const order = await Order_1.default.findOne({
        'paymentDetails.razorpayPaymentId': refund.payment_id,
    });
    if (order) {
        order.refundStatus = 'completed';
        order.refundAmount = refund.amount / 100;
        await order.save();
    }
};
exports.createOrderFromCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { items, customerInfo, shippingAddress, paymentMethod, paymentDetails, } = req.body;
    if (!items || items.length === 0) {
        throw new AppError_1.AppError('No items in order', 400);
    }
    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
        throw new AppError_1.AppError('Customer information is required', 400);
    }
    if (!shippingAddress) {
        throw new AppError_1.AppError('Shipping address is required', 400);
    }
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
        const product = await Product_1.default.findById(item.product);
        if (!product) {
            throw new AppError_1.AppError(`Product not found: ${item.product}`, 404);
        }
        if (product.stock < item.quantity) {
            throw new AppError_1.AppError(`Insufficient stock for ${product.name}`, 400);
        }
        const itemPrice = item.type === 'subscription' ? product.price * 0.85 : product.price;
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        orderItems.push({
            product: product._id,
            name: product.name,
            price: itemPrice,
            quantity: item.quantity,
            image: product.mainImage,
            sku: product.sku,
        });
        product.stock -= item.quantity;
        await product.save();
    }
    const tax = subtotal * 0.18;
    const shipping = subtotal >= 1000 ? 0 : (paymentMethod === 'cod' ? 75 : 50);
    const total = subtotal + tax + shipping;
    const order = await Order_1.default.create({
        user: req.user?.id,
        customerInfo,
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
        paymentDetails,
        shippingAddress,
        orderStatus: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });
    try {
        await (0, emailService_1.sendEmail)({
            email: customerInfo.email,
            subject: 'Order Confirmation - Cafe at Once',
            template: 'orderConfirmation',
            data: {
                customerName: customerInfo.name,
                orderNumber: order.orderNumber,
                items: orderItems,
                total: total,
                paymentMethod,
                estimatedDelivery: order.estimatedDelivery,
            },
        });
    }
    catch (err) {
        console.error('Error sending order confirmation email:', err);
    }
    res.status(201).json({
        status: 'success',
        data: {
            order,
        },
    });
});
//# sourceMappingURL=paymentController.js.map