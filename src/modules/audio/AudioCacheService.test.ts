import { describe, it, expect, beforeEach, vi } from 'vitest';
import { audioCacheService } from './AudioCacheService';

describe('AudioCacheService', () => {
  it('should initialize and return original url when not a network URL', async () => {
    const dataUrl = 'data:audio/mp3;base64,AAAA';
    const result = await audioCacheService.getOrFetchAudioUrl(dataUrl);
    expect(result).toBe(dataUrl);
  });

  it('should handle isCached checks gracefully without crashing', async () => {
    const isCached = await audioCacheService.isCached('https://example.com/audio.mp3');
    expect(typeof isCached).toBe('boolean');
  });

  it('should retrieve cache stats structure properly', async () => {
    const stats = await audioCacheService.getCacheStats();
    expect(stats).toHaveProperty('count');
    expect(stats).toHaveProperty('totalBytes');
    expect(typeof stats.count).toBe('number');
    expect(typeof stats.totalBytes).toBe('number');
  });
});
