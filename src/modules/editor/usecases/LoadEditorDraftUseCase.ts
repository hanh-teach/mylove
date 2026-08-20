import { DraftStorage } from '../autosave/DraftStorage';
import { NoteDocument } from '../../../components/editor/DocumentModel';

export class LoadEditorDraftUseCase {
  static async execute(): Promise<{ document: NoteDocument; timestamp: number } | null> {
    return await DraftStorage.getDraft();
  }
}
