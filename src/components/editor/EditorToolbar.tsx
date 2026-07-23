import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CopyPlus, 
  Trash2, 
  Lock, 
  Unlock, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical, 
  AlignCenterVertical, 
  AlignEndVertical, 
  ArrowUpToLine, 
  ArrowDownToLine, 
  Group, 
  Download, 
  Sparkles, 
  Undo2, 
  Redo2, 
  Type, 
  Grid,
  HelpCircle,
  Wand2,
  Printer,
  Check
} from 'lucide-react';

interface EditorToolbarProps {
  hasSelection: boolean;
  selectedCount: number;
  isLocked: boolean;
  canUndo: boolean;
  canRedo: boolean;
  gridEnabled?: boolean;
  snapToGrid?: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onToggleGrid?: () => void;
  onToggleSnapToGrid?: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onOpenExport?: () => void;
  onOpenPrint?: () => void;
  onQuickExport: () => void;
  onAddText: () => void;
  onAddDecor: () => void;
  onShowShortcuts?: () => void;
  onToggleWorkflow?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  hasSelection,
  selectedCount,
  isLocked,
  canUndo,
  canRedo,
  gridEnabled = false,
  snapToGrid = false,
  onUndo,
  onRedo,
  onDuplicate,
  onDelete,
  onToggleLock,
  onToggleGrid,
  onToggleSnapToGrid,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignTop,
  onAlignMiddle,
  onAlignBottom,
  onBringToFront,
  onSendToBack,
  onGroup,
  onUngroup,
  onOpenExport,
  onOpenPrint,
  onQuickExport,
  onAddText,
  onAddDecor,
  onShowShortcuts,
  onToggleWorkflow,
}) => {
  const [showMore, setShowMore] = React.useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-1.5 select-none text-xs overflow-x-auto max-w-full">
      {/* Primary Actions: Add Content */}
      <div className="flex items-center gap-1 border-r border-slate-200/80 pr-2 shrink-0">
        <button
          onClick={onAddText}
          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Type size={16} />
          <span>Chữ</span>
        </button>
        <button
          onClick={onAddDecor}
          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Sparkles size={16} />
          <span>Decor</span>
        </button>
      </div>

      {/* AI Assistant - Core Focus */}
      {onToggleWorkflow && (
        <button
          onClick={onToggleWorkflow}
          className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 shadow-md shadow-rose-500/20 active:scale-95"
          title="AI Studio Assistant"
        >
          <Wand2 size={16} />
          <span>AI Studio</span>
        </button>
      )}

      <div className="h-6 w-px bg-slate-200 mx-1 shrink-0" />

      {/* Quick Tools for selection - Only show if has selection */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex items-center gap-1 shrink-0 overflow-hidden"
          >
            <button
              onClick={onDuplicate}
              className="p-2 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
              title="Nhân bản (Ctrl+D)"
            >
              <CopyPlus size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
              title="Xóa layer (Del)"
            >
              <Trash2 size={16} />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Tools Toggle (More...) */}
      <div className="relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className={`p-2 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
            showMore ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-500'
          }`}
        >
          <Grid size={16} />
          <span>Công cụ</span>
        </button>

        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-3 left-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 min-w-[280px] z-50 grid grid-cols-2 gap-4"
            >
              {/* Undo/Redo */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Lịch sử</p>
                <div className="flex gap-1">
                  <button onClick={onUndo} disabled={!canUndo} className="flex-1 p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><Undo2 size={15} /></button>
                  <button onClick={onRedo} disabled={!canRedo} className="flex-1 p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><Redo2 size={15} /></button>
                </div>
              </div>

              {/* View Settings */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Hiển thị</p>
                <button onClick={onToggleGrid} className={`w-full p-2 rounded-lg flex items-center gap-2 ${gridEnabled ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-700'}`}>
                  <Grid size={15} />
                  <span className="font-semibold">Lưới Grid</span>
                </button>
              </div>

              {/* Alignment */}
              <div className="col-span-2 space-y-1.5 pt-1 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Căn chỉnh Layer</p>
                <div className="grid grid-cols-6 gap-1">
                  <button onClick={onAlignLeft} disabled={!hasSelection} className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><AlignLeft size={15} /></button>
                  <button onClick={onAlignCenter} disabled={!hasSelection} className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><AlignCenter size={15} /></button>
                  <button onClick={onAlignRight} disabled={!hasSelection} className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><AlignRight size={15} /></button>
                  <button onClick={onAlignTop} disabled={!hasSelection} className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><AlignStartVertical size={15} /></button>
                  <button onClick={onAlignMiddle} disabled={!hasSelection} className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><AlignCenterVertical size={15} /></button>
                  <button onClick={onAlignBottom} disabled={!hasSelection} className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex justify-center"><AlignEndVertical size={15} /></button>
                </div>
              </div>

              {/* Layer Order */}
              <div className="col-span-2 space-y-1.5 pt-1 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Thứ tự Layer</p>
                <div className="flex gap-2">
                  <button onClick={onBringToFront} disabled={!hasSelection} className="flex-1 p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex items-center justify-center gap-2 font-semibold">
                    <ArrowUpToLine size={15} /> Lên trên
                  </button>
                  <button onClick={onSendToBack} disabled={!hasSelection} className="flex-1 p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-lg flex items-center justify-center gap-2 font-semibold">
                    <ArrowDownToLine size={15} /> Xuống dưới
                  </button>
                </div>
              </div>

              {/* Shortcuts */}
              {onShowShortcuts && (
                <button onClick={onShowShortcuts} className="col-span-2 p-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
                  <HelpCircle size={16} />
                  <span>Hướng dẫn & Phím tắt</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1" />

      {/* Export / Finish Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {onOpenExport && (
          <button
            onClick={onOpenExport}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            title="Export"
          >
            <Download size={18} />
          </button>
        )}
        <button
          onClick={onQuickExport}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2 active:scale-95"
        >
          <Check size={18} strokeWidth={3} />
          <span>Hoàn tất</span>
        </button>
      </div>
    </div>
  );
};
