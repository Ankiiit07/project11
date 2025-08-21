"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const createProductValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Product name must be between 2 and 200 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('price')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('category')
        .isIn(['concentrate', 'tube', 'flavored', 'tea'])
        .withMessage('Category must be one of: concentrate, tube, flavored, tea'),
    (0, express_validator_1.body)('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    (0, express_validator_1.body)('sku')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('SKU must be between 3 and 20 characters'),
];
const searchValidation = [
    (0, express_validator_1.query)('q')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Search query must not be empty'),
    (0, express_validator_1.query)('category')
        .optional()
        .isIn(['concentrate', 'tube', 'flavored', 'tea'])
        .withMessage('Invalid category'),
    (0, express_validator_1.query)('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),
    (0, express_validator_1.query)('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number'),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];
router.get('/', productController_1.getAllProducts);
router.get('/featured', productController_1.getFeaturedProducts);
router.get('/category/:category', productController_1.getProductsByCategory);
router.get('/search', productController_1.searchProducts);
router.get('/:id', productController_1.getProduct);
router.use(auth_1.protect);
router.use((0, auth_1.restrictTo)('admin'));
router.post('/', productController_1.createProduct);
router.patch('/:id', productController_1.updateProduct);
router.delete('/:id', productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.js.map