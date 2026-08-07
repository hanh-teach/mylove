
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { migrateLocalStorageToIndexedDb, FIXED_KEYS } from './migrateLocalStorageToIndexedDb';
import { idbAdapter } from './IndexedDbAdapter';
import { AssetStore } from '../asset/AssetStore';

vi.mock('./IndexedDbAdapter', () => ({
  idbAdapter: {
    set: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue(null),
    delete: vi.fn().mockResolvedValue(undefined),
    listKeys: vi.fn().mockResolvedValue([])
  }
}));

describe('migrateLocalStorageToIndexedDb', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should migrate all fixed keys', async () => {
    for (const key of FIXED_KEYS) {
        localStorage.setItem(key, 'value');
    }

    await migrateLocalStorageToIndexedDb();

    expect(localStorage.getItem('lovenote_idb_migrated_v1')).toBe('true');
    for (const key of FIXED_KEYS) {
        expect(idbAdapter.set).toHaveBeenCalledWith(key, 'value');
    }
  });
});

describe('AssetStore', () => {
    it('should save to IDB', async () => {
        const store = new AssetStore();
        const asset = { 
            title: 'Test', 
            projectId: 'proj-1',
            url: 'https://test.com',
            type: 'image' as const,
            size: 100,
            tags: [],
            aiGenerated: false,
            provider: 'local' as const,
            favorite: false
        };
        store.addAsset(asset);
        expect(idbAdapter.set).toHaveBeenCalled();
    });
});
