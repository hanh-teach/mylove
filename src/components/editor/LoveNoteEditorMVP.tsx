import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { DocumentModel } from './DocumentModel';

interface LoveNoteEditorMVPProps {
  onOpenAIAssistant?: () => void;
  onSyncToCard?: (title: string, message: string) => void;
}

export const LoveNoteEditorMVP: React.FC<LoveNoteEditorMVPProps> = ({
  onOpenAIAssistant,
  onSyncToCard,
}) => {
  const defaultDoc = DocumentModel.createDefaultDocument(
    'Bài viết đầu tiên ✨',
    'Kính gửi người thân yêu,\n\nTôi viết những dòng này để chia sẻ những cảm xúc và câu chuyện chân thành nhất trên hành trình này...'
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
      <RichTextEditor
        initialDocument={defaultDoc}
        onOpenAIAssistant={onOpenAIAssistant}
        onSyncToCard={onSyncToCard}
      />
    </div>
  );
};
