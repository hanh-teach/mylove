import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryService } from './MemoryService';
import { idbAdapter } from '../storage/IndexedDbAdapter';

vi.mock('../storage/IndexedDbAdapter', () => ({
  idbAdapter: {
    get: vi.fn(),
    set: vi.fn().mockResolvedValue(undefined)
  }
}));

describe('MemoryService Hydration Race Condition', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Reset private state of MemoryService if possible or just rely on the flags
        // Since they are private static, we might need to use some tricks if they persist across tests
        // But for a fresh run, it should be fine.
    });

    it('should not overwrite newer memory data with older IDB data', async () => {
        const storedMemories = JSON.stringify([{ id: 'old-mem', title: 'Old Memory', content: '...', date: new Date().toISOString() }]);
        let resolveHydration: (value: any) => void;
        const hydrationPromise = new Promise<string>((resolve) => {
            resolveHydration = resolve;
        });

        const mockGet = idbAdapter.get as any;
        mockGet.mockReturnValue(hydrationPromise);

        // Trigger hydration
        const memoriesPromise = MemoryService.getMemories();
        
        // While hydrating, perform a save
        const newMemories = [{ id: 'new-mem', title: 'New Memory', content: '...', date: new Date().toISOString() }];
        MemoryService.saveMemories(newMemories as any);

        // Resolve hydration with "old" data
        resolveHydration!(storedMemories);
        await hydrationPromise;
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 0));

        // State should be "New Memory"
        const currentMemories = MemoryService.getMemories();
        const foundOld = currentMemories.find(m => m.id === 'old-mem');
        expect(foundOld).toBeUndefined();
        
        const foundNew = currentMemories.find(m => m.title === 'New Memory');
        expect(foundNew).toBeDefined();
    });
});
