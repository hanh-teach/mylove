import React from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, 
  List, ListOrdered, CheckSquare, Smile, Sticker, Image as ImageIcon, Sparkles, Undo2, Redo2 
} from 'lucide-react';
import { BlockType } from '../DocumentModel';

interface RichToolbarProps {
  onToggleFormat: (format: 'bold' | 'italic' | 'underline') => void;
  onSetBlockType: (type: BlockType, level?: number) => void;
  onAddList: (listType: 'bullet' | 'number' | 'checklist') => void;
  onInsertImage: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenAI: () => void;
  onOpenEmojiModal: () => void;
  onOpenStickerModal: () => void;
}

export const RichToolbar: React.FC<RichToolbarProps> = ({
  onToggleFormat,
  onSetBlockType,
  onAddList,
  onInsertImage,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenAI,
  onOpenEmojiModal,
  onOpenStickerModal,
}) => {
  return (
    <div className="bg-rose-50/70 border-b border-rose-100 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto relative">
      <div className="flex items-center gap-1.5 min-w-max">
        {/* Formatting */}
        <button
          onClick={() => onToggleFormat('bold')}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>
        <button
          onClick={() => onToggleFormat('italic')}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>
        <button
          onClick={() => onToggleFormat('underline')}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Underline (Ctrl+U)"
        >
          <Underline size={15} />
        </button>

        <div className="h-5 w-[1px] bg-rose-200 mx-1"></div>

        {/* Headings */}
        <button
          onClick={() => onSetBlockType('heading', 1)}
          className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => onSetBlockType('heading', 2)}
          className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => onSetBlockType('heading', 3)}
          className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Heading 3"
        >
          H3
        </button>

        <div className="h-5 w-[1px] bg-rose-200 mx-1"></div>

        {/* Lists & Checklist */}
        <button
          onClick={() => onAddList('bullet')}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          onClick={() => onAddList('number')}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>
        <button
          onClick={() => onAddList('checklist')}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Checklist"
        >
          <CheckSquare size={15} />
        </button>

        <div className="h-5 w-[1px] bg-rose-200 mx-1"></div>

        {/* Emojis & Stickers Trigger Buttons */}
        <button
          type="button"
          onClick={onOpenEmojiModal}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px] flex items-center gap-1 cursor-pointer"
          title="Mở hộp thoại chọn Emoji"
        >
          <Smile size={16} />
          <span className="hidden sm:inline">Emoji</span>
        </button>

        <button
          type="button"
          onClick={onOpenStickerModal}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px] flex items-center gap-1 cursor-pointer"
          title="Mở hộp thoại chọn Sticker Tag"
        >
          <Sticker size={16} />
          <span className="hidden sm:inline">Sticker</span>
        </button>

        <button
          onClick={onInsertImage}
          className="p-2 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs transition-all min-h-[36px]"
          title="Insert Image"
        >
          <ImageIcon size={15} />
        </button>

        <div className="h-5 w-[1px] bg-rose-200 mx-1"></div>

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg border text-xs font-bold transition-all min-h-[36px] ${
            canUndo ? 'bg-white border-rose-200 text-rose-700 hover:bg-rose-50' : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg border text-xs font-bold transition-all min-h-[36px] ${
            canRedo ? 'bg-white border-rose-200 text-rose-700 hover:bg-rose-50' : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={15} />
        </button>
      </div>

      <div className="flex items-center gap-2 min-w-max">
        <button
          onClick={onOpenAI}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-sm transition-all flex items-center gap-1.5 min-h-[36px]"
        >
          <Sparkles size={14} />
          <span>AI Assistant</span>
        </button>
      </div>
    </div>
  );
};
