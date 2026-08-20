import React, { useEffect, useRef, useMemo } from 'react';
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoize extensions to prevent re-initialization on every render
  const extensions = useMemo(() => [
    (StarterKit as any).configure({
      history: false, // Use global DocumentHistory instead
    }),
    Placeholder.configure({
      placeholder: placeholder || 'Type here...',
    }),
  ], [placeholder]);

  const editor = useEditor({
    extensions,
    content: content || '',
    editorProps: {
      attributes: {
        class: `focus:outline-none ${className}`,
        placeholder: placeholder || '',
      },
    },
    onUpdate: ({ editor }) => {
      if (!editor || editor.isDestroyed || !isMounted.current) return;
      try {
        isUpdating.current = true;
        const newContent = editor.getHTML();
        if (isMounted.current) {
          onChange(newContent);
        }
      } catch (err) {
        // Guard against transient schema access errors during teardown
      } finally {
        isUpdating.current = false;
      }
    },
    onBlur: () => {
      if (onBlur && isMounted.current) onBlur();
    }
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && !isUpdating.current) {
      try {
        const currentHTML = editor.getHTML();
        if (content !== currentHTML) {
          editor.commands.setContent(content || '', { emitUpdate: false } as any);
        }
      } catch (err) {
        // Guard against transient content update errors
      }
    }
  }, [content, editor]);

  if (!editor || editor.isDestroyed) {
    return <div className={`w-full min-h-[1.5em] ${className}`} />;
  }

  return <EditorContent editor={editor} className="w-full" />;
};
