import { SUPPORT_CONTACT_EMAILS } from '../../config/contact';

export const DEFAULT_OWNER_EMAILS = ['nvdtinthcs@gmail.com', 'hanhbaithuc@gmail.com', ...SUPPORT_CONTACT_EMAILS];

/**
 * Checks if the given role or email corresponds to a system owner.
 * Supports passing (role, email), or passing either a role string or an email string as single argument.
 */
export const isOwnerUser = (roleOrEmail?: string | null, optionalEmail?: string | null): boolean => {
  if (!roleOrEmail && !optionalEmail) return false;

  const param1 = (roleOrEmail || '').trim().toLowerCase();
  const param2 = (optionalEmail || '').trim().toLowerCase();

  // 1. Check if param1 or param2 is explicit owner role
  if (
    param1 === 'owner' ||
    param1 === 'tài khoản chủ (toàn quyền)' ||
    param1.includes('chủ') ||
    param2 === 'owner' ||
    param2 === 'tài khoản chủ (toàn quyền)' ||
    param2.includes('chủ')
  ) {
    return true;
  }

  // 2. Check if either parameter matches an owner email
  const checkEmail = (val: string) => {
    if (!val || !val.includes('@')) return false;
    return DEFAULT_OWNER_EMAILS.some(owner => owner.toLowerCase().trim() === val);
  };

  if (checkEmail(param1) || checkEmail(param2)) {
    return true;
  }

  return false;
};

/**
 * Checks if a user has permission to export video animation.
 * Owners always have permission.
 * Standard users have permission if they have configured a Hugging Face API key.
 */
export const hasVideoExportPermission = (roleOrEmail?: string | null, huggingFaceKey?: string | null, optionalEmail?: string | null): boolean => {
  if (isOwnerUser(roleOrEmail, optionalEmail)) return true;
  if (huggingFaceKey && huggingFaceKey.trim().length > 0) return true;
  return false;
};

/**
 * Checks if a user has permission to edit Supabase Storage configuration in Settings.
 * Only Owners can modify Supabase URL and API Keys.
 */
export const hasSupabaseStoragePermission = (roleOrEmail?: string | null, optionalEmail?: string | null): boolean => {
  return isOwnerUser(roleOrEmail, optionalEmail);
};

