export interface CachedEndpoint {
  url: string;
  type: 'video' | 'image' | 'chat';
  model: string;
}

class CacheRepository {
  private cachedModels: string[] | null = null;
  private lastCacheTime = 0;
  private readonly CACHE_TTL = 3600 * 1000; // 1 hour
  private cachedSuccessEndpoint: CachedEndpoint | null = null;

  public getCachedModels(): string[] | null {
    const now = Date.now();
    if (this.cachedModels && (now - this.lastCacheTime < this.CACHE_TTL)) {
      return this.cachedModels;
    }
    return null;
  }

  public setCachedModels(models: string[]): void {
    this.cachedModels = models;
    this.lastCacheTime = Date.now();
  }

  public getCachedSuccessEndpoint(): CachedEndpoint | null {
    return this.cachedSuccessEndpoint;
  }

  public setCachedSuccessEndpoint(endpoint: CachedEndpoint): void {
    this.cachedSuccessEndpoint = endpoint;
  }
}

export const cacheRepository = new CacheRepository();
