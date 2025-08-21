import { Response } from 'express';
interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    timestamp: string;
    path: string;
}
export declare const successResponse: <T>(res: Response, data: T, message?: string, statusCode?: number, meta?: ApiResponse["meta"]) => Response<any, Record<string, any>>;
export declare const errorResponse: (res: Response, message?: string, statusCode?: number, error?: string) => Response<any, Record<string, any>>;
export declare const paginatedResponse: <T>(res: Response, data: T[], page: number, limit: number, total: number, message?: string) => Response<any, Record<string, any>>;
export declare const createdResponse: <T>(res: Response, data: T, message?: string) => Response<any, Record<string, any>>;
export declare const updatedResponse: <T>(res: Response, data: T, message?: string) => Response<any, Record<string, any>>;
export declare const deletedResponse: (res: Response, message?: string) => Response<any, Record<string, any>>;
export declare const notFoundResponse: (res: Response, message?: string) => Response<any, Record<string, any>>;
export declare const validationErrorResponse: (res: Response, errors: string[], message?: string) => Response<any, Record<string, any>>;
export declare const unauthorizedResponse: (res: Response, message?: string) => Response<any, Record<string, any>>;
export declare const forbiddenResponse: (res: Response, message?: string) => Response<any, Record<string, any>>;
export declare const conflictResponse: (res: Response, message?: string) => Response<any, Record<string, any>>;
export declare const rateLimitResponse: (res: Response, message?: string) => Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=apiResponse.d.ts.map