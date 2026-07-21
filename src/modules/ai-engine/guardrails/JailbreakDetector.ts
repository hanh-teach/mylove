export class JailbreakDetector {
  public detect(prompt: string): number {
    // Simple detection logic
    const jailbreakPatterns = [/developer mode/i, /ignore policy/i];
    let score = 0;
    for (const pattern of jailbreakPatterns) {
      if (pattern.test(prompt)) score += 50;
    }
    return score;
  }
}

export const jailbreakDetector = new JailbreakDetector();
