export type AssetCategory = 'image' | 'video' | 'audio' | 'document' | 'ai' | 'icon' | 'background' | 'template';

export type AssetStatus = 'active' | 'trash';

// Backward compatibility aliases
export type AssetType = AssetCategory | 'sticker' | 'font' | 'music' | 'voice' | 'animation';

export interface ProjectAsset {
  id: string;
  projectId: string;
  title: string;
  url: string;
  type: AssetType;
  size: number; // in bytes
  width?: number;
  height?: number;
  duration?: number; // in seconds
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
  tags: string[];
  aiGenerated: boolean;
  provider: 'local' | 'system' | 'external' | 'gemini' | 'ai-studio';
  version: number;
  status: AssetStatus;
  description?: string;
  mimeType?: string;
  hash?: string;
  usedBy?: string[];
  collections?: string[];
  projectsUsed?: string[];
  metadata?: Record<string, any>;
}

export interface Asset extends ProjectAsset {}
