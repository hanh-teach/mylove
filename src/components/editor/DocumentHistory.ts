import { NoteDocument } from './DocumentModel';

export class DocumentHistory {
  private history: NoteDocument[] = [];
  private currentIndex: number = -1;
  private maxSnapshots: number = 50;

  constructor(initialDoc: NoteDocument) {
    this.push(initialDoc);
  }

  public current(): NoteDocument | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  public push(doc: NoteDocument): void {
    // If we are in the middle of history, discard future
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    const cloned = JSON.parse(JSON.stringify(doc));
    cloned.version = (cloned.version || 1) + 1;
    cloned.updatedAt = Date.now();

    this.history.push(cloned);
    if (this.history.length > this.maxSnapshots) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  public undo(): NoteDocument | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.current();
    }
    return null;
  }

  public redo(): NoteDocument | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.current();
    }
    return null;
  }

  public canUndo(): boolean {
    return this.currentIndex > 0;
  }

  public canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}
