import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/loggerService';
import { AppError } from '../utils/errors';
import { isAllowedDomain, isBlockedHostname } from '../validators/mediaProxyValidator';

const FETCH_TIMEOUT_MS = 20_000;
const MAX_PROXY_BYTES = 200 * 1024 * 1024; // 200MB safety ceiling

/**
 * Streams a remote AI-generated video/image (Runway, Agnes AI, Hugging Face, FAL...) through our
 * own backend so the browser sees it as same-origin.
 */
export async function proxyMedia(req: Request, res: Response, next: NextFunction) {
  let currentUrl: string = (req as any).validatedMediaUrl;
  const traceId = req.traceId || 'N/A';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    let upstream: any = null;
    let redirectsCount = 0;
    const MAX_REDIRECTS = 3;

    while (redirectsCount <= MAX_REDIRECTS) {
      upstream = await fetch(currentUrl, {
        signal: controller.signal,
        redirect: 'manual'
      });

      if (upstream.status >= 300 && upstream.status < 400) {
        const location = upstream.headers.get('location');
        if (!location) {
          throw new AppError('Redirect response missing Location header', 502, 'MEDIA_PROXY_INVALID_REDIRECT');
        }

        let nextUrl: URL;
        try {
          nextUrl = new URL(location, currentUrl);
        } catch {
          throw new AppError('Invalid redirect URL', 502, 'MEDIA_PROXY_INVALID_REDIRECT');
        }

        if (nextUrl.protocol !== 'http:' && nextUrl.protocol !== 'https:') {
          throw new AppError('Only http(s) redirect URLs are allowed', 502, 'MEDIA_PROXY_INVALID_REDIRECT');
        }

        if (isBlockedHostname(nextUrl.hostname) || !isAllowedDomain(nextUrl.hostname)) {
          throw new AppError('Redirected URL not allowed by security policy', 403, 'MEDIA_PROXY_FORBIDDEN_REDIRECT');
        }

        currentUrl = nextUrl.toString();
        redirectsCount++;
        if (redirectsCount > MAX_REDIRECTS) {
          throw new AppError('Too many redirects', 502, 'MEDIA_PROXY_TOO_MANY_REDIRECTS');
        }
        continue;
      }
      break;
    }

    if (!upstream || !upstream.ok || !upstream.body) {
      throw new AppError(
        `Upstream media fetch failed with status ${upstream?.status || 502}`,
        502,
        'MEDIA_PROXY_UPSTREAM_ERROR'
      );
    }

    const contentLengthHeader = upstream.headers.get('content-length');
    if (contentLengthHeader && Number(contentLengthHeader) > MAX_PROXY_BYTES) {
      throw new AppError('Upstream media exceeds proxy size limit', 502, 'MEDIA_PROXY_TOO_LARGE');
    }

    res.status(200);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
    if (contentLengthHeader) {
      res.setHeader('Content-Length', contentLengthHeader);
    }
    // Media is read-only and immutable once generated — safe to cache aggressively client-side.
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    const reader = upstream.body.getReader();
    let bytesWritten = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesWritten += value.byteLength;
      if (bytesWritten > MAX_PROXY_BYTES) {
        res.destroy();
        return;
      }
      if (!res.write(Buffer.from(value))) {
        await new Promise((resolve) => res.once('drain', resolve));
      }
    }

    res.end();
  } catch (error: any) {
    logger.exception(error instanceof Error ? error : new Error(String(error)), {
      traceId,
      module: 'MediaProxyController',
      api: 'GET /api/media-proxy',
      targetUrl: currentUrl,
      originalError: error?.message
    });

    if (res.headersSent) {
      res.destroy();
      return;
    }

    return next(
      error instanceof AppError
        ? error
        : new AppError('Failed to proxy media', 502, 'MEDIA_PROXY_ERROR')
    );
  } finally {
    clearTimeout(timeout);
  }
}
