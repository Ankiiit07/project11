"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactMessage = void 0;
const emailService_1 = require("../services/emailService");
const AppError_1 = require("../utils/AppError");
const catchAsync_1 = require("../utils/catchAsync");
exports.sendContactMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, email, subject, message, category } = req.body;
    try {
        await (0, emailService_1.sendEmail)({
            email: process.env.EMAIL_FROM || 'cafeatonce@gmail.com',
            subject: `Contact Form: ${subject}`,
            template: 'contactForm',
            data: {
                customerName: name,
                customerEmail: email,
                subject,
                message,
                category,
            },
        });
        await (0, emailService_1.sendEmail)({
            email: email,
            subject: 'Thank you for contacting Cafe at Once',
            template: 'contactConfirmation',
            data: {
                customerName: name,
                subject,
            },
        });
        res.status(200).json({
            status: 'success',
            message: 'Message sent successfully',
        });
    }
    catch (error) {
        console.error('Error sending contact message:', error);
        throw new AppError_1.AppError('Failed to send message. Please try again later.', 500);
    }
});
//# sourceMappingURL=contactController.js.map