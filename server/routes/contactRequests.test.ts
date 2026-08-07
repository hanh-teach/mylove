import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { requireAuth } from '../middlewares/requireAuth';
import { requireOwner } from '../middlewares/requireOwner';

const TEST_SECRET = 'contact-jwt-secret';
process.env.JWT_SECRET = TEST_SECRET;

const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => req.ip || '127.0.0.1',
  message: { success: false, error: 'Quá nhiều yêu cầu liên hệ từ IP này, vui lòng thử lại sau.' },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

let inMemoryRequests: any[] = [];

const app = express();
app.use(express.json());

app.get('/api/contact-requests', requireAuth, requireOwner, (req, res) => {
  return res.json({ success: true, requests: inMemoryRequests });
});

app.post('/api/contact-requests', contactRateLimiter, (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  inMemoryRequests.push({ email: cleanEmail, name: name || 'User', date: new Date().toISOString() });
  return res.json({ success: true, message: 'Request saved successfully' });
});

describe('Contact Requests Endpoints (/api/contact-requests)', () => {
  const ownerToken = jwt.sign(
    { userId: 'owner-1', email: 'phonghoc3.nvx@gmail.com', name: 'Owner', role: 'owner' },
    TEST_SECRET
  );

  const regularUserToken = jwt.sign(
    { userId: 'user-1', email: 'regular@example.com', name: 'Regular', role: 'user' },
    TEST_SECRET
  );

  beforeEach(() => {
    inMemoryRequests = [];
  });

  describe('GET /api/contact-requests', () => {
    it('returns 401 Unauthorized if unauthenticated', async () => {
      const res = await request(app).get('/api/contact-requests');
      expect(res.status).toBe(401);
    });

    it('returns 403 Forbidden if authenticated as regular user (non-owner)', async () => {
      const res = await request(app)
        .get('/api/contact-requests')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.status).toBe(403);
    });

    it('returns 200 OK if authenticated as system owner', async () => {
      const res = await request(app)
        .get('/api/contact-requests')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/contact-requests', () => {
    it('allows public submission without auth token', async () => {
      const res = await request(app)
        .post('/api/contact-requests')
        .send({ email: 'client@example.com', name: 'Client' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('enforces rate limiting when max requests exceeded', async () => {
      // 3 allowed requests
      await request(app).post('/api/contact-requests').send({ email: 'r1@example.com' });
      await request(app).post('/api/contact-requests').send({ email: 'r2@example.com' });
      await request(app).post('/api/contact-requests').send({ email: 'r3@example.com' });

      // 4th request should trigger 429
      const res = await request(app).post('/api/contact-requests').send({ email: 'r4@example.com' });
      expect(res.status).toBe(429);
      expect(res.body.error).toContain('Quá nhiều yêu cầu');
    });
  });
});
