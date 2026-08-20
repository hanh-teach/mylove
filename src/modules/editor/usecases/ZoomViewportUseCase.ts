import { ViewportTransform, calculateFitTransform } from '../ZoomEngine';

export class ZoomViewportUseCase {
  static zoomIn(viewport: ViewportTransform): ViewportTransform {
    return {
      ...viewport,
      zoom: Math.min(viewport.zoom * 1.25, 4.0),
    };
  }

  static zoomOut(viewport: ViewportTransform): ViewportTransform {
    return {
      ...viewport,
      zoom: Math.max(viewport.zoom / 1.25, 0.1),
    };
  }

  static resetZoom(viewport: ViewportTransform): ViewportTransform {
    return {
      ...viewport,
      zoom: 1.0,
      panX: 0,
      panY: 0,
    };
  }

  static fitToScreen(containerWidth: number, containerHeight: number, contentWidth = 1000, contentHeight = 800): ViewportTransform {
    return calculateFitTransform(containerWidth, containerHeight, contentWidth, contentHeight, 'screen');
  }
}
