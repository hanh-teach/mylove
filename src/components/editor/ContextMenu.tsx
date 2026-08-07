import React, { useEffect, useRef } from 'react';
import { 
  Copy, 
  Clipboard, 
  CopyPlus, 
  Trash2, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Group, 
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  selectedLayerIds: string[];
  isLocked: boolean;
  isVisible: boolean;
  isGrouped: boolean;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onToggleVisibility: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onAlignLeft?: () => void;
  onAlignCenter?: () => void;
  onAlignRight?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  selectedLayerIds,
  isLocked,
  isVisible,
  isGrouped,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onToggleLock,
  onToggleVisibility,
  onBringToFront,
  onSendToBack,
  onGroup,
  onUngroup,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, onClose]);

  if (!position) return null;

  const hasSelection = selectedLayerIds.length > 0;
  const multiSelection = selectedLayerIds.length > 1;

  // Prevent menu going off-screen
  const menuWidth = 220;
  const menuHeight = 320;
  const left = Math.min(position.x, window.innerWidth - menuWidth - 10);
  const top = Math.min(position.y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      style={{ left: `${left}px`, top: `${top}px` }}
      className="fixed z-[100] w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-rose-100 p-1.5 text-xs text-slate-800 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {hasSelection ? (
        <>
          <button
            onClick={() => { onCopy(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Copy size={14} className="text-rose-500" />
              Sao chép
            </span>
            <kbd className="text-[10px] text-slate-400 font-mono">Ctrl+C</kbd>
          </button>

          <button
            onClick={() => { onDuplicate(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <CopyPlus size={14} className="text-rose-500" />
              Nhân bản
            </span>
            <kbd className="text-[10px] text-slate-400 font-mono">Ctrl+D</kbd>
          </button>

          <div className="h-px bg-slate-100 my-1" />

          <button
            onClick={() => { onToggleLock(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              {isLocked ? <Unlock size={14} className="text-amber-500" /> : <Lock size={14} className="text-rose-500" />}
              {isLocked ? 'Mở khóa' : 'Khóa layer'}
            </span>
          </button>

          <button
            onClick={() => { onToggleVisibility(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              {isVisible ? <EyeOff size={14} className="text-slate-400" /> : <Eye size={14} className="text-emerald-500" />}
              {isVisible ? 'Ẩn layer' : 'Hiện layer'}
            </span>
          </button>

          <div className="h-px bg-slate-100 my-1" />

          <button
            onClick={() => { onBringToFront(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowUp size={14} className="text-rose-500" />
              Lên trên cùng
            </span>
          </button>

          <button
            onClick={() => { onSendToBack(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowDown size={14} className="text-rose-500" />
              Xuống dưới cùng
            </span>
          </button>

          {multiSelection && (
            <button
              onClick={() => { onGroup(); onClose(); }}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Group size={14} className="text-indigo-500" />
                Gộp nhóm (Group)
              </span>
            </button>
          )}

          {isGrouped && (
            <button
              onClick={() => { onUngroup(); onClose(); }}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Ungroup size={14} className="text-indigo-500" />
                Rã nhóm (Ungroup)
              </span>
            </button>
          )}

          <div className="h-px bg-slate-100 my-1" />

          <button
            onClick={() => { onDelete(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
          >
            <span className="flex items-center gap-2 font-medium">
              <Trash2 size={14} className="text-red-500" />
              Xóa layer
            </span>
            <kbd className="text-[10px] text-red-300 font-mono">Del</kbd>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => { onPaste(); onClose(); }}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Clipboard size={14} className="text-rose-500" />
              Dán layer
            </span>
            <kbd className="text-[10px] text-slate-400 font-mono">Ctrl+V</kbd>
          </button>
        </>
      )}
    </div>
  );
};
