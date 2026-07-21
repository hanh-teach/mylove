export class PromptInjectionDetector {
  public detect(prompt: string): number {
    // Simple detection logic
    const injectionPatterns = [/ignore previous instructions/i, /system prompt/i];
    let score = 0;
    for (const pattern of injectionPatterns) {
      if (pattern.test(prompt)) score += 30;
    }
    return score;
  }
}

export const promptInjectionDetector = new PromptInjectionDetector();
