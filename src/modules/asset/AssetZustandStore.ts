import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { ProjectAsset } from './AssetModel';
import { assetStore } from './AssetStore';

export interface AssetZustandState {
  assets: ProjectAsset[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  addAsset: (asset: ProjectAsset) => void;
  deleteAsset: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearTrash: (projectId?: string) => void;
  restoreAsset: (id: string) => void;
  restoreAllFromTrash: (projectId?: string) => void;
  refreshAssets: () => void;
}

export const useAssetZustandStore = create<AssetZustandState>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set) => {
          assetStore.subscribe(() => {
            set({ assets: assetStore.getAssets() });
          });

          return {
            assets: assetStore.getAssets(),
            searchQuery: '',
            selectedCategory: 'all',

            setSearchQuery: (query: string) => set({ searchQuery: query }),
            setSelectedCategory: (category: string) => set({ selectedCategory: category }),

            addAsset: (asset: ProjectAsset) => {
              assetStore.addAsset(asset);
            },
            deleteAsset: (id: string) => {
              assetStore.moveToTrash(id);
            },
            toggleFavorite: (id: string) => {
              assetStore.toggleFavorite(id);
            },
            clearTrash: (projectId?: string) => {
              assetStore.clearTrash(projectId);
            },
            restoreAsset: (id: string) => {
              assetStore.restoreFromTrash(id);
            },
            restoreAllFromTrash: (projectId?: string) => {
              assetStore.restoreAllFromTrash(projectId);
            },
            refreshAssets: () => {
              set({ assets: assetStore.getAssets() });
            },
          };
        },
        {
          name: 'lovenote_asset_ui_v1',
          // Persist user preference (selectedCategory). Exclude searchQuery and assets (handled by assetStore adapter).
          partialize: (state) => ({
            selectedCategory: state.selectedCategory,
          }),
        }
      ),
      { name: 'AssetStore' }
    )
  )
);

// Atomic Selectors
export const selectAssets = (state: AssetZustandState) => state.assets;
export const selectAssetSearchQuery = (state: AssetZustandState) => state.searchQuery;
export const selectAssetCategory = (state: AssetZustandState) => state.selectedCategory;

// Custom Selector Hooks
export const useAssets = () => useAssetZustandStore(selectAssets);
export const useAssetSearchQuery = () => useAssetZustandStore(selectAssetSearchQuery);
export const useAssetCategory = () => useAssetZustandStore(selectAssetCategory);
