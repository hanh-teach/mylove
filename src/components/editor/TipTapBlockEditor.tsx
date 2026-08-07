import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TipTapBlockEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  isSingleLine?: boolean;
}

export const TipTapBlockEditor: React.FC<TipTapBlockEditorProps> = ({
  content,
  onChange,
  onBlur,
  placeholder,
  className = '',
  isSingleLine = false
}) => {
  const isUpdating = useRef(false);

  const editor = useEditor({
    extensions: [
      (StarterKit as any).configure({
        history: false, // Use our global DocumentHistory instead
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Type here...',
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: `focus:outline-none ${className}`,
        placeholder: placeholder || '',
      },
    },
    onUpdate: ({ editor }) => {
      isUpdating.current = true;
      let newContent = editor.getHTML();
      if (isSingleLine) {
        // Strip paragraph tags for single line inputs if needed, though getHTML returns them.
        // For simplicity, we just keep HTML but maybe strip wrapping <p> or prevent line breaks.
        // Or we use getText() for single line? No, we need bold/italic.
      }
      onChange(newContent);
      isUpdating.current = false;
    },
    onBlur: () => {
      if (onBlur) onBlur();
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML() && !isUpdating.current) {
      editor.commands.setContent(content, { emitUpdate: false } as any);
    }
  }, [content, editor]);

  return <EditorContent editor={editor} className="w-full" />;
};
