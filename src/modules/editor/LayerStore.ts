import { ILayer } from './LayerTypes';
import { LayerModel } from './LayerModel';

export type LayerStoreListener = (layers: ILayer[]) => void;

export class LayerStore {
  private layers: ILayer[] = [];
  private listeners: Set<LayerStoreListener> = new Set();

  constructor(initialLayers: ILayer[] = []) {
    this.layers = initialLayers.map(l => new LayerModel(l));
  }

  /**
   * Get all root-level layers sorted by zIndex
   */
  public getRootLayers(): ILayer[] {
    return [...this.layers]
      .filter(l => !l.parentId)
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * Retrieves all layers as a flat list
   */
  public getFlatLayers(): ILayer[] {
    const flat: ILayer[] = [];
    const traverse = (list: ILayer[]) => {
      for (const item of list) {
        flat.push(item);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      }
    };
    traverse(this.layers);
    return flat;
  }

  /**
   * Search for a layer by its unique ID
   */
  public findLayerById(id: string): ILayer | null {
    const flat = this.getFlatLayers();
    return flat.find(l => l.id === id) || null;
  }

  /**
   * Computes the absolute coordinates (X, Y) of a layer in the canvas workspace,
   * taking into account any nested parent offsets recursively.
   */
  public getAbsolutePosition(id: string): { x: number; y: number } {
    const layer = this.findLayerById(id);
    if (!layer) return { x: 0, y: 0 };
    if (!layer.parentId) return { x: layer.x, y: layer.y };
    const parentPos = this.getAbsolutePosition(layer.parentId);
    return {
      x: parentPos.x + layer.x,
      y: parentPos.y + layer.y
    };
  }

  /**
   * Replaces the entire layer list and notifies listeners
   */
  public setLayers(newLayers: ILayer[]): void {
    this.layers = newLayers.map(l => new LayerModel(l));
    this.notify();
  }

  /**
   * Add a new layer to the store
   */
  public addLayer(layer: ILayer): void {
    const newModel = new LayerModel(layer);
    if (newModel.parentId) {
      const parent = this.findLayerById(newModel.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(newModel);
      } else {
        // Fallback to root if parent not found
        newModel.parentId = null;
        this.layers.push(newModel);
      }
    } else {
      this.layers.push(newModel);
    }
    this.notify();
  }

  /**
   * Update layer properties
   */
  public updateLayer(id: string, updates: Partial<ILayer>): boolean {
    const layer = this.findLayerById(id);
    if (!layer) return false;

    // Apply updates
    Object.assign(layer, updates);
    this.notify();
    return true;
  }

  /**
   * Delete a layer and clean up child nodes recursively
   */
  public removeLayer(id: string): boolean {
    let removed = false;

    // Check if it is a root layer
    const rootIndex = this.layers.findIndex(l => l.id === id);
    if (rootIndex !== -1) {
      this.layers.splice(rootIndex, 1);
      removed = true;
    } else {
      // Check in children hierarchies
      const traverseAndRemove = (list: ILayer[]): boolean => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            list.splice(i, 1);
            return true;
          }
          if (list[i].children && list[i].children.length > 0) {
            if (traverseAndRemove(list[i].children)) return true;
          }
        }
        return false;
      };
      removed = traverseAndRemove(this.layers);
    }

    if (removed) {
      this.notify();
    }
    return removed;
  }

  /**
   * Subscribe to state changes
   */
  public subscribe(listener: LayerStoreListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all registered observers
   */
  private notify(): void {
    const currentSnapshot = this.getRootLayers();
    this.listeners.forEach(listener => {
      try {
        listener(currentSnapshot);
      } catch (err) {
        console.error('[LayerStore] Error invoking listener:', err);
      }
    });
  }
}

// Export a default shared instance for seamless application-wide singleton access
export const layerStore = new LayerStore();
