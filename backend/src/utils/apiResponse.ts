import { Response } from 'express';

// Standard API response interface
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

// Success response helper
export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  meta?: ApiResponse['meta']
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
    path: res.req.originalUrl,
  };

  return res.status(statusCode).json(response);
};

// Error response helper
export const errorResponse = (
  res: Response,
  message: string = 'Error occurred',
  statusCode: number = 500,
  error?: string
) => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
    path: res.req.originalUrl,
  };

  return res.status(statusCode).json(response);
};

// Pagination response helper
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Data retrieved successfully'
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const meta = {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };

  return successResponse(res, data, message, 200, meta);
};

// Created response helper
export const createdResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
) => {
  return successResponse(res, data, message, 201);
};

// Updated response helper
export const updatedResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Resource updated successfully'
) => {
  return successResponse(res, data, message, 200);
};

// Deleted response helper
export const deletedResponse = (
  res: Response,
  message: string = 'Resource deleted successfully'
) => {
  return successResponse(res, null, message, 200);
};

// Not found response helper
export const notFoundResponse = (
  res: Response,
  message: string = 'Resource not found'
) => {
  return errorResponse(res, message, 404);
};

// Validation error response helper
export const validationErrorResponse = (
  res: Response,
  errors: string[],
  message: string = 'Validation failed'
) => {
  return errorResponse(res, message, 400, errors.join(', '));
};

// Unauthorized response helper
export const unauthorizedResponse = (
  res: Response,
  message: string = 'Unauthorized access'
) => {
  return errorResponse(res, message, 401);
};

// Forbidden response helper
export const forbiddenResponse = (
  res: Response,
  message: string = 'Access forbidden'
) => {
  return errorResponse(res, message, 403);
};

// Conflict response helper
export const conflictResponse = (
  res: Response,
  message: string = 'Resource conflict'
) => {
  return errorResponse(res, message, 409);
};

// Rate limit response helper
export const rateLimitResponse = (
  res: Response,
  message: string = 'Too many requests'
) => {
  return errorResponse(res, message, 429);
}; 