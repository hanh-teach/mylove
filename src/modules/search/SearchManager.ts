import { projectStore } from '../project/ProjectStore';
import { sceneStore } from '../scene/SceneStore';
import { assetStore } from '../asset/AssetStore';
import { searchStore } from './SearchStore';

export interface SearchFilters {
  tags?: string[];
  types?: ('project' | 'scene' | 'asset' | 'font' | 'sticker')[];
  dateRange?: { start: number; end: number };
  favorite?: boolean;
}

export class SearchManager {
  private debounceTimer: any = null;

  /**
   * Realtime search with debouncing to prevent UI blocking
   */
  public search(query: string, filters: SearchFilters = {}, debounceMs: number = 150): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    searchStore.setSearching(true);

    this.debounceTimer = setTimeout(() => {
      this.executeSearch(query, filters);
    }, debounceMs);
  }

  private executeSearch(query: string, filters: SearchFilters) {
    const lowerQuery = query.toLowerCase().trim();
    
    let projects = projectStore.getProjects();
    let scenes = sceneStore.getScenes();
    let assets = assetStore.getAssets();

    // 1. Projects
    if (filters.types && !filters.types.includes('project')) {
      projects = [];
    } else {
      projects = projects.filter(p => {
        let match = true;
        if (lowerQuery) {
          match = p.title.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery);
        }
        if (match && filters.tags && filters.tags.length > 0) {
          match = filters.tags.some(tag => p.tags.includes(tag));
        }
        if (match && filters.favorite !== undefined) {
          match = p.favorite === filters.favorite;
        }
        if (match && filters.dateRange) {
          match = p.createdAt >= filters.dateRange.start && p.createdAt <= filters.dateRange.end;
        }
        return match;
      });
    }

    // 2. Scenes
    if (filters.types && !filters.types.includes('scene')) {
      scenes = [];
    } else {
      scenes = scenes.filter(s => {
        let match = true;
        if (lowerQuery) {
          match = s.name.toLowerCase().includes(lowerQuery);
        }
        return match;
      });
    }

    // 3. Assets
    const includesAsset = !filters.types || filters.types.includes('asset');
    const includesFont = !filters.types || filters.types.includes('font');
    const includesSticker = !filters.types || filters.types.includes('sticker');
    
    if (!includesAsset && !includesFont && !includesSticker) {
      assets = [];
    } else {
      assets = assets.filter(a => {
        let match = true;
        
        if (filters.types) {
          if (a.type === 'font' && !includesFont) match = false;
          if (a.type === 'sticker' && !includesSticker) match = false;
          if (a.type !== 'font' && a.type !== 'sticker' && !includesAsset) match = false;
        }
        
        if (match && lowerQuery) {
          const name = a.metadata?.name || a.metadata?.fontFamily || a.url || '';
          match = name.toLowerCase().includes(lowerQuery) || a.type.toLowerCase().includes(lowerQuery);
        }

        if (match && filters.dateRange) {
          match = a.createdAt >= filters.dateRange.start && a.createdAt <= filters.dateRange.end;
        }

        return match;
      });
    }

    searchStore.setResult({ projects, scenes, assets }, query);
  }
}

export const searchManager = new SearchManager();
