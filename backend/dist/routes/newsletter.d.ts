import express from 'express';
declare const router: import("express-serve-static-core").Router;
export declare const subscribeToNewsletter: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const unsubscribeFromNewsletter: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const getAllNewsletterSubscriptions: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export declare const getNewsletterStats: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export default router;
//# sourceMappingURL=newsletter.d.ts.map