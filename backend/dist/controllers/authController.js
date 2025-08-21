"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const emailService_1 = require("../services/emailService");
const AppError_1 = require("../utils/AppError");
const catchAsync_1 = require("../utils/catchAsync");
const signToken = (id) => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpire = process.env.JWT_EXPIRE;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (!jwtExpire) {
        throw new Error('JWT_EXPIRE is not defined in environment variables');
    }
    return jsonwebtoken_1.default.sign({ id }, jwtSecret, {
        expiresIn: jwtExpire,
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};
exports.register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new AppError_1.AppError('User with this email already exists', 400);
    }
    const user = await User_1.default.create({
        name,
        email,
        password,
        phone,
    });
    const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto_1.default
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    await user.save({ validateBeforeSave: false });
    try {
        const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        await (0, emailService_1.sendEmail)({
            email: user.email,
            subject: 'Welcome to Cafe at Once - Verify Your Email',
            template: 'welcome',
            data: {
                name: user.name,
                verificationURL,
            },
        });
    }
    catch (err) {
        console.error('Error sending verification email:', err);
    }
    createSendToken(user, 201, res);
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError_1.AppError('Please provide email and password', 400);
    }
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError_1.AppError('Incorrect email or password', 401);
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    createSendToken(user, 200, res);
});
const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};
exports.logout = logout;
exports.forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await User_1.default.findOne({ email: req.body.email });
    if (!user) {
        throw new AppError_1.AppError('There is no user with that email address', 404);
    }
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    try {
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await (0, emailService_1.sendEmail)({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            template: 'passwordReset',
            data: {
                name: user.name,
                resetURL,
            },
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new AppError_1.AppError('There was an error sending the email. Try again later.', 500);
    }
});
exports.resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new AppError_1.AppError('Token is invalid or has expired', 400);
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
});
exports.verifyEmail = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User_1.default.findOne({
        emailVerificationToken: hashedToken,
    });
    if (!user) {
        throw new AppError_1.AppError('Token is invalid', 400);
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: 'success',
        message: 'Email verified successfully',
    });
});
exports.updatePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const user = await User_1.default.findById(req.user.id).select('+password');
    if (!(await user.comparePassword(req.body.passwordCurrent))) {
        throw new AppError_1.AppError('Your current password is wrong', 401);
    }
    user.password = req.body.password;
    await user.save();
    createSendToken(user, 200, res);
});
//# sourceMappingURL=authController.js.map