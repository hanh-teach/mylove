import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export const ALLOWED_MEDIA_HOSTNAME_SUFFIXES = [
  'runwayml.com',
  'runway.com',
  'runwayml.ai',
  'fal.media',
  'fal.ai',
  'huggingface.co',
  'hf.co',
  'agnes-ai.com',
  'amazonaws.com',
  'cloudfront.net',
  'storage.googleapis.com',
  'r2.cloudflarestorage.com',
  'supabase.co'
];

// Alias for backwards compatibility
export const ALLOWED_MEDIA_DOMAINS = ALLOWED_MEDIA_HOSTNAME_SUFFIXES;

export function isAllowedDomain(hostname: string): boolean {
  if (!hostname || typeof hostname !== 'string') return false;
  const lower = hostname.toLowerCase().trim();
  return ALLOWED_MEDIA_HOSTNAME_SUFFIXES.some((suffix) => {
    const cleanSuffix = suffix.toLowerCase().trim();
    return lower === cleanSuffix || lower.endsWith('.' + cleanSuffix);
  });
}

// Defense-in-depth blocklist for internal/private IPs and localhost
const BLOCKED_HOSTNAME_PATTERNS: RegExp[] = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./, // link-local / cloud metadata endpoints
  /^172\.(1[6-9]|2\d|3[0-1])\./, // 172.16.0.0/12
  /^::1$/,
  /^\[::1\]$/,
  /^0x[0-9a-f]+/i, // hex IP
  /^\d+$/, // decimal IP
  /^0\d+\./, // octal IP
  /^::ffff:/i, // IPv4-mapped IPv6
  /^\[::ffff:/i,
  /^fc[0-9a-f]{2}:/i, // fc00::/7 (ULA)
  /^fd[0-9a-f]{2}:/i,
  /^fe[89ab][0-9a-f]:/i, // fe80::/10 (Link-local)
];

export function isBlockedHostname(hostname: string): boolean {
  if (!hostname || typeof hostname !== 'string') return true;
  const clean = hostname.trim();
  return BLOCKED_HOSTNAME_PATTERNS.some((pattern) => pattern.test(clean));
}

export function validateMediaProxyUrl(req: Request, res: Response, next: NextFunction) {
  const rawUrl = req.query.url;

  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return next(new ValidationError('Missing required query param: url', { field: 'url' }));
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return next(new ValidationError('Invalid URL supplied to media proxy', { field: 'url' }));
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return next(new ValidationError('Only http(s) URLs may be proxied', { field: 'url' }));
  }

  if (isBlockedHostname(parsed.hostname)) {
    return next(new ValidationError('Internal or blocked host cannot be proxied', { field: 'url' }));
  }

  if (!isAllowedDomain(parsed.hostname)) {
    return next(new ValidationError('Domain not allowed by media proxy allowlist', { field: 'url' }));
  }

  (req as any).validatedMediaUrl = parsed.toString();
  next();
}
