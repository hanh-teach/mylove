import { Workspace } from './Workspace';
import { safeStorage } from '../../shared/utils/safeStorage';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
}

const getInitialUser = (): UserProfile => {
  const email = safeStorage.local.getItem('lovenote_user_email') || '';
  const name = safeStorage.local.getItem('lovenote_user_name') || 'Khách';
  const role = safeStorage.local.getItem('lovenote_user_role') || 'Tài khoản Người dùng';
  const avatarUrl = safeStorage.local.getItem('lovenote_user_avatar') || undefined;
  
  return {
    name,
    email,
    role,
    twoFactorEnabled: safeStorage.local.getItem('lovenote_user_2fa') === 'true',
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

    // Persist to safeStorage
    if (this.currentUser.email) safeStorage.local.setItem('lovenote_user_email', this.currentUser.email);
    else safeStorage.local.removeItem('lovenote_user_email');
    if (this.currentUser.name) safeStorage.local.setItem('lovenote_user_name', this.currentUser.name);
    if (this.currentUser.role) safeStorage.local.setItem('lovenote_user_role', this.currentUser.role);
    safeStorage.local.setItem('lovenote_user_2fa', String(this.currentUser.twoFactorEnabled));
    if (this.currentUser.avatarUrl) safeStorage.local.setItem('lovenote_user_avatar', this.currentUser.avatarUrl);
    else safeStorage.local.removeItem('lovenote_user_avatar');

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
