import { ProjectVersion, VersionPatch } from './VersionModel';
import { versionStore } from './VersionStore';

const SNAPSHOT_INTERVAL = 10; // Create a full snapshot every 10 versions to optimize restoration

export class VersionManager {
  
  // Stubs for JSON Patch operations
  private computeDiff(oldState: any, newState: any): VersionPatch[] {
    // In a real implementation, use a library like fast-json-patch
    // return fastJsonPatch.compare(oldState, newState);
    return [{ op: 'replace', path: '/', value: newState }]; // Mock diff
  }

  private applyDiff(state: any, patches: VersionPatch[]): any {
    // In a real implementation, use fastJsonPatch.applyPatch(state, patches)
    return patches.length > 0 && patches[0].op === 'replace' ? patches[0].value : state;
  }

  public saveVersion(projectId: string, currentState: any, name?: string): ProjectVersion {
    const history = versionStore.getVersions(projectId);
    const parentVersion = history.length > 0 ? history[0] : undefined; // Newest is at index 0

    // Snapshot if there is no parent, or every SNAPSHOT_INTERVAL versions
    const isSnapshot = !parentVersion || history.filter(v => v.type === 'snapshot').length !== Math.floor((history.length + 1) / SNAPSHOT_INTERVAL);
    
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
      name: name || `Version ${history.length + 1}`,
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
