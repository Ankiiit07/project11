"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailService_1 = require("../services/emailService");
const AppError_1 = require("../utils/AppError");
const router = express_1.default.Router();
router.post('/send', async (req, res, next) => {
    try {
        const { email, subject, template, data } = req.body;
        if (!email || !subject || !template) {
            throw new AppError_1.AppError('Email, subject, and template are required', 400);
        }
        await (0, emailService_1.sendEmail)({
            email,
            subject,
            template,
            data: data || {}
        });
        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=email.js.map