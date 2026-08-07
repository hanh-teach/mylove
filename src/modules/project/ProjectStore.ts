import { Project } from './ProjectModel';

export class ProjectStore {
  private projects: Map<string, Project> = new Map();
  private listeners: Set<() => void> = new Set();
  private activeProjectId: string | null = null;

  public getProjects(workspaceId?: string): Project[] {
    const all = Array.from(this.projects.values());
    if (workspaceId) {
      return all.filter(p => p.workspaceId === workspaceId);
    }
    return all;
  }

  public getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  public setProjects(projects: Project[]) {
    this.projects.clear();
    projects.forEach(p => this.projects.set(p.id, p));
    this.notify();
  }

  public addProject(project: Project) {
    this.projects.set(project.id, project);
    this.notify();
  }

  public updateProject(id: string, updates: Partial<Project>) {
    const existing = this.projects.get(id);
    if (existing) {
      this.projects.set(id, { ...existing, ...updates, updatedAt: Date.now() });
      this.notify();
    }
  }

  public removeProject(id: string) {
    this.projects.delete(id);
    if (this.activeProjectId === id) {
      this.activeProjectId = null;
    }
    this.notify();
  }
  
  public setActiveProject(id: string | null) {
    this.activeProjectId = id;
    this.notify();
  }
  
  public getActiveProject(): Project | undefined {
    if (!this.activeProjectId) return undefined;
    return this.projects.get(this.activeProjectId);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const projectStore = new ProjectStore();
