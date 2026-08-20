import { ILayer } from '../LayerTypes';
import { LayerModel } from '../LayerModel';

export class LayerOperationsUseCase {
  static addLayer(layers: ILayer[], newLayer: ILayer): ILayer[] {
    return [...layers, newLayer];
  }

  static updateLayer(layers: ILayer[], layerId: string, updates: Partial<ILayer>): ILayer[] {
    return layers.map(layer => {
      if (layer.id === layerId) {
        return new LayerModel({ ...layer, ...updates });
      }
      return layer;
    });
  }

  static removeLayer(layers: ILayer[], layerId: string): ILayer[] {
    return layers.filter(layer => layer.id !== layerId);
  }
}
