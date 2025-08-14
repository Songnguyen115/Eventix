import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './authMiddleware';

export function sponsorAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  // First check if user is authenticated
  authMiddleware(req, res, (err?: any) => {
    if (err) {
      return; // Error already handled by authMiddleware
    }

    // Check if user has sponsor role
    if (req.user && req.user.role === 'SPONSOR') {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: 'Access denied. Sponsor role required.'
      });
    }
  });
}
