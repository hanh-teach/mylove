import React from 'react';
import { RotateCcw, Sparkles, Trash2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DraftRecoveryModalProps {
  isOpen: boolean;
  savedTime: string | null;
  onRestore: () => void;
  onDiscard: () => void;
}

export const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  isOpen,
  savedTime,
  onRestore,
  onDiscard
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-rose-100 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-rose-100/80 text-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Clock size={28} className="animate-pulse" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Khôi Phục Bản Nháp Tự Động Save
          </h3>
          
          <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 justify-center">
            <Sparkles size={14} className="text-rose-500" />
            Hệ thống tìm thấy bản lưu gần nhất vào lúc:
            <span className="font-semibold text-rose-600 font-mono">{savedTime || 'Vừa xong'}</span>
          </p>

          <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-3.5 mb-6 text-left text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
            <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              Bạn có muốn tiếp tục công việc thiết kế thiệp từ bản nháp này hay bắt đầu phiên làm việc mới?
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <button
              onClick={onDiscard}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 size={15} />
              Bắt đầu mới
            </button>

            <button
              onClick={onRestore}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <RotateCcw size={15} />
              Khôi phục bản nháp
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
