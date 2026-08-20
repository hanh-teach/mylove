import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from './errorHandler';
import { ValidationError, AppError } from '../utils/errors';
import { Request, Response } from 'express';
import { logger } from '../services/loggerService';

vi.mock('../services/loggerService', () => {
  return {
    logger: {
      exception: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }
  };
});

describe('errorHandler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: any;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {
      method: 'POST',
      path: '/api/test',
      traceId: 'test-trace-id',
      headers: {
        'x-user-email': 'test@example.com'
      }
    };
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock
    };
    nextFunction = vi.fn();
  });

  it('should preserve original error message and status code for AppError (e.g. ValidationError)', () => {
    const error = new ValidationError('Invalid input data', [{ field: 'title', message: 'Title is required' }]);

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      data: null,
      errors: [{ field: 'title', message: 'Title is required' }],
      traceId: 'test-trace-id'
    });

    // Logger should log original exception fully
    expect(logger.exception).toHaveBeenCalledWith(error, expect.objectContaining({
      traceId: 'test-trace-id',
      user: 'test@example.com',
      module: 'unhandled-error-middleware',
      api: 'POST /api/test',
      status: 400
    }));
  });

  it('should sanitize message for non-AppError and return 500 status code', () => {
    const error = new Error('Database connection failed! secret_password=xyz');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
      data: null,
      errors: null,
      traceId: 'test-trace-id'
    });

    // Logger must still get the original sensitive exception
    expect(logger.exception).toHaveBeenCalledWith(error, expect.objectContaining({
      traceId: 'test-trace-id',
      user: 'test@example.com',
      module: 'unhandled-error-middleware',
      api: 'POST /api/test',
      status: 500
    }));
  });
});
