import { ProjectAsset, AssetCategory, AssetStatus } from './AssetModel';
import { assetStore } from './AssetStore';

export interface AssetFilterOptions {
  projectId?: string;
  category?: AssetCategory | 'all' | 'recent' | 'favorite' | 'trash';
  searchQuery?: string;
  sortBy?: 'date' | 'name' | 'size';
  sortDirection?: 'asc' | 'desc';
  status?: AssetStatus;
}

export class AssetManager {
  /**
   * Registers a new asset in the store for a given project.
   */
  public registerAsset(data: {
    projectId: string;
    title: string;
    url: string;
    type: AssetCategory;
    size?: number;
    width?: number;
    height?: number;
    duration?: number;
    tags?: string[];
    aiGenerated?: boolean;
    provider?: 'local' | 'system' | 'external' | 'gemini' | 'ai-studio';
    description?: string;
    mimeType?: string;
  }): ProjectAsset {
    return assetStore.addAsset({
      projectId: data.projectId,
      title: data.title,
      url: data.url,
      type: data.type,
      size: data.size || Math.floor(Math.random() * 2000000) + 500000,
      width: data.width,
      height: data.height,
      duration: data.duration,
      favorite: false,
      tags: data.tags || [],
      aiGenerated: data.aiGenerated ?? false,
      provider: data.provider || 'local',
      description: data.description,
      mimeType: data.mimeType || this.inferMimeType(data.url, data.type),
    });
  }

  /**
   * Helper to automatically register AI-generated assets into project library
   */
  public registerAIAsset(
    projectId: string,
    title: string,
    url: string,
    type: AssetCategory = 'ai',
    provider: 'gemini' | 'ai-studio' = 'gemini',
    description?: string
  ): ProjectAsset {
    return this.registerAsset({
      projectId,
      title: title || `AI Generated ${type.toUpperCase()} - ${new Date().toLocaleTimeString('vi-VN')}`,
      url,
      type: 'ai',
      aiGenerated: true,
      provider,
      description: description || 'Tài nguyên sinh ra bởi mô hình AI Studio',
      tags: ['ai-gen', provider, type],
    });
  }

  /**
   * Filter, search and sort assets
   */
  public queryAssets(options: AssetFilterOptions): ProjectAsset[] {
    let list = assetStore.getAssets(options.projectId);

    // Status filter (active vs trash)
    const targetStatus = options.status || (options.category === 'trash' ? 'trash' : 'active');
    list = list.filter(a => a.status === targetStatus);

    // Category filter
    if (options.category && options.category !== 'all' && options.category !== 'trash') {
      if (options.category === 'favorite') {
        list = list.filter(a => a.favorite);
      } else if (options.category === 'recent') {
        const threeDaysAgo = Date.now() - 86400000 * 3;
        list = list.filter(a => a.createdAt >= threeDaysAgo);
      } else if (options.category === 'ai') {
        list = list.filter(a => a.aiGenerated || a.type === 'ai');
      } else if (options.category === 'icon') {
        list = list.filter(a => a.type === 'icon' || a.type === 'sticker');
      } else {
        list = list.filter(a => a.type === options.category);
      }
    }

    // Search query
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    const direction = options.sortDirection === 'asc' ? 1 : -1;
    const sortBy = options.sortBy || 'date';

    list = [...list].sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title) * direction;
      }
      if (sortBy === 'size') {
        return (a.size - b.size) * direction;
      }
      // default 'date'
      return (a.createdAt - b.createdAt) * direction;
    });

    return list;
  }

  public toggleFavorite(id: string): void {
    assetStore.toggleFavorite(id);
  }

  public renameAsset(id: string, newTitle: string): void {
    if (!newTitle.trim()) return;
    assetStore.updateAsset(id, { title: newTitle.trim() });
  }

  public moveToTrash(id: string): void {
    assetStore.moveToTrash(id);
  }

  public restoreAsset(id: string): void {
    assetStore.restoreFromTrash(id);
  }

  public deletePermanently(id: string): void {
    assetStore.deletePermanently(id);
  }

  private inferMimeType(url: string, type: AssetCategory): string {
    if (url.startsWith('data:image')) return 'image/png';
    if (url.startsWith('data:audio')) return 'audio/mp3';
    if (url.startsWith('data:video')) return 'video/mp4';
    
    switch (type) {
      case 'image': return 'image/jpeg';
      case 'video': return 'video/mp4';
      case 'audio': return 'audio/mp3';
      case 'document': return 'application/pdf';
      case 'ai': return 'image/png';
      default: return 'application/octet-stream';
    }
  }
}

export const assetManager = new AssetManager();
