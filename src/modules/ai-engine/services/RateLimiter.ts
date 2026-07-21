export class RateLimiter {
  private tokens: Map<string, number> = new Map();
  private lastRefill: Map<string, number> = new Map();
  private maxTokens = 10; // Simple token bucket
  private refillRate = 1000; // 1 token per second

  public canExecute(providerId: string): boolean {
    const now = Date.now();
    const last = this.lastRefill.get(providerId) || now;
    const tokens = this.tokens.get(providerId) || this.maxTokens;
    
    // Refill tokens
    const passed = now - last;
    const newTokens = Math.min(this.maxTokens, tokens + Math.floor(passed / this.refillRate));
    
    if (newTokens > 0) {
      this.tokens.set(providerId, newTokens - 1);
      this.lastRefill.set(providerId, now);
      return true;
    }
    return false;
  }
}

export const rateLimiter = new RateLimiter();
