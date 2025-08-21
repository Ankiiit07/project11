"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSystemSettings = exports.getSystemSettings = exports.updateOrderAdmin = exports.getAllOrdersAdmin = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const apiFeatures_1 = require("../utils/apiFeatures");
const router = express_1.default.Router();
exports.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const features = new apiFeatures_1.APIFeatures(User_1.default.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users = await features.query;
    const totalUsers = await User_1.default.countDocuments();
    res.status(200).json({
        status: 'success',
        results: users.length,
        totalResults: totalUsers,
        data: {
            users,
        },
    });
});
exports.getUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user) {
        throw new AppError_1.AppError('No user found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});
exports.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, email, role, isEmailVerified } = req.body;
    const user = await User_1.default.findByIdAndUpdate(req.params.id, { name, email, role, isEmailVerified }, { new: true, runValidators: true });
    if (!user) {
        throw new AppError_1.AppError('No user found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});
exports.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await User_1.default.findByIdAndDelete(req.params.id);
    if (!user) {
        throw new AppError_1.AppError('No user found with that ID', 404);
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
exports.createProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await Product_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            product,
        },
    });
});
exports.updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new AppError_1.AppError('No product found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            product,
        },
    });
});
exports.deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await Product_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) {
        throw new AppError_1.AppError('No product found with that ID', 404);
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
exports.getAllOrdersAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const features = new apiFeatures_1.APIFeatures(Order_1.default.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const orders = await features.query;
    const totalOrders = await Order_1.default.countDocuments();
    res.status(200).json({
        status: 'success',
        results: orders.length,
        totalResults: totalOrders,
        data: {
            orders,
        },
    });
});
exports.updateOrderAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { orderStatus, trackingNumber, notes } = req.body;
    const order = await Order_1.default.findByIdAndUpdate(req.params.id, {
        orderStatus,
        trackingNumber,
        notes,
        ...(orderStatus === 'delivered' && { actualDelivery: new Date() })
    }, { new: true, runValidators: true });
    if (!order) {
        throw new AppError_1.AppError('No order found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            order,
        },
    });
});
exports.getSystemSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
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
exports.updateSystemSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const settings = req.body;
    res.status(200).json({
        status: 'success',
        data: {
            settings,
        },
    });
});
const updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string().valid('customer', 'admin').optional(),
    isEmailVerified: joi_1.default.boolean().optional(),
});
const createProductSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(200).required(),
    description: joi_1.default.string().min(10).max(2000).required(),
    price: joi_1.default.number().positive().required(),
    category: joi_1.default.string().valid('concentrate', 'tube', 'flavored', 'tea').required(),
    stock: joi_1.default.number().integer().min(0).required(),
    sku: joi_1.default.string().min(3).max(20).required(),
});
const updateOrderSchema = joi_1.default.object({
    orderStatus: joi_1.default.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').optional(),
    trackingNumber: joi_1.default.string().min(5).max(50).optional(),
    notes: joi_1.default.string().max(1000).optional(),
});
router.use(auth_1.protect);
router.use((0, auth_1.restrictTo)('admin'));
router.get('/users', exports.getAllUsers);
router.get('/users/:id', exports.getUser);
router.patch('/users/:id', exports.updateUser);
router.delete('/users/:id', exports.deleteUser);
router.post('/products', exports.createProduct);
router.patch('/products/:id', exports.updateProduct);
router.delete('/products/:id', exports.deleteProduct);
router.get('/orders', exports.getAllOrdersAdmin);
router.patch('/orders/:id', exports.updateOrderAdmin);
router.get('/settings', exports.getSystemSettings);
router.patch('/settings', exports.updateSystemSettings);
exports.default = router;
//# sourceMappingURL=admin.js.map