import { ILayer, LayerOperationResult } from './LayerTypes';
import { layerStore, LayerStore } from './LayerStore';
import { layerManager, LayerManager } from './LayerManager';
import { LayerModel } from './LayerModel';

export class LayerService {
  private store: LayerStore;
  private manager: LayerManager;

  constructor(store: LayerStore = layerStore, manager: LayerManager = layerManager) {
    this.store = store;
    this.manager = manager;
  }

  /**
   * Sync and import legacy/flat arrays of canvas items into the structured LayerStore
   */
  public importFromLegacyCanvasItems(items: any[]): void {
    const layers: ILayer[] = items.map((item, index) => {
      return new LayerModel({
        id: item.id || `decor_${index}_${Math.random().toString(36).substr(2, 5)}`,
        type: item.type || 'decor',
        name: item.name || item.label || `Layer ${index + 1}`,
        visible: item.visible !== undefined ? item.visible : true,
        locked: item.locked !== undefined ? item.locked : false,
        opacity: item.opacity !== undefined ? item.opacity : (item.scale !== undefined ? item.scale : 1.0),
        rotation: item.rotation !== undefined ? item.rotation : 0,
        x: item.x !== undefined ? item.x : 0,
        y: item.y !== undefined ? item.y : 0,
        width: item.width || 100,
        height: item.height || 100,
        zIndex: item.zIndex !== undefined ? item.zIndex : index,
        parentId: item.parentId || null,
        children: [],
        metadata: {
          ...item,
          legacy: true
        }
      });
    });

    this.store.setLayers(layers);
  }

  /**
   * Export structured LayerStore nodes back into standard/legacy canvas items flat list
   */
  public exportToLegacyCanvasItems(): any[] {
    const flatLayers = this.store.getFlatLayers();
    return flatLayers.map(l => {
      return {
        ...(l.metadata || {}),
        id: l.id,
        type: l.type,
        label: l.name,
        visible: l.visible,
        locked: l.locked,
        scale: l.opacity, // sync opacity back if legacy scale was stored there
        rotation: l.rotation,
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
        zIndex: l.zIndex,
        parentId: l.parentId
      };
    });
  }

  /**
   * Delegates and executes LayerManager/LayerStore commands safely
   */
  public addLayer(layer: Partial<ILayer>): LayerOperationResult {
    return this.manager.addLayer(layer);
  }

  public removeLayer(id: string): LayerOperationResult {
    return this.manager.removeLayer(id);
  }

  public renameLayer(id: string, newName: string): LayerOperationResult {
    return this.manager.renameLayer(id, newName);
  }

  public duplicateLayer(id: string): LayerOperationResult {
    return this.manager.duplicateLayer(id);
  }

  public moveLayer(id: string, dx: number, dy: number): LayerOperationResult {
    return this.manager.moveLayer(id, dx, dy);
  }

  public bringToFront(id: string): LayerOperationResult {
    return this.manager.bringToFront(id);
  }

  public sendToBack(id: string): LayerOperationResult {
    return this.manager.sendToBack(id);
  }

  public toggleVisibility(id: string): LayerOperationResult {
    return this.manager.toggleVisibility(id);
  }

  public lockLayer(id: string): LayerOperationResult {
    return this.manager.lockLayer(id);
  }

  public unlockLayer(id: string): LayerOperationResult {
    return this.manager.unlockLayer(id);
  }

  /**
   * Expose store subscriptions to allow component listening
   */
  public getStore(): LayerStore {
    return this.store;
  }
}

export const layerService = new LayerService();
