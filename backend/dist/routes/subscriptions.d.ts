import express from 'express';
declare const router: import("express-serve-static-core").Router;
export declare const getUserSubscriptions: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const getSubscription: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const createSubscription: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const updateSubscription: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const pauseSubscription: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const resumeSubscription: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const cancelSubscription: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const getAllSubscriptions: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export default router;
//# sourceMappingURL=subscriptions.d.ts.map