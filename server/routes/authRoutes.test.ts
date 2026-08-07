import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import authRouter from './authRoutes';
import { userRepository } from '../repositories/userRepository';
import { promoteUserToOwner } from '../services/promotionService';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('AuthRoutes & Promotion Tests', () => {
  const originalEnv = process.env.OWNER_EMAILS;

  beforeEach(() => {
    userRepository.clearForTest();
    process.env.OWNER_EMAILS = 'owner1@example.com,owner2@example.com';
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    userRepository.clearForTest();
    if (originalEnv !== undefined) {
      process.env.OWNER_EMAILS = originalEnv;
    } else {
      delete process.env.OWNER_EMAILS;
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a normal user with role "user"', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'password123',
          name: 'Regular User'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('user');
    });

    it('should register a user whose email matches OWNER_EMAILS but still set role to "user"', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'owner1@example.com',
          password: 'password123',
          name: 'Potential Owner'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('user'); // MUST BE user
    });
  });

  describe('promoteUserToOwner logic', () => {
    it('should fail if email is not in OWNER_EMAILS', () => {
      const res = promoteUserToOwner('user@example.com');
      expect(res.success).toBe(false);
      expect(res.message).toContain('không nằm trong danh sách OWNER_EMAILS');
    });

    it('should fail if user account has not registered yet', () => {
      const res = promoteUserToOwner('owner1@example.com');
      expect(res.success).toBe(false);
      expect(res.message).toContain('chưa tồn tại. Vui lòng yêu cầu người dùng tự đăng ký');
    });

    it('should successfully promote user to owner if account exists and email matches OWNER_EMAILS', () => {
      // First, create the user
      userRepository.createUser({
        email: 'owner1@example.com',
        passwordHash: 'dummyhash',
        name: 'Owner'
      });

      const res = promoteUserToOwner('owner1@example.com');
      expect(res.success).toBe(true);
      expect(res.message).toContain('thành owner thành công');
      expect(res.user.role).toBe('owner');

      const userAfter = userRepository.findByEmail('owner1@example.com');
      expect(userAfter?.role).toBe('owner');
    });
  });
});
