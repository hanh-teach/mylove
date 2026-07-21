import { ICommand } from './Command';
import { historyStore, HistoryStore } from './HistoryStore';
import { layerStore, LayerStore } from './LayerStore';
import { ILayer } from './LayerTypes';
import { LayerModel } from './LayerModel';

/**
 * 1. ADD / CREATE LAYER COMMAND
 */
export class AddLayerCommand implements ICommand {
  readonly name = 'Add Layer';
  private addedLayer: ILayer | null = null;

  constructor(
    private layerData: Partial<ILayer>,
    private store: LayerStore = layerStore
  ) {}

  execute(): void {
    if (!this.addedLayer) {
      this.addedLayer = new LayerModel(this.layerData);
    }
    this.store.addLayer(this.addedLayer);
  }

  undo(): void {
    if (this.addedLayer) {
      this.store.removeLayer(this.addedLayer.id);
    }
  }
}

/**
 * 2. DELETE LAYER COMMAND
 */
export class DeleteLayerCommand implements ICommand {
  readonly name = 'Delete Layer';
  private deletedLayerBackup: ILayer | null = null;

  constructor(
    private layerId: string,
    private store: LayerStore = layerStore
  ) {
    const original = this.store.findLayerById(layerId);
    if (original) {
      this.deletedLayerBackup = { ...original };
    }
  }

  execute(): void {
    if (this.deletedLayerBackup) {
      this.store.removeLayer(this.deletedLayerBackup.id);
    }
  }

  undo(): void {
    if (this.deletedLayerBackup) {
      this.store.addLayer(this.deletedLayerBackup);
    }
  }
}

/**
 * 3. PROPERTY CHANGE COMMAND (Handles Move, Resize, Rotate, Change Color, Change Font, Edit Text)
 * Stores only minimal properties to protect memory
 */
export class ChangePropertyCommand implements ICommand {
  private prevValue: any;

  constructor(
    readonly name: string,
    private layerId: string,
    private propertyName: string,
    private nextValue: any,
    private store: LayerStore = layerStore
  ) {
    const layer = this.store.findLayerById(this.layerId);
    if (layer) {
      this.prevValue = (layer as any)[this.propertyName];
      // Support nested metadata changes if property starts with metadata.
      if (this.propertyName.startsWith('metadata.')) {
        const key = this.propertyName.split('.')[1];
        this.prevValue = layer.metadata ? layer.metadata[key] : undefined;
      }
    }
  }

  execute(): void {
    this.applyValue(this.nextValue);
  }

  undo(): void {
    this.applyValue(this.prevValue);
  }

  private applyValue(val: any): void {
    if (this.propertyName.startsWith('metadata.')) {
      const key = this.propertyName.split('.')[1];
      const layer = this.store.findLayerById(this.layerId);
      if (layer) {
        const metadata = { ...(layer.metadata || {}), [key]: val };
        this.store.updateLayer(this.layerId, { metadata });
      }
    } else {
      this.store.updateLayer(this.layerId, { [this.propertyName]: val });
    }
  }
}

/**
 * 4. MULTI-PROPERTY BATCH COMMAND (e.g. Move with dynamic x and y offsets)
 */
export class BatchChangePropertyCommand implements ICommand {
  private prevValues: Record<string, any> = {};

  constructor(
    readonly name: string,
    private layerId: string,
    private updates: Record<string, any>,
    private store: LayerStore = layerStore
  ) {
    const layer = this.store.findLayerById(this.layerId);
    if (layer) {
      Object.keys(updates).forEach(key => {
        this.prevValues[key] = (layer as any)[key];
      });
    }
  }

  execute(): void {
    this.store.updateLayer(this.layerId, this.updates);
  }

  undo(): void {
    this.store.updateLayer(this.layerId, this.prevValues);
  }
}

/**
 * 5. DUPLICATE LAYER COMMAND
 */
export class DuplicateLayerCommand implements ICommand {
  readonly name = 'Duplicate Layer';
  private duplicatedModel: LayerModel | null = null;

  constructor(
    private sourceId: string,
    private store: LayerStore = layerStore
  ) {}

  execute(): void {
    if (!this.duplicatedModel) {
      const source = this.store.findLayerById(this.sourceId);
      if (source) {
        this.duplicatedModel = LayerModel.duplicate(source, source.parentId);
      }
    }
    if (this.duplicatedModel) {
      this.store.addLayer(this.duplicatedModel);
    }
  }

  undo(): void {
    if (this.duplicatedModel) {
      this.store.removeLayer(this.duplicatedModel.id);
    }
  }
}

/**
 * 6. GROUP LAYERS COMMAND
 */
export class GroupLayersCommand implements ICommand {
  readonly name = 'Group Layers';
  private groupLayer: ILayer | null = null;
  private childBackups: { id: string; prevParentId: string | null; prevZIndex: number }[] = [];

  constructor(
    private childIds: string[],
    private store: LayerStore = layerStore
  ) {
    this.childIds.forEach(id => {
      const child = this.store.findLayerById(id);
      if (child) {
        this.childBackups.push({
          id: child.id,
          prevParentId: child.parentId,
          prevZIndex: child.zIndex
        });
      }
    });
  }

  execute(): void {
    if (this.childBackups.length === 0) return;

    if (!this.groupLayer) {
      // Find mid-position to place the group container
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      this.childIds.forEach(id => {
        const layer = this.store.findLayerById(id);
        if (layer) {
          minX = Math.min(minX, layer.x);
          minY = Math.min(minY, layer.y);
          maxX = Math.max(maxX, layer.x + (layer.width || 0));
          maxY = Math.max(maxY, layer.y + (layer.height || 0));
        }
      });

      const width = maxX - minX > 0 ? maxX - minX : 100;
      const height = maxY - minY > 0 ? maxY - minY : 100;

      this.groupLayer = new LayerModel({
        type: 'group',
        name: 'Group',
        x: minX,
        y: minY,
        width,
        height,
        children: []
      });
    }

    // Add group container layer
    this.store.addLayer(this.groupLayer);

    // Reparent selected children under the group container and normalize relative positions
    this.childIds.forEach(id => {
      const child = this.store.findLayerById(id);
      if (child && this.groupLayer) {
        this.store.updateLayer(id, {
          parentId: this.groupLayer.id,
          // Relative coordinates
          x: child.x - this.groupLayer.x,
          y: child.y - this.groupLayer.y
        });
      }
    });
  }

  undo(): void {
    if (!this.groupLayer) return;

    // Restore children previous states
    this.childBackups.forEach(backup => {
      const child = this.store.findLayerById(backup.id);
      if (child && this.groupLayer) {
        this.store.updateLayer(backup.id, {
          parentId: backup.prevParentId,
          x: child.x + this.groupLayer.x,
          y: child.y + this.groupLayer.y,
          zIndex: backup.prevZIndex
        });
      }
    });

    // Remove group container
    this.store.removeLayer(this.groupLayer.id);
  }
}

/**
 * 7. UNGROUP LAYERS COMMAND
 */
export class UngroupLayersCommand implements ICommand {
  readonly name = 'Ungroup Layers';
  private groupBackup: ILayer | null = null;
  private childrenBackups: { id: string; relX: number; relY: number; prevZIndex: number }[] = [];

  constructor(
    private groupId: string,
    private store: LayerStore = layerStore
  ) {
    const group = this.store.findLayerById(groupId);
    if (group && group.type === 'group') {
      this.groupBackup = { ...group };
      const flat = this.store.getFlatLayers();
      const groupChildren = flat.filter(l => l.parentId === groupId);
      groupChildren.forEach(child => {
        this.childrenBackups.push({
          id: child.id,
          relX: child.x,
          relY: child.y,
          prevZIndex: child.zIndex
        });
      });
    }
  }

  execute(): void {
    if (!this.groupBackup) return;

    // Move child layers back to root space
    this.childrenBackups.forEach(backup => {
      const child = this.store.findLayerById(backup.id);
      if (child && this.groupBackup) {
        this.store.updateLayer(backup.id, {
          parentId: this.groupBackup.parentId,
          x: child.x + this.groupBackup.x,
          y: child.y + this.groupBackup.y
        });
      }
    });

    // Delete group container layer
    this.store.removeLayer(this.groupBackup.id);
  }

  undo(): void {
    if (!this.groupBackup) return;

    // Recreate group container layer
    this.store.addLayer(this.groupBackup);

    // Reparent child layers
    this.childrenBackups.forEach(backup => {
      this.store.updateLayer(backup.id, {
        parentId: this.groupBackup!.id,
        x: backup.relX,
        y: backup.relY,
        zIndex: backup.prevZIndex
      });
    });
  }
}

/**
 * CORE ORCHESTRATION LAYER FOR RUNNING COMMANDS & UNDO / REDO
 */
export class HistoryManager {
  private hStore: HistoryStore;
  private lStore: LayerStore;

  constructor(hStore: HistoryStore = historyStore, lStore: LayerStore = layerStore) {
    this.hStore = hStore;
    this.lStore = lStore;
  }

  /**
   * Safe execution wrapper for registering commands to the undo list
   */
  public execute(command: ICommand): void {
    try {
      command.execute();
      this.hStore.push(command);
    } catch (err) {
      console.error(`[HistoryManager] Failed to execute command: ${command.name}`, err);
    }
  }

  /**
   * Undo the latest transaction
   */
  public undo(): void {
    const cmd = this.hStore.popUndo();
    if (cmd) {
      try {
        cmd.undo();
      } catch (err) {
        console.error(`[HistoryManager] Failed to undo command: ${cmd.name}`, err);
      }
    }
  }

  /**
   * Redo the latest undone transaction
   */
  public redo(): void {
    const cmd = this.hStore.popRedo();
    if (cmd) {
      try {
        cmd.execute();
      } catch (err) {
        console.error(`[HistoryManager] Failed to redo command: ${cmd.name}`, err);
      }
    }
  }

  /**
   * Clean history structures
   */
  public clear(): void {
    this.hStore.clear();
  }

  // --- Convenience Helpers ---

  public executeAddLayer(layerData: Partial<ILayer>): void {
    this.execute(new AddLayerCommand(layerData, this.lStore));
  }

  public executeDeleteLayer(id: string): void {
    this.execute(new DeleteLayerCommand(id, this.lStore));
  }

  public executeMoveLayer(id: string, newX: number, newY: number): void {
    this.execute(new BatchChangePropertyCommand('Move Layer', id, { x: newX, y: newY }, this.lStore));
  }

  public executeResizeLayer(id: string, newW: number, newH: number): void {
    this.execute(new BatchChangePropertyCommand('Resize Layer', id, { width: newW, height: newH }, this.lStore));
  }

  public executeRotateLayer(id: string, newRotation: number): void {
    this.execute(new ChangePropertyCommand('Rotate Layer', id, 'rotation', newRotation, this.lStore));
  }

  public executeChangeColor(id: string, newColor: string): void {
    this.execute(new ChangePropertyCommand('Change Color', id, 'metadata.color', newColor, this.lStore));
  }

  public executeChangeFont(id: string, newFont: string): void {
    this.execute(new ChangePropertyCommand('Change Font', id, 'metadata.fontFamily', newFont, this.lStore));
  }

  public executeEditText(id: string, newText: string): void {
    this.execute(new ChangePropertyCommand('Edit Text', id, 'name', newText, this.lStore));
  }

  public executeDuplicateLayer(id: string): void {
    this.execute(new DuplicateLayerCommand(id, this.lStore));
  }

  public executeGroupLayers(ids: string[]): void {
    this.execute(new GroupLayersCommand(ids, this.lStore));
  }

  public executeUngroupLayers(groupId: string): void {
    this.execute(new UngroupLayersCommand(groupId, this.lStore));
  }
}

export const historyManager = new HistoryManager();
