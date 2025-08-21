import { Request, Response } from 'express';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { APIFeatures } from '../utils/apiFeatures';

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  // Build query
  const features = new APIFeatures(Product.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  
  // Get total count for pagination
  const totalProducts = await Product.countDocuments({ isActive: true });

  res.status(200).json({
    status: 'success',
    results: products.length,
    totalResults: totalProducts,
    data: {
      products,
    },
  });
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findOne({ 
    _id: req.params.id, 
    isActive: true 
  });

  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await Product.find({ 
    isActive: true, 
    isFeatured: true 
  }).limit(8);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

export const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { category } = req.params;
  
  const products = await Product.find({ 
    isActive: true, 
    category 
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

export const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const { q, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

  // Build search query
  const searchQuery: any = { isActive: true };

  // Text search
  if (q) {
    searchQuery.$text = { $search: q as string };
  }

  // Category filter
  if (category) {
    searchQuery.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = Number(minPrice);
    if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
  }

  // Execute search with pagination
  const skip = (Number(page) - 1) * Number(limit);
  
  const products = await Product.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, rating: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalResults = await Product.countDocuments(searchQuery);

  res.status(200).json({
    status: 'success',
    results: products.length,
    totalResults,
    page: Number(page),
    totalPages: Math.ceil(totalResults / Number(limit)),
    data: {
      products,
    },
  });
});