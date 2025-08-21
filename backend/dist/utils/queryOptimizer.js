"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeQuery = exports.indexRecommendations = exports.optimizeQuery = exports.QueryBuilder = void 0;
const performance_1 = require("../middleware/performance");
const logger_1 = __importDefault(require("./logger"));
class QueryBuilder {
    constructor(baseQuery, options = {}, filters = {}) {
        this.query = baseQuery;
        this.options = options;
        this.filters = filters;
        this.startTime = Date.now();
    }
    paginate() {
        const page = this.options.page || 1;
        const limit = this.options.limit || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    sort() {
        if (this.options.sort) {
            const sortField = this.options.sort.startsWith('-')
                ? this.options.sort.substring(1)
                : this.options.sort;
            const sortOrder = this.options.sort.startsWith('-') ? -1 : 1;
            this.query = this.query.sort({ [sortField]: sortOrder });
        }
        else {
            this.query = this.query.sort({ createdAt: -1 });
        }
        return this;
    }
    select() {
        if (this.options.select) {
            this.query = this.query.select(this.options.select);
        }
        return this;
    }
    populate() {
        if (this.options.populate) {
            if (Array.isArray(this.options.populate)) {
                this.options.populate.forEach(field => {
                    this.query = this.query.populate(field);
                });
            }
            else {
                this.query = this.query.populate(this.options.populate);
            }
        }
        return this;
    }
    search() {
        if (this.filters.search) {
            const searchRegex = new RegExp(this.filters.search, 'i');
            this.query = this.query.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex },
                    { tags: { $in: [searchRegex] } }
                ]
            });
        }
        return this;
    }
    filterByCategory() {
        if (this.filters.category) {
            this.query = this.query.find({ category: this.filters.category });
        }
        return this;
    }
    filterByPrice() {
        const priceFilter = {};
        if (this.filters.minPrice !== undefined) {
            priceFilter.$gte = this.filters.minPrice;
        }
        if (this.filters.maxPrice !== undefined) {
            priceFilter.$lte = this.filters.maxPrice;
        }
        if (Object.keys(priceFilter).length > 0) {
            this.query = this.query.find({ price: priceFilter });
        }
        return this;
    }
    filterByStock() {
        if (this.filters.inStock !== undefined) {
            if (this.filters.inStock) {
                this.query = this.query.find({ stock: { $gt: 0 } });
            }
            else {
                this.query = this.query.find({ stock: { $lte: 0 } });
            }
        }
        return this;
    }
    filterByActive() {
        if (this.filters.isActive !== undefined) {
            this.query = this.query.find({ isActive: this.filters.isActive });
        }
        return this;
    }
    filterByDate() {
        const dateFilter = {};
        if (this.filters.dateFrom) {
            dateFilter.$gte = this.filters.dateFrom;
        }
        if (this.filters.dateTo) {
            dateFilter.$lte = this.filters.dateTo;
        }
        if (Object.keys(dateFilter).length > 0) {
            this.query = this.query.find({ createdAt: dateFilter });
        }
        return this;
    }
    lean() {
        if (this.options.lean) {
            this.query = this.query.lean();
        }
        return this;
    }
    async execute() {
        try {
            const result = await this.query.exec();
            const duration = Date.now() - this.startTime;
            (0, performance_1.queryPerformanceMonitor)(this.query.toString(), duration);
            return result;
        }
        catch (error) {
            logger_1.default.error('Query execution failed:', error);
            throw error;
        }
    }
    async count() {
        try {
            const result = await this.query.countDocuments().exec();
            const duration = Date.now() - this.startTime;
            (0, performance_1.queryPerformanceMonitor)(`COUNT: ${this.query.toString()}`, duration);
            return result;
        }
        catch (error) {
            logger_1.default.error('Count query failed:', error);
            throw error;
        }
    }
    toString() {
        return this.query.toString();
    }
}
exports.QueryBuilder = QueryBuilder;
exports.optimizeQuery = {
    addHints: (query, hints) => {
        return query.hint(hints);
    },
    forceIndex: (query, indexName) => {
        return query.hint({ [indexName]: 1 });
    },
    limitFields: (query, fields) => {
        const selectObj = {};
        fields.forEach(field => {
            selectObj[field] = 1;
        });
        return query.select(selectObj);
    },
    textSearch: (query, searchTerm, fields) => {
        const searchConditions = fields.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' }
        }));
        return query.find({ $or: searchConditions });
    },
    nearLocation: (query, coordinates, maxDistance) => {
        return query.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    $maxDistance: maxDistance
                }
            }
        });
    },
    aggregateOptimized: (pipeline) => {
        const optimizedPipeline = pipeline.map(stage => {
            if (stage.$match) {
                return stage;
            }
            return stage;
        });
        const hasLimit = optimizedPipeline.some(stage => stage.$limit);
        if (!hasLimit) {
            optimizedPipeline.push({ $limit: 1000 });
        }
        return optimizedPipeline;
    }
};
exports.indexRecommendations = {
    productIndexes: [
        { name: 1 },
        { category: 1 },
        { price: 1 },
        { stock: 1 },
        { isActive: 1 },
        { createdAt: -1 },
        { category: 1, price: 1 },
        { category: 1, isActive: 1 },
        { name: 'text', description: 'text' }
    ],
    orderIndexes: [
        { userId: 1 },
        { status: 1 },
        { createdAt: -1 },
        { userId: 1, status: 1 },
        { userId: 1, createdAt: -1 }
    ],
    userIndexes: [
        { email: 1 },
        { phone: 1 },
        { createdAt: -1 }
    ]
};
const analyzeQuery = (query, executionTime) => {
    const analysis = {
        executionTime,
        isSlow: executionTime > 100,
        recommendations: []
    };
    if (executionTime > 100) {
        analysis.recommendations.push('Consider adding database indexes');
        analysis.recommendations.push('Use field selection to limit data transfer');
        analysis.recommendations.push('Consider implementing caching');
    }
    if (executionTime > 1000) {
        analysis.recommendations.push('Query is very slow - consider query optimization');
        analysis.recommendations.push('Check if proper indexes exist');
        analysis.recommendations.push('Consider pagination for large datasets');
    }
    return analysis;
};
exports.analyzeQuery = analyzeQuery;
//# sourceMappingURL=queryOptimizer.js.map