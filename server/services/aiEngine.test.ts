import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiEngine } from './aiEngine';
import { aiRouter } from '../utils/aiRouter';
import { cacheService } from './cacheService';
import { AIProvider } from '../providers/aiProviderInterface';

vi.mock('../utils/aiRouter', () => {
  return {
    aiRouter: {
      routeVideo: vi.fn(),
      routeAnimator: vi.fn()
    }
  };
});

describe('AIEngine', () => {
  const samplePayload = {
    title: 'Test Title',
    message: 'Test Message',
    scene: 'garden',
    bgStyle: 'dreamy',
    musicTrack: { label: 'Romantic piano', url: 'https://example.com/audio.mp3' },
    placedItems: [{ id: '1', x: 100, y: 150, type: 'rose' }]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cacheService.clear();
  });

  it('should use cached AI response if present', async () => {
    const mockCachedResult = {
      success: true,
      simulation: false,
      videoUrl: 'https://example.com/cached-video.mp4',
      message: 'From Cache'
    };

    // Preset the cache
    const payloadCacheKey = JSON.stringify({
      title: samplePayload.title,
      message: samplePayload.message,
      scene: samplePayload.scene,
      bgStyle: samplePayload.bgStyle,
      musicTrack: samplePayload.musicTrack.url,
      placedItems: [{ id: '1', x: 100, y: 150 }]
    });
    cacheService.setAIResponse(payloadCacheKey, mockCachedResult);

    const result = await aiEngine.generateVideo(samplePayload);

    expect(result).toEqual(mockCachedResult);
    expect(aiRouter.routeVideo).not.toHaveBeenCalled();
  });

  it('should fall back to simulation (Preview Mode) if no provider is configured', async () => {
    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: { name: 'Agnes' } as AIProvider,
      apiKey: '',
      isFallbackToPreview: true
    });

    const result = await aiEngine.generateVideo(samplePayload);

    expect(result.success).toBe(true);
    expect(result.simulation).toBe(true);
    expect(result.isSimulated).toBe(true);
    expect(result.apiKeyConfigured).toBe(false);
    expect(result.videoUrl).toContain('data:image/svg+xml');
  });

  it('should route and execute generateVideo for Agnes AI provider when key is configured', async () => {
    const mockProvider = {
      name: 'Agnes',
      generateVideo: vi.fn().mockResolvedValue({
        url: 'https://example.com/agnes-generated.mp4',
        raw: { some_data: true }
      })
    } as unknown as AIProvider;

    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: mockProvider,
      apiKey: 'agnes-key-123',
      isFallbackToPreview: false
    });

    const result = await aiEngine.generateVideo(samplePayload);

    expect(mockProvider.generateVideo).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.simulation).toBe(false);
    expect(result.videoUrl).toBe('https://example.com/agnes-generated.mp4');
    expect(result.data).toEqual({ some_data: true });
  });

  it('should route to HuggingFace for image, then use Runway for animation if Runway key exists', async () => {
    const mockHFProvider = {
      name: 'HuggingFace',
      generateImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,mockImageBytes')
    } as unknown as AIProvider;

    const mockRunwayProvider = {
      name: 'Runway',
      generateVideo: vi.fn().mockResolvedValue({
        url: 'https://example.com/runway-animated.mp4'
      })
    } as unknown as AIProvider;

    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: mockHFProvider,
      apiKey: 'hf-key-123',
      isFallbackToPreview: false
    });

    const result = await aiEngine.generateVideo(samplePayload);

    expect(mockHFProvider.generateImage).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.videoUrl).toBe('data:image/jpeg;base64,mockImageBytes');
  });

  it('should fall back to static HuggingFace visual if Runway animation fails', async () => {
    const mockHFProvider = {
      name: 'HuggingFace',
      generateImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,mockImageBytes')
    } as unknown as AIProvider;

    const mockRunwayProvider = {
      name: 'Runway',
      generateVideo: vi.fn().mockRejectedValue(new Error('Runway quota exceeded'))
    } as unknown as AIProvider;

    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: mockRunwayProvider,
      apiKey: 'runway-key-123',
      isFallbackToPreview: false
    });

    const result = await aiEngine.generateVideo(samplePayload);

    expect(mockRunwayProvider.generateVideo).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.simulation).toBe(true);
    expect(result.warning).toContain('Runway quota exceeded');
  });

  it('should handle provider execution failure and fall back to preview card with a warning', async () => {
    const mockProvider = {
      name: 'Fal',
      generateVideo: vi.fn().mockRejectedValue(new Error('Connection timed out'))
    } as unknown as AIProvider;

    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: mockProvider,
      apiKey: 'fal-key-123',
      isFallbackToPreview: false
    });

    const result = await aiEngine.generateVideo(samplePayload);

    expect(mockProvider.generateVideo).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.simulation).toBe(true);
    expect(result.isSimulated).toBe(true);
    expect(result.warning).toContain('Could not connect to Fal API: Connection timed out');
    expect(result.videoUrl).toContain('data:image/svg+xml');
  });
});
