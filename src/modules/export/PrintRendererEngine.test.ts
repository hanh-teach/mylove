import { describe, it, expect, vi } from 'vitest';
import { PrintRendererEngine, getPrintDimensionsPx } from './PrintRendererEngine';

describe('PrintRendererEngine Tests', () => {
  it('should calculate accurate 300 DPI dimensions with bleed', () => {
    const a4Dim = getPrintDimensionsPx('a4', 300, true);
    expect(a4Dim.dpi).toBe(300);
    expect(a4Dim.width).toBeGreaterThan(2400); // 210mm + 6mm bleed at 300 DPI approx 2551px
    expect(a4Dim.height).toBeGreaterThan(3400); // 297mm + 6mm bleed at 300 DPI approx 3579px

    const postcardDim = getPrintDimensionsPx('postcard_4x6', 300, false);
    expect(postcardDim.dpi).toBe(300);
    expect(postcardDim.width).toBe(1200); // 4 inches * 300 DPI
    expect(postcardDim.height).toBe(1800); // 6 inches * 300 DPI

    const bifoldDim = getPrintDimensionsPx('bifold_5x7', 300, false);
    expect(bifoldDim.width).toBe(3000); // 10 inches * 300 DPI
    expect(bifoldDim.height).toBe(2100); // 7 inches * 300 DPI
  });

  it('should get singleton instance of PrintRendererEngine', () => {
    const engine1 = PrintRendererEngine.getInstance();
    const engine2 = PrintRendererEngine.getInstance();
    expect(engine1).toBeDefined();
    expect(engine1).toBe(engine2);
  });

  it('should render print canvas with correct context operations', async () => {
    const engine = PrintRendererEngine.getInstance();

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
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      translate: vi.fn(),
      fillText: vi.fn(),
      setLineDash: vi.fn(),
      drawImage: vi.fn()
    };

    const mockCanvas = {
      width: 3000,
      height: 2100,
      getContext: vi.fn(() => mockContext),
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,mock')
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return document.createElement(tagName);
    });

    const canvas = await engine.renderPrintCanvas({
      paperSize: 'bifold_5x7',
      orientation: 'landscape',
      title: 'Kỷ Niệm Đẹp',
      message: 'Lời chúc ý nghĩa',
      includeCropMarks: true,
      includeFoldLine: true
    });

    expect(canvas).toBeDefined();
    expect(mockContext.fillRect).toHaveBeenCalled();
  });
});
