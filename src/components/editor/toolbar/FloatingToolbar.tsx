import React from 'react';
import { Bold, Italic, Underline, Sparkles, Heart } from 'lucide-react';

interface FloatingToolbarProps {
  onToggleFormat: (format: 'bold' | 'italic' | 'underline') => void;
  onOpenAI: () => void;
  onInsertHeart: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onToggleFormat,
  onOpenAI,
  onInsertHeart,
}) => {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 z-40 animate-fadeIn text-xs font-medium">
      <button
        onClick={() => onToggleFormat('bold')}
        className="p-1.5 hover:bg-white/10 rounded transition-colors"
        title="Bold"
      >
        <Bold size={14} />
      </button>
      <button
        onClick={() => onToggleFormat('italic')}
        className="p-1.5 hover:bg-white/10 rounded transition-colors"
        title="Italic"
      >
        <Italic size={14} />
      </button>
      <button
        onClick={() => onToggleFormat('underline')}
        className="p-1.5 hover:bg-white/10 rounded transition-colors"
        title="Underline"
      >
        <Underline size={14} />
      </button>

      <div className="w-[1px] h-4 bg-white/20 mx-0.5"></div>

      <button
        onClick={onInsertHeart}
        className="p-1.5 hover:bg-white/10 rounded transition-colors text-rose-400 flex items-center gap-1"
        title="Insert Heart"
      >
        <Heart size={14} fill="currentColor" />
      </button>

      <div className="w-[1px] h-4 bg-white/20 mx-0.5"></div>

      <button
        onClick={onOpenAI}
        className="px-2 py-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-lg text-white font-bold flex items-center gap-1 shadow-sm transition-all text-[11px]"
      >
        <Sparkles size={12} />
        <span>AI Improve</span>
      </button>
    </div>
  );
};
