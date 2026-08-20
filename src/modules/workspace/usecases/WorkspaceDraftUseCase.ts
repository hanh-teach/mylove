import { DraftStorage } from '../../editor/autosave/DraftStorage';

export class WorkspaceDraftUseCase {
  static async loadDraft(): Promise<{ document: any; timestamp: number } | null> {
    return await DraftStorage.getDraft();
  }

  static restoreDraft(activeDraft: { document: any; timestamp: number }): void {
    window.dispatchEvent(new CustomEvent('lovenote-restore-draft', { detail: activeDraft.document }));
  }

  static async clearDraft(): Promise<void> {
    await DraftStorage.clearDraft();
  }
}
