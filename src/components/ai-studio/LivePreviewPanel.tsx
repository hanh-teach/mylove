import React, { memo } from 'react';
import { IAITask } from './types';
import { ResultActionsBar } from './ResultActionsBar';
import { Eye, Sparkles, Heart, Film, Image as ImageIcon, Music, BookOpen, Mail, Users, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LivePreviewPanelProps {
  currentTask: IAITask | null;
  onSaveToMemories: () => void;
  onOpenInEditor: () => void;
  onAddToTimeline: () => void;
  onExport: () => void;
  onShare: () => void;
  onRegenerate: () => void;
  onQuickSelect: (type: any) => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = memo(({
  currentTask,
  onSaveToMemories,
  onOpenInEditor,
  onAddToTimeline,
  onExport,
  onShare,
  onRegenerate,
  onQuickSelect
}) => {
  // Empty State when no active task or result exists yet
  if (!currentTask) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md"
        >
          <Sparkles size={32} className="fill-white" />
        </motion.div>

        <div>
          <h3 className="text-base font-black text-slate-800 mb-1">
            ✨ Bạn muốn tạo nội dung sáng tạo nào hôm nay?
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Chọn một mẫu tạo nhanh ở khu vực Quick Create hoặc cấu hình trong Prompt Builder để AI bắt đầu khởi tạo tác phẩm của bạn.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onQuickSelect('love_letter')}
            className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} className="fill-rose-500 text-rose-500" />
            <span>Thư & Thiệp AI</span>
          </button>
          <button
            onClick={() => onQuickSelect('romantic_image')}
            className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ImageIcon size={14} />
            <span>Ảnh Minh Hoạ Visual</span>
          </button>
          <button
            onClick={() => onQuickSelect('memory_video')}
            className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Film size={14} />
            <span>Video kỷ niệm</span>
          </button>
          <button
            onClick={() => onQuickSelect('story')}
            className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <BookOpen size={14} />
            <span>Love Story</span>
          </button>
        </div>
      </div>
    );
  }

  // Loading / In-Progress State
  if (currentTask.status === 'in_progress' || currentTask.status === 'pending') {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
        <div className="relative">
          <Loader2 size={48} className="text-rose-500 animate-spin" />
          <Heart size={20} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-800">
            {currentTask.title}...
          </h3>
          <p className="text-xs text-slate-500">
            AI đang phân tích cảm xúc & biên dịch sáng tạo ({currentTask.progress}%)
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(currentTask.progress, 10)}%` }}
          />
        </div>
      </div>
    );
  }

  // Completed or Failed Result Display
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-5 space-y-4 flex flex-col justify-between min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-rose-500 text-white shadow-xs">
            <Eye size={18} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-800">Xem trước trực tiếp (Live Preview)</h3>
            <p className="text-[11px] text-slate-500">{currentTask.title} • Thời gian: {(currentTask.durationMs / 1000).toFixed(1)}s</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          ● Hoàn thành
        </span>
      </div>

      {/* Content Preview Container */}
      <div className="flex-1 p-4 rounded-2xl bg-rose-50/30 border border-rose-100 overflow-y-auto max-h-[320px]">
        {currentTask.result?.mediaUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-rose-200 shadow-xs">
            <img
              src={currentTask.result.mediaUrl}
              alt="AI Generated Media"
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {currentTask.result?.text ? (
          <div className="prose prose-rose text-xs leading-relaxed font-medium text-slate-800 whitespace-pre-wrap">
            {currentTask.result.text}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">Không tìm thấy nội dung hiển thị.</p>
        )}

        {currentTask.result?.subText && (
          <div className="mt-3 pt-3 border-t border-rose-200/60 text-[11px] font-semibold text-rose-700 italic">
            💡 {currentTask.result.subText}
          </div>
        )}
      </div>

      {/* Result Actions Bar */}
      <ResultActionsBar
        onSaveToMemories={onSaveToMemories}
        onOpenInEditor={onOpenInEditor}
        onAddToTimeline={onAddToTimeline}
        onExport={onExport}
        onShare={onShare}
        onRegenerate={onRegenerate}
        isGenerating={false}
      />
    </div>
  );
});

LivePreviewPanel.displayName = 'LivePreviewPanel';
