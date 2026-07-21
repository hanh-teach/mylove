export interface ViewportTransform {
  zoom: number;       // scale multiplier (e.g. 1.0 = 100%)
  panX: number;       // horizontal offset in pixels
  panY: number;       // vertical offset in pixels
}

export const ZOOM_LEVELS = [0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 4.0];

/**
 * Calculates new zoom and pan offsets for pointer-centered zooming
 */
export function zoomTowardsPointer(
  currentTransform: ViewportTransform,
  newZoom: number,
  pointerX: number,
  pointerY: number
): ViewportTransform {
  const { zoom, panX, panY } = currentTransform;
  
  // Clamp zoom between 10% and 400%
  const clampedZoom = Math.max(0.1, Math.min(4.0, newZoom));
  
  if (clampedZoom === zoom) {
    return currentTransform;
  }

  // Calculate corresponding canvas coordinate under pointer
  const canvasX = (pointerX - panX) / zoom;
  const canvasY = (pointerY - panY) / zoom;

  // New translation offsets keeping canvas coordinate under pointer stationary
  const newPanX = pointerX - canvasX * clampedZoom;
  const newPanY = pointerY - canvasY * clampedZoom;

  return {
    zoom: clampedZoom,
    panX: newPanX,
    panY: newPanY
  };
}

/**
 * Calculates zoom scale and offsets to perfectly fit a target dimension into the viewport container
 */
export function calculateFitTransform(
  viewportWidth: number,
  viewportHeight: number,
  contentWidth: number,
  contentHeight: number,
  mode: 'width' | 'height' | 'screen'
): ViewportTransform {
  let scale = 1.0;

  const pad = 40; // margin padding
  const availW = Math.max(100, viewportWidth - pad * 2);
  const availH = Math.max(100, viewportHeight - pad * 2);

  if (mode === 'width') {
    scale = availW / contentWidth;
  } else if (mode === 'height') {
    scale = availH / contentHeight;
  } else {
    // fit screen (aspect ratio fitting)
    const scaleX = availW / contentWidth;
    const scaleY = availH / contentHeight;
    scale = Math.min(scaleX, scaleY);
  }

  // Clamp fitted zoom to standard 10%-400% range
  scale = Math.max(0.1, Math.min(4.0, scale));

  // Center the content in the viewport
  const panX = (viewportWidth - contentWidth * scale) / 2;
  const panY = (viewportHeight - contentHeight * scale) / 2;

  return { zoom: scale, panX, panY };
}
