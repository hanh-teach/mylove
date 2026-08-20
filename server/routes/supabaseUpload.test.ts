import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middlewares/requireAuth';
import { validateSupabaseKeyRole } from '../../src/shared/utils/supabaseKeyValidator';

const TEST_SECRET = 'test-secret-key-123';
process.env.JWT_SECRET = TEST_SECRET;

// Create test app isolating upload endpoint logic
const app = express();
app.use(express.json({ limit: '50mb' }));

const uploadRateLimiter = (req: any, res: any, next: any) => next();

app.post('/api/supabase/upload', requireAuth, uploadRateLimiter, async (req, res) => {
  try {
    const { fileBase64, fileName, mimeType, supabaseUrl: clientUrl, supabaseKey: clientKey, supabaseBucket } = req.body;

    if (clientKey) {
      const validation = validateSupabaseKeyRole(clientKey);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, error: validation.error || 'Không chấp nhận service_role key do client gửi lên.' });
      }
    }

    let url = process.env.SUPABASE_URL;
    let key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (clientUrl && clientKey) {
      try {
        new URL(clientUrl);
        url = clientUrl;
        key = clientKey;
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid custom Supabase URL provided.' });
      }
    }

    if (!url || !key) {
      return res.status(500).json({ success: false, error: 'Supabase URL and Key are not configured on server.' });
    }

    if (!fileBase64 || !fileName) {
      return res.status(400).json({ success: false, error: 'Missing file data or file name.' });
    }

    const allowedMimePrefixes = ['image/', 'video/', 'audio/'];
    const allowedExactMimes = ['application/pdf'];
    const isValidMime = mimeType && (allowedMimePrefixes.some(p => mimeType.startsWith(p)) || allowedExactMimes.includes(mimeType));
    if (!isValidMime) {
      return res.status(400).json({ success: false, error: 'Định dạng file không được phép.' });
    }

    let base64Data = fileBase64;
    if (fileBase64.includes(';base64,')) {
      base64Data = fileBase64.split(';base64,')[1];
    }
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 20 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'Kích thước file vượt quá giới hạn 20MB.' });
    }

    return res.json({ success: true, publicUrl: 'https://example.com/uploaded-file.png' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

describe('POST /api/supabase/upload', () => {
  const validUserToken = jwt.sign(
    { userId: 'user-1', email: 'user@example.com', name: 'User', role: 'user' },
    TEST_SECRET
  );

  beforeEach(() => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-service-key';
  });

  it('returns 401 Unauthorized if no auth token is provided', async () => {
    const response = await request(app)
      .post('/api/supabase/upload')
      .send({ fileName: 'test.png', fileBase64: 'aaaa', mimeType: 'image/png' });

    expect(response.status).toBe(401);
  });

  it('returns 400 Bad Request if client sends a service_role key', async () => {
    const serviceRoleJwt = `header.${Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64')}.signature`;

    const response = await request(app)
      .post('/api/supabase/upload')
      .set('Authorization', `Bearer ${validUserToken}`)
      .send({
        fileName: 'test.png',
        fileBase64: 'aaaa',
        mimeType: 'image/png',
        supabaseKey: serviceRoleJwt
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('service_role');
  });

  it('returns 400 Bad Request if file size exceeds 20MB', async () => {
    const largeBuffer = Buffer.alloc(21 * 1024 * 1024);
    const largeBase64 = largeBuffer.toString('base64');

    const response = await request(app)
      .post('/api/supabase/upload')
      .set('Authorization', `Bearer ${validUserToken}`)
      .send({
        fileName: 'large.png',
        fileBase64: largeBase64,
        mimeType: 'image/png'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('20MB');
  });

  it('returns 400 Bad Request if file mimeType is forbidden', async () => {
    const response = await request(app)
      .post('/api/supabase/upload')
      .set('Authorization', `Bearer ${validUserToken}`)
      .send({
        fileName: 'hack.exe',
        fileBase64: 'aaaa',
        mimeType: 'application/x-msdownload'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Định dạng file không được phép');
  });

  it('returns 200 OK for valid image upload when authenticated', async () => {
    const response = await request(app)
      .post('/api/supabase/upload')
      .set('Authorization', `Bearer ${validUserToken}`)
      .send({
        fileName: 'photo.jpg',
        fileBase64: 'aW1hZ2UgZGF0YQ==',
        mimeType: 'image/jpeg'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
