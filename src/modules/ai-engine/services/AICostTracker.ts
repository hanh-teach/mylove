import { AIResponse, AIProvider } from '../types';

export interface AICostEntry {
  id: string;
  timestamp: number;
  provider: AIProvider;
  model: string;
  usage: AIResponse['usage'];
  latency: number;
  userId?: string;
  projectId?: string;
}

export class AICostTracker {
  private totalCost: number = 0;
  private history: AICostEntry[] = [];

  public log(response: AIResponse, userId?: string, projectId?: string) {
    this.totalCost += response.usage.costEstimate;
    this.history.push({
      id: response.id,
      timestamp: Date.now(),
      provider: response.provider,
      model: response.model,
      usage: response.usage,
      latency: response.latency,
      userId,
      projectId
    });
    console.log(`[AI Engine] Accumulated Cost: $${this.totalCost.toFixed(5)}`);
  }

  public getTotalCost(): number {
    return this.totalCost;
  }

  public getHistory(): AICostEntry[] {
    return this.history;
  }
}

export interface CacheEntry {
  response: AIResponse;
  expiresAt: number;
}

export class AICache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTtl = 3600 * 1000; // 1 hour

  public get(key: string): AIResponse | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.response;
  }

  public set(key: string, value: AIResponse, ttl = this.defaultTtl) {
    this.cache.set(key, { response: value, expiresAt: Date.now() + ttl });
  }

  public generateKey(prompt: string, options: any): string {
    const data = JSON.stringify({ prompt, options });
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  }
}

export const aiCostTracker = new AICostTracker();
export const aiCache = new AICache();
