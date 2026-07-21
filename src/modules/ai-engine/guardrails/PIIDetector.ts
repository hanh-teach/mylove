export class PIIDetector {
  public detect(prompt: string): number {
    // Simple regex for email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    return emailRegex.test(prompt) ? 40 : 0;
  }
}

export const piiDetector = new PIIDetector();
