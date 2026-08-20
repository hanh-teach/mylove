import { ILayer } from './LayerTypes';
import { LayerModel } from './LayerModel';

export class ArrangeService {
  /**
   * Align selected layers relative to canvas or relative to bounding box
   */
  static alignLayers(
    layers: ILayer[],
    selectedIds: string[],
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom',
    canvasWidth = 1000,
    canvasHeight = 650
  ): ILayer[] {
    if (selectedIds.length === 0) return layers;

    const selected = layers.filter(l => selectedIds.includes(l.id));

    // If single layer, align relative to canvas
    if (selected.length === 1) {
      const layer = selected[0];
      let newX = layer.x;
      let newY = layer.y;

      switch (alignment) {
        case 'left':
          newX = 40; // canvas margin
          break;
        case 'center':
          newX = (canvasWidth - layer.width) / 2;
          break;
        case 'right':
          newX = canvasWidth - 40 - layer.width;
          break;
        case 'top':
          newY = 40;
          break;
        case 'middle':
          newY = (canvasHeight - layer.height) / 2;
          break;
        case 'bottom':
          newY = canvasHeight - 40 - layer.height;
          break;
      }

      return layers.map(l => (l.id === layer.id ? { ...l, x: newX, y: newY } : l));
    }

    // If multiple layers, calculate bounding box of selection
    const minX = Math.min(...selected.map(l => l.x));
    const maxX = Math.max(...selected.map(l => l.x + l.width));
    const minY = Math.min(...selected.map(l => l.y));
    const maxY = Math.max(...selected.map(l => l.y + l.height));
    const boundsWidth = maxX - minX;
    const boundsHeight = maxY - minY;

    return layers.map(l => {
      if (!selectedIds.includes(l.id)) return l;

      let newX = l.x;
      let newY = l.y;

      switch (alignment) {
        case 'left':
          newX = minX;
          break;
        case 'center':
          newX = minX + (boundsWidth - l.width) / 2;
          break;
        case 'right':
          newX = maxX - l.width;
          break;
        case 'top':
          newY = minY;
          break;
        case 'middle':
          newY = minY + (boundsHeight - l.height) / 2;
          break;
        case 'bottom':
          newY = maxY - l.height;
          break;
      }

      return { ...l, x: Math.round(newX), y: Math.round(newY) };
    });
  }

  /**
   * Distribute layers evenly along X or Y axis
   */
  static distributeLayers(
    layers: ILayer[],
    selectedIds: string[],
    direction: 'horizontal' | 'vertical'
  ): ILayer[] {
    if (selectedIds.length < 3) return layers;

    const selected = layers
      .filter(l => selectedIds.includes(l.id))
      .sort((a, b) => (direction === 'horizontal' ? a.x - b.x : a.y - b.y));

    if (direction === 'horizontal') {
      const minX = selected[0].x;
      const last = selected[selected.length - 1];
      const maxX = last.x + last.width;
      const totalWidths = selected.reduce((acc, l) => acc + l.width, 0);
      const remainingSpace = maxX - minX - totalWidths;
      const gap = remainingSpace / (selected.length - 1);

      let currentX = minX;
      const updateMap = new Map<string, number>();

      selected.forEach((l, idx) => {
        if (idx === 0) {
          updateMap.set(l.id, l.x);
          currentX += l.width;
        } else if (idx === selected.length - 1) {
          updateMap.set(l.id, l.x);
        } else {
          currentX += gap;
          updateMap.set(l.id, Math.round(currentX));
          currentX += l.width;
        }
      });

      return layers.map(l => (updateMap.has(l.id) ? { ...l, x: updateMap.get(l.id)! } : l));
    } else {
      const minY = selected[0].y;
      const last = selected[selected.length - 1];
      const maxY = last.y + last.height;
      const totalHeights = selected.reduce((acc, l) => acc + l.height, 0);
      const remainingSpace = maxY - minY - totalHeights;
      const gap = remainingSpace / (selected.length - 1);

      let currentY = minY;
      const updateMap = new Map<string, number>();

      selected.forEach((l, idx) => {
        if (idx === 0) {
          updateMap.set(l.id, l.y);
          currentY += l.height;
        } else if (idx === selected.length - 1) {
          updateMap.set(l.id, l.y);
        } else {
          currentY += gap;
          updateMap.set(l.id, Math.round(currentY));
          currentY += l.height;
        }
      });

      return layers.map(l => (updateMap.has(l.id) ? { ...l, y: updateMap.get(l.id)! } : l));
    }
  }

  /**
   * Group selected layers into a group layer
   */
  static groupLayers(layers: ILayer[], selectedIds: string[]): { newLayers: ILayer[]; groupId: string | null } {
    if (selectedIds.length < 2) return { newLayers: layers, groupId: null };

    const selected = layers.filter(l => selectedIds.includes(l.id));
    const minX = Math.min(...selected.map(l => l.x));
    const maxX = Math.max(...selected.map(l => l.x + l.width));
    const minY = Math.min(...selected.map(l => l.y));
    const maxY = Math.max(...selected.map(l => l.y + l.height));

    const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const maxZ = Math.max(...selected.map(l => l.zIndex || 0));

    const groupLayer = new LayerModel({
      id: groupId,
      type: 'group',
      name: `Nhóm (${selected.length} items)`,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      zIndex: maxZ + 1,
      children: selected,
    });

    const updatedLayers = layers.map(l => {
      if (selectedIds.includes(l.id)) {
        return { ...l, parentId: groupId };
      }
      return l;
    });

    return {
      newLayers: [...updatedLayers, groupLayer],
      groupId,
    };
  }

  /**
   * Ungroup a group layer
   */
  static ungroupLayers(layers: ILayer[], groupId: string): ILayer[] {
    const groupLayer = layers.find(l => l.id === groupId);
    if (!groupLayer) return layers;

    return layers
      .filter(l => l.id !== groupId)
      .map(l => {
        if (l.parentId === groupId) {
          return { ...l, parentId: undefined };
        }
        return l;
      });
  }
}
