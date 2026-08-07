import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { Workspace } from './Workspace';
import { UserProfile, workspaceStore } from './WorkspaceStore';

export interface WorkspaceZustandState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  currentUser: UserProfile;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (id: string) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  addWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (id: string) => void;
}

export const useWorkspaceZustandStore = create<WorkspaceZustandState>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set) => {
          // Sync on initialize
          workspaceStore.subscribe(() => {
            set({
              workspaces: workspaceStore.getWorkspaces(),
              activeWorkspaceId: workspaceStore.getActiveWorkspace()?.id || null,
              currentUser: workspaceStore.getCurrentUser(),
            });
          });

          return {
            workspaces: workspaceStore.getWorkspaces(),
            activeWorkspaceId: workspaceStore.getActiveWorkspace()?.id || null,
            currentUser: workspaceStore.getCurrentUser(),

            setWorkspaces: (workspaces: Workspace[]) => {
              workspaceStore.setWorkspaces(workspaces);
            },
            setActiveWorkspace: (id: string) => {
              workspaceStore.setActiveWorkspace(id);
            },
            updateCurrentUser: (updates: Partial<UserProfile>) => {
              workspaceStore.updateCurrentUser(updates);
            },
            addWorkspace: (workspace: Workspace) => {
              workspaceStore.addWorkspace(workspace);
            },
            removeWorkspace: (id: string) => {
              workspaceStore.removeWorkspace(id);
            },
          };
        },
        {
          name: 'lovenote_workspace_ui_v1',
          // Persist user preference (activeWorkspaceId). Workspaces & currentUser persisted in workspaceStore adapter.
          partialize: (state) => ({
            activeWorkspaceId: state.activeWorkspaceId,
          }),
        }
      ),
      { name: 'WorkspaceStore' }
    )
  )
);

// Atomic Selectors
export const selectWorkspaces = (state: WorkspaceZustandState) => state.workspaces;
export const selectActiveWorkspaceId = (state: WorkspaceZustandState) => state.activeWorkspaceId;
export const selectCurrentUser = (state: WorkspaceZustandState) => state.currentUser;

// Custom Selector Hooks
export const useWorkspaces = () => useWorkspaceZustandStore(selectWorkspaces);
export const useActiveWorkspaceId = () => useWorkspaceZustandStore(selectActiveWorkspaceId);
export const useCurrentUser = () => useWorkspaceZustandStore(selectCurrentUser);
