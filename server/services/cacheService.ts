import { logger } from './loggerService';
import { config } from '../config/config';

export class CacheService {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  private readonly defaultTtl: number; // in milliseconds

  constructor() {
    this.defaultTtl = config.cacheTtlSeconds * 1000;
  }

  /**
   * Core get method
   */
  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      logger.info(`[Cache] Cache expired for key: ${key}`, { module: 'CacheService', key });
      return null;
    }
    return item.value as T;
  }

  /**
   * Core set method
   */
  public set<T>(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs !== undefined ? ttlMs : this.defaultTtl);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Core delete method
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Core clear method
   */
  public clear(): void {
    this.cache.clear();
  }

  // --- Domain-Specific Helpers as requested: AI Response, Background, Prompt, Template, Image Metadata, Video Metadata ---

  /**
   * 1. AI Response caching
   */
  public getAIResponse<T>(key: string): T | null {
    const cached = this.get<T>(`ai-response:${key}`);
    if (cached) {
      logger.info(`[Cache HIT] AI Response retrieved from cache for key: ${key}`, { module: 'CacheService', domain: 'ai-response', key });
    } else {
      logger.info(`[Cache MISS] AI Response cache miss for key: ${key}`, { module: 'CacheService', domain: 'ai-response', key });
    }
    return cached;
  }

  public setAIResponse<T>(key: string, value: T, ttlMs?: number): void {
    this.set(`ai-response:${key}`, value, ttlMs);
    logger.info(`[Cache SET] Cached AI Response for key: ${key}`, { module: 'CacheService', domain: 'ai-response', key });
  }

  /**
   * 2. Background caching
   */
  public getBackground<T>(key: string): T | null {
    const cached = this.get<T>(`background:${key}`);
    if (cached) {
      logger.info(`[Cache HIT] Background asset retrieved from cache for key: ${key}`, { module: 'CacheService', domain: 'background', key });
    }
    return cached;
  }

  public setBackground<T>(key: string, value: T, ttlMs?: number): void {
    this.set(`background:${key}`, value, ttlMs);
    logger.info(`[Cache SET] Cached Background for key: ${key}`, { module: 'CacheService', domain: 'background', key });
  }

  /**
   * 3. Prompt caching
   */
  public getPrompt(key: string): string | null {
    const cached = this.get<string>(`prompt:${key}`);
    if (cached) {
      logger.info(`[Cache HIT] Prompt string retrieved from cache for key: ${key}`, { module: 'CacheService', domain: 'prompt', key });
    }
    return cached;
  }

  public setPrompt(key: string, value: string, ttlMs?: number): void {
    this.set(`prompt:${key}`, value, ttlMs);
    logger.info(`[Cache SET] Cached Prompt for key: ${key}`, { module: 'CacheService', domain: 'prompt', key });
  }

  /**
   * 4. Template caching
   */
  public getTemplate<T>(key: string): T | null {
    const cached = this.get<T>(`template:${key}`);
    if (cached) {
      logger.info(`[Cache HIT] Template schema retrieved from cache for key: ${key}`, { module: 'CacheService', domain: 'template', key });
    }
    return cached;
  }

  public setTemplate<T>(key: string, value: T, ttlMs?: number): void {
    this.set(`template:${key}`, value, ttlMs);
    logger.info(`[Cache SET] Cached Template for key: ${key}`, { module: 'CacheService', domain: 'template', key });
  }

  /**
   * 5. Image Metadata caching
   */
  public getImageMetadata<T>(key: string): T | null {
    const cached = this.get<T>(`image-metadata:${key}`);
    if (cached) {
      logger.info(`[Cache HIT] Image Metadata retrieved from cache for key: ${key}`, { module: 'CacheService', domain: 'image-metadata', key });
    }
    return cached;
  }

  public setImageMetadata<T>(key: string, value: T, ttlMs?: number): void {
    this.set(`image-metadata:${key}`, value, ttlMs);
    logger.info(`[Cache SET] Cached Image Metadata for key: ${key}`, { module: 'CacheService', domain: 'image-metadata', key });
  }

  /**
   * 6. Video Metadata caching
   */
  public getVideoMetadata<T>(key: string): T | null {
    const cached = this.get<T>(`video-metadata:${key}`);
    if (cached) {
      logger.info(`[Cache HIT] Video Metadata retrieved from cache for key: ${key}`, { module: 'CacheService', domain: 'video-metadata', key });
    }
    return cached;
  }

  public setVideoMetadata<T>(key: string, value: T, ttlMs?: number): void {
    this.set(`video-metadata:${key}`, value, ttlMs);
    logger.info(`[Cache SET] Cached Video Metadata for key: ${key}`, { module: 'CacheService', domain: 'video-metadata', key });
  }
}

export const cacheService = new CacheService();
