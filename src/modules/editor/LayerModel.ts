import { ILayer, LayerType } from './LayerTypes';

export class LayerModel implements ILayer {
  public id: string;
  public type: LayerType | string;
  public name: string;
  public visible: boolean;
  public locked: boolean;
  public opacity: number;
  public rotation: number;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public zIndex: number;
  public parentId: string | null;
  public children: ILayer[];
  public metadata?: Record<string, any>;

  constructor(data: Partial<ILayer>) {
    this.id = data.id || `layer_${Math.random().toString(36).substr(2, 9)}`;
    this.type = data.type || 'decor';
    this.name = data.name || `Layer - ${this.type}`;
    this.visible = data.visible !== undefined ? data.visible : true;
    this.locked = data.locked !== undefined ? data.locked : false;
    this.opacity = data.opacity !== undefined ? data.opacity : 1.0;
    this.rotation = data.rotation !== undefined ? data.rotation : 0;
    this.x = data.x !== undefined ? data.x : 0;
    this.y = data.y !== undefined ? data.y : 0;
    this.width = data.width !== undefined ? data.width : 100;
    this.height = data.height !== undefined ? data.height : 100;
    this.zIndex = data.zIndex !== undefined ? data.zIndex : 0;
    this.parentId = data.parentId || null;
    this.children = data.children ? data.children.map(c => new LayerModel(c)) : [];
    this.metadata = data.metadata ? { ...data.metadata } : {};
  }

  /**
   * Performs a complete deep duplication of the layer, generating new IDs for the clone and all descendants.
   * Completely clones Position, Rotation, Opacity, Effect, Text, Shadow, Animation, Asset, and custom properties
   * with zero old references shared.
   */
  public static duplicate(layer: ILayer, parentId: string | null = null): LayerModel {
    const newId = `layer_${Math.random().toString(36).substr(2, 9)}`;
    
    // Deep copy the metadata and custom properties using JSON parsing/serialization to decouple references completely
    const clonedMetadata = layer.metadata ? JSON.parse(JSON.stringify(layer.metadata)) : undefined;
    
    // Decouple all child structures recursively
    const clonedChildren = (layer.children || []).map(child => LayerModel.duplicate(child, newId));

    // Ensure all custom fields, position, rotation, opacity, effect, text, shadow, animation, asset are perfectly copied
    return new LayerModel({
      ...layer,
      id: newId,
      name: `${layer.name} (Copy)`,
      parentId,
      children: clonedChildren,
      x: layer.x + 20, // offset slightly to distinguish it visually
      y: layer.y + 20,
      rotation: layer.rotation,
      opacity: layer.opacity,
      width: layer.width,
      height: layer.height,
      metadata: clonedMetadata
    });
  }

  /**
   * Safely updates layer fields and returns a new LayerModel instance.
   */
  public update(fields: Partial<ILayer>): LayerModel {
    return new LayerModel({
      ...this,
      ...fields,
      // Ensure children keep their classes or structure
      children: fields.children !== undefined ? fields.children : this.children
    });
  }

  /**
   * Export to raw JSON structure
   */
  public toJSON(): ILayer {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      visible: this.visible,
      locked: this.locked,
      opacity: this.opacity,
      rotation: this.rotation,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      zIndex: this.zIndex,
      parentId: this.parentId,
      children: this.children.map(child => (child instanceof LayerModel ? child.toJSON() : child)),
      metadata: this.metadata
    };
  }
}
