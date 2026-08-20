import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { prefetchImageAsBase64 } from './downloadUtils';

describe('prefetchImageAsBase64', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should return the original string if it is a data URL', async () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgo';
    const result = await prefetchImageAsBase64(dataUrl);
    expect(result).toBe(dataUrl);
  });

  it('should return the original string if it is a blob URL', async () => {
    const blobUrl = 'blob:http://localhost:3000/some-uuid';
    const result = await prefetchImageAsBase64(blobUrl);
    expect(result).toBe(blobUrl);
  });

  it('should return the original string if it is not http/https', async () => {
    const localPath = '/images/test.png';
    const result = await prefetchImageAsBase64(localPath);
    expect(result).toBe(localPath);
  });

  it('should fetch and return base64 Data URI on success', async () => {
    const mockUrl = 'https://example.com/image.png';
    const mockBlob = new Blob(['mock-image-data'], { type: 'image/png' });
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    // Mock FileReader since JSDOM might not have a fully functional one or we want to control it
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onloadend: null as any,
      onerror: null as any,
      result: 'data:image/png;base64,mockbase64',
      error: null
    };

    const originalFileReader = global.FileReader;
    global.FileReader = class { get result() { return mockFileReader.result; } get error() { return mockFileReader.error; } readAsDataURL(blob: any) { mockFileReader.readAsDataURL(blob); } set onloadend(fn: any) { mockFileReader.onloadend = fn; } set onerror(fn: any) { mockFileReader.onerror = fn; } } as any;

    const promise = prefetchImageAsBase64(mockUrl);
    
    // Simulate FileReader onloadend
    setTimeout(() => {
      if (mockFileReader.onloadend) {
        mockFileReader.onloadend({} as ProgressEvent<FileReader>);
      }
    }, 0);

    const result = await promise;
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
    expect(result).toBe('data:image/png;base64,mockbase64');
    
    global.FileReader = originalFileReader;
  });

  it('should return the original URL if fetch fails (fallback)', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mockUrl = 'https://example.com/not-found.png';
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404
    });

    const result = await prefetchImageAsBase64(mockUrl);
    
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toBe(mockUrl);
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });
});
