import { describe, it, expect, vi, beforeEach } from 'vitest';
import { falProvider } from './falProvider';
import { AIProviderError } from '../utils/errors';
import { fal } from '@fal-ai/client';

vi.mock('@fal-ai/client', () => {
  return {
    fal: {
      config: vi.fn(),
      subscribe: vi.fn()
    }
  };
});

describe('falProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully return the video URL and raw response', async () => {
    const mockResponse = {
      video: {
        url: 'https://example.com/pika-video.mp4'
      }
    } as any;

    vi.mocked(fal.subscribe).mockResolvedValue(mockResponse);

    const result = await falProvider.generateVideo('magical garden', 'fal-key-123');

    expect(fal.config).toHaveBeenCalledWith({ credentials: 'fal-key-123' });
    expect(fal.subscribe).toHaveBeenCalledWith('fal-ai/pika/v2.2/text-to-video', {
      input: {
        prompt: 'magical garden',
        aspect_ratio: '16:9'
      }
    });

    expect(result).toEqual({
      url: 'https://example.com/pika-video.mp4',
      raw: mockResponse
    });
  });

  it('should throw an error if no video URL is found in the response', async () => {
    const mockResponse = {} as any;
    vi.mocked(fal.subscribe).mockResolvedValue(mockResponse);

    await expect(falProvider.generateVideo('magical garden', 'fal-key-123')).rejects.toThrow(AIProviderError);
  });

  it('should throw AIProviderError when Fal subscription fails', async () => {
    vi.mocked(fal.subscribe).mockRejectedValue(new Error('Billing limit reached'));

    await expect(falProvider.generateVideo('magical garden', 'fal-key-123')).rejects.toThrow(AIProviderError);
  });
});
