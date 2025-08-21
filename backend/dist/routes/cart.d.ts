import express from 'express';
declare const router: import("express-serve-static-core").Router;
export declare const getCart: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const addToCart: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const updateCartItem: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const removeFromCart: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const clearCart: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const mergeCart: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export default router;
//# sourceMappingURL=cart.d.ts.map