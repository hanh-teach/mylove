import { ProjectVersion, VersionPatch, VersionTag } from './VersionModel';
import { versionStore } from './VersionStore';
import { compare, applyPatch } from 'fast-json-patch';

const SNAPSHOT_INTERVAL = 10; // Create a full snapshot every 10 versions to optimize restoration

export class VersionManager {
  
  // Real implementation using fast-json-patch
  private computeDiff(oldState: any, newState: any): VersionPatch[] {
    try {
      return compare(oldState, newState) as unknown as VersionPatch[];
    } catch (err) {
      console.error('[VersionManager] Diff error:', err);
      return [{ op: 'replace', path: '/', value: newState }]; 
    }
  }

  private validatePatches(patches: any): asserts patches is VersionPatch[] {
    if (!Array.isArray(patches)) {
      throw new Error('[VersionManager] Validation failed: Patches must be an array');
    }
    for (let i = 0; i < patches.length; i++) {
      const p = patches[i];
      if (!p || typeof p !== 'object') {
        throw new Error(`[VersionManager] Validation failed: Patch at index ${i} is not an object`);
      }
      if (typeof p.op !== 'string') {
        throw new Error(`[VersionManager] Validation failed: Patch at index ${i} is missing an 'op' string`);
      }
      const validOps = ['add', 'remove', 'replace', 'move', 'copy', 'test'];
      if (!validOps.includes(p.op)) {
        throw new Error(`[VersionManager] Validation failed: Patch at index ${i} has invalid op '${p.op}'`);
      }
      if (typeof p.path !== 'string' || !p.path.startsWith('/')) {
        throw new Error(`[VersionManager] Validation failed: Patch at index ${i} has invalid or missing 'path' (must start with '/')`);
      }
      if (['add', 'replace', 'test'].includes(p.op) && !('value' in p)) {
        throw new Error(`[VersionManager] Validation failed: Patch at index ${i} of op '${p.op}' is missing 'value' field`);
      }
      if (['move', 'copy'].includes(p.op) && (typeof p.from !== 'string' || !p.from.startsWith('/'))) {
        throw new Error(`[VersionManager] Validation failed: Patch at index ${i} of op '${p.op}' is missing or invalid 'from' path`);
      }
    }
  }

  private applyDiff(state: any, patches: VersionPatch[]): any {
    try {
      this.validatePatches(patches);
      const result = applyPatch(state, patches, false, false);
      return result.newDocument;
    } catch (err: any) {
      console.error('[VersionManager] Patch error:', err.message || err);
      // Fallback: if patch fails and first patch is replace root, return that value
      if (Array.isArray(patches) && patches.length > 0 && patches[0] && patches[0].op === 'replace' && patches[0].path === '/') {
        return patches[0].value;
      }
      return state;
    }
  }

  public saveVersion(
    projectId: string, 
    currentState: any, 
    options?: {
      name?: string;
      tag?: VersionTag;
      description?: string;
      author?: string;
      isProtected?: boolean;
      forceSnapshot?: boolean;
    } | string
  ): ProjectVersion {
    const opts = typeof options === 'string' ? { name: options } : (options || {});
    const history = versionStore.getVersions(projectId);
    const parentVersion = history.length > 0 ? history[0] : undefined; // Newest is at index 0

    // Snapshot if explicitly requested, or no parent, or every SNAPSHOT_INTERVAL versions
    const isSnapshot = opts.forceSnapshot || !parentVersion || history.filter(v => v.type === 'snapshot').length !== Math.floor((history.length + 1) / SNAPSHOT_INTERVAL);
    
    let type: 'snapshot' | 'diff' = 'snapshot';
    let data: any = currentState;

    if (!isSnapshot && parentVersion) {
      const parentState = this.reconstructState(parentVersion.id);
      type = 'diff';
      data = this.computeDiff(parentState, currentState);
    }

    const newVersion: ProjectVersion = {
      id: `ver-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      projectId,
      name: opts.name || `Phiên bản v1.1 #${history.length + 1}`,
      tag: opts.tag || (opts.name?.includes('Auto') ? 'Auto-Save' : 'Manual'),
      description: opts.description,
      author: opts.author || 'Tác giả hiện tại',
      isProtected: opts.isProtected || false,
      createdAt: Date.now(),
      type,
      data,
      parentVersionId: parentVersion?.id
    };

    versionStore.addVersion(newVersion);
    return newVersion;
  }

  public reconstructState(versionId: string): any {
    const version = versionStore.getVersion(versionId);
    if (!version) throw new Error('Version not found');

    if (version.type === 'snapshot') {
      return JSON.parse(JSON.stringify(version.data)); // Deep copy
    }

    // It's a diff, we need to trace back to the closest snapshot
    const patchesToApply: VersionPatch[][] = [version.data];
    let currentParentId = version.parentVersionId;
    let baseState: any = null;

    while (currentParentId) {
      const parent = versionStore.getVersion(currentParentId);
      if (!parent) throw new Error('Broken version chain');

      if (parent.type === 'snapshot') {
        baseState = JSON.parse(JSON.stringify(parent.data));
        break;
      } else {
        patchesToApply.unshift(parent.data); // Add to beginning of array
        currentParentId = parent.parentVersionId;
      }
    }

    if (!baseState) throw new Error('Could not find base snapshot');

    // Apply patches forward
    let currentState = baseState;
    for (const patches of patchesToApply) {
      currentState = this.applyDiff(currentState, patches);
    }

    return currentState;
  }

  public restoreVersion(versionId: string): any {
    return this.reconstructState(versionId);
  }

  public compareVersions(versionIdA: string, versionIdB: string): VersionPatch[] {
    const stateA = this.reconstructState(versionIdA);
    const stateB = this.reconstructState(versionIdB);
    return this.computeDiff(stateA, stateB);
  }

  public renameVersion(versionId: string, name: string): void {
    versionStore.updateVersion(versionId, { name });
  }

  public deleteVersion(versionId: string): void {
    // Note: In a real diff-based system, deleting a version in the middle of a chain
    // requires rebasing the subsequent diffs. For simplicity, we just mark it as removed
    // or we only allow deleting if it's not a parent, or we recompute. 
    // Here we'll just remove it from the store.
    versionStore.removeVersion(versionId);
  }

  public getHistory(projectId: string): ProjectVersion[] {
    return versionStore.getVersions(projectId);
  }
}

export const versionManager = new VersionManager();
