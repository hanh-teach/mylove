export interface RetryConfig {
  maxRetries: number;
  currentRetry?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
}

export class RetryPolicy {
  public static async executeWithRetry<T>(
    fn: (attempt: number) => Promise<T>,
    config: RetryConfig = { maxRetries: 3, initialDelayMs: 1000, backoffMultiplier: 2 },
    onRetry?: (attempt: number, error: any, delayMs: number) => void
  ): Promise<T> {
    const maxRetries = config.maxRetries ?? 3;
    const initialDelay = config.initialDelayMs ?? 1000;
    const multiplier = config.backoffMultiplier ?? 2;

    let attempt = 0;
    while (true) {
      try {
        return await fn(attempt);
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          throw error;
        }
        const delayMs = initialDelay * Math.pow(multiplier, attempt - 1);
        if (onRetry) {
          onRetry(attempt, error, delayMs);
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
}
