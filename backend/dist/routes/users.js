"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserAddress = exports.getUserAddresses = exports.updateUserProfile = exports.getUserProfile = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
exports.getUserProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await User_1.default.findById(req.user.id).select('-password');
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});
exports.updateUserProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, email, phone } = req.body;
    const user = await User_1.default.findByIdAndUpdate(req.user.id, { name, email, phone }, { new: true, runValidators: true }).select('-password');
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});
exports.getUserAddresses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await User_1.default.findById(req.user.id).select('addresses');
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            addresses: user.addresses,
        },
    });
});
exports.addUserAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User_1.default.findById(req.user.id);
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    if (isDefault) {
        user.addresses.forEach(address => {
            address.isDefault = false;
        });
    }
    user.addresses.push({
        type,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || user.addresses.length === 0,
    });
    await user.save();
    res.status(201).json({
        status: 'success',
        data: {
            addresses: user.addresses,
        },
    });
});
const updateProfileValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
];
const addAddressValidation = [
    (0, express_validator_1.body)('type')
        .isIn(['home', 'work', 'other'])
        .withMessage('Address type must be home, work, or other'),
    (0, express_validator_1.body)('street')
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),
    (0, express_validator_1.body)('city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    (0, express_validator_1.body)('state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    (0, express_validator_1.body)('zipCode')
        .trim()
        .notEmpty()
        .withMessage('ZIP code is required'),
    (0, express_validator_1.body)('country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),
];
router.use(auth_1.protect);
router.get('/profile', exports.getUserProfile);
router.put('/profile', exports.updateUserProfile);
router.get('/addresses', exports.getUserAddresses);
router.post('/addresses', exports.addUserAddress);
exports.default = router;
//# sourceMappingURL=users.js.map