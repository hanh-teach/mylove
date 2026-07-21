import { Workspace } from './Workspace';

export class WorkspaceStore {
  private workspaces: Map<string, Workspace> = new Map();
  private activeWorkspaceId: string | null = null;
  private listeners: Set<() => void> = new Set();

  public getWorkspaces(): Workspace[] {
    return Array.from(this.workspaces.values());
  }

  public getWorkspace(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }

  public getActiveWorkspace(): Workspace | undefined {
    if (!this.activeWorkspaceId) return undefined;
    return this.workspaces.get(this.activeWorkspaceId);
  }

  public setWorkspaces(workspaces: Workspace[]) {
    this.workspaces.clear();
    workspaces.forEach(w => this.workspaces.set(w.id, w));
    this.notify();
  }

  public addWorkspace(workspace: Workspace) {
    this.workspaces.set(workspace.id, workspace);
    this.notify();
  }

  public updateWorkspace(id: string, updates: Partial<Workspace>) {
    const existing = this.workspaces.get(id);
    if (existing) {
      this.workspaces.set(id, { ...existing, ...updates, updatedAt: Date.now() });
      this.notify();
    }
  }

  public removeWorkspace(id: string) {
    this.workspaces.delete(id);
    if (this.activeWorkspaceId === id) {
      this.activeWorkspaceId = null;
    }
    this.notify();
  }

  public setActiveWorkspace(id: string) {
    if (this.workspaces.has(id)) {
      this.activeWorkspaceId = id;
      this.notify();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const workspaceStore = new WorkspaceStore();
