import { NoteDocument } from '../../../components/editor/DocumentModel';
import { VersionMetadata, VersionDiff } from './VersionDiff';
import { DraftStorage } from './DraftStorage';

export class VersionManager {
  static async createVersion(
    doc: NoteDocument, 
    type: 'Automatic' | 'Manual' | 'Recovered Draft' | 'Restored' = 'Automatic',
    customSummary?: string
  ): Promise<VersionMetadata> {
    const existingVersions = await DraftStorage.getVersions();
    const prevDoc = existingVersions.length > 0 ? existingVersions[0].document : null;
    const summary = customSummary || VersionDiff.generateSummary(prevDoc, doc);

    const newVersion: VersionMetadata = {
      id: 'ver_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      versionNumber: existingVersions.length + 1,
      timestamp: Date.now(),
      type,
      summary,
      document: JSON.parse(JSON.stringify(doc)),
    };

    await DraftStorage.saveVersion(newVersion);
    await this.applyRetentionPolicy();
    return newVersion;
  }

  static async applyRetentionPolicy(): Promise<void> {
    const versions = await DraftStorage.getVersions();
    if (versions.length <= 60) return;

    // Policy: Keep 10 per minute, 20 per hour, 30 per day max cleanup
    // Simple prune: keep newest 60 versions
    const pruned = versions.slice(0, 60);
    // Re-save pruned list
    try {
      // In IndexedDB we can delete excess ones
      const toDelete = versions.slice(60);
      for (const v of toDelete) {
        await DraftStorage.deleteVersion(v.id);
      }
    } catch (e) {}
  }
}
