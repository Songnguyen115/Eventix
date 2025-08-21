import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare function errorHandler(error: AppError, req: Request, res: Response, next: NextFunction): void;
export declare function createError(statusCode: number, message: string): AppError;
//# sourceMappingURL=errorHandler.d.ts.map