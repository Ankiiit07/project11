import express from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import Newsletter from '../models/Newsletter';
import { sendEmail } from '../services/emailService';

const router = express.Router();

// Subscribe to newsletter
export const subscribeToNewsletter = catchAsync(async (req: any, res: any) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Check if email is already subscribed
  const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });
  
  if (existingSubscription) {
    if (existingSubscription.isActive) {
      throw new AppError('Email is already subscribed to our newsletter', 400);
    } else {
      // Reactivate subscription
      existingSubscription.isActive = true;
      existingSubscription.unsubscribedAt = undefined;
      await existingSubscription.save();
      
      // Send welcome back email
      await sendEmail({
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

  // Create new subscription
  const subscription = await Newsletter.create({
    email: email.toLowerCase()
  });

  // Send welcome email to subscriber
  await sendEmail({
    email: subscription.email,
    subject: 'Welcome to Cafe at Once Newsletter!',
    template: 'newsletterWelcome',
    data: {
      email: subscription.email,
      subscribedAt: subscription.subscribedAt
    }
  });

  // Send notification email to admin
  await sendEmail({
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

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = catchAsync(async (req: any, res: any) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

  if (!subscription) {
    throw new AppError('Email not found in newsletter subscriptions', 404);
  }

  if (!subscription.isActive) {
    throw new AppError('Email is already unsubscribed', 400);
  }

  subscription.isActive = false;
  subscription.unsubscribedAt = new Date();
  await subscription.save();

  // Send confirmation email
  await sendEmail({
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

// Get all newsletter subscriptions (admin only)
export const getAllNewsletterSubscriptions = catchAsync(async (req: any, res: any) => {
  const subscriptions = await Newsletter.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    data: {
      subscriptions
    }
  });
});

// Get newsletter subscription stats (admin only)
export const getNewsletterStats = catchAsync(async (req: any, res: any) => {
  const totalSubscribers = await Newsletter.countDocuments();
  const activeSubscribers = await Newsletter.countDocuments({ isActive: true });
  const inactiveSubscribers = await Newsletter.countDocuments({ isActive: false });
  
  // Get recent subscriptions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSubscriptions = await Newsletter.countDocuments({
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

// Routes
router.post('/subscribe', subscribeToNewsletter);
router.post('/unsubscribe', unsubscribeFromNewsletter);
router.get('/all', getAllNewsletterSubscriptions);
router.get('/stats', getNewsletterStats);

export default router; 