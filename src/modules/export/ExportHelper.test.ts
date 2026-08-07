import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureElementToCanvas, getExportCanvas } from './ExportHelper';
import { decorRegistry } from '../../shared/constants';
import * as downloadUtils from './downloadUtils';
import html2canvas from 'html2canvas';

vi.mock('./downloadUtils', () => ({
  prefetchImageAsBase64: vi.fn()
}));

vi.mock('html2canvas', () => ({
  default: vi.fn()
}));

describe('captureElementToCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call html2canvas with correct options', async () => {
    const mockCanvas = { getContext: vi.fn() } as unknown as HTMLCanvasElement;
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const element = document.createElement('div');
    element.id = 'test-el';
    const options = {
      scale: 3,
      backgroundColor: '#ffffff'
    };

    const result = await captureElementToCanvas(element, options);

    expect(html2canvas).toHaveBeenCalledWith(element, expect.objectContaining({
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: false,
      logging: false
    }));
    expect(result).toBe(mockCanvas);
  });

  it('should enforce crossorigin on images during onclone', async () => {
    const mockImage = { setAttribute: vi.fn() };
    const mockDoc = {
      getElementsByTagName: vi.fn().mockReturnValue([mockImage])
    };

    vi.mocked(html2canvas).mockImplementation(async (el, options: any) => {
      if (options?.onclone) {
        options.onclone(mockDoc as any);
      }
      return { getContext: vi.fn() } as any;
    });

    const element = document.createElement('div');
    await captureElementToCanvas(element, { backgroundColor: '#000' });

    expect(mockDoc.getElementsByTagName).toHaveBeenCalledWith('img');
    expect(mockImage.setAttribute).toHaveBeenCalledWith('crossorigin', 'anonymous');
  });

  it('should call optional onClone callback', async () => {
    const onCloneSpy = vi.fn();
    const mockDoc = {
      getElementsByTagName: vi.fn().mockReturnValue([]),
      querySelectorAll: vi.fn().mockReturnValue([]),
      getElementById: vi.fn().mockReturnValue(null)
    };

    vi.mocked(html2canvas).mockImplementation(async (el, options: any) => {
      if (options?.onclone) {
        await options.onclone(mockDoc as any);
      }
      return { getContext: vi.fn() } as any;
    });

    const element = document.createElement('div');
    await captureElementToCanvas(element, { 
      backgroundColor: '#000',
      onClone: onCloneSpy
    });

    expect(onCloneSpy).toHaveBeenCalledWith(mockDoc, element);
  });

  it('should return null and log error when html2canvas fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(html2canvas).mockRejectedValue(new Error('Mock Canvas Error'));

    const element = document.createElement('div');
    const result = await captureElementToCanvas(element, { backgroundColor: '#000' });

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('getExportCanvas', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
  });

  it('should calculate scale based on quality', async () => {
    const mockCanvas = { getContext: vi.fn() } as unknown as HTMLCanvasElement;
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);
    
    const targetElement = document.createElement('div');
    
    await getExportCanvas({}, { quality: 'print' } as any, targetElement);
    expect(html2canvas).toHaveBeenCalledWith(targetElement, expect.objectContaining({ scale: 3 }));
    
    await getExportCanvas({}, { quality: 'high' } as any, targetElement);
    expect(html2canvas).toHaveBeenCalledWith(targetElement, expect.objectContaining({ scale: 2 }));
    
    await getExportCanvas({}, { quality: 'standard' } as any, targetElement);
    expect(html2canvas).toHaveBeenCalledWith(targetElement, expect.objectContaining({ scale: 1.5 }));
  });

  it('should select backgroundColor correctly based on scene', async () => {
    const mockCanvas = { getContext: vi.fn() } as unknown as HTMLCanvasElement;
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);
    
    const targetElement = document.createElement('div');
    
    // Test 'rose' (default)
    await getExportCanvas({ scene: 'rose' }, {} as any, targetElement);
    expect(html2canvas).toHaveBeenCalledWith(targetElement, expect.objectContaining({ backgroundColor: '#ffe4e6' }));
    
    // Test 'garden'
    await getExportCanvas({ scene: 'garden' }, {} as any, targetElement);
    expect(html2canvas).toHaveBeenCalledWith(targetElement, expect.objectContaining({ backgroundColor: '#d1fae5' }));
    
    // Test unknown scene (should fallback to rose's hex)
    await getExportCanvas({ scene: 'unknown' }, {} as any, targetElement);
    expect(html2canvas).toHaveBeenCalledWith(targetElement, expect.objectContaining({ backgroundColor: '#ffe4e6' }));
  });

  it('should prefetch images for image decor items and handle errors gracefully', async () => {
    const mockCanvas = { getContext: vi.fn() } as unknown as HTMLCanvasElement;
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);
    
    const prefetchSpy = vi.mocked(downloadUtils.prefetchImageAsBase64);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    prefetchSpy.mockResolvedValueOnce('data:image/png;base64,success');
    prefetchSpy.mockRejectedValueOnce(new Error('Prefetch failed'));
    
    decorRegistry['Couple'].content = 'test-url';
    decorRegistry['Bouquet'].content = 'test-url2';
    const data = {
      placedItems: [
        { type: 'Couple', content: 'https://example.com/img1.png' },
        { type: 'Bouquet', content: 'https://example.com/img2.png' },
        { type: 'Heart' }
      ]
    };
    
    const targetElement = document.createElement('div');
    await getExportCanvas(data, {} as any, targetElement);
    
    expect(prefetchSpy).toHaveBeenCalledTimes(2);
    expect(consoleWarnSpy).toHaveBeenCalledWith('[getExportCanvas] Lỗi prefetch/frame ảnh sticker/photo:', expect.any(Error));
    
    consoleWarnSpy.mockRestore();
    prefetchSpy.mockRestore();
  });

  it('should create and cleanup a temporary element if targetElement is not provided', async () => {
    const mockCanvas = { getContext: vi.fn() } as unknown as HTMLCanvasElement;
    
    expect(document.body.childNodes.length).toBe(0);
    
    let elementInDomDuringCapture = false;
    vi.mocked(html2canvas).mockImplementationOnce(async (el, options: any) => {
      elementInDomDuringCapture = document.body.contains(el);
      if (options?.onclone) {
        await options.onclone(document);
      }
      return mockCanvas;
    });
    
    await getExportCanvas({}, {} as any);
    
    expect(elementInDomDuringCapture).toBe(true);
    expect(document.body.childNodes.length).toBe(0);
  });

  it('should cleanup temporary element even if html2canvas throws an error', async () => {
    vi.mocked(html2canvas).mockRejectedValue(new Error('Capture error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(document.body.childNodes.length).toBe(0);
    
    const result = await getExportCanvas({}, {} as any);
    expect(result).not.toBeNull();
    
    expect(document.body.childNodes.length).toBe(0);
    consoleSpy.mockRestore();
  });
});
