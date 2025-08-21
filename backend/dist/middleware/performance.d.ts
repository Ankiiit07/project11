import { Request, Response, NextFunction } from 'express';
export declare const performanceMonitor: (req: Request, res: Response, next: NextFunction) => void;
export declare const getPerformanceMetrics: () => {
    totalRequests: number;
    averageResponseTime: number;
    slowRequests: number;
    errorRate: number;
    memoryUsage: {
        average: number;
        peak: number;
    };
};
export declare const cleanupMetrics: () => void;
export declare const queryPerformanceMonitor: (query: string, duration: number) => void;
//# sourceMappingURL=performance.d.ts.map