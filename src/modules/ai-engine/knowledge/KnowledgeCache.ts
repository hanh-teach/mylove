import { RetrievalResult } from './KnowledgeTypes';

interface CacheEntry {
  results: RetrievalResult[];
  expiresAt: number;
}

export class KnowledgeCache {
  private static cache = new Map<string, CacheEntry>();
  private static defaultTTLMs = 5 * 60 * 1000; // 5 Minutes

  /**
   * Generates a cache lookup key from query parameters.
   */
  private static buildKey(text: string, userId?: string, types?: string[]): string {
    const typesStr = types ? types.sort().join(',') : 'all';
    return `${userId || 'anon'}:${typesStr}:${text.trim().toLowerCase()}`;
  }

  public static get(text: string, userId?: string, types?: string[]): RetrievalResult[] | null {
    const key = this.buildKey(text, userId, types);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.results;
  }

  public static set(text: string, results: RetrievalResult[], userId?: string, types?: string[], ttlMs?: number): void {
    const key = this.buildKey(text, userId, types);
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTTLMs);
    
    this.cache.set(key, { results, expiresAt });
  }

  public static invalidateAll(): void {
    this.cache.clear();
  }
}
