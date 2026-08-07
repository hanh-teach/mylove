import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { proxyMedia } from './mediaProxyController';
import { Request, Response } from 'express';

describe('mediaProxyController - proxyMedia redirects and security', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should successfully proxy media when redirected to another allowed domain in allowlist after re-validation', async () => {
    const req = {
      query: { url: 'https://fal.media/redirect' },
      traceId: 'test-trace'
    } as unknown as Request;
    (req as any).validatedMediaUrl = 'https://fal.media/redirect';

    const res = {
      status: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      write: vi.fn().mockReturnValue(true),
      end: vi.fn(),
      destroy: vi.fn()
    } as unknown as Response;

    const next = vi.fn() as any;

    const mockStream = {
      getReader: () => ({
        read: vi.fn()
          .mockResolvedValueOnce({ done: false, value: new Uint8Array([1, 2, 3]) })
          .mockResolvedValueOnce({ done: true, value: undefined })
      })
    };

    let fetchCall = 0;
    global.fetch = vi.fn().mockImplementation(async (_url: string) => {
      fetchCall++;
      if (fetchCall === 1) {
        return {
          status: 302,
          ok: false,
          headers: {
            get: (name: string) => name.toLowerCase() === 'location' ? 'https://cdn.runwayml.com/final.mp4' : null
          }
        };
      } else {
        return {
          status: 200,
          ok: true,
          headers: {
            get: (name: string) => {
              if (name.toLowerCase() === 'content-type') return 'video/mp4';
              if (name.toLowerCase() === 'content-length') return '3';
              return null;
            }
          },
          body: mockStream
        };
      }
    });

    await proxyMedia(req, res, next);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'video/mp4');
    expect(next).not.toHaveBeenCalled();
  });

  it('should immediately block redirect to internal/blocked IP address or unallowed domain', async () => {
    const req = {
      query: { url: 'https://fal.media/redirect' },
      traceId: 'test-trace'
    } as unknown as Request;
    (req as any).validatedMediaUrl = 'https://fal.media/redirect';

    const res = {
      status: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      destroy: vi.fn(),
      headersSent: false
    } as unknown as Response;

    const next = vi.fn() as any;

    global.fetch = vi.fn().mockResolvedValue({
      status: 302,
      ok: false,
      headers: {
        get: (name: string) => name.toLowerCase() === 'location' ? 'http://169.254.169.254/latest/meta-data/' : null
      }
    });

    await proxyMedia(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err.message).toContain('Redirected URL not allowed');
  });

  it('should block when exceeding max redirects (3 redirects)', async () => {
    const req = {
      query: { url: 'https://fal.media/loop' },
      traceId: 'test-trace'
    } as unknown as Request;
    (req as any).validatedMediaUrl = 'https://fal.media/loop';

    const res = {
      status: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      destroy: vi.fn(),
      headersSent: false
    } as unknown as Response;

    const next = vi.fn() as any;

    global.fetch = vi.fn().mockResolvedValue({
      status: 302,
      ok: false,
      headers: {
        get: (name: string) => name.toLowerCase() === 'location' ? 'https://fal.media/loop' : null
      }
    });

    await proxyMedia(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err.message).toContain('Too many redirects');
  });
});
