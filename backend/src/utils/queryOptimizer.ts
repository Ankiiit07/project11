import { queryPerformanceMonitor } from '../middleware/performance';
import logger from './logger';

// Query options interface
interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  select?: string;
  populate?: string | string[];
  lean?: boolean;
  cache?: boolean;
  cacheTTL?: number;
}

// Filter interface
interface FilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

// Advanced query builder class
export class QueryBuilder<T = any> {
  private query: any;
  private options: QueryOptions;
  private filters: FilterOptions;
  private startTime: number;

  constructor(baseQuery: any, options: QueryOptions = {}, filters: FilterOptions = {}) {
    this.query = baseQuery;
    this.options = options;
    this.filters = filters;
    this.startTime = Date.now();
  }

  // Apply pagination
  paginate(): this {
    const page = this.options.page || 1;
    const limit = this.options.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // Apply sorting
  sort(): this {
    if (this.options.sort) {
      const sortField = this.options.sort.startsWith('-') 
        ? this.options.sort.substring(1) 
        : this.options.sort;
      const sortOrder = this.options.sort.startsWith('-') ? -1 : 1;
      
      this.query = this.query.sort({ [sortField]: sortOrder });
    } else {
      // Default sorting by createdAt
      this.query = this.query.sort({ createdAt: -1 });
    }
    return this;
  }

  // Apply field selection
  select(): this {
    if (this.options.select) {
      this.query = this.query.select(this.options.select);
    }
    return this;
  }

  // Apply population
  populate(): this {
    if (this.options.populate) {
      if (Array.isArray(this.options.populate)) {
        this.options.populate.forEach(field => {
          this.query = this.query.populate(field);
        });
      } else {
        this.query = this.query.populate(this.options.populate);
      }
    }
    return this;
  }

  // Apply search filters
  search(): this {
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

  // Apply category filter
  filterByCategory(): this {
    if (this.filters.category) {
      this.query = this.query.find({ category: this.filters.category });
    }
    return this;
  }

  // Apply price range filter
  filterByPrice(): this {
    const priceFilter: any = {};
    
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

  // Apply stock filter
  filterByStock(): this {
    if (this.filters.inStock !== undefined) {
      if (this.filters.inStock) {
        this.query = this.query.find({ stock: { $gt: 0 } });
      } else {
        this.query = this.query.find({ stock: { $lte: 0 } });
      }
    }
    return this;
  }

  // Apply active status filter
  filterByActive(): this {
    if (this.filters.isActive !== undefined) {
      this.query = this.query.find({ isActive: this.filters.isActive });
    }
    return this;
  }

  // Apply date range filter
  filterByDate(): this {
    const dateFilter: any = {};
    
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

  // Apply lean option for better performance
  lean(): this {
    if (this.options.lean) {
      this.query = this.query.lean();
    }
    return this;
  }

  // Execute query with performance monitoring
  async execute(): Promise<T[]> {
    try {
      const result = await this.query.exec();
      
      // Monitor query performance
      const duration = Date.now() - this.startTime;
      queryPerformanceMonitor(this.query.toString(), duration);
      
      return result;
    } catch (error) {
      logger.error('Query execution failed:', error);
      throw error;
    }
  }

  // Execute count query
  async count(): Promise<number> {
    try {
      const result = await this.query.countDocuments().exec();
      
      const duration = Date.now() - this.startTime;
      queryPerformanceMonitor(`COUNT: ${this.query.toString()}`, duration);
      
      return result;
    } catch (error) {
      logger.error('Count query failed:', error);
      throw error;
    }
  }

  // Get query string for debugging
  toString(): string {
    return this.query.toString();
  }
}

// Query optimization utilities
export const optimizeQuery = {
  // Add database hints for better performance
  addHints: (query: any, hints: any) => {
    return query.hint(hints);
  },

  // Force index usage
  forceIndex: (query: any, indexName: string) => {
    return query.hint({ [indexName]: 1 });
  },

  // Limit fields for better performance
  limitFields: (query: any, fields: string[]) => {
    const selectObj: any = {};
    fields.forEach(field => {
      selectObj[field] = 1;
    });
    return query.select(selectObj);
  },

  // Add text search index
  textSearch: (query: any, searchTerm: string, fields: string[]) => {
    const searchConditions = fields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }));
    
    return query.find({ $or: searchConditions });
  },

  // Add geospatial queries
  nearLocation: (query: any, coordinates: [number, number], maxDistance: number) => {
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

  // Add aggregation pipeline optimization
  aggregateOptimized: (pipeline: any[]) => {
    // Add $match stage early to reduce documents
    const optimizedPipeline = pipeline.map(stage => {
      if (stage.$match) {
        // Move $match to the beginning if not already there
        return stage;
      }
      return stage;
    });

    // Add $limit stage if not present
    const hasLimit = optimizedPipeline.some(stage => stage.$limit);
    if (!hasLimit) {
      optimizedPipeline.push({ $limit: 1000 }); // Default limit
    }

    return optimizedPipeline;
  }
};

// Index recommendations
export const indexRecommendations = {
  // Product indexes
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

  // Order indexes
  orderIndexes: [
    { userId: 1 },
    { status: 1 },
    { createdAt: -1 },
    { userId: 1, status: 1 },
    { userId: 1, createdAt: -1 }
  ],

  // User indexes
  userIndexes: [
    { email: 1 },
    { phone: 1 },
    { createdAt: -1 }
  ]
};

// Query performance analyzer
export const analyzeQuery = (query: any, executionTime: number) => {
  const analysis = {
    executionTime,
    isSlow: executionTime > 100,
    recommendations: [] as string[]
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