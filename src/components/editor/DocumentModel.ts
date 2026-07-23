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
    const paragraphs = initialText ? initialText.split('\n\n') : [
      'Kính gửi người thân yêu,',
      'Tôi viết những dòng này để chia sẻ những suy nghĩ, cảm xúc và thông điệp chân thành nhất.',
      'Hy vọng trang viết này mang lại nguồn cảm hứng và ý nghĩa cho hành trình tuyệt vời phía trước.'
    ];

    const blocks: NoteBlock[] = paragraphs.map((p, idx) => ({
      id: 'block_' + Date.now() + '_' + idx,
      type: idx === 0 ? 'heading' : 'paragraph',
      content: p,
    }));

    return {
      id: 'doc_' + Date.now(),
      title,
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
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }
}
