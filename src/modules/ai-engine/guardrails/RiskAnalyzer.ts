export class RiskAnalyzer {
  public analyze(scores: number[]): number {
    return scores.reduce((a, b) => a + b, 0);
  }
}

export const riskAnalyzer = new RiskAnalyzer();
