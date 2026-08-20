import { describe, it, expect, vi } from 'vitest';
import { isOriginAllowed, createCorsOptionsDelegate } from './corsPolicy';
import { Request } from 'express';

describe('CORS Policy Middleware', () => {
  describe('isOriginAllowed', () => {
    it('allows requests with missing origin (same-origin browser navigation or server-to-server)', () => {
      expect(isOriginAllowed(undefined, 'my-card-app.com')).toBe(true);
    });

    it('allows same-host origin requests', () => {
      const origin = 'https://my-card-app.com';
      const reqHost = 'my-card-app.com';
      expect(isOriginAllowed(origin, reqHost)).toBe(true);
    });

    it('allows localhost origin in development mode (NODE_ENV !== production)', () => {
      const devEnv = { NODE_ENV: 'development' };
      expect(isOriginAllowed('http://localhost:3000', 'other-host.com', devEnv)).toBe(true);
      expect(isOriginAllowed('http://localhost:5173', 'other-host.com', devEnv)).toBe(true);
    });

    it('DENIES localhost origin in production mode (NODE_ENV === production)', () => {
      const prodEnv = { NODE_ENV: 'production' };
      expect(isOriginAllowed('http://localhost:3000', 'other-host.com', prodEnv)).toBe(false);
      expect(isOriginAllowed('http://localhost:5173', 'other-host.com', prodEnv)).toBe(false);
    });

    it('allows explicit domains configured in ALLOWED_ORIGIN environment variable', () => {
      const env = {
        NODE_ENV: 'production',
        ALLOWED_ORIGIN: 'https://official-app.onrender.com,https://app.mycard.vn'
      };
      expect(isOriginAllowed('https://official-app.onrender.com', 'api.mycard.vn', env)).toBe(true);
      expect(isOriginAllowed('https://app.mycard.vn', 'api.mycard.vn', env)).toBe(true);
    });

    it('DENIES random public hosting domains like *.vercel.app not listed in ALLOWED_ORIGIN (regression test)', () => {
      const env = {
        NODE_ENV: 'production',
        ALLOWED_ORIGIN: 'https://official-app.onrender.com'
      };

      expect(isOriginAllowed('https://evil-site.vercel.app', 'api.mycard.vn', env)).toBe(false);
      expect(isOriginAllowed('https://attacker.onrender.com', 'api.mycard.vn', env)).toBe(false);
      expect(isOriginAllowed('https://untrusted.run.app', 'api.mycard.vn', env)).toBe(false);
      expect(isOriginAllowed('https://malicious.netlify.app', 'api.mycard.vn', env)).toBe(false);
    });

    it('DENIES wildcard "*" in ALLOWED_ORIGIN and does not grant global access', () => {
      const env = {
        NODE_ENV: 'production',
        ALLOWED_ORIGIN: '*'
      };

      expect(isOriginAllowed('https://evil-site.vercel.app', 'api.mycard.vn', env)).toBe(false);
    });
  });

  describe('createCorsOptionsDelegate', () => {
    it('passes options with credentials: true and computed origin to callback', () => {
      const delegate = createCorsOptionsDelegate({ NODE_ENV: 'development' });
      const req = {
        headers: {
          origin: 'http://localhost:3000',
          host: 'localhost:3000'
        }
      } as unknown as Request;

      const callback = vi.fn();
      delegate(req, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        origin: true,
        credentials: true
      });
    });

    it('sets origin: false for untrusted origins in callback', () => {
      const delegate = createCorsOptionsDelegate({
        NODE_ENV: 'production',
        ALLOWED_ORIGIN: 'https://trusted.com'
      });
      const req = {
        headers: {
          origin: 'https://evil.vercel.app',
          host: 'trusted.com'
        }
      } as unknown as Request;

      const callback = vi.fn();
      delegate(req, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        origin: false,
        credentials: true
      });
    });
  });
});
