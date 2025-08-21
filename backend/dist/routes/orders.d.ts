import express from 'express';
declare const router: import("express-serve-static-core").Router;
export declare const getUserOrders: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const getOrder: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const trackOrder: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const cancelOrder: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const getAllOrders: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const updateOrderStatus: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const createOrder: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export default router;
//# sourceMappingURL=orders.d.ts.map