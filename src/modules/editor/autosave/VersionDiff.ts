import { NoteDocument } from '../../../components/editor/DocumentModel';

export interface VersionMetadata {
  id: string;
  versionNumber: number;
  timestamp: number;
  type: 'Automatic' | 'Manual' | 'Recovered Draft' | 'Restored';
  summary: string;
  document: NoteDocument;
}

export class VersionDiff {
  static generateSummary(prev: NoteDocument | null, current: NoteDocument): string {
    if (!prev) return 'Initial version';
    const prevText = prev.blocks.map(b => b.content).join('');
    const currText = current.blocks.map(b => b.content).join('');
    const diffLen = currText.length - prevText.length;
    
    if (prev.title !== current.title) {
      return `Updated title to "${current.title}"`;
    }
    if (diffLen > 20) {
      return `Added ~${diffLen} characters`;
    } else if (diffLen < -20) {
      return `Removed ~${Math.abs(diffLen)} characters`;
    } else {
      return `Edited text content`;
    }
  }
}
