export interface WorkspaceSettings {
  isPublic: boolean;
  allowCollaboration: boolean;
  maxProjects: number;
}

export interface WorkspaceTheme {
  primaryColor: string;
  fontFamily: string;
  mode: 'light' | 'dark' | 'system';
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  createdAt: number;
  updatedAt: number;
  owner: string; // User ID
  settings: WorkspaceSettings;
  theme: WorkspaceTheme;
}
