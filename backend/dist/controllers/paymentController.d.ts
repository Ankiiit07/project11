import { Request, Response } from 'express';
export declare const createOrder: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const verifyPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getPaymentStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const refundPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const handleWebhook: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createOrderFromCart: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=paymentController.d.ts.map