import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import User from '../models/User';

const router = express.Router();

// Get user profile
export const getUserProfile = catchAsync(async (req: any, res: any) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Update user profile
export const updateUserProfile = catchAsync(async (req: any, res: any) => {
  const { name, email, phone } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Get user addresses
export const getUserAddresses = catchAsync(async (req: any, res: any) => {
  const user = await User.findById(req.user.id).select('addresses');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      addresses: user.addresses,
    },
  });
});

// Add user address
export const addUserAddress = catchAsync(async (req: any, res: any) => {
  const { type, street, city, state, zipCode, country, isDefault } = req.body;
  
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // If this is set as default, make all other addresses non-default
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

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
];

const addAddressValidation = [
  body('type')
    .isIn(['home', 'work', 'other'])
    .withMessage('Address type must be home, work, or other'),
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
];

// Routes
router.use(protect); // All routes require authentication

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/addresses', getUserAddresses);
router.post('/addresses', addUserAddress);

export default router;