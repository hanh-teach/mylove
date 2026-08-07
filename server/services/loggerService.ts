import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY' | 'PERFORMANCE' | 'AI_REQUEST' | 'AI_RESPONSE' | 'EXCEPTION';

export interface LogMetadata {
  traceId?: string;
  user?: string;
  module?: string;
  api?: string;
  duration?: number;
  status?: number | string;
  [key: string]: any;
}

export class LoggerService {
  private static formatMessage(
    level: LogLevel,
    message: string,
    metadata: LogMetadata = {}
  ): string {
    const logRecord = {
      time: new Date().toISOString(),
      level,
      message,
      traceId: metadata.traceId || 'N/A',
      user: metadata.user || 'anonymous',
      module: metadata.module || 'system',
      api: metadata.api || 'N/A',
      duration: metadata.duration !== undefined ? `${metadata.duration}ms` : undefined,
      status: metadata.status !== undefined ? metadata.status : undefined,
      additionalInfo: Object.keys(metadata).reduce((acc, key) => {
        if (!['traceId', 'user', 'module', 'api', 'duration', 'status'].includes(key)) {
          acc[key] = metadata[key];
        }
        return acc;
      }, {} as any)
    };

    return JSON.stringify(logRecord);
  }

  public info(message: string, metadata?: LogMetadata): void {
    console.info(LoggerService.formatMessage('INFO', message, metadata));
  }

  public warn(message: string, metadata?: LogMetadata): void {
    console.warn(LoggerService.formatMessage('WARN', message, metadata));
  }

  public error(message: string, metadata?: LogMetadata): void {
    console.error(LoggerService.formatMessage('ERROR', message, metadata));
  }

  public security(message: string, metadata?: LogMetadata): void {
    console.warn(LoggerService.formatMessage('SECURITY', message, metadata));
  }

  public performance(message: string, duration: number, metadata?: LogMetadata): void {
    console.info(LoggerService.formatMessage('PERFORMANCE', message, { ...metadata, duration }));
  }

  public aiRequest(providerName: string, promptLength: number, metadata?: LogMetadata): void {
    console.info(LoggerService.formatMessage('AI_REQUEST', `Initiated request to ${providerName}`, {
      ...metadata,
      provider: providerName,
      promptLength
    }));
  }

  public aiResponse(providerName: string, duration: number, success: boolean, metadata?: LogMetadata): void {
    console.info(LoggerService.formatMessage('AI_RESPONSE', `Received response from ${providerName}`, {
      ...metadata,
      provider: providerName,
      duration,
      status: success ? 'SUCCESS' : 'FAILED'
    }));
  }

  public exception(err: Error, metadata?: LogMetadata): void {
    console.error(LoggerService.formatMessage('EXCEPTION', err.message, {
      ...metadata,
      stack: err.stack,
      errorName: err.name
    }));
  }
}

export const logger = new LoggerService();

// Extend Request type to hold trace ID and start times
declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      startTime?: number;
    }
  }
}

/**
 * Express Middleware to assign TraceIDs, start request timer, and automatically log incoming requests and outgoing responses
 */
export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  req.traceId = (req.headers['x-trace-id'] as string) || randomUUID();
  req.startTime = Date.now();

  const user = (req.headers['x-user-email'] as string) || 'anonymous';
  const api = `${req.method} ${req.path}`;
  const module = req.path.startsWith('/api') ? 'backend-api' : 'frontend-serve';

  // Log incoming request
  logger.info(`Incoming HTTP Request: ${api}`, {
    traceId: req.traceId,
    user,
    module,
    api
  });

  // Track response output
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    const duration = Date.now() - (req.startTime || Date.now());
    
    // Log outgoing response
    logger.performance(`HTTP Response completed: ${api}`, duration, {
      traceId: req.traceId,
      user,
      module,
      api,
      status: res.statusCode
    });

    return originalEnd.call(this, chunk, encoding, cb);
  } as any;

  next();
}
