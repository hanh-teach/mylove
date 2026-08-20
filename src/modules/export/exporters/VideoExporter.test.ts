import { describe, it, expect, vi } from 'vitest';
import { VideoExporter, WebmExporter, GifExporter } from './VideoExporter';
import { ExportRegistry } from '../ExportRegistry';

describe('Video Exporters Tests', () => {
  it('should be correctly registered in ExportRegistry', () => {
    const mp4Exp = ExportRegistry.get('mp4');
    const webmExp = ExportRegistry.get('webm');
    const gifExp = ExportRegistry.get('gif');

    expect(mp4Exp).toBeDefined();
    expect(mp4Exp?.id).toBe('mp4');

    expect(webmExp).toBeDefined();
    expect(webmExp?.id).toBe('webm');

    expect(gifExp).toBeDefined();
    expect(gifExp?.id).toBe('gif');
  });

  it('should export video data and return blob with object URL', async () => {
    const exporter = new VideoExporter();
    
    // Mock video renderer
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

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost:3000/mock-video');

    const result = await exporter.export(
      {
        title: 'Happy Birthday',
        message: 'Wishing you love and happiness',
      },
      {
        format: 'mp4',
        quality: 'high',
        filename: 'birthday-card',
        includeImages: true,
        includeTimeline: false,
        includeMetadata: false,
        includeVersionInfo: false,
        includeWatermark: false,
        includeComments: false,
        watermarkText: ''
      }
    );

    expect(result.success).toBe(true);
    expect(result.url).toBe('blob:http://localhost:3000/mock-video');
  });
});
