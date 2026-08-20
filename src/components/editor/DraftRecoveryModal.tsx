import React, { useState } from 'react';
import { RotateCcw, Sparkles, Trash2, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DraftRecoveryModalProps {
  isOpen: boolean;
  savedTime: string | null;
  onRestore: () => void;
  onDiscard: () => void;
  onDontShowAgain: (dontShow: boolean) => void;
}

export const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  isOpen,
  savedTime,
  onRestore,
  onDiscard,
  onDontShowAgain
}) => {
  const [dontShow, setDontShow] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -30, opacity: 0, scale: 0.96 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[94%] sm:w-auto pointer-events-auto"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-3 px-4 border border-rose-200/90 flex flex-col gap-3 text-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={18} className="animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <span>Tìm thấy bản nháp tự động</span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-mono font-semibold">
                    {savedTime || 'Vừa xong'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Bạn có muốn khôi phục công việc thiết kế trước đó không?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={onDiscard}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Bỏ qua và bắt đầu trang mới"
              >
                <Trash2 size={13} />
                <span>Bắt đầu mới</span>
              </button>

              <button
                onClick={onRestore}
                className="py-1.5 px-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                title="Khôi phục nội dung đã lưu"
              >
                <RotateCcw size={13} />
                <span>Khôi phục</span>
              </button>

              <button
                onClick={onDiscard}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-1"
                title="Đóng thông báo"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 mt-1">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShow}
              onChange={(e) => {
                setDontShow(e.target.checked);
                onDontShowAgain(e.target.checked);
              }}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="dontShowAgain" className="text-[11px] text-slate-500 cursor-pointer">
              Không nhắc lại lần sau (có thể tìm thấy trong Dashboard)
            </label>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

