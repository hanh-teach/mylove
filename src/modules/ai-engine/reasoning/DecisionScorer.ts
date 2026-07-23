export interface DecisionOption {
  id: string;
  name: string;
  tasks: string[];
  estimatedCostUsd: number;
  estimatedLatencyMs: number;
  safetyScore: number; // 0 to 1
  qualityScore: number; // 0 to 1
}

export interface ScoredOption extends DecisionOption {
  score: number;
}

export class DecisionScorer {
  public static score(options: DecisionOption[], budget: number, maxLatency: number): ScoredOption[] {
    return options.map(option => {
      let score = 100;
      
      // Cost penalty
      if (option.estimatedCostUsd > budget) {
        score -= (option.estimatedCostUsd - budget) * 100; // Steep penalty for going over budget
      } else {
        score += (1 - (option.estimatedCostUsd / budget)) * 10; // Slight reward for being under budget
      }

      // Latency penalty
      if (option.estimatedLatencyMs > maxLatency) {
        score -= 20;
      }

      // Quality and Safety reward
      score += option.qualityScore * 20;
      score += option.safetyScore * 20;

      return {
        ...option,
        score: Math.max(0, parseFloat(score.toFixed(2)))
      };
    }).sort((a, b) => b.score - a.score);
  }
}
