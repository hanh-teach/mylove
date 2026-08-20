import { describe, it, expect } from 'vitest';
import { validateSupabaseKeyRole, decodeJwtPayload } from './supabaseKeyValidator';

describe('Supabase Key Validator', () => {
  // Helpers to generate dummy JWTs
  const makeTokenWithRole = (role: string) => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({ role, exp: Date.now() + 100000 })).toString('base64');
    const signature = 'signature';
    return `${header}.${payload}.${signature}`;
  };

  const makeInvalidJwt = () => {
    return 'not.a.validjwt';
  };

  describe('decodeJwtPayload', () => {
    it('should correctly decode a valid JWT payload', () => {
      const token = makeTokenWithRole('anon');
      const decoded = decodeJwtPayload(token);
      expect(decoded).toBeDefined();
      expect(decoded.role).toBe('anon');
    });

    it('should return null for non-JWT strings', () => {
      expect(decodeJwtPayload('invalid_token')).toBeNull();
      expect(decodeJwtPayload('one.two')).toBeNull();
    });
  });

  describe('validateSupabaseKeyRole', () => {
    it('should allow valid anon keys', () => {
      const anonToken = makeTokenWithRole('anon');
      const result = validateSupabaseKeyRole(anonToken);
      expect(result.isValid).toBe(true);
      expect(result.role).toBe('anon');
    });

    it('should reject service_role keys', () => {
      const serviceToken = makeTokenWithRole('service_role');
      const result = validateSupabaseKeyRole(serviceToken);
      expect(result.isValid).toBe(false);
      expect(result.role).toBe('service_role');
      expect(result.error).toContain('Service Role Key');
    });

    it('should reject keys explicitly containing the service_role text', () => {
      const result = validateSupabaseKeyRole('some-service_role-secret-key');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Service Role Key');
    });

    it('should allow keys without any role specified in the payload', () => {
      const tokenWithoutRole = makeTokenWithRole(''); // payload with empty or missing role
      const result = validateSupabaseKeyRole(tokenWithoutRole);
      expect(result.isValid).toBe(true);
    });

    it('should return isValid true for invalid/non-JWT strings to ensure flexible fallback', () => {
      const result = validateSupabaseKeyRole(makeInvalidJwt());
      expect(result.isValid).toBe(true);
    });

    it('should return isValid true for empty or undefined keys', () => {
      const result1 = validateSupabaseKeyRole('');
      expect(result1.isValid).toBe(true);
    });
  });
});
