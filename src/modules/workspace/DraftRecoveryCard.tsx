import React, { useState } from 'react';
import { FileText, RotateCcw, X } from 'lucide-react';

interface DraftRecoveryCardProps {
  timestamp?: number;
  title?: string;
  onRestore: () => void;
  onDismiss?: () => void;
}

function formatRelativeTime(timestamp?: number): string {
  if (!timestamp) return 'gần đây';
  const now = Date.now();
  const diffMs = now - timestamp;
  if (diffMs <= 0) return 'vừa xong';
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'vừa xong';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ngày trước`;
}

export const DraftRecoveryCard: React.FC<DraftRecoveryCardProps> = ({
  timestamp,
  title,
  onRestore,
  onDismiss
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [restored, setRestored] = useState(false);

  if (dismissed || restored) return null;

  const timeText = formatRelativeTime(timestamp);
  const docTitle = title || 'Viết lách';

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <FileText size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-amber-950 text-sm">Khôi phục bản nháp chưa lưu</h4>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">Tự động lưu</span>
          </div>
          <p className="text-xs text-amber-800 mt-0.5">
            Tìm thấy thay đổi từ {timeText} trong dự án "{docTitle}".
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            setRestored(true);
            onRestore();
          }}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Khôi phục</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-2 rounded-xl hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
          title="Bỏ qua bản nháp"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
