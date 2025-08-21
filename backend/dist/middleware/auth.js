"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = require("../utils/AppError");
const catchAsync_1 = require("../utils/catchAsync");
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        throw new AppError_1.AppError('You are not logged in! Please log in to get access.', 401);
    }
    const decoded = await (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User_1.default.findById(decoded.id);
    if (!currentUser) {
        throw new AppError_1.AppError('The user belonging to this token does no longer exist.', 401);
    }
    req.user = currentUser;
    next();
});
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError_1.AppError('You do not have permission to perform this action', 403);
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.optionalAuth = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (token) {
        try {
            const decoded = await (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
            const currentUser = await User_1.default.findById(decoded.id);
            if (currentUser) {
                req.user = currentUser;
            }
        }
        catch (err) {
        }
    }
    next();
});
//# sourceMappingURL=auth.js.map