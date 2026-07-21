export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface ProjectTheme {
  primaryColor?: string;
  fontFamily?: string;
}

export interface ProjectMetadata {
  width?: number;
  height?: number;
  author?: string;
  [key: string]: any;
}

export interface Project {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  thumbnail: string;
  cover: string;
  status: ProjectStatus;
  version: number;
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
  tags: string[];
  theme: ProjectTheme;
  metadata: ProjectMetadata;
}
