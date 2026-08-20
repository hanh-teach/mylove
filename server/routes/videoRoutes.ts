import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { videoController } from '../controllers/videoController';
import { validateGenerateVideo } from '../validators/videoValidator';
import { validateMediaProxyUrl } from '../validators/mediaProxyValidator';
import { proxyMedia } from '../controllers/mediaProxyController';
import { logger } from '../services/loggerService';
import { mediaProxyRateLimiter } from '../middlewares/rateLimiters';

const router = Router();

const videoRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  },
  message: {
    success: false,
    error: 'Too many video generation requests from this IP, please try again after a minute.'
  },
  handler: (req, res, next, options) => {
    logger.security('Rate limit exceeded for /generate-video', { ip: req.ip });
    res.status(429).json(options.message);
  }
});

router.post(
  '/generate-video',
  (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const timestamp = new Date().toISOString();
    logger.security('Video generation request initiated', { ip, timestamp, path: req.path });
    next();
  },
  videoRateLimiter,
  validateGenerateVideo,
  (req, res, next) => {
    videoController.generateVideo(req, res, next).catch(next);
  }
);

router.get(
  '/tasks/:taskId',
  (req, res, next) => {
    videoController.getTaskStatus(req, res, next);
  }
);

// Streams a remote AI-generated video/image through our own origin so the browser never treats
// it as cross-origin — fixes the "black export" bug where html2canvas can't read back a
// cross-origin <video>/<img> frame without the provider's own CORS cooperation. See
// mediaProxyController.ts for the full explanation.
router.get(
  '/media-proxy',
  mediaProxyRateLimiter,
  validateMediaProxyUrl,
  (req, res, next) => {
    proxyMedia(req, res, next).catch(next);
  }
);

export default router;

