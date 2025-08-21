"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubscriptions = exports.cancelSubscription = exports.resumeSubscription = exports.pauseSubscription = exports.updateSubscription = exports.createSubscription = exports.getSubscription = exports.getUserSubscriptions = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const Subscription_1 = __importDefault(require("../models/Subscription"));
const Product_1 = __importDefault(require("../models/Product"));
const apiFeatures_1 = require("../utils/apiFeatures");
const router = express_1.default.Router();
exports.getUserSubscriptions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const features = new apiFeatures_1.APIFeatures(Subscription_1.default.find({ user: req.user.id }).populate('products.product'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const subscriptions = await features.query;
    const totalSubscriptions = await Subscription_1.default.countDocuments({ user: req.user.id });
    res.status(200).json({
        status: 'success',
        results: subscriptions.length,
        totalResults: totalSubscriptions,
        data: {
            subscriptions,
        },
    });
});
exports.getSubscription = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const subscription = await Subscription_1.default.findOne({
        _id: req.params.id,
        user: req.user.id,
    }).populate('products.product');
    if (!subscription) {
        throw new AppError_1.AppError('No subscription found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            subscription,
        },
    });
});
exports.createSubscription = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { products, frequency, shippingAddress, paymentMethod, } = req.body;
    let totalAmount = 0;
    const validatedProducts = [];
    for (const item of products) {
        const product = await Product_1.default.findById(item.product);
        if (!product) {
            throw new AppError_1.AppError(`Product not found: ${item.product}`, 404);
        }
        if (product.stock < item.quantity) {
            throw new AppError_1.AppError(`Insufficient stock for ${product.name}`, 400);
        }
        const itemPrice = product.price * 0.85;
        totalAmount += itemPrice * item.quantity;
        validatedProducts.push({
            product: product._id,
            quantity: item.quantity,
        });
    }
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
    const subscription = await Subscription_1.default.create({
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
exports.updateSubscription = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const allowedUpdates = ['frequency', 'shippingAddress', 'products'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        throw new AppError_1.AppError('Invalid updates', 400);
    }
    const subscription = await Subscription_1.default.findOne({
        _id: req.params.id,
        user: req.user.id,
    });
    if (!subscription) {
        throw new AppError_1.AppError('No subscription found with that ID', 404);
    }
    if (subscription.status === 'cancelled') {
        throw new AppError_1.AppError('Cannot update cancelled subscription', 400);
    }
    updates.forEach(update => {
        subscription[update] = req.body[update];
    });
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
    if (req.body.products) {
        let totalAmount = 0;
        for (const item of req.body.products) {
            const product = await Product_1.default.findById(item.product);
            if (product) {
                const itemPrice = product.price * 0.85;
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
exports.pauseSubscription = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { pausedUntil } = req.body;
    const subscription = await Subscription_1.default.findOne({
        _id: req.params.id,
        user: req.user.id,
    });
    if (!subscription) {
        throw new AppError_1.AppError('No subscription found with that ID', 404);
    }
    if (subscription.status !== 'active') {
        throw new AppError_1.AppError('Only active subscriptions can be paused', 400);
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
exports.resumeSubscription = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const subscription = await Subscription_1.default.findOne({
        _id: req.params.id,
        user: req.user.id,
    });
    if (!subscription) {
        throw new AppError_1.AppError('No subscription found with that ID', 404);
    }
    if (subscription.status !== 'paused') {
        throw new AppError_1.AppError('Only paused subscriptions can be resumed', 400);
    }
    subscription.status = 'active';
    subscription.pausedUntil = undefined;
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
exports.cancelSubscription = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { reason } = req.body;
    const subscription = await Subscription_1.default.findOne({
        _id: req.params.id,
        user: req.user.id,
    });
    if (!subscription) {
        throw new AppError_1.AppError('No subscription found with that ID', 404);
    }
    if (subscription.status === 'cancelled') {
        throw new AppError_1.AppError('Subscription is already cancelled', 400);
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
exports.getAllSubscriptions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const features = new apiFeatures_1.APIFeatures(Subscription_1.default.find().populate('user products.product'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const subscriptions = await features.query;
    const totalSubscriptions = await Subscription_1.default.countDocuments();
    res.status(200).json({
        status: 'success',
        results: subscriptions.length,
        totalResults: totalSubscriptions,
        data: {
            subscriptions,
        },
    });
});
const createSubscriptionValidation = [
    (0, express_validator_1.body)('products')
        .isArray({ min: 1 })
        .withMessage('At least one product is required'),
    (0, express_validator_1.body)('products.*.product')
        .isMongoId()
        .withMessage('Valid product ID is required'),
    (0, express_validator_1.body)('products.*.quantity')
        .isInt({ min: 1, max: 10 })
        .withMessage('Quantity must be between 1 and 10'),
    (0, express_validator_1.body)('frequency')
        .isIn(['weekly', 'biweekly', 'monthly'])
        .withMessage('Frequency must be weekly, biweekly, or monthly'),
    (0, express_validator_1.body)('shippingAddress.street')
        .notEmpty()
        .withMessage('Street address is required'),
    (0, express_validator_1.body)('shippingAddress.city')
        .notEmpty()
        .withMessage('City is required'),
    (0, express_validator_1.body)('shippingAddress.state')
        .notEmpty()
        .withMessage('State is required'),
    (0, express_validator_1.body)('shippingAddress.zipCode')
        .notEmpty()
        .withMessage('ZIP code is required'),
    (0, express_validator_1.body)('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required'),
];
const pauseSubscriptionValidation = [
    (0, express_validator_1.body)('pausedUntil')
        .optional()
        .isISO8601()
        .withMessage('Pause until date must be a valid date'),
];
const cancelSubscriptionValidation = [
    (0, express_validator_1.body)('reason')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Cancellation reason must be less than 500 characters'),
];
router.use(auth_1.protect);
router.get('/', exports.getUserSubscriptions);
router.post('/', exports.createSubscription);
router.get('/:id', exports.getSubscription);
router.patch('/:id', exports.updateSubscription);
router.patch('/:id/pause', exports.pauseSubscription);
router.patch('/:id/resume', exports.resumeSubscription);
router.delete('/:id', exports.cancelSubscription);
router.use((0, auth_1.restrictTo)('admin'));
router.get('/admin/all', exports.getAllSubscriptions);
exports.default = router;
//# sourceMappingURL=subscriptions.js.map