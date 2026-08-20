import { describe, it, expect, vi, afterEach } from 'vitest';
import html2canvas from 'html2canvas';
import { captureElementToCanvas } from './ExportHelper';

vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

describe('black-export repro: fixed-position modal + page scroll', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does NOT add scroll offset for a target inside a position:fixed ancestor', async () => {
    document.body.innerHTML = `
      <div style="height: 3000px;"></div>
      <div id="backdrop" style="position: fixed; inset: 0;">
        <div id="modal-card">
          <div id="generated-card-container">content</div>
        </div>
      </div>
    `;
    const container = document.getElementById('generated-card-container')!;

    // Simulate the page having been scrolled before the modal was opened/captured — this is
    // exactly the real-world trigger: whatever content sat above the fold pushes scrollY > 0.
    Object.defineProperty(window, 'scrollY', { value: 800, configurable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });

    // rect.top for a `position: fixed; inset: 0` element is always 0 regardless of scroll —
    // jsdom's layout engine doesn't compute real geometry, so we stub getBoundingClientRect
    // to return what a real browser would for this fixed, viewport-pinned element.
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 10, left: 5, width: 400, height: 300, right: 405, bottom: 310, x: 5, y: 10, toJSON() {},
    } as DOMRect);

    let capturedX: number | undefined;
    let capturedY: number | undefined;
    vi.mocked(html2canvas).mockImplementation(async (_el, options: any) => {
      capturedX = options.x;
      capturedY = options.y;
      return { getContext: vi.fn() } as any;
    });

    await captureElementToCanvas(container, { backgroundColor: '#000000' });

    // BUG (before fix): capturedX/Y would be rect.left/top + window.scrollX/Y = 5, 810 — far
    // outside the actual 0-scroll clone, landing the crop on empty space (rendered as solid
    // backgroundColor = black). FIXED: for a fixed-position target, x/y must equal rect.left/top
    // exactly, since the clone always renders un-scrolled and fixed elements don't move with
    // scroll either way.
    expect(capturedX).toBe(5);
    expect(capturedY).toBe(10);
  });

  it('DOES add scroll offset for a normal in-flow (non-fixed) target', async () => {
    document.body.innerHTML = `
      <div style="height: 800px;"></div>
      <div id="normal-card">content</div>
    `;
    const container = document.getElementById('normal-card')!;

    Object.defineProperty(window, 'scrollY', { value: 800, configurable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 10, left: 5, width: 400, height: 300, right: 405, bottom: 310, x: 5, y: 10, toJSON() {},
    } as DOMRect);

    let capturedX: number | undefined;
    let capturedY: number | undefined;
    vi.mocked(html2canvas).mockImplementation(async (_el, options: any) => {
      capturedX = options.x;
      capturedY = options.y;
      return { getContext: vi.fn() } as any;
    });

    await captureElementToCanvas(container, { backgroundColor: '#000000' });

    // Unchanged behaviour for normal-flow elements: still needs the scroll offset added so the
    // crop matches where the element sits in the un-scrolled clone's full document layout.
    expect(capturedX).toBe(5);
    expect(capturedY).toBe(810);
  });
});
