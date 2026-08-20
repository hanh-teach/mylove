import { describe, it, expect, vi } from 'vitest';
import {
  validateMediaProxyUrl,
  isAllowedDomain,
  isBlockedHostname,
  ALLOWED_MEDIA_HOSTNAME_SUFFIXES
} from './mediaProxyValidator';
import { ValidationError } from '../utils/errors';
import { Request, Response } from 'express';

describe('mediaProxyValidator', () => {
  describe('ALLOWED_MEDIA_HOSTNAME_SUFFIXES', () => {
    it('contains all required media provider suffixes', () => {
      expect(ALLOWED_MEDIA_HOSTNAME_SUFFIXES).toContain('runwayml.com');
      expect(ALLOWED_MEDIA_HOSTNAME_SUFFIXES).toContain('fal.media');
      expect(ALLOWED_MEDIA_HOSTNAME_SUFFIXES).toContain('huggingface.co');
      expect(ALLOWED_MEDIA_HOSTNAME_SUFFIXES).toContain('agnes-ai.com');
      expect(ALLOWED_MEDIA_HOSTNAME_SUFFIXES).toContain('supabase.co');
    });
  });

  describe('isAllowedDomain', () => {
    it('should allow valid domains and subdomains', () => {
      expect(isAllowedDomain('fal.media')).toBe(true);
      expect(isAllowedDomain('cdn.fal.media')).toBe(true);
      expect(isAllowedDomain('runwayml.com')).toBe(true);
      expect(isAllowedDomain('asset.runwayml.com')).toBe(true);
      expect(isAllowedDomain('huggingface.co')).toBe(true);
      expect(isAllowedDomain('cdn-lfs.huggingface.co')).toBe(true);
      expect(isAllowedDomain('agnes-ai.com')).toBe(true);
      expect(isAllowedDomain('apihub.agnes-ai.com')).toBe(true);
      expect(isAllowedDomain('sub.supabase.co')).toBe(true);
    });

    it('should reject domains outside allowlist or similar-looking domain prefixes/suffixes', () => {
      expect(isAllowedDomain('evilfal.media')).toBe(false);
      expect(isAllowedDomain('notrunwayml.com')).toBe(false);
      expect(isAllowedDomain('example.com')).toBe(false);
      expect(isAllowedDomain('malicious-huggingface.co')).toBe(false);
      expect(isAllowedDomain('runwayml.com.attacker.com')).toBe(false);
      expect(isAllowedDomain('fake-supabase.co.evil.org')).toBe(false);
    });
  });

  describe('isBlockedHostname', () => {
    it('should block local, private, and internal IP formats', () => {
      expect(isBlockedHostname('localhost')).toBe(true);
      expect(isBlockedHostname('127.0.0.1')).toBe(true);
      expect(isBlockedHostname('10.0.0.1')).toBe(true);
      expect(isBlockedHostname('192.168.1.1')).toBe(true);
      expect(isBlockedHostname('169.254.169.254')).toBe(true);
      expect(isBlockedHostname('172.16.0.1')).toBe(true);
      expect(isBlockedHostname('::1')).toBe(true);
      expect(isBlockedHostname('[::1]')).toBe(true);
      expect(isBlockedHostname('0x7f000001')).toBe(true);
      expect(isBlockedHostname('2130706433')).toBe(true);
      expect(isBlockedHostname('0177.0.0.1')).toBe(true);
      expect(isBlockedHostname('::ffff:127.0.0.1')).toBe(true);
      expect(isBlockedHostname('fc00::1')).toBe(true);
      expect(isBlockedHostname('fe80::1')).toBe(true);
    });

    it('should allow public domains in allowlist', () => {
      expect(isBlockedHostname('fal.media')).toBe(false);
      expect(isBlockedHostname('cdn.runwayml.com')).toBe(false);
      expect(isBlockedHostname('apihub.agnes-ai.com')).toBe(false);
    });
  });

  describe('validateMediaProxyUrl middleware', () => {
    it('should call next() for allowed external media URLs', () => {
      const req = {
        query: { url: 'https://cdn.fal.media/videos/output.mp4' }
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn();

      validateMediaProxyUrl(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect((req as any).validatedMediaUrl).toBe('https://cdn.fal.media/videos/output.mp4');
    });

    it('should reject domains not in allowlist', () => {
      const req = {
        query: { url: 'https://malicious.com/payload.mp4' }
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn();

      validateMediaProxyUrl(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(ValidationError);
      expect(err.message).toContain('Domain not allowed');
    });

    it('should reject internal IP addresses even if disguised', () => {
      const req = {
        query: { url: 'http://169.254.169.254/latest/meta-data/' }
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn();

      validateMediaProxyUrl(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(ValidationError);
      expect(err.message).toContain('Internal or blocked host');
    });
  });
});
