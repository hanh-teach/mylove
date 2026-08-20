import { SelectionStore, selectionStore } from './SelectionStore';
import { LayerStore, layerStore } from './LayerStore';
import { ILayer } from './LayerTypes';

export class SelectionManager {
  private selStore: SelectionStore;
  private lStore: LayerStore;

  constructor(selStore: SelectionStore = selectionStore, lStore: LayerStore = layerStore) {
    this.selStore = selStore;
    this.lStore = lStore;
  }

  /**
   * Select a single layer, clearing all previous selections
   */
  public selectSingle(id: string): void {
    const layer = this.lStore.findLayerById(id);
    if (layer && !layer.locked) {
      this.selStore.setSelectedIds([id]);
    }
  }

  /**
   * Toggles the selection status of a layer, typically used when holding Command/Ctrl key
   */
  public selectToggle(id: string): void {
    const layer = this.lStore.findLayerById(id);
    if (!layer || layer.locked) return;

    this.selStore.toggle(id);
  }

  /**
   * Selects multiple layers simultaneously by adding them to the selection stack
   */
  public selectMultiple(ids: string[]): void {
    const validIds = ids.filter(id => {
      const layer = this.lStore.findLayerById(id);
      return layer && !layer.locked;
    });
    this.selStore.setSelectedIds(validIds);
  }

  /**
   * Selects all non-locked, visible layers in the workspace
   */
  public selectAll(): void {
    const flatLayers = this.lStore.getFlatLayers();
    const selectableIds = flatLayers
      .filter(l => !l.locked && l.visible)
      .map(l => l.id);
    this.selStore.setSelectedIds(selectableIds);
  }

  /**
   * Clears selection, handles Click Outside
   */
  public clearSelection(): void {
    this.selStore.clear();
  }

  /**
   * Shift select: Selects everything between the last selected element and the current element
   * in the flat layer tree. If no previous selection exists, defaults to single selection.
   */
  public selectShift(id: string): void {
    const targetLayer = this.lStore.findLayerById(id);
    if (!targetLayer || targetLayer.locked) return;

    const selected = this.selStore.getSelectedIds();
    if (selected.length === 0) {
      this.selStore.setSelectedIds([id]);
      return;
    }

    const flat = this.lStore.getFlatLayers().filter(l => !l.locked && l.visible);
    const lastSelectedId = selected[selected.length - 1];
    
    const lastIdx = flat.findIndex(l => l.id === lastSelectedId);
    const targetIdx = flat.findIndex(l => l.id === id);

    if (lastIdx === -1 || targetIdx === -1) {
      this.selStore.toggle(id);
      return;
    }

    const start = Math.min(lastIdx, targetIdx);
    const end = Math.max(lastIdx, targetIdx);

    const idsToSelect = flat.slice(start, end + 1).map(l => l.id);
    
    // Merge existing selection with range to mimic Adobe/Figma Shift+Select lists
    const uniqueIds = Array.from(new Set([...selected, ...idsToSelect]));
    this.selStore.setSelectedIds(uniqueIds);
  }

  /**
   * Box Selection (Marquee): Detects which layers lie within the bounding box of a drag gesture
   * @param x Left coordinate of marquee box
   * @param y Top coordinate of marquee box
   * @param width Width of marquee box
   * @param height Height of marquee box
   * @param isPartialOverlap If true, selects layer if any part touches the box (AABB overlap).
   *                         If false, selects layer only if it is completely inside.
   */
  public selectByBox(x: number, y: number, width: number, height: number, isPartialOverlap = true): void {
    const boxLeft = x;
    const boxRight = x + width;
    const boxTop = y;
    const boxBottom = y + height;

    const flat = this.lStore.getFlatLayers().filter(l => !l.locked && l.visible);
    const intersectingIds: string[] = [];

    for (const layer of flat) {
      const layerLeft = layer.x;
      const layerRight = layer.x + (layer.width || 0);
      const layerTop = layer.y;
      const layerBottom = layer.y + (layer.height || 0);

      if (isPartialOverlap) {
        // AABB Intersect test
        const overlapsX = layerLeft < boxRight && layerRight > boxLeft;
        const overlapsY = layerTop < boxBottom && layerBottom > boxTop;
        if (overlapsX && overlapsY) {
          intersectingIds.push(layer.id);
        }
      } else {
        // Complete containment test
        const insideX = layerLeft >= boxLeft && layerRight <= boxRight;
        const insideY = layerTop >= boxTop && layerBottom <= boxBottom;
        if (insideX && insideY) {
          intersectingIds.push(layer.id);
        }
      }
    }

    this.selStore.setSelectedIds(intersectingIds);
  }

  /**
   * Handle generic mouse interaction (single click) with modifiers (Ctrl, Shift)
   */
  public handleLayerClick(id: string, modifiers: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }): void {
    if (modifiers.shiftKey) {
      this.selectShift(id);
    } else if (modifiers.ctrlKey || modifiers.metaKey) {
      this.selectToggle(id);
    } else {
      this.selectSingle(id);
    }
  }
}

export const selectionManager = new SelectionManager();
