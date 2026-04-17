import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err instanceof ValidationError && { errors: err.errors }),
    });
  }

  // Log unexpected errors
  console.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(500).json({
    status: "error",
    message,
  });
};

// Async error wrapper
export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
