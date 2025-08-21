"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsletterStats = exports.getAllNewsletterSubscriptions = exports.unsubscribeFromNewsletter = exports.subscribeToNewsletter = void 0;
const express_1 = __importDefault(require("express"));
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const Newsletter_1 = __importDefault(require("../models/Newsletter"));
const emailService_1 = require("../services/emailService");
const router = express_1.default.Router();
exports.subscribeToNewsletter = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new AppError_1.AppError('Email is required', 400);
    }
    const existingSubscription = await Newsletter_1.default.findOne({ email: email.toLowerCase() });
    if (existingSubscription) {
        if (existingSubscription.isActive) {
            throw new AppError_1.AppError('Email is already subscribed to our newsletter', 400);
        }
        else {
            existingSubscription.isActive = true;
            existingSubscription.unsubscribedAt = undefined;
            await existingSubscription.save();
            await (0, emailService_1.sendEmail)({
                email: existingSubscription.email,
                subject: 'Welcome Back to Cafe at Once Newsletter!',
                template: 'newsletterWelcome',
                data: {
                    email: existingSubscription.email,
                    subscribedAt: existingSubscription.subscribedAt
                }
            });
            return res.status(200).json({
                status: 'success',
                message: 'Successfully resubscribed to newsletter',
                data: {
                    subscription: existingSubscription
                }
            });
        }
    }
    const subscription = await Newsletter_1.default.create({
        email: email.toLowerCase()
    });
    await (0, emailService_1.sendEmail)({
        email: subscription.email,
        subject: 'Welcome to Cafe at Once Newsletter!',
        template: 'newsletterWelcome',
        data: {
            email: subscription.email,
            subscribedAt: subscription.subscribedAt
        }
    });
    await (0, emailService_1.sendEmail)({
        email: 'cafeatonce@gmail.com',
        subject: 'New Newsletter Subscription',
        template: 'newsletterNotification',
        data: {
            subscriberEmail: subscription.email,
            subscribedAt: subscription.subscribedAt
        }
    });
    res.status(201).json({
        status: 'success',
        message: 'Successfully subscribed to newsletter',
        data: {
            subscription
        }
    });
});
exports.unsubscribeFromNewsletter = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new AppError_1.AppError('Email is required', 400);
    }
    const subscription = await Newsletter_1.default.findOne({ email: email.toLowerCase() });
    if (!subscription) {
        throw new AppError_1.AppError('Email not found in newsletter subscriptions', 404);
    }
    if (!subscription.isActive) {
        throw new AppError_1.AppError('Email is already unsubscribed', 400);
    }
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();
    await (0, emailService_1.sendEmail)({
        email: subscription.email,
        subject: 'Unsubscribed from Cafe at Once Newsletter',
        template: 'newsletterUnsubscribe',
        data: {
            email: subscription.email,
            unsubscribedAt: subscription.unsubscribedAt
        }
    });
    res.status(200).json({
        status: 'success',
        message: 'Successfully unsubscribed from newsletter'
    });
});
exports.getAllNewsletterSubscriptions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const subscriptions = await Newsletter_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        status: 'success',
        results: subscriptions.length,
        data: {
            subscriptions
        }
    });
});
exports.getNewsletterStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const totalSubscribers = await Newsletter_1.default.countDocuments();
    const activeSubscribers = await Newsletter_1.default.countDocuments({ isActive: true });
    const inactiveSubscribers = await Newsletter_1.default.countDocuments({ isActive: false });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSubscriptions = await Newsletter_1.default.countDocuments({
        subscribedAt: { $gte: thirtyDaysAgo }
    });
    res.status(200).json({
        status: 'success',
        data: {
            totalSubscribers,
            activeSubscribers,
            inactiveSubscribers,
            recentSubscriptions
        }
    });
});
router.post('/subscribe', exports.subscribeToNewsletter);
router.post('/unsubscribe', exports.unsubscribeFromNewsletter);
router.get('/all', exports.getAllNewsletterSubscriptions);
router.get('/stats', exports.getNewsletterStats);
exports.default = router;
//# sourceMappingURL=newsletter.js.map