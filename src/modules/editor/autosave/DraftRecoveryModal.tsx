import React from 'react';
import { NoteDocument } from '../../../components/editor/DocumentModel';
import { RefreshCw, Check, Trash2, X } from 'lucide-react';

interface DraftRecoveryModalProps {
  draft: { document: NoteDocument; timestamp: number };
  onRestore: () => void;
  onDiscard: () => void;
}

export const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  draft,
  onRestore,
  onDiscard,
}) => {
  const timeAgo = Math.round((Date.now() - draft.timestamp) / 60000);
  const timeStr = timeAgo < 1 ? 'mới đây' : `${timeAgo} phút trước`;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[94%] sm:w-auto pointer-events-auto animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3 px-4 border border-rose-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="p-2 bg-rose-100 rounded-xl text-rose-600 shrink-0">
            <RefreshCw size={18} className="animate-spin-slow" />
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <span>Bản nháp chưa lưu ({timeStr})</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-xs">
              {(draft.document.title || 'Bài viết chưa đặt tên').normalize('NFC')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onDiscard}
            className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Bỏ qua</span>
          </button>
          <button
            onClick={onRestore}
            className="py-1.5 px-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-xs shadow-sm rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <Check size={13} />
            <span>Khôi phục</span>
          </button>
          <button
            onClick={onDiscard}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

