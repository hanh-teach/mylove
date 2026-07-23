export class ConfidenceEngine {
  public static estimate(output: string, score: number): number {
    return score > 0.8 ? 0.95 : 0.7;
  }
}
