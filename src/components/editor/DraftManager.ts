export interface DraftNote {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  wordCount: number;
  charCount: number;
}

const STORAGE_KEY = 'lovenote_drafts_v4';
const ACTIVE_DRAFT_KEY = 'lovenote_active_draft_id_v4';

export class DraftManager {
  static listDrafts(): DraftNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveDraft(draft: DraftNote): void {
    const drafts = this.listDrafts();
    const index = drafts.findIndex(d => d.id === draft.id);
    const updatedDraft = {
      ...draft,
      updatedAt: Date.now(),
      wordCount: draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0,
      charCount: draft.content.length,
    };
    if (index >= 0) {
      drafts[index] = updatedDraft;
    } else {
      drafts.unshift(updatedDraft);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_KEY, draft.id);
  }

  static loadDraft(id: string): DraftNote | null {
    const drafts = this.listDrafts();
    return drafts.find(d => d.id === id) || null;
  }

  static createDraft(title = '', content = ''): DraftNote {
    const newDraft: DraftNote = {
      id: 'draft_' + Date.now(),
      title,
      content,
      updatedAt: Date.now(),
      wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
      charCount: content.length,
    };
    this.saveDraft(newDraft);
    return newDraft;
  }

  static deleteDraft(id: string): void {
    const drafts = this.listDrafts().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }

  static getActiveDraft(): DraftNote {
    const drafts = this.listDrafts();
    if (drafts.length > 0) {
      return drafts[0];
    }
    return this.createDraft(
      'Bài viết đầu tiên ✨',
      'Kính gửi người thân yêu,\n\nTôi viết những dòng này để chia sẻ những cảm xúc và câu chuyện chân thành nhất trên hành trình này...'
    );
  }
}
