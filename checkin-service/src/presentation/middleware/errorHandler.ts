import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors/ValidationError';
import { NotFoundError } from '../../domain/errors/NotFoundError';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle domain errors
  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: error.message,
      type: 'ValidationError'
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      error: error.message,
      type: 'NotFoundError'
    });
    return;
  }

  // Handle database errors
  if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
    res.status(409).json({
      success: false,
      error: 'Resource already exists',
      type: 'ConflictError'
    });
    return;
  }

  if (error.message.includes('foreign key constraint')) {
    res.status(400).json({
      success: false,
      error: 'Referenced resource does not exist',
      type: 'ReferenceError'
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      type: 'AuthenticationError'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expired',
      type: 'AuthenticationError'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    type: 'InternalServerError'
  });
}
