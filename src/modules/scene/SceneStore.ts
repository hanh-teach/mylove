import { Scene } from './SceneModel';

export class SceneStore {
  private scenes: Map<string, Scene> = new Map();
  private listeners: Set<() => void> = new Set();
  private activeSceneId: string | null = null;

  public getScenes(projectId?: string): Scene[] {
    const all = Array.from(this.scenes.values());
    if (projectId) {
      return all.filter(s => s.projectId === projectId).sort((a, b) => a.order - b.order);
    }
    return all.sort((a, b) => a.order - b.order);
  }

  public getScene(id: string): Scene | undefined {
    return this.scenes.get(id);
  }

  public setScenes(scenes: Scene[]) {
    this.scenes.clear();
    scenes.forEach(s => this.scenes.set(s.id, s));
    this.notify();
  }

  public addScene(scene: Scene) {
    this.scenes.set(scene.id, scene);
    this.notify();
  }

  public updateScene(id: string, updates: Partial<Scene>) {
    const existing = this.scenes.get(id);
    if (existing) {
      this.scenes.set(id, { ...existing, ...updates });
      this.notify();
    }
  }

  public removeScene(id: string) {
    this.scenes.delete(id);
    if (this.activeSceneId === id) {
      this.activeSceneId = null;
    }
    this.notify();
  }

  public setActiveScene(id: string | null) {
    this.activeSceneId = id;
    this.notify();
  }

  public getActiveScene(): Scene | undefined {
    if (!this.activeSceneId) return undefined;
    return this.scenes.get(this.activeSceneId);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const sceneStore = new SceneStore();
