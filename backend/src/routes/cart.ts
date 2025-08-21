import express from 'express';
import { protect, optionalAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import Cart from '../models/Cart';
import Product from '../models/Product';

const router = express.Router();

// Get cart
export const getCart = catchAsync(async (req: any, res: any) => {
  let cart;
  
  if (req.user) {
    // Authenticated user
    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  } else {
    // Guest user - use session
    const sessionId = req.session.id;
    cart = await Cart.findOne({ sessionId }).populate('items.product');
  }

  if (!cart) {
    cart = { items: [] };
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Add item to cart
export const addToCart = catchAsync(async (req: any, res: any) => {
  const { productId, quantity = 1, type = 'single' } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  let cart;
  
  if (req.user) {
    // Authenticated user
    cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }
  } else {
    // Guest user - use session
    const sessionId = req.session.id;
    cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({
        sessionId,
        items: [],
      });
    }
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && item.type === type
  );

  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      type,
    });
  }

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Update cart item
export const updateCartItem = catchAsync(async (req: any, res: any) => {
  const { productId, quantity } = req.body;

  let cart;
  
  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    cart = await Cart.findOne({ sessionId: req.session.id });
  }

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new AppError('Item not found in cart', 404);
  }

  if (quantity <= 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Remove item from cart
export const removeFromCart = catchAsync(async (req: any, res: any) => {
  const { productId } = req.params;

  let cart;
  
  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    cart = await Cart.findOne({ sessionId: req.session.id });
  }

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Clear cart
export const clearCart = catchAsync(async (req: any, res: any) => {
  let cart;
  
  if (req.user) {
    cart = await Cart.findOne({ user: req.user.id });
  } else {
    cart = await Cart.findOne({ sessionId: req.session.id });
  }

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Merge guest cart with user cart on login
export const mergeCart = catchAsync(async (req: any, res: any) => {
  const { sessionId } = req.body;

  if (!req.user || !sessionId) {
    throw new AppError('User authentication and session ID required', 400);
  }

  const guestCart = await Cart.findOne({ sessionId });
  if (!guestCart || guestCart.items.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'No guest cart to merge',
    });
  }

  let userCart = await Cart.findOne({ user: req.user.id });
  if (!userCart) {
    // Create user cart from guest cart
    userCart = await Cart.create({
      user: req.user.id,
      items: guestCart.items,
    });
  } else {
    // Merge items
    guestCart.items.forEach(guestItem => {
      const existingItemIndex = userCart!.items.findIndex(
        item => item.product.toString() === guestItem.product.toString() && 
                item.type === guestItem.type
      );

      if (existingItemIndex > -1) {
        userCart!.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        userCart!.items.push(guestItem);
      }
    });
    await userCart.save();
  }

  // Delete guest cart
  await Cart.findByIdAndDelete(guestCart._id);

  await userCart.populate('items.product');

  res.status(200).json({
    status: 'success',
    data: {
      cart: userCart,
    },
  });
});

// Validation rules
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  body('type')
    .optional()
    .isIn(['single', 'subscription'])
    .withMessage('Type must be single or subscription'),
];

const updateCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .isInt({ min: 0, max: 10 })
    .withMessage('Quantity must be between 0 and 10'),
];

const mergeCartValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required'),
];

// Routes
router.use(optionalAuth); // Allow both authenticated and guest users

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

// Authenticated routes
router.use(protect);
router.post('/merge', mergeCart);

export default router;