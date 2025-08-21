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
export declare class QueryBuilder<T = any> {
    private query;
    private options;
    private filters;
    private startTime;
    constructor(baseQuery: any, options?: QueryOptions, filters?: FilterOptions);
    paginate(): this;
    sort(): this;
    select(): this;
    populate(): this;
    search(): this;
    filterByCategory(): this;
    filterByPrice(): this;
    filterByStock(): this;
    filterByActive(): this;
    filterByDate(): this;
    lean(): this;
    execute(): Promise<T[]>;
    count(): Promise<number>;
    toString(): string;
}
export declare const optimizeQuery: {
    addHints: (query: any, hints: any) => any;
    forceIndex: (query: any, indexName: string) => any;
    limitFields: (query: any, fields: string[]) => any;
    textSearch: (query: any, searchTerm: string, fields: string[]) => any;
    nearLocation: (query: any, coordinates: [number, number], maxDistance: number) => any;
    aggregateOptimized: (pipeline: any[]) => any[];
};
export declare const indexRecommendations: {
    productIndexes: ({
        name: number;
        category?: undefined;
        price?: undefined;
        stock?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        description?: undefined;
    } | {
        category: number;
        name?: undefined;
        price?: undefined;
        stock?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        description?: undefined;
    } | {
        price: number;
        name?: undefined;
        category?: undefined;
        stock?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        description?: undefined;
    } | {
        stock: number;
        name?: undefined;
        category?: undefined;
        price?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        description?: undefined;
    } | {
        isActive: number;
        name?: undefined;
        category?: undefined;
        price?: undefined;
        stock?: undefined;
        createdAt?: undefined;
        description?: undefined;
    } | {
        createdAt: number;
        name?: undefined;
        category?: undefined;
        price?: undefined;
        stock?: undefined;
        isActive?: undefined;
        description?: undefined;
    } | {
        category: number;
        price: number;
        name?: undefined;
        stock?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        description?: undefined;
    } | {
        category: number;
        isActive: number;
        name?: undefined;
        price?: undefined;
        stock?: undefined;
        createdAt?: undefined;
        description?: undefined;
    } | {
        name: string;
        description: string;
        category?: undefined;
        price?: undefined;
        stock?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
    })[];
    orderIndexes: ({
        userId: number;
        status?: undefined;
        createdAt?: undefined;
    } | {
        status: number;
        userId?: undefined;
        createdAt?: undefined;
    } | {
        createdAt: number;
        userId?: undefined;
        status?: undefined;
    } | {
        userId: number;
        status: number;
        createdAt?: undefined;
    } | {
        userId: number;
        createdAt: number;
        status?: undefined;
    })[];
    userIndexes: ({
        email: number;
        phone?: undefined;
        createdAt?: undefined;
    } | {
        phone: number;
        email?: undefined;
        createdAt?: undefined;
    } | {
        createdAt: number;
        email?: undefined;
        phone?: undefined;
    })[];
};
export declare const analyzeQuery: (query: any, executionTime: number) => {
    executionTime: number;
    isSlow: boolean;
    recommendations: string[];
};
export {};
//# sourceMappingURL=queryOptimizer.d.ts.map