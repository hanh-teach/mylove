export type BlockType = 'paragraph' | 'heading' | 'quote' | 'divider' | 'image' | 'checklist';

export interface NoteBlock {
  id: string;
  type: BlockType;
  content: string;
  formatting?: {
    bold?: boolean;
    italic?: boolean;
  };
}

export interface NoteDocument {
  id: string;
  title: string;
  blocks: NoteBlock[];
  version: number;
  updatedAt: number;
  metadata?: {
    author?: string;
    theme?: string;
  };
}

export class DocumentModel {
  static createDefaultDocument(title = 'Bài viết đầu tiên ✨', initialText = ''): NoteDocument {
    const normTitle = (title || 'Bài viết đầu tiên ✨').normalize('NFC');
    const normText = (initialText || '').normalize('NFC');
    const paragraphs = normText ? normText.split('\n\n') : [
      'Kính gửi người thân yêu,',
      'Tôi viết những dòng này để chia sẻ những suy nghĩ, cảm xúc và thông điệp chân thành nhất.',
      'Hy vọng trang viết này mang lại nguồn cảm hứng và ý nghĩa cho hành trình tuyệt vời phía trước.'
    ].map(s => s.normalize('NFC'));

    const blocks: NoteBlock[] = paragraphs.map((p, idx) => ({
      id: 'block_' + Date.now() + '_' + idx,
      type: idx === 0 ? 'heading' : 'paragraph',
      content: p,
    }));

    return {
      id: 'doc_' + Date.now(),
      title: normTitle,
      blocks,
      version: 1,
      updatedAt: Date.now(),
    };
  }

  static serialize(doc: NoteDocument): string {
    return JSON.stringify(doc, null, 2);
  }

  static deserialize(jsonStr: string): NoteDocument | null {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.title) parsed.title = String(parsed.title).normalize('NFC');
      if (parsed && Array.isArray(parsed.blocks)) {
        parsed.blocks = parsed.blocks.map((b: any) => ({
          ...b,
          content: String(b.content || '').normalize('NFC')
        }));
      }
      return parsed;
    } catch {
      return null;
    }
  }
}
