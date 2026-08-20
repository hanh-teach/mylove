import { DraftStorage } from '../autosave/DraftStorage';
import { NoteDocument } from '../../../components/editor/DocumentModel';

export class SaveEditorDraftUseCase {
  static async execute(doc: NoteDocument): Promise<void> {
    await DraftStorage.saveDraft(doc);
  }
}
