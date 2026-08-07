import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getOwnerEmails, isOwnerEmail } from './ownerEmails';

describe('ownerEmails', () => {
  const originalEnv = process.env.OWNER_EMAILS;

  beforeEach(() => {
    // Reset OWNER_EMAILS before each test
    delete process.env.OWNER_EMAILS;
  });

  afterEach(() => {
    // Restore OWNER_EMAILS
    if (originalEnv !== undefined) {
      process.env.OWNER_EMAILS = originalEnv;
    } else {
      delete process.env.OWNER_EMAILS;
    }
  });

  it('should return default fallback array if OWNER_EMAILS is not set', () => {
    const emails = getOwnerEmails();
    expect(emails).toEqual(['nvdtinthcs@gmail.com', 'hanhbaithuc@gmail.com']);
  });

  it('should return default fallback array if OWNER_EMAILS is empty', () => {
    process.env.OWNER_EMAILS = ' ';
    const emails = getOwnerEmails();
    expect(emails).toEqual(['nvdtinthcs@gmail.com', 'hanhbaithuc@gmail.com']);
  });

  it('should parse and clean emails when OWNER_EMAILS is correctly configured', () => {
    process.env.OWNER_EMAILS = 'User1@Example.com, user2@example.com , , USER3@example.com';
    const emails = getOwnerEmails();
    expect(emails).toEqual([
      'user1@example.com',
      'user2@example.com',
      'user3@example.com'
    ]);
  });

  it('should identify default owner emails when OWNER_EMAILS is not configured', () => {
    expect(isOwnerEmail('nvdtinthcs@gmail.com')).toBe(true);
    expect(isOwnerEmail('hanhbaithuc@gmail.com')).toBe(true);
    expect(isOwnerEmail('any@example.com')).toBe(false);
    expect(isOwnerEmail(null)).toBe(false);
    expect(isOwnerEmail(undefined)).toBe(false);
  });

  it('should correctly identify owner emails when configured', () => {
    process.env.OWNER_EMAILS = 'admin@mycard.com,owner@mycard.com';
    expect(isOwnerEmail('admin@mycard.com')).toBe(true);
    expect(isOwnerEmail('OWNER@mycard.com')).toBe(true);
    expect(isOwnerEmail('other@mycard.com')).toBe(false);
  });
});

