import rateLimit from 'express-rate-limit';
import { logger } from '../services/loggerService';

export const aiWriteRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return req.ip || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';
  },
  message: {
    success: false,
    error: 'Too many AI write requests from this IP, please try again after a minute.'
  },
  handler: (req, res, next, options) => {
    logger.security('Rate limit exceeded for /api/ai/write', { ip: req.ip });
    res.status(429).json(options.message);
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return req.ip || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';
  },
  message: {
    success: false,
    error: 'Quá nhiều yêu cầu đăng nhập/xác thực từ IP này. Vui lòng thử lại sau 15 phút.'
  },
  handler: (req, res, next, options) => {
    logger.security('Rate limit exceeded for Auth route', { ip: req.ip, url: req.originalUrl });
    res.status(429).json(options.message);
  }
});

export const mediaProxyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return req.ip || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';
  },
  message: {
    success: false,
    error: 'Quá nhiều yêu cầu media proxy từ IP này, vui lòng thử lại sau 1 phút.'
  },
  handler: (req, res, next, options) => {
    logger.security('Rate limit exceeded for /api/media-proxy', { ip: req.ip });
    res.status(429).json(options.message);
  }
});

export const videoGenRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return req.ip || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';
  },
  message: {
    success: false,
    error: 'Quá nhiều yêu cầu tạo video từ IP này, vui lòng chờ 1 phút.'
  },
  handler: (req, res, next, options) => {
    logger.security('Rate limit exceeded for Video Generation', { ip: req.ip });
    res.status(429).json(options.message);
  }
});

