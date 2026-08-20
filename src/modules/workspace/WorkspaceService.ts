import { Workspace } from './Workspace';
import { workspaceStore } from './WorkspaceStore';

export class WorkspaceService {
  
  // Simulate fetching from an API or local storage
  public async fetchUserWorkspaces(userId: string): Promise<Workspace[]> {
    // Simulated API call: GET /api/users/${userId}/workspaces
    
    // Mock data based on requirements
    const mockWorkspaces: Workspace[] = [
      {
        id: 'ws-personal',
        name: 'Personal',
        description: 'My personal projects',
        thumbnail: '',
        createdAt: Date.now() - 100000,
        updatedAt: Date.now(),
        owner: userId,
        settings: { isPublic: false, allowCollaboration: false, maxProjects: 10 },
        theme: { primaryColor: '#3B82F6', fontFamily: 'Inter', mode: 'light' }
      },
      {
        id: 'ws-wedding',
        name: 'Wedding',
        description: 'Wedding planning and design',
        thumbnail: '',
        createdAt: Date.now() - 50000,
        updatedAt: Date.now(),
        owner: userId,
        settings: { isPublic: true, allowCollaboration: true, maxProjects: 5 },
        theme: { primaryColor: '#EC4899', fontFamily: 'Playfair Display', mode: 'light' }
      },
      {
        id: 'ws-birthday',
        name: 'Birthday',
        description: 'Birthday cards and decorations',
        thumbnail: '',
        createdAt: Date.now() - 40000,
        updatedAt: Date.now(),
        owner: userId,
        settings: { isPublic: true, allowCollaboration: true, maxProjects: 5 },
        theme: { primaryColor: '#F59E0B', fontFamily: 'Comic Sans', mode: 'light' }
      },
      {
        id: 'ws-valentine',
        name: 'Valentine',
        description: 'Romantic and lovely designs',
        thumbnail: '',
        createdAt: Date.now() - 30000,
        updatedAt: Date.now(),
        owner: userId,
        settings: { isPublic: false, allowCollaboration: false, maxProjects: 5 },
        theme: { primaryColor: '#E11D48', fontFamily: 'Dancing Script', mode: 'light' }
      },
      {
        id: 'ws-business',
        name: 'Business',
        description: 'Professional and business related',
        thumbnail: '',
        createdAt: Date.now() - 20000,
        updatedAt: Date.now(),
        owner: userId,
        settings: { isPublic: false, allowCollaboration: true, maxProjects: 50 },
        theme: { primaryColor: '#0F172A', fontFamily: 'Inter', mode: 'dark' }
      }
    ];

    workspaceStore.setWorkspaces(mockWorkspaces);
    if (mockWorkspaces.length > 0) {
      workspaceStore.setActiveWorkspace(mockWorkspaces[0].id);
    }
    
    return mockWorkspaces;
  }

  public async createWorkspace(data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> {
    const newWorkspace: Workspace = {
      ...data,
      id: `ws-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    workspaceStore.addWorkspace(newWorkspace);
    return newWorkspace;
  }

  public async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<void> {
    workspaceStore.updateWorkspace(id, updates);
  }

  public async deleteWorkspace(id: string): Promise<void> {
    workspaceStore.removeWorkspace(id);
  }
}

export const workspaceService = new WorkspaceService();
