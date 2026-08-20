import { ILayer } from '../LayerTypes';

export interface MarqueeBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export class CanvasSelectionUseCase {
  static getIntersectedLayerIds(layers: ILayer[], marqueeBox: MarqueeBox): string[] {
    const mMinX = Math.min(marqueeBox.startX, marqueeBox.currentX);
    const mMaxX = Math.max(marqueeBox.startX, marqueeBox.currentX);
    const mMinY = Math.min(marqueeBox.startY, marqueeBox.currentY);
    const mMaxY = Math.max(marqueeBox.startY, marqueeBox.currentY);

    return layers
      .filter((l) => l.visible !== false)
      .filter((l) => {
        const lRight = l.x + l.width;
        const lBottom = l.y + l.height;
        return l.x < mMaxX && lRight > mMinX && l.y < mMaxY && lBottom > mMinY;
      })
      .map((l) => l.id);
  }
}
