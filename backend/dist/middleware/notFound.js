"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const AppError_1 = require("../utils/AppError");
const notFound = (req, res, next) => {
    const err = new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map