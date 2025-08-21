"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAnalytics = exports.getSalesAnalytics = exports.getDashboardAnalytics = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const catchAsync_1 = require("../utils/catchAsync");
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const router = express_1.default.Router();
exports.getDashboardAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const totalUsers = await User_1.default.countDocuments();
    const totalOrders = await Order_1.default.countDocuments();
    const totalProducts = await Product_1.default.countDocuments();
    const activeSubscriptions = await Subscription_1.default.countDocuments({ status: 'active' });
    const monthlyRevenue = await Order_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfMonth },
                paymentStatus: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$total' }
            }
        }
    ]);
    const lastMonthRevenue = await Order_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                paymentStatus: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$total' }
            }
        }
    ]);
    const recentOrders = await Order_1.default.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber customerInfo.name total orderStatus createdAt');
    const topProducts = await Order_1.default.aggregate([
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.product',
                totalSold: { $sum: '$items.quantity' },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product'
            }
        },
        { $unwind: '$product' }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            overview: {
                totalUsers,
                totalOrders,
                totalProducts,
                activeSubscriptions,
                monthlyRevenue: monthlyRevenue[0]?.total || 0,
                lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
            },
            recentOrders,
            topProducts,
        },
    });
});
exports.getSalesAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { period = '30d' } = req.query;
    let startDate = new Date();
    switch (period) {
        case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
        case '90d':
            startDate.setDate(startDate.getDate() - 90);
            break;
        case '1y':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
    }
    const dailySales = await Order_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                paymentStatus: 'completed'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                },
                revenue: { $sum: '$total' },
                orders: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    const paymentMethods = await Order_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                paymentStatus: 'completed'
            }
        },
        {
            $group: {
                _id: '$paymentMethod',
                count: { $sum: 1 },
                revenue: { $sum: '$total' }
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            dailySales,
            paymentMethods,
        },
    });
});
exports.getUserAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { period = '30d' } = req.query;
    let startDate = new Date();
    switch (period) {
        case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
        case '90d':
            startDate.setDate(startDate.getDate() - 90);
            break;
        case '1y':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
    }
    const newUsers = await User_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    const userActivity = await Order_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: '$user',
                orderCount: { $sum: 1 },
                totalSpent: { $sum: '$total' }
            }
        },
        {
            $group: {
                _id: null,
                activeUsers: { $sum: 1 },
                averageOrdersPerUser: { $avg: '$orderCount' },
                averageSpentPerUser: { $avg: '$totalSpent' }
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            newUsers,
            userActivity: userActivity[0] || {
                activeUsers: 0,
                averageOrdersPerUser: 0,
                averageSpentPerUser: 0
            },
        },
    });
});
router.use(auth_1.protect);
router.use((0, auth_1.restrictTo)('admin'));
router.get('/dashboard', exports.getDashboardAnalytics);
router.get('/sales', exports.getSalesAnalytics);
router.get('/users', exports.getUserAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.js.map