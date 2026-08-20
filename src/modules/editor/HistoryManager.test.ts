import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangePropertyCommand, BatchChangePropertyCommand } from './HistoryManager';
import { LayerStore } from './LayerStore';
import { ILayer } from './LayerTypes';

describe('HistoryManager / ChangePropertyCommand Property Checking', () => {
  let store: LayerStore;
  let testLayer: ILayer;

  beforeEach(() => {
    testLayer = {
      id: 'layer-1',
      type: 'text',
      name: 'My Text',
      visible: true,
      locked: false,
      opacity: 1,
      rotation: 0,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      zIndex: 1,
      parentId: null,
      children: [],
      metadata: { color: '#ff0000', fontFamily: 'serif' }
    };
    store = new LayerStore([testLayer]);
  });

  it('should successfully read a valid Layer property', () => {
    const cmd = new ChangePropertyCommand('Rotate', 'layer-1', 'rotation', 90, store);
    cmd.execute();
    expect(store.findLayerById('layer-1')?.rotation).toBe(90);
    cmd.undo();
    expect(store.findLayerById('layer-1')?.rotation).toBe(0);
  });

  it('should successfully read nested metadata property', () => {
    const cmd = new ChangePropertyCommand('Change Color', 'layer-1', 'metadata.color', '#00ff00', store);
    cmd.execute();
    expect(store.findLayerById('layer-1')?.metadata?.color).toBe('#00ff00');
    cmd.undo();
    expect(store.findLayerById('layer-1')?.metadata?.color).toBe('#ff0000');
  });

  it('should log a warning and handle invalid property gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const cmd = new ChangePropertyCommand('Invalid', 'layer-1', 'notAProperty', 'someValue', store);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[HistoryManager] Invalid propertyName: notAProperty')
    );
    
    expect(() => cmd.execute()).not.toThrow();
    expect(() => cmd.undo()).not.toThrow();
    
    consoleWarnSpy.mockRestore();
  });
});
