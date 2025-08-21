"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.getProductsByCategory = exports.getFeaturedProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getAllProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const AppError_1 = require("../utils/AppError");
const catchAsync_1 = require("../utils/catchAsync");
const apiFeatures_1 = require("../utils/apiFeatures");
exports.getAllProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const features = new apiFeatures_1.APIFeatures(Product_1.default.find({ isActive: true }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const products = await features.query;
    const totalProducts = await Product_1.default.countDocuments({ isActive: true });
    res.status(200).json({
        status: 'success',
        results: products.length,
        totalResults: totalProducts,
        data: {
            products,
        },
    });
});
exports.getProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await Product_1.default.findOne({
        _id: req.params.id,
        isActive: true
    });
    if (!product) {
        throw new AppError_1.AppError('No product found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            product,
        },
    });
});
exports.createProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await Product_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            product,
        },
    });
});
exports.updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new AppError_1.AppError('No product found with that ID', 404);
    }
    res.status(200).json({
        status: 'success',
        data: {
            product,
        },
    });
});
exports.deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await Product_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) {
        throw new AppError_1.AppError('No product found with that ID', 404);
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
exports.getFeaturedProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const products = await Product_1.default.find({
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
exports.getProductsByCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { category } = req.params;
    const products = await Product_1.default.find({
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
exports.searchProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { q, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const searchQuery = { isActive: true };
    if (q) {
        searchQuery.$text = { $search: q };
    }
    if (category) {
        searchQuery.category = category;
    }
    if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice)
            searchQuery.price.$gte = Number(minPrice);
        if (maxPrice)
            searchQuery.price.$lte = Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product_1.default.find(searchQuery)
        .sort({ score: { $meta: 'textScore' }, rating: -1 })
        .skip(skip)
        .limit(Number(limit));
    const totalResults = await Product_1.default.countDocuments(searchQuery);
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
//# sourceMappingURL=productController.js.map