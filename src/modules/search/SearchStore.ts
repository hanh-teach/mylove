import { Project } from '../project/ProjectModel';
import { Scene } from '../scene/SceneModel';
import { Asset } from '../asset/AssetModel';

export interface SearchResult {
  projects: Project[];
  scenes: Scene[];
  assets: Asset[];
}

export class SearchStore {
  private result: SearchResult = { projects: [], scenes: [], assets: [] };
  private query: string = '';
  private isSearching: boolean = false;
  private listeners: Set<() => void> = new Set();

  public getResult(): SearchResult {
    return this.result;
  }

  public getQuery(): string {
    return this.query;
  }

  public getIsSearching(): boolean {
    return this.isSearching;
  }

  public setResult(result: SearchResult, query: string) {
    this.result = result;
    this.query = query;
    this.isSearching = false;
    this.notify();
  }

  public setSearching(isSearching: boolean) {
    this.isSearching = isSearching;
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const searchStore = new SearchStore();
