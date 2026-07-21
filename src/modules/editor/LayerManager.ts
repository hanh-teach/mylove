import { ILayer, LayerOperationResult } from './LayerTypes';
import { LayerModel } from './LayerModel';
import { LayerStore, layerStore } from './LayerStore';

export class LayerManager {
  private store: LayerStore;

  constructor(store: LayerStore = layerStore) {
    this.store = store;
  }

  /**
   * Add a new layer
   */
  public addLayer(layerData: Partial<ILayer>): LayerOperationResult {
    try {
      const model = new LayerModel(layerData);
      
      // Calculate next zIndex if not specified
      if (layerData.zIndex === undefined) {
        const flatLayers = this.store.getFlatLayers();
        const maxZ = flatLayers.reduce((max, l) => l.zIndex > max ? l.zIndex : max, 0);
        model.zIndex = maxZ + 1;
      }

      this.store.addLayer(model);
      return { success: true, affectedLayerId: model.id };
    } catch (err: any) {
      return { success: false, error: err.message || 'Unknown error adding layer' };
    }
  }

  /**
   * Remove an existing layer by ID
   */
  public removeLayer(id: string): LayerOperationResult {
    const success = this.store.removeLayer(id);
    if (success) {
      return { success: true, affectedLayerId: id };
    }
    return { success: false, error: `Layer with ID ${id} not found.` };
  }

  /**
   * Rename a layer
   */
  public renameLayer(id: string, newName: string): LayerOperationResult {
    if (!newName.trim()) {
      return { success: false, error: 'Name cannot be empty' };
    }
    const success = this.store.updateLayer(id, { name: newName.trim() });
    if (success) {
      return { success: true, affectedLayerId: id };
    }
    return { success: false, error: `Layer with ID ${id} not found.` };
  }

  /**
   * Deep duplicates a layer, offsets its position slightly, and appends it to the workspace
   */
  public duplicateLayer(id: string): LayerOperationResult {
    const source = this.store.findLayerById(id);
    if (!source) {
      return { success: false, error: `Source layer ${id} not found.` };
    }

    try {
      const clone = LayerModel.duplicate(source, source.parentId);
      this.store.addLayer(clone);
      return { success: true, affectedLayerId: clone.id };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error duplicating layer' };
    }
  }

  /**
   * Translate layer offset coordinates
   */
  public moveLayer(id: string, dx: number, dy: number): LayerOperationResult {
    const layer = this.store.findLayerById(id);
    if (!layer) {
      return { success: false, error: `Layer ${id} not found.` };
    }
    if (layer.locked) {
      return { success: false, error: `Layer ${id} is locked and cannot be moved.` };
    }

    const success = this.store.updateLayer(id, {
      x: layer.x + dx,
      y: layer.y + dy
    });

    return { success, affectedLayerId: id };
  }

  /**
   * Brings a layer to the absolute front (highest zIndex at its level)
   */
  public bringToFront(id: string): LayerOperationResult {
    const layer = this.store.findLayerById(id);
    if (!layer) {
      return { success: false, error: `Layer ${id} not found.` };
    }

    const flat = this.store.getFlatLayers();
    const siblingLayers = flat.filter(l => l.parentId === layer.parentId && l.id !== layer.id);
    const maxZ = siblingLayers.reduce((max, l) => l.zIndex > max ? l.zIndex : max, 0);

    const success = this.store.updateLayer(id, { zIndex: maxZ + 1 });
    return { success, affectedLayerId: id };
  }

  /**
   * Sends a layer to the absolute back (lowest zIndex at its level)
   */
  public sendToBack(id: string): LayerOperationResult {
    const layer = this.store.findLayerById(id);
    if (!layer) {
      return { success: false, error: `Layer ${id} not found.` };
    }

    const flat = this.store.getFlatLayers();
    const siblingLayers = flat.filter(l => l.parentId === layer.parentId && l.id !== layer.id);
    const minZ = siblingLayers.reduce((min, l) => l.zIndex < min ? l.zIndex : min, 0);

    const success = this.store.updateLayer(id, { zIndex: minZ - 1 });
    return { success, affectedLayerId: id };
  }

  /**
   * Toggles whether a layer is visible on screen
   */
  public toggleVisibility(id: string): LayerOperationResult {
    const layer = this.store.findLayerById(id);
    if (!layer) {
      return { success: false, error: `Layer ${id} not found.` };
    }

    const success = this.store.updateLayer(id, { visible: !layer.visible });
    return { success, affectedLayerId: id };
  }

  /**
   * Locks the layer to prevent accidental modification
   */
  public lockLayer(id: string): LayerOperationResult {
    const success = this.store.updateLayer(id, { locked: true });
    return { success, affectedLayerId: id };
  }

  /**
   * Unlocks the layer to restore editing capability
   */
  public unlockLayer(id: string): LayerOperationResult {
    const success = this.store.updateLayer(id, { locked: false });
    return { success, affectedLayerId: id };
  }

  /**
   * Combine multiple layers into a parent Group Layer
   */
  public groupLayers(childIds: string[], groupName = 'Group'): LayerOperationResult {
    if (!childIds || childIds.length < 2) {
      return { success: false, error: 'Select at least 2 layers to group' };
    }

    // Filter valid layers that are not locked
    const validLayers = childIds
      .map(id => this.store.findLayerById(id))
      .filter((l): l is ILayer => l !== null && !l.locked);

    if (validLayers.length < 2) {
      return { success: false, error: 'Not enough selectable layers' };
    }

    // Determine the bounding box using absolute positions
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    validLayers.forEach(l => {
      const pos = this.store.getAbsolutePosition(l.id);
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + l.width);
      maxY = Math.max(maxY, pos.y + l.height);
    });

    const width = maxX - minX > 0 ? maxX - minX : 100;
    const height = maxY - minY > 0 ? maxY - minY : 100;

    // Create the group layer
    const groupLayer = new LayerModel({
      type: 'group',
      name: groupName,
      x: minX,
      y: minY,
      width,
      height,
      children: []
    });

    // Add to store (this will place it at root level)
    this.store.addLayer(groupLayer);

    // Update parentId of child layers and adjust their coordinates to be relative to the new group origin
    validLayers.forEach(child => {
      const childAbs = this.store.getAbsolutePosition(child.id);
      this.store.updateLayer(child.id, {
        parentId: groupLayer.id,
        x: childAbs.x - minX,
        y: childAbs.y - minY
      });
    });

    return { success: true, affectedLayerId: groupLayer.id };
  }

  /**
   * Dissolves a Group Layer and returns children to parent space
   */
  public ungroupLayers(groupId: string): LayerOperationResult {
    const group = this.store.findLayerById(groupId);
    if (!group || group.type !== 'group') {
      return { success: false, error: 'Target is not a group layer' };
    }
    if (group.locked) {
      return { success: false, error: 'Group is locked' };
    }

    // Find all children of this group
    const flat = this.store.getFlatLayers();
    const children = flat.filter(l => l.parentId === groupId);

    // Restore children coordinates to group's parent relative space or absolute space
    children.forEach(child => {
      const childAbs = this.store.getAbsolutePosition(child.id);
      
      let newParentId = group.parentId;
      let newX = childAbs.x;
      let newY = childAbs.y;

      if (newParentId) {
        const grandParentPos = this.store.getAbsolutePosition(newParentId);
        newX = childAbs.x - grandParentPos.x;
        newY = childAbs.y - grandParentPos.y;
      }

      this.store.updateLayer(child.id, {
        parentId: newParentId,
        x: newX,
        y: newY
      });
    });

    // Delete the group container layer
    this.store.removeLayer(groupId);

    return { success: true, affectedLayerId: groupId };
  }

  /**
   * Recursively scales a group and all of its nested children proportionally
   */
  public resizeGroup(groupId: string, newWidth: number, newHeight: number): LayerOperationResult {
    const group = this.store.findLayerById(groupId);
    if (!group || group.type !== 'group') {
      return { success: false, error: 'Target is not a group layer' };
    }
    if (group.locked) {
      return { success: false, error: 'Group is locked and cannot be resized' };
    }

    const sx = group.width > 0 ? newWidth / group.width : 1;
    const sy = group.height > 0 ? newHeight / group.height : 1;

    const scaleChild = (child: ILayer) => {
      const updatedFields: Partial<ILayer> = {
        x: child.x * sx,
        y: child.y * sy,
        width: child.width * sx,
        height: child.height * sy
      };
      this.store.updateLayer(child.id, updatedFields);

      if (child.children && child.children.length > 0) {
        child.children.forEach(nestedChild => scaleChild(nestedChild));
      }
    };

    group.children.forEach(child => scaleChild(child));
    this.store.updateLayer(groupId, { width: newWidth, height: newHeight });

    return { success: true, affectedLayerId: groupId };
  }

  /**
   * Recursively rotates a group and calculates rotated relative pivots for children
   */
  public rotateGroup(groupId: string, deltaAngle: number): LayerOperationResult {
    const group = this.store.findLayerById(groupId);
    if (!group || group.type !== 'group') {
      return { success: false, error: 'Target is not a group layer' };
    }
    if (group.locked) {
      return { success: false, error: 'Group is locked and cannot be rotated' };
    }

    const rad = (deltaAngle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const cx = group.width / 2;
    const cy = group.height / 2;

    const rotateChild = (child: ILayer) => {
      const childCx = child.x + child.width / 2;
      const childCy = child.y + child.height / 2;

      const dx = childCx - cx;
      const dy = childCy - cy;

      const rotatedDx = dx * cos - dy * sin;
      const rotatedDy = dx * sin + dy * cos;

      const newChildCx = cx + rotatedDx;
      const newChildCy = cy + rotatedDy;

      const newX = newChildCx - child.width / 2;
      const newY = newChildCy - child.height / 2;
      const newRotation = (child.rotation + deltaAngle) % 360;

      this.store.updateLayer(child.id, {
        x: newX,
        y: newY,
        rotation: newRotation
      });

      if (child.children && child.children.length > 0) {
        child.children.forEach(nestedChild => {
          this.store.updateLayer(nestedChild.id, {
            rotation: (nestedChild.rotation + deltaAngle) % 360
          });
        });
      }
    };

    group.children.forEach(child => rotateChild(child));
    this.store.updateLayer(groupId, { rotation: (group.rotation + deltaAngle) % 360 });

    return { success: true, affectedLayerId: groupId };
  }

  /**
   * Set visibility recursively for a layer and all of its descendants
   */
  public setVisibilityRecursive(id: string, visible: boolean): LayerOperationResult {
    const layer = this.store.findLayerById(id);
    if (!layer) {
      return { success: false, error: `Layer ${id} not found.` };
    }

    const traverse = (node: ILayer) => {
      this.store.updateLayer(node.id, { visible });
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(layer);
    return { success: true, affectedLayerId: id };
  }

  /**
   * Set lock recursively for a layer and all of its descendants
   */
  public setLockRecursive(id: string, locked: boolean): LayerOperationResult {
    const layer = this.store.findLayerById(id);
    if (!layer) {
      return { success: false, error: `Layer ${id} not found.` };
    }

    const traverse = (node: ILayer) => {
      this.store.updateLayer(node.id, { locked });
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(layer);
    return { success: true, affectedLayerId: id };
  }
}

export const layerManager = new LayerManager();
