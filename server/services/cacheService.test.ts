import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { config } from '../config/config';
import { CacheService } from './cacheService';

vi.mock('../config/config', () => {
  return {
    config: {
      cacheTtlSeconds: 10,
      cacheMaxEntries: 3
    }
  };
});

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new CacheService();
  });

  afterEach(() => {
    cache.destroy();
    vi.useRealTimers();
  });

  it('should set and get values successfully', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
    expect(cache.size()).toBe(1);
  });

  it('should return null for non-existent key', () => {
    expect(cache.get('non-existent')).toBeNull();
  });

  it('should automatically expire keys based on TTL', () => {
    cache.set('key1', 'value1', 5000); // 5 seconds
    expect(cache.get('key1')).toBe('value1');

    // Fast-forward time by 6 seconds
    vi.advanceTimersByTime(6000);

    expect(cache.get('key1')).toBeNull();
    expect(cache.size()).toBe(0);
  });

  it('should evict the least recently used key when exceeding maxEntries', () => {
    // maxEntries is mocked to 3
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');

    expect(cache.size()).toBe(3);

    // Access key1 to make it most recently used
    expect(cache.get('key1')).toBe('value1');

    // Add a 4th key, which should trigger eviction of the oldest (which is now key2, as key1 was recently get-accessed)
    cache.set('key4', 'value4');

    expect(cache.size()).toBe(3);
    expect(cache.get('key2')).toBeNull(); // evicted
    expect(cache.get('key1')).toBe('value1'); // still present
    expect(cache.get('key3')).toBe('value3'); // still present
    expect(cache.get('key4')).toBe('value4'); // still present
  });

  it('should update insertion order when setting an existing key', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');

    // Update key1's value to make it most recently used
    cache.set('key1', 'new-value1');

    // Add key4, which should evict key2 (the least recently used)
    cache.set('key4', 'value4');

    expect(cache.get('key2')).toBeNull(); // evicted
    expect(cache.get('key1')).toBe('new-value1'); // kept
  });

  it('should support size() and clear() correctly', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.size()).toBe(2);

    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it('should proactively clean up expired keys via background interval', () => {
    cache.set('temp', 'val', 1000); // 1 second

    // Fast-forward by 5 minutes (CLEANUP_INTERVAL_MS)
    vi.advanceTimersByTime(5 * 60 * 1000);

    // The key should have been cleaned up by the interval even without calling get()
    expect(cache.size()).toBe(0);
  });

  it('should stop background cleanup interval on destroy', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    cache.destroy();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
