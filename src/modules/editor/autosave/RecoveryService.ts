import { DraftStorage } from './DraftStorage';
import { NoteDocument } from '../../../components/editor/DocumentModel';

export class RecoveryService {
  static async checkForRecovery(): Promise<{ document: NoteDocument; timestamp: number } | null> {
    try {
      const draft = await DraftStorage.getDraft();
      if (!draft) return null;
      // If draft is recent (e.g. within last 7 days and has actual content)
      const isRecent = Date.now() - draft.timestamp < 7 * 24 * 3600 * 1000;
      const hasContent = draft.document.blocks.some(b => b.content.trim().length > 0);
      if (isRecent && hasContent) {
        return draft;
      }
    } catch (e) {}
    return null;
  }

  static async clearRecovery(): Promise<void> {
    await DraftStorage.clearDraft();
  }
}
