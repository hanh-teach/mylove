export interface Constraints {
  maxBudgetUsd?: number;
  maxLatencyMs?: number;
  preferredProvider?: string;
  memoryLimit?: number;
  tokenQuota?: number;
}

export interface ResolvedConstraints {
  budget: number;
  provider: string;
  timeMs: number;
  memory: number;
  token: number;
}

export class ConstraintResolver {
  public static resolve(constraints?: Constraints): ResolvedConstraints {
    // Merge provided constraints with system defaults/policies
    return {
      budget: constraints?.maxBudgetUsd ?? 0.5, // Default $0.50 budget
      provider: constraints?.preferredProvider ?? 'gemini-flash', // Default to fast, cheap provider
      timeMs: constraints?.maxLatencyMs ?? 30000, // 30s default timeout
      memory: constraints?.memoryLimit ?? 10, // 10 memory items max
      token: constraints?.tokenQuota ?? 4000 // 4k context token limit
    };
  }
}
