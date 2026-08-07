import { ViewportTransform, zoomTowardsPointer } from '../ZoomEngine';

export class CanvasViewportUseCase {
  static handleWheelZoom(
    viewport: ViewportTransform,
    deltaY: number,
    pointerX: number,
    pointerY: number
  ): ViewportTransform {
    const zoomFactor = deltaY < 0 ? 1.15 : 0.85;
    const newZoom = viewport.zoom * zoomFactor;
    return zoomTowardsPointer(viewport, newZoom, pointerX, pointerY);
  }

  static handleWheelPan(
    viewport: ViewportTransform,
    deltaX: number,
    deltaY: number
  ): ViewportTransform {
    return {
      ...viewport,
      panX: viewport.panX - deltaX,
      panY: viewport.panY - deltaY,
    };
  }

  static calculatePointerPan(
    startPanX: number,
    startPanY: number,
    deltaX: number,
    deltaY: number
  ): { panX: number; panY: number } {
    return {
      panX: startPanX + deltaX,
      panY: startPanY + deltaY,
    };
  }
}
