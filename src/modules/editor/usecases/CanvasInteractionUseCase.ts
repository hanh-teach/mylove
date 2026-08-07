export interface CanvasDropPosition {
  x: number;
  y: number;
}

export class CanvasInteractionUseCase {
  static calculateDropPosition(
    clientX: number,
    clientY: number,
    artboardRect: DOMRect,
    zoom: number
  ): CanvasDropPosition {
    const dropX = Math.round((clientX - artboardRect.left) / zoom - 50);
    const dropY = Math.round((clientY - artboardRect.top) / zoom - 40);

    return {
      x: Math.max(20, dropX),
      y: Math.max(20, dropY),
    };
  }

  static calculateCanvasPointerPosition(
    clientX: number,
    clientY: number,
    artboardRect: DOMRect,
    zoom: number
  ): { x: number; y: number } {
    return {
      x: (clientX - artboardRect.left) / zoom,
      y: (clientY - artboardRect.top) / zoom,
    };
  }
}
