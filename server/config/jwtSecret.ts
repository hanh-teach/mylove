import crypto from 'crypto';

let fallbackSecret: string | null = null;

export const getJwtSecret = (): string => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length > 0) {
    return process.env.JWT_SECRET.trim();
  }
  // If process.env.JWT_SECRET is not provided, generate a secure random secret in-memory
  // so that no hardcoded secret exists in the source code.
  if (!fallbackSecret) {
    fallbackSecret = crypto.randomBytes(32).toString('hex');
  }
  return fallbackSecret;
};
