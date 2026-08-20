import React, { useMemo } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { DocumentModel } from './DocumentModel';
import { cleanAIGeneratedText } from '../../utils/textCleaner';

interface LoveNoteEditorMVPProps {
  initialTitle?: string;
  initialMessage?: string;
  onOpenAIAssistant?: () => void;
  onSyncToCard?: (title: string, message: string, images: string[]) => void;
}

export const LoveNoteEditorMVP: React.FC<LoveNoteEditorMVPProps> = ({
  initialTitle,
  initialMessage,
  onOpenAIAssistant,
  onSyncToCard,
}) => {
  const doc = useMemo(() => {
    const cleanMsg = initialMessage ? cleanAIGeneratedText(initialMessage) : '';
    const title = (initialTitle || 'Bài viết đầu tiên ✨').normalize('NFC');
    const msg = (cleanMsg || 'Thân gửi trân quý,\n\nTôi viết những dòng này để lưu giữ và chia sẻ những kỷ niệm và câu chuyện ý nghĩa nhất trên hành trình này...').normalize('NFC');
    return DocumentModel.createDefaultDocument(title, msg);
  }, [initialTitle, initialMessage]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
      <RichTextEditor
        initialDocument={doc}
        onOpenAIAssistant={onOpenAIAssistant}
        onSyncToCard={onSyncToCard}
      />
    </div>
  );
};
