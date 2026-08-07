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
      const parsed: DraftNote[] = JSON.parse(data);
      return parsed.map(d => ({
        ...d,
        title: String(d.title || '').normalize('NFC'),
        content: String(d.content || '').normalize('NFC'),
      }));
    } catch {
      return [];
    }
  }

  static saveDraft(draft: DraftNote): void {
    const drafts = this.listDrafts();
    const index = drafts.findIndex(d => d.id === draft.id);
    const normalizedTitle = String(draft.title || '').normalize('NFC');
    const normalizedContent = String(draft.content || '').normalize('NFC');
    const updatedDraft = {
      ...draft,
      title: normalizedTitle,
      content: normalizedContent,
      updatedAt: Date.now(),
      wordCount: normalizedContent.trim() ? normalizedContent.trim().split(/\s+/).length : 0,
      charCount: normalizedContent.length,
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
      title: String(title).normalize('NFC'),
      content: String(content).normalize('NFC'),
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
      'Bài viết đầu tiên ✨'.normalize('NFC'),
      'Kính gửi người thân yêu,\n\nTôi viết những dòng này để chia sẻ những cảm xúc và câu chuyện chân thành nhất trên hành trình này...'.normalize('NFC')
    );
  }
}
