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
    if (!prev) return 'Bản phác thảo đầu tiên';
    const prevText = prev.blocks.map(b => b.content).join('');
    const currText = current.blocks.map(b => b.content).join('');
    const diffLen = currText.length - prevText.length;
    
    if (prev.title !== current.title) {
      return `Cập nhật tiêu đề thành "${current.title}"`;
    }
    if (diffLen > 20) {
      return `Đã thêm khoảng ${diffLen} ký tự`;
    } else if (diffLen < -20) {
      return `Đã xóa bớt khoảng ${Math.abs(diffLen)} ký tự`;
    } else {
      return `Đã chỉnh sửa nội dung`;
    }
  }
}
