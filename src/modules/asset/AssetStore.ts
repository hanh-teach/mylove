import { Asset } from './AssetModel';

export class AssetStore {
  // Map of asset ID to Asset
  private assets: Map<string, Asset> = new Map();
  // Map of hash to asset ID for deduplication
  private hashIndex: Map<string, string> = new Map();
  
  private listeners: Set<() => void> = new Set();

  public getAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  public getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  public getAssetByHash(hash: string): Asset | undefined {
    const id = this.hashIndex.get(hash);
    if (id) {
      return this.assets.get(id);
    }
    return undefined;
  }

  public addAsset(asset: Asset) {
    this.assets.set(asset.id, asset);
    this.hashIndex.set(asset.hash, asset.id);
    this.notify();
  }

  public updateAsset(id: string, updates: Partial<Asset>) {
    const existing = this.assets.get(id);
    if (existing) {
      this.assets.set(id, { ...existing, ...updates });
      this.notify();
    }
  }

  public removeAsset(id: string) {
    const asset = this.assets.get(id);
    if (asset) {
      this.assets.delete(id);
      this.hashIndex.delete(asset.hash);
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

export const assetStore = new AssetStore();
