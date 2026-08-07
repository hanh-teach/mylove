import { Scene, SceneTransition } from './SceneModel';
import { sceneStore } from './SceneStore';

export class SceneManager {
  
  public addScene(projectId: string, data: Partial<Scene>): Scene {
    const scenes = sceneStore.getScenes(projectId);
    const order = scenes.length > 0 ? Math.max(...scenes.map(s => s.order)) + 1 : 0;

    const newScene: Scene = {
      id: `scene-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      projectId,
      name: data.name || `Scene ${order + 1}`,
      duration: data.duration ?? 5000,
      thumbnail: data.thumbnail || '',
      transition: data.transition || { type: 'none', duration: 0 },
      background: data.background || { type: 'solid', value: '#ffffff' },
      layers: data.layers || [],
      animation: data.animation || {},
      music: data.music,
      voice: data.voice,
      isHidden: data.isHidden || false,
      isLocked: data.isLocked || false,
      type: data.type || 'plain',
      order: data.order ?? order,
    };
    
    sceneStore.addScene(newScene);
    return newScene;
  }

  public deleteScene(id: string): void {
    const scene = sceneStore.getScene(id);
    if (!scene) return;
    const projectId = scene.projectId;
    
    sceneStore.removeScene(id);
    this.normalizeOrder(projectId);
  }

  public duplicateScene(id: string): Scene | null {
    const existing = sceneStore.getScene(id);
    if (!existing) return null;

    const scenes = sceneStore.getScenes(existing.projectId);
    
    const duplicated: Scene = {
      ...existing,
      id: `scene-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: `${existing.name} (Copy)`,
      order: existing.order + 1, 
      layers: [...existing.layers], 
    };
    
    scenes.forEach(s => {
      if (s.order > existing.order) {
        sceneStore.updateScene(s.id, { order: s.order + 1 });
      }
    });

    sceneStore.addScene(duplicated);
    return duplicated;
  }

  public moveScene(id: string, newOrder: number): void {
    const scene = sceneStore.getScene(id);
    if (!scene) return;
    
    const projectId = scene.projectId;
    const scenes = sceneStore.getScenes(projectId);
    const maxOrder = scenes.length - 1;
    
    const clampedNewOrder = Math.max(0, Math.min(newOrder, maxOrder));
    if (scene.order === clampedNewOrder) return;
    
    const oldOrder = scene.order;
    
    scenes.forEach(s => {
      if (s.id === id) {
        sceneStore.updateScene(s.id, { order: clampedNewOrder });
      } else {
        if (oldOrder < clampedNewOrder && s.order > oldOrder && s.order <= clampedNewOrder) {
          sceneStore.updateScene(s.id, { order: s.order - 1 });
        } else if (oldOrder > clampedNewOrder && s.order >= clampedNewOrder && s.order < oldOrder) {
          sceneStore.updateScene(s.id, { order: s.order + 1 });
        }
      }
    });
  }

  public reorderScenes(projectId: string, sceneIdsInOrder: string[]): void {
    sceneIdsInOrder.forEach((id, index) => {
      const scene = sceneStore.getScene(id);
      if (scene && scene.projectId === projectId) {
        sceneStore.updateScene(id, { order: index });
      }
    });
  }

  private normalizeOrder(projectId: string): void {
    const scenes = sceneStore.getScenes(projectId);
    scenes.forEach((s, index) => {
      if (s.order !== index) {
        sceneStore.updateScene(s.id, { order: index });
      }
    });
  }

  public toggleHide(id: string): void {
    const existing = sceneStore.getScene(id);
    if (existing) {
      sceneStore.updateScene(id, { isHidden: !existing.isHidden });
    }
  }

  public toggleLock(id: string): void {
    const existing = sceneStore.getScene(id);
    if (existing) {
      sceneStore.updateScene(id, { isLocked: !existing.isLocked });
    }
  }

  public updateTransition(id: string, transition: SceneTransition): void {
    sceneStore.updateScene(id, { transition });
  }
}

export const sceneManager = new SceneManager();
