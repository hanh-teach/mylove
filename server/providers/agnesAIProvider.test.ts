import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { agnesAIProvider } from './agnesAIProvider';
import { cacheRepository } from '../repositories/cacheRepository';
import { AIProviderError } from '../utils/errors';

describe('agnesAIProvider', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.useFakeTimers();
    // Clear caches
    cacheRepository.setCachedModels(null);
    cacheRepository.setCachedSuccessEndpoint(null as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('discoverModels', () => {
    it('should fetch models successfully from endpoint and return them', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: 'agnes-video-2.0' }, { id: 'agnes-image-2.0' }]
        })
      });

      const models = await agnesAIProvider.discoverModels('https://api.test', 'https://api.test', 'key');
      expect(models).toEqual(['agnes-video-2.0', 'agnes-image-2.0']);
      expect(fetchMock).toHaveBeenCalled();
    });

    it('should use cached models if they exist', async () => {
      cacheRepository.setCachedModels(['cached-model-1']);
      
      const models = await agnesAIProvider.discoverModels('https://api.test', 'https://api.test', 'key');
      expect(models).toEqual(['cached-model-1']);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should return empty list if all endpoints fail', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'));

      const models = await agnesAIProvider.discoverModels('https://api.test', 'https://api.test', 'key');
      expect(models).toEqual([]);
    });
  });

  describe('generateVideo', () => {
    beforeEach(() => {
      // Warm the models cache so that discoverModels is instantly bypassed
      // and doesn't make any unexpected fetch calls.
      cacheRepository.setCachedModels(['agnes-video-2.0']);
    });

    it('should return synchronous video url if returned directly in POST response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          video_url: 'https://example.com/direct-video.mp4'
        })
      });

      const result = await agnesAIProvider.generateVideo('sunset garden', 'mock-key', {
        apiBase: 'https://api.test',
        cleanBase: 'https://api.test'
      });

      expect(result).toBeDefined();
      expect(result.url).toBe('https://example.com/direct-video.mp4');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should initiate polling if POST response returns taskId, and succeed when poll returns video url', async () => {
      // 1. generateVideo POST request (returns taskId)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          taskId: 'task-abc-123'
        })
      });

      // 2. First polling GET request (returns pending status)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'pending'
        })
      });

      // 3. Second polling GET request (returns completed and videoUrl)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'completed',
          video_url: 'https://example.com/polled-video.mp4'
        })
      });

      const promise = agnesAIProvider.generateVideo('sunset garden', 'mock-key', {
        apiBase: 'https://api.test',
        cleanBase: 'https://api.test'
      });

      // Process microtasks and advance timers to step through the polling wait loop
      await vi.advanceTimersByTimeAsync(3000); // Wait for first poll
      await vi.advanceTimersByTimeAsync(3000); // Wait for second poll

      const result = await promise;
      expect(result.url).toBe('https://example.com/polled-video.mp4');
    });

    it('should throw AIProviderError if polling is exhausted and no url is found', async () => {
      let postCount = 0;
      fetchMock.mockImplementation(async (url, init) => {
        if (init?.method === 'POST') {
          postCount++;
          if (postCount > 1) {
            // Reject subsequent configurations to avoid infinite fallback loops
            return { ok: false, status: 500, text: async () => 'Internal Server Error' };
          }
          return {
            ok: true,
            json: async () => ({ taskId: 'task-timeout' })
          };
        }
        return {
          ok: true,
          json: async () => ({ status: 'processing' })
        };
      });

      const promise = agnesAIProvider.generateVideo('sunset garden', 'mock-key', {
        apiBase: 'https://api.test',
        cleanBase: 'https://api.test'
      });

      // Attach catch handler immediately to prevent unhandled rejection during fake timers ticks
      const caughtPromise = promise.catch(err => err);

      // Advance timers up to 15 times to exhaust the loop
      for (let i = 0; i < 15; i++) {
        await vi.advanceTimersByTimeAsync(3000);
      }

      const err = await caughtPromise;
      expect(err).toBeInstanceOf(AIProviderError);
    });

    it('should stop polling immediately and throw if poll response status is failed', async () => {
      let postCount = 0;
      fetchMock.mockImplementation(async (url, init) => {
        if (init?.method === 'POST') {
          postCount++;
          if (postCount > 1) {
            return { ok: false, status: 500, text: async () => 'Internal Server Error' };
          }
          return {
            ok: true,
            json: async () => ({ taskId: 'task-fail' })
          };
        }
        return {
          ok: true,
          json: async () => ({
            status: 'failed',
            error: 'Generation failed due to NSFW filter'
          })
        };
      });

      const promise = agnesAIProvider.generateVideo('sunset garden', 'mock-key', {
        apiBase: 'https://api.test',
        cleanBase: 'https://api.test'
      });

      // Attach catch handler immediately to prevent unhandled rejection during fake timers ticks
      const caughtPromise = promise.catch(err => err);

      // Advance timers 15 times to satisfy any outer loop iterations
      for (let i = 0; i < 15; i++) {
        await vi.advanceTimersByTimeAsync(3000);
      }

      const err = await caughtPromise;
      expect(err).toBeInstanceOf(AIProviderError);
    });

    it('should throw AIProviderError on 429 rate limit instantly', async () => {
      // generateVideo POST returns 429
      fetchMock.mockResolvedValueOnce({
        status: 429,
        ok: false,
        text: async () => 'Rate limit exceeded'
      });

      await expect(
        agnesAIProvider.generateVideo('sunset garden', 'mock-key', {
          apiBase: 'https://api.test',
          cleanBase: 'https://api.test'
        })
      ).rejects.toThrow(AIProviderError);
    });
  });
});
