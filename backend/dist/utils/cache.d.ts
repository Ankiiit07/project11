declare class Cache {
    private cache;
    private maxSize;
    constructor(maxSize?: number);
    set<T>(key: string, value: T, ttl?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): boolean;
    clear(): void;
    size(): number;
    keys(): string[];
    has(key: string): boolean;
    private cleanup;
    private evictOldest;
    getStats(): {
        size: number;
        maxSize: number;
        expiredCount: number;
        averageAge: number;
    };
}
declare const cache: Cache;
export declare function cached(ttl?: number, keyGenerator?: (...args: any[]) => string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export declare const cacheMiddleware: (ttl?: number) => (req: any, res: any, next: any) => any;
export declare const invalidatePattern: (pattern: string) => number;
export declare const warmCache: (keys: string[], fetcher: (key: string) => Promise<any>, ttl?: number) => Promise<PromiseSettledResult<{
    key: string;
    success: boolean;
    error?: undefined;
} | {
    key: string;
    success: boolean;
    error: unknown;
}>[]>;
export default cache;
export { Cache };
//# sourceMappingURL=cache.d.ts.map