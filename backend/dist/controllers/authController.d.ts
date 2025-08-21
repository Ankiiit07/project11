import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const logout: (req: Request, res: Response) => void;
export declare const forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const verifyEmail: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updatePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=authController.d.ts.map