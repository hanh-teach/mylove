import { Workspace } from './Workspace';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
}

const getInitialUser = (): UserProfile => {
  const email = localStorage.getItem('lovenote_user_email') || '';
  const name = localStorage.getItem('lovenote_user_name') || 'Khách';
  const role = localStorage.getItem('lovenote_user_role') || 'Tài khoản Người dùng';
  const avatarUrl = localStorage.getItem('lovenote_user_avatar') || undefined;
  
  return {
    name,
    email,
    role,
    twoFactorEnabled: localStorage.getItem('lovenote_user_2fa') === 'true',
    avatarUrl
  };
};

export class WorkspaceStore {
  private workspaces: Map<string, Workspace> = new Map();
  private activeWorkspaceId: string | null = null;
  private currentUser: UserProfile = getInitialUser();
  private listeners: Set<() => void> = new Set();

  public getCurrentUser(): UserProfile {
    return { ...this.currentUser };
  }

  public updateCurrentUser(updates: Partial<UserProfile>) {
    this.currentUser = { 
      ...this.currentUser, 
      ...updates,
      role: updates.role ?? this.currentUser.role
    };

    // Persist to localStorage
    if (this.currentUser.email) localStorage.setItem('lovenote_user_email', this.currentUser.email);
    else localStorage.removeItem('lovenote_user_email');
    if (this.currentUser.name) localStorage.setItem('lovenote_user_name', this.currentUser.name);
    if (this.currentUser.role) localStorage.setItem('lovenote_user_role', this.currentUser.role);
    localStorage.setItem('lovenote_user_2fa', String(this.currentUser.twoFactorEnabled));
    if (this.currentUser.avatarUrl) localStorage.setItem('lovenote_user_avatar', this.currentUser.avatarUrl);
    else localStorage.removeItem('lovenote_user_avatar');

    this.notify();
  }

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
