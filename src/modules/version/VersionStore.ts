import { ProjectVersion } from './VersionModel';

export class VersionStore {
  private versions: Map<string, ProjectVersion> = new Map();
  private listeners: Set<() => void> = new Set();

  public getVersions(projectId: string): ProjectVersion[] {
    return Array.from(this.versions.values())
      .filter(v => v.projectId === projectId)
      .sort((a, b) => b.createdAt - a.createdAt); // Newest first
  }

  public getVersion(id: string): ProjectVersion | undefined {
    return this.versions.get(id);
  }

  public addVersion(version: ProjectVersion) {
    this.versions.set(version.id, version);
    this.notify();
  }

  public updateVersion(id: string, updates: Partial<ProjectVersion>) {
    const existing = this.versions.get(id);
    if (existing) {
      this.versions.set(id, { ...existing, ...updates });
      this.notify();
    }
  }

  public removeVersion(id: string) {
    this.versions.delete(id);
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const versionStore = new VersionStore();
