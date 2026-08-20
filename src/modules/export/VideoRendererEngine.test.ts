import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoRendererEngine, getVideoDimensions } from './VideoRendererEngine';

describe('VideoRendererEngine Tests', () => {
  it('should calculate proper video dimensions for various aspect ratios and resolutions', () => {
    // 1080p
    expect(getVideoDimensions('16:9', '1080p')).toEqual({ width: 1920, height: 1080 });
    expect(getVideoDimensions('9:16', '1080p')).toEqual({ width: 1080, height: 1920 });
    expect(getVideoDimensions('1:1', '1080p')).toEqual({ width: 1080, height: 1080 });
    expect(getVideoDimensions('4:5', '1080p')).toEqual({ width: 1080, height: 1350 });

    // 720p
    expect(getVideoDimensions('16:9', '720p')).toEqual({ width: 1280, height: 720 });
    expect(getVideoDimensions('9:16', '720p')).toEqual({ width: 720, height: 1280 });
    expect(getVideoDimensions('1:1', '720p')).toEqual({ width: 720, height: 720 });
    expect(getVideoDimensions('4:5', '720p')).toEqual({ width: 720, height: 900 });

    // 480p
    expect(getVideoDimensions('16:9', '480p')).toEqual({ width: 854, height: 480 });
    expect(getVideoDimensions('9:16', '480p')).toEqual({ width: 480, height: 854 });
    expect(getVideoDimensions('1:1', '480p')).toEqual({ width: 480, height: 480 });
    expect(getVideoDimensions('4:5', '480p')).toEqual({ width: 480, height: 600 });
  });

  it('should get singleton instance of VideoRendererEngine', () => {
    const engine1 = VideoRendererEngine.getInstance();
    const engine2 = VideoRendererEngine.getInstance();
    expect(engine1).toBeDefined();
    expect(engine1).toBe(engine2);
  });

  it('should handle rendering progress tracking accurately', async () => {
    const engine = VideoRendererEngine.getInstance();

    // Mock HTMLCanvasElement and 2d context for Node/Vitest test environment
    const mockContext = {
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      arc: vi.fn(),
      arcTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      clip: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn()
    };

    const mockCanvas = {
      width: 1280,
      height: 720,
      getContext: vi.fn(() => mockContext),
      captureStream: vi.fn(() => ({
        getVideoTracks: () => [{ kind: 'video' }]
      }))
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return document.createElement(tagName);
    });

    let lastProgress = 0;
    let framesRendered = 0;

    const progressSpy = vi.fn((progress: number, current: number, total: number) => {
      lastProgress = progress;
      framesRendered = current;
    });

    const resultBlob = await engine.renderVideo({
      title: 'Thiệp Kỷ Niệm Test',
      message: 'Lời chúc yêu thương',
      fps: 30,
      durationSec: 0.1, // 3 frames for quick test
      particleEffect: 'sakura',
      onProgress: progressSpy
    });

    expect(progressSpy).toHaveBeenCalled();
    expect(lastProgress).toBe(100);
    expect(resultBlob).toBeDefined();
  });
});
