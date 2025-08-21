"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCart = exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const router = express_1.default.Router();
exports.getCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    let cart;
    if (req.user) {
        cart = await Cart_1.default.findOne({ user: req.user.id }).populate('items.product');
    }
    else {
        const sessionId = req.session.id;
        cart = await Cart_1.default.findOne({ sessionId }).populate('items.product');
    }
    if (!cart) {
        cart = { items: [] };
    }
    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});
exports.addToCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId, quantity = 1, type = 'single' } = req.body;
    const product = await Product_1.default.findById(productId);
    if (!product) {
        throw new AppError_1.AppError('Product not found', 404);
    }
    let cart;
    if (req.user) {
        cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart_1.default.create({
                user: req.user.id,
                items: [],
            });
        }
    }
    else {
        const sessionId = req.session.id;
        cart = await Cart_1.default.findOne({ sessionId });
        if (!cart) {
            cart = await Cart_1.default.create({
                sessionId,
                items: [],
            });
        }
    }
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId && item.type === type);
    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    }
    else {
        cart.items.push({
            product: productId,
            quantity,
            type,
        });
    }
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});
exports.updateCartItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId, quantity } = req.body;
    let cart;
    if (req.user) {
        cart = await Cart_1.default.findOne({ user: req.user.id });
    }
    else {
        cart = await Cart_1.default.findOne({ sessionId: req.session.id });
    }
    if (!cart) {
        throw new AppError_1.AppError('Cart not found', 404);
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
        throw new AppError_1.AppError('Item not found in cart', 404);
    }
    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    }
    else {
        cart.items[itemIndex].quantity = quantity;
    }
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});
exports.removeFromCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    let cart;
    if (req.user) {
        cart = await Cart_1.default.findOne({ user: req.user.id });
    }
    else {
        cart = await Cart_1.default.findOne({ sessionId: req.session.id });
    }
    if (!cart) {
        throw new AppError_1.AppError('Cart not found', 404);
    }
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});
exports.clearCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    let cart;
    if (req.user) {
        cart = await Cart_1.default.findOne({ user: req.user.id });
    }
    else {
        cart = await Cart_1.default.findOne({ sessionId: req.session.id });
    }
    if (!cart) {
        throw new AppError_1.AppError('Cart not found', 404);
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({
        status: 'success',
        data: {
            cart,
        },
    });
});
exports.mergeCart = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { sessionId } = req.body;
    if (!req.user || !sessionId) {
        throw new AppError_1.AppError('User authentication and session ID required', 400);
    }
    const guestCart = await Cart_1.default.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
        return res.status(200).json({
            status: 'success',
            message: 'No guest cart to merge',
        });
    }
    let userCart = await Cart_1.default.findOne({ user: req.user.id });
    if (!userCart) {
        userCart = await Cart_1.default.create({
            user: req.user.id,
            items: guestCart.items,
        });
    }
    else {
        guestCart.items.forEach(guestItem => {
            const existingItemIndex = userCart.items.findIndex(item => item.product.toString() === guestItem.product.toString() &&
                item.type === guestItem.type);
            if (existingItemIndex > -1) {
                userCart.items[existingItemIndex].quantity += guestItem.quantity;
            }
            else {
                userCart.items.push(guestItem);
            }
        });
        await userCart.save();
    }
    await Cart_1.default.findByIdAndDelete(guestCart._id);
    await userCart.populate('items.product');
    res.status(200).json({
        status: 'success',
        data: {
            cart: userCart,
        },
    });
});
const addToCartValidation = [
    (0, express_validator_1.body)('productId')
        .isMongoId()
        .withMessage('Valid product ID is required'),
    (0, express_validator_1.body)('quantity')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Quantity must be between 1 and 10'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['single', 'subscription'])
        .withMessage('Type must be single or subscription'),
];
const updateCartValidation = [
    (0, express_validator_1.body)('productId')
        .isMongoId()
        .withMessage('Valid product ID is required'),
    (0, express_validator_1.body)('quantity')
        .isInt({ min: 0, max: 10 })
        .withMessage('Quantity must be between 0 and 10'),
];
const mergeCartValidation = [
    (0, express_validator_1.body)('sessionId')
        .notEmpty()
        .withMessage('Session ID is required'),
];
router.use(auth_1.optionalAuth);
router.get('/', exports.getCart);
router.post('/add', exports.addToCart);
router.put('/update', exports.updateCartItem);
router.delete('/remove/:productId', exports.removeFromCart);
router.delete('/clear', exports.clearCart);
router.use(auth_1.protect);
router.post('/merge', exports.mergeCart);
exports.default = router;
//# sourceMappingURL=cart.js.map