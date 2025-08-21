"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitResponse = exports.conflictResponse = exports.forbiddenResponse = exports.unauthorizedResponse = exports.validationErrorResponse = exports.notFoundResponse = exports.deletedResponse = exports.updatedResponse = exports.createdResponse = exports.paginatedResponse = exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, data, message = 'Success', statusCode = 200, meta) => {
    const response = {
        success: true,
        message,
        data,
        meta,
        timestamp: new Date().toISOString(),
        path: res.req.originalUrl,
    };
    return res.status(statusCode).json(response);
};
exports.successResponse = successResponse;
const errorResponse = (res, message = 'Error occurred', statusCode = 500, error) => {
    const response = {
        success: false,
        message,
        error,
        timestamp: new Date().toISOString(),
        path: res.req.originalUrl,
    };
    return res.status(statusCode).json(response);
};
exports.errorResponse = errorResponse;
const paginatedResponse = (res, data, page, limit, total, message = 'Data retrieved successfully') => {
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
    return (0, exports.successResponse)(res, data, message, 200, meta);
};
exports.paginatedResponse = paginatedResponse;
const createdResponse = (res, data, message = 'Resource created successfully') => {
    return (0, exports.successResponse)(res, data, message, 201);
};
exports.createdResponse = createdResponse;
const updatedResponse = (res, data, message = 'Resource updated successfully') => {
    return (0, exports.successResponse)(res, data, message, 200);
};
exports.updatedResponse = updatedResponse;
const deletedResponse = (res, message = 'Resource deleted successfully') => {
    return (0, exports.successResponse)(res, null, message, 200);
};
exports.deletedResponse = deletedResponse;
const notFoundResponse = (res, message = 'Resource not found') => {
    return (0, exports.errorResponse)(res, message, 404);
};
exports.notFoundResponse = notFoundResponse;
const validationErrorResponse = (res, errors, message = 'Validation failed') => {
    return (0, exports.errorResponse)(res, message, 400, errors.join(', '));
};
exports.validationErrorResponse = validationErrorResponse;
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return (0, exports.errorResponse)(res, message, 401);
};
exports.unauthorizedResponse = unauthorizedResponse;
const forbiddenResponse = (res, message = 'Access forbidden') => {
    return (0, exports.errorResponse)(res, message, 403);
};
exports.forbiddenResponse = forbiddenResponse;
const conflictResponse = (res, message = 'Resource conflict') => {
    return (0, exports.errorResponse)(res, message, 409);
};
exports.conflictResponse = conflictResponse;
const rateLimitResponse = (res, message = 'Too many requests') => {
    return (0, exports.errorResponse)(res, message, 429);
};
exports.rateLimitResponse = rateLimitResponse;
//# sourceMappingURL=apiResponse.js.map