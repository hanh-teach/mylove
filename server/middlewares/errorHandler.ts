import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/loggerService';
import { AppError } from '../utils/errors';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const traceId = req.traceId || 'N/A';
  const user = (req.headers['x-user-email'] as string) || 'anonymous';
  const api = `${req.method} ${req.path}`;

  // Log error using Logger Service
  logger.exception(err instanceof Error ? err : new Error(String(err)), {
    traceId,
    user,
    module: 'unhandled-error-middleware',
    api,
    status: err.statusCode || 500
  });

  // Extract AppError properties or fallback to generic server error
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Internal Server Error';
  const errors = err instanceof AppError ? err.errors : null;

  return res.status(statusCode).json({
    success: false,
    message,
    code,
    data: null,
    errors,
    traceId
  });
}

