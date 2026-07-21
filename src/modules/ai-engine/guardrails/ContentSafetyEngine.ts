export class ContentSafetyEngine {
  public check(prompt: string): number {
    // Mock safety check
    return 0;
  }
}

export const contentSafetyEngine = new ContentSafetyEngine();
