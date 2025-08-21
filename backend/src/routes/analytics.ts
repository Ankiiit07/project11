import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import Subscription from '../models/Subscription';

const router = express.Router();

// Get dashboard analytics
export const getDashboardAnalytics = catchAsync(async (req: any, res: any) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Total counts
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

  // Monthly revenue
  const monthlyRevenue = await Order.aggregate([
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

  const lastMonthRevenue = await Order.aggregate([
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

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('orderNumber customerInfo.name total orderStatus createdAt');

  // Top products
  const topProducts = await Order.aggregate([
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

// Get sales analytics
export const getSalesAnalytics = catchAsync(async (req: any, res: any) => {
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

  // Daily sales
  const dailySales = await Order.aggregate([
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

  // Payment method breakdown
  const paymentMethods = await Order.aggregate([
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

// Get user analytics
export const getUserAnalytics = catchAsync(async (req: any, res: any) => {
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

  // New user registrations
  const newUsers = await User.aggregate([
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

  // User activity
  const userActivity = await Order.aggregate([
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

// Routes - Admin only
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/sales', getSalesAnalytics);
router.get('/users', getUserAnalytics);

export default router;