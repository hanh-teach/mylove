export function getOwnerEmails(): string[] {
  const envEmails = process.env.OWNER_EMAILS;
  if (envEmails) {
    const parsed = envEmails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    if (parsed.length > 0) return parsed;
  }
  return ['nvdtinthcs@gmail.com', 'hanhbaithuc@gmail.com'];
}

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  const owners = getOwnerEmails();
  return owners.includes(email.trim().toLowerCase());
}

