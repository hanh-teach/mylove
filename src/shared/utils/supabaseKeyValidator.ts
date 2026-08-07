/**
 * Safe base64url decoding that works in both Node.js and Browser environments
 */
export function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payloadPart = parts[1];
    // Convert base64url to standard base64
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');

    if (typeof Buffer !== 'undefined') {
      return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
    } else {
      return JSON.parse(atob(padded));
    }
  } catch (e) {
    return null;
  }
}

/**
 * Validates if the given Supabase key is an Anon/Public key.
 * If the key is a JWT and contains a "role" field, it must be "anon".
 * If the role is "service_role" or anything else than "anon", it returns false.
 * If it's not a valid JWT, it returns true (does not block) for flexible configurations.
 */
export function validateSupabaseKeyRole(key: string): { isValid: boolean; role?: string; error?: string } {
  if (!key) {
    return { isValid: true };
  }

  // Quick text check to detect service_role strings
  if (key.toLowerCase().includes('service_role')) {
    return {
      isValid: false,
      role: 'service_role',
      error: 'Đây có vẻ là Service Role Key (service_role), vui lòng dùng Anon Key thay thế.'
    };
  }

  const payload = decodeJwtPayload(key);
  if (!payload) {
    // If not a valid JWT format, do not block (flexible/permissive fallback)
    return { isValid: true };
  }

  const role = payload.role;
  if (role && role !== 'anon') {
    return {
      isValid: false,
      role,
      error: 'Đây có vẻ là Service Role Key (service_role), vui lòng dùng Anon Key thay thế.'
    };
  }

  return { isValid: true, role };
}
