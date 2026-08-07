import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiWriteRateLimiter } from './rateLimiters';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/loggerService';
import { EventEmitter } from 'events';

vi.mock('../services/loggerService', () => ({
  logger: {
    security: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }
}));

function createMockResponse() {
  const emitter = new EventEmitter();
  const headers: Record<string, string> = {};
  
  const jsonMock = vi.fn();
  const statusMock = vi.fn().mockReturnValue({ json: jsonMock });

  const res: any = {
    headersSent: false,
    statusCode: 200,
    setHeader: vi.fn((key: string, value: string) => {
      headers[key.toLowerCase()] = value;
    }),
    getHeader: vi.fn((key: string) => headers[key.toLowerCase()]),
    removeHeader: vi.fn((key: string) => {
      delete headers[key.toLowerCase()];
    }),
    status: statusMock,
    json: jsonMock,
    send: vi.fn(),
    on: vi.fn((event: string, listener: (...args: any[]) => void) => {
      emitter.on(event, listener);
      return res;
    }),
    emit: (event: string, ...args: any[]) => emitter.emit(event, ...args)
  };

  return { res, statusMock, jsonMock };
}

describe('rateLimiters - aiWriteRateLimiter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows requests within limit by calling next()', async () => {
    const req = {
      ip: '10.0.0.1',
      headers: {},
      socket: { remoteAddress: '10.0.0.1' }
    } as unknown as Request;

    const { res } = createMockResponse();
    const next = vi.fn() as NextFunction;

    await (aiWriteRateLimiter as any)(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('blocks request and logs security event when max limit is reached', async () => {
    const testIp = '10.0.0.99';

    const req = {
      ip: testIp,
      headers: {},
      socket: { remoteAddress: testIp }
    } as unknown as Request;

    // Simulate 20 requests
    for (let i = 0; i < 20; i++) {
      const { res } = createMockResponse();
      const next = vi.fn() as NextFunction;
      await (aiWriteRateLimiter as any)(req, res, next);
    }

    // 21st request should trigger rate limit handler
    const { res, statusMock, jsonMock } = createMockResponse();
    const next21 = vi.fn() as NextFunction;

    await (aiWriteRateLimiter as any)(req, res, next21);

    expect(statusMock).toHaveBeenCalledWith(429);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: expect.stringContaining('Too many AI write requests')
    });
    expect(logger.security).toHaveBeenCalledWith(
      'Rate limit exceeded for /api/ai/write',
      expect.objectContaining({ ip: testIp })
    );
  });
});
