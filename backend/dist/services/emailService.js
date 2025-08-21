"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const AppError_1 = require("../utils/AppError");
const createTransporter = () => {
    const hasEmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    if (process.env.NODE_ENV === 'production' || hasEmailCredentials) {
        console.log('📧 Using real email service');
        return nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'cafeatonce@gmail.com',
                pass: process.env.EMAIL_PASS || '',
            },
        });
    }
    else {
        console.log('📧 Using enhanced mock email service (no email credentials)');
        return {
            sendMail: async (mailOptions) => {
                console.log('📧 ===== DEVELOPMENT EMAIL LOG =====');
                console.log('📧 To:', mailOptions.to);
                console.log('📧 Subject:', mailOptions.subject);
                console.log('📧 From:', mailOptions.from);
                console.log('📧 HTML Content Length:', mailOptions.html ? mailOptions.html.length : 0);
                console.log('📧 ===== EMAIL CONTENT PREVIEW =====');
                if (mailOptions.html) {
                    console.log(mailOptions.html.substring(0, 500) + '...');
                }
                console.log('📧 ===== END EMAIL LOG =====');
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { messageId: 'mock-message-id-' + Date.now() };
            }
        };
    }
};
const getEmailTemplate = (template, data) => {
    switch (template) {
        case 'welcome':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Welcome to Cafe at Once!</h1>
          <p>Hi ${data.name},</p>
          <p>Thank you for joining Cafe at Once! We're excited to have you as part of our coffee-loving community.</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${data.verificationURL}" style="background-color: #8B7355; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
        case 'passwordReset':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Password Reset Request</h1>
          <p>Hi ${data.name},</p>
          <p>You requested a password reset for your Cafe at Once account.</p>
          <p>Click the button below to reset your password (valid for 10 minutes):</p>
          <a href="${data.resetURL}" style="background-color: #8B7355; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
        case 'orderConfirmation':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Order Confirmation</h1>
          <p>Hi ${data.customerName},</p>
          <p>Thank you for your order! Your order #${data.orderNumber} has been confirmed.</p>
          
          <h3>Order Details:</h3>
          <ul>
            ${data.items.map((item) => `
              <li>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>
            `).join('')}
          </ul>
          
          <p><strong>Total: ₹${data.total.toFixed(2)}</strong></p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
          
          <p>We'll send you tracking information once your order ships.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
        case 'orderNotification':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">New Order Received 📦</h1>
          <p>A new order has been placed on Cafe at Once.</p>
          
          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">Order Details:</h3>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Customer Name:</strong> ${data.customerName}</p>
            <p><strong>Customer Email:</strong> ${data.customerEmail}</p>
            <p><strong>Customer Phone:</strong> ${data.customerPhone}</p>
            <p><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p><strong>Order Status:</strong> ${data.orderStatus}</p>
            <p><strong>Total Amount:</strong> ₹${data.total.toFixed(2)}</p>
          </div>
          
          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">Order Items:</h3>
            <ul>
              ${data.items.map((item) => `
                <li>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>
              `).join('')}
            </ul>
          </div>
          
          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">Shipping Address:</h3>
            <p>${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
            ${data.shippingAddress.country}</p>
          </div>
          
          <p>Please process this order promptly and update the status in the admin panel.</p>
          <p>Best regards,<br>Cafe at Once System</p>
        </div>
      `;
        case 'contactForm':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">New Contact Form Submission</h1>
          <p><strong>From:</strong> ${data.customerName} (${data.customerEmail})</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          <p>Please respond to this inquiry promptly.</p>
        </div>
      `;
        case 'contactConfirmation':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Thank You for Contacting Us!</h1>
          <p>Hi ${data.customerName},</p>
          <p>Thank you for reaching out to Cafe at Once. We have received your message regarding "${data.subject}".</p>
          <p>Our team will review your inquiry and respond within 24 hours during business hours.</p>
          <p>If you have any urgent questions, please feel free to call us at +91 7979837079 or WhatsApp us.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
        case 'newsletterWelcome':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Welcome to Cafe at Once Newsletter! ☕</h1>
          <p>Hi there!</p>
          <p>Thank you for subscribing to our newsletter! We're excited to keep you updated with the latest coffee insights, exclusive offers, and behind-the-scenes stories from Cafe at Once.</p>
          
          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">What you'll receive:</h3>
            <ul style="color: #666;">
              <li>🎯 Exclusive discounts and early access to new products</li>
              <li>☕ Coffee brewing tips and recipes</li>
              <li>🌱 Health benefits and wellness insights</li>
              <li>📦 Order updates and delivery notifications</li>
              <li>🎉 Special promotions and seasonal offers</li>
            </ul>
          </div>
          
          <p>Your first newsletter will arrive soon. In the meantime, why not explore our latest products?</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" style="background-color: #8B7355; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Shop Now</a>
          
          <p>If you have any questions, feel free to reply to this email or contact us at cafeatonce@gmail.com</p>
          
          <p>Best regards,<br>The Cafe at Once Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">
            You can unsubscribe at any time by clicking the unsubscribe link in our emails.
          </p>
        </div>
      `;
        case 'newsletterNotification':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">New Newsletter Subscription 📧</h1>
          <p>A new user has subscribed to the Cafe at Once newsletter.</p>
          
          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">Subscription Details:</h3>
            <p><strong>Email:</strong> ${data.subscriberEmail}</p>
            <p><strong>Subscribed At:</strong> ${new Date(data.subscribedAt).toLocaleString()}</p>
          </div>
          
          <p>This brings your total newsletter subscribers to a growing community of coffee enthusiasts!</p>
          
          <p>Best regards,<br>Cafe at Once System</p>
        </div>
      `;
        case 'newsletterUnsubscribe':
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Unsubscribed from Newsletter</h1>
          <p>Hi there,</p>
          <p>You have been successfully unsubscribed from the Cafe at Once newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always resubscribe by visiting our website and entering your email in the newsletter section.</p>
          <p>Thank you for being part of our coffee community. We hope to see you again soon!</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
        default:
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Cafe at Once</h1>
          <p>Thank you for choosing Cafe at Once!</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
    }
};
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `Cafe at Once <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            html: getEmailTemplate(options.template, options.data),
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new AppError_1.AppError('Email could not be sent', 500);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailService.js.map