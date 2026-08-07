
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetStore } from './AssetStore';
import { idbAdapter } from '../storage/IndexedDbAdapter';

// Mock the IndexedDbAdapter
vi.mock('../storage/IndexedDbAdapter', () => ({
  idbAdapter: {
    get: vi.fn(),
    set: vi.fn().mockResolvedValue(undefined)
  }
}));

describe('AssetStore Hydration Race Condition', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should not overwrite newer memory data with older IDB data', async () => {
        const storedAsset = JSON.stringify([{ id: 'old-asset', title: 'Old Asset', projectId: 'proj-1' }]);
        let resolveHydration: (value: any) => void;
        const hydrationPromise = new Promise<string>((resolve) => {
            resolveHydration = resolve;
        });

        // Make IDB get take some time
        const mockGet = idbAdapter.get as any;
        mockGet.mockReturnValue(hydrationPromise);

        const store = new AssetStore();
        
        // Before hydration resolves, perform a save (via addAsset)
        const newAsset = { 
            title: 'New Asset', 
            projectId: 'proj-1', 
            url: 'https://test.com', 
            type: 'image' as const, 
            size: 100, 
            tags: [], 
            aiGenerated: false, 
            provider: 'local' as const, 
            favorite: false 
        };
        store.addAsset(newAsset);

        // Resolve hydration with the "older" data
        resolveHydration!(storedAsset);
        await hydrationPromise;
        // Small delay to ensure any async notify/state updates complete
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assets in store should still be the "New Asset" (plus INITIAL_SAMPLE_ASSETS if seeded), not "Old Asset"
        const assets = store.getAssets('proj-1');
        
        // Verify "Old Asset" from IDB is NOT in assets because memory was newer
        const foundOld = assets.find(a => a.id === 'old-asset');
        expect(foundOld).toBeUndefined();
        
        // Verify "New Asset" IS in assets
        const foundNew = assets.find(a => a.title === 'New Asset');
        expect(foundNew).toBeDefined();
    });
});
