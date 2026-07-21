import { Asset, AssetType } from './AssetModel';
import { assetStore } from './AssetStore';

export class AssetManager {
  
  /**
   * Registers a new asset or returns an existing one if the hash matches (deduplication).
   */
  public async registerAsset(data: {
    type: AssetType;
    url: string;
    size: number;
    hash: string;
    width?: number;
    height?: number;
    provider?: 'local' | 'system' | 'external';
    metadata?: any;
  }): Promise<Asset> {
    // Deduplication check
    const existingAsset = assetStore.getAssetByHash(data.hash);
    if (existingAsset) {
      return existingAsset;
    }

    const newAsset: Asset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: data.type,
      url: data.url,
      size: data.size,
      width: data.width,
      height: data.height,
      provider: data.provider || 'local',
      hash: data.hash,
      metadata: data.metadata || {},
      createdAt: Date.now(),
      usedBy: [],
    };
    
    assetStore.addAsset(newAsset);
    return newAsset;
  }

  /**
   * Marks an asset as being used by a specific entity (Layer or Scene).
   */
  public bindAssetUsage(assetId: string, entityId: string): void {
    const asset = assetStore.getAsset(assetId);
    if (asset) {
      if (!asset.usedBy.includes(entityId)) {
        assetStore.updateAsset(assetId, { usedBy: [...asset.usedBy, entityId] });
      }
    }
  }

  /**
   * Removes an entity's usage of an asset.
   * Optionally deletes the asset if it is no longer used by anything.
   */
  public unbindAssetUsage(assetId: string, entityId: string, autoClean: boolean = true): void {
    const asset = assetStore.getAsset(assetId);
    if (asset) {
      const updatedUsedBy = asset.usedBy.filter(id => id !== entityId);
      
      if (updatedUsedBy.length === 0 && autoClean) {
        // No longer used anywhere, clean up
        assetStore.removeAsset(assetId);
      } else {
        assetStore.updateAsset(assetId, { usedBy: updatedUsedBy });
      }
    }
  }
  
  public getAsset(id: string): Asset | undefined {
    return assetStore.getAsset(id);
  }

  public getAssetsByType(type: AssetType): Asset[] {
    return assetStore.getAssets().filter(a => a.type === type);
  }
  
  public deleteAsset(id: string): void {
    assetStore.removeAsset(id);
  }
}

export const assetManager = new AssetManager();
