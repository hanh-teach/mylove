import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageExporter, JpgExporter } from './exporters/ImageExporter';
import * as ExportHelper from './ExportHelper';
import { triggerFileDownload } from './downloadUtils';

vi.mock('./ExportHelper', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./ExportHelper')>();
  return {
    ...actual,
    getExportCanvas: vi.fn(),
  };
});

describe('ImageExporter - Tainted Canvas test', () => {
  it('should return error with custom Vietnamese message when toBlob returns null (tainted canvas)', async () => {
    const mockCanvas = {
      toBlob: vi.fn((callback) => {
        // Simulate tainted canvas where toBlob returns null
        callback(null);
      })
    } as unknown as HTMLCanvasElement;

    vi.mocked(ExportHelper.getExportCanvas).mockResolvedValue(mockCanvas);

    const exporter = new ImageExporter();
    const result = await exporter.export({}, {
      format: 'png',
      quality: 'high',
      filename: 'test.png',
      includeImages: true,
      includeTimeline: false,
      includeMetadata: false,
      includeVersionInfo: false,
      includeWatermark: false,
      includeComments: false,
      watermarkText: '',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Không thể xuất vì thiệp có ảnh từ nguồn không hỗ trợ');
    expect(result.error).toContain('SecurityError');
  });

  it('should return error with custom Vietnamese message when toBlob throws a SecurityError synchronously', async () => {
    const mockCanvas = {
      toBlob: vi.fn(() => {
        // Simulate synchronous SecurityError
        const error = new Error('The operation is insecure.');
        error.name = 'SecurityError';
        throw error;
      })
    } as unknown as HTMLCanvasElement;

    vi.mocked(ExportHelper.getExportCanvas).mockResolvedValue(mockCanvas);

    const exporter = new JpgExporter();
    const result = await exporter.export({}, {
      format: 'jpg',
      quality: 'high',
      filename: 'test.jpg',
      includeImages: true,
      includeTimeline: false,
      includeMetadata: false,
      includeVersionInfo: false,
      includeWatermark: false,
      includeComments: false,
      watermarkText: '',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('The operation is insecure.');
  });
});

describe('triggerFileDownload tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('alert', vi.fn());
  });

  it('should trigger Web Share API if navigator.canShare and navigator.share are supported', async () => {
    const mockCanShare = vi.fn().mockReturnValue(true);
    const mockShare = vi.fn().mockResolvedValue(undefined);
    
    vi.stubGlobal('navigator', {
      canShare: mockCanShare,
      share: mockShare,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
    });

    const blob = new Blob(['hello'], { type: 'text/plain' });
    await triggerFileDownload(blob, 'test.txt');

    expect(mockCanShare).toHaveBeenCalled();
    expect(mockShare).toHaveBeenCalled();
  });

  it('should fallback to standard download if share is not supported', async () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    });

    const mockLink = {
      href: '',
      download: '',
      style: { display: '' },
      click: vi.fn(),
    };
    const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

    const blob = new Blob(['hello'], { type: 'text/plain' });
    await triggerFileDownload(blob, 'test.txt');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe('test.txt');
    expect(mockLink.click).toHaveBeenCalled();

    mockCreateElement.mockRestore();
    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
  });

  it('should show iOS PWA standalone warning if standalone and share unsupported', async () => {
    const mockAlert = vi.fn();
    vi.stubGlobal('alert', mockAlert);
    
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: true });
    vi.stubGlobal('window', {
      matchMedia: mockMatchMedia,
    });

    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
    });

    const blob = new Blob(['hello'], { type: 'text/plain' });
    await triggerFileDownload(blob, 'test.txt');

    expect(mockAlert).toHaveBeenCalledWith(expect.stringContaining('Thiết bị của bạn chưa hỗ trợ tải trực tiếp trong chế độ ứng dụng'));
  });
});
