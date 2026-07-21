export class PromptSanitizer {
  public sanitize(prompt: string): string {
    let sanitized = prompt.trim();
    // Normalize unicode
    sanitized = sanitized.normalize('NFKC');
    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>\\/]/g, '');
    return sanitized;
  }
}

export const promptSanitizer = new PromptSanitizer();
