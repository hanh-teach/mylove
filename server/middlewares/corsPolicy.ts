import { Request } from 'express';
import { CorsOptions } from 'cors';

export interface EnvOptions {
  NODE_ENV?: string;
  ALLOWED_ORIGIN?: string;
}

/**
 * Checks if a request origin is allowed based on strict security policies:
 * 1. Missing origin -> allowed (non-browser or same-origin requests omitting Origin header)
 * 2. Origin host matches request Host header (same-origin request) -> allowed
 * 3. Localhost origins when NODE_ENV !== 'production' (development environment only) -> allowed
 * 4. Explicit exact match in ALLOWED_ORIGIN env var (comma-separated list, no wildcards allowed) -> allowed
 *
 * Public hosting wildcard patterns (.run.app, .onrender.com, .vercel.app, .netlify.app)
 * and wildcard ALLOWED_ORIGIN='*' are STRICTLY REMOVED to prevent cross-site credential theft.
 */
export function isOriginAllowed(
  origin: string | undefined,
  reqHost: string | undefined,
  envOptions?: EnvOptions
): boolean {
  if (!origin) {
    return true;
  }

  const env = envOptions || process.env;
  const nodeEnv = env.NODE_ENV || 'development';
  const allowedOriginEnv = env.ALLOWED_ORIGIN;

  // 1. Same-host / Same-origin check
  try {
    const originHost = new URL(origin).host;
    if (originHost && reqHost && originHost === reqHost) {
      return true;
    }
  } catch {
    // Ignore invalid URL format
  }

  // 2. Localhost check allowed only in non-production environments
  const isDev = nodeEnv !== 'production';
  if (isDev && /^https?:\/\/localhost(:\d+)?$/i.test(origin)) {
    return true;
  }

  // 3. Explicit exact match list from ALLOWED_ORIGIN env var (no wildcard)
  if (allowedOriginEnv) {
    const allowedList = allowedOriginEnv
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && item !== '*');

    if (allowedList.includes(origin)) {
      return true;
    }
  }

  return false;
}

export function createCorsOptionsDelegate(envOptions?: EnvOptions) {
  return (req: Request, callback: (err: Error | null, options?: CorsOptions) => void) => {
    const origin = req.headers.origin as string | undefined;
    const reqHost = req.headers.host as string | undefined;

    const isAllowed = isOriginAllowed(origin, reqHost, envOptions);

    callback(null, {
      origin: isAllowed,
      credentials: true
    });
  };
}
