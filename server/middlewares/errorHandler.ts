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
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = isAppError ? (err.message || 'Internal Server Error') : 'Internal Server Error';
  const errors = isAppError ? err.errors : null;

  return res.status(statusCode).json({
    success: false,
    message,
    code,
    data: null,
    errors,
    traceId
  });
}

