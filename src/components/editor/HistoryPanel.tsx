import React from 'react';
import { History, Undo2, Redo2, Check, Clock, ChevronRight } from 'lucide-react';

export interface HistoryItem {
  id: string;
  action: string;
  timestamp: string;
  snapshot: any;
}

interface HistoryPanelProps {
  historyStack: HistoryItem[];
  currentIndex: number; // Current active point in history stack
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onJumpToVersion: (index: number) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  historyStack,
  currentIndex,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onJumpToVersion,
}) => {
  return (
    <div className="w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 flex flex-col h-full select-none overflow-hidden text-xs">
      {/* Header */}
      <div className="p-3 border-b border-rose-100/80 flex items-center justify-between bg-rose-50/40">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <History size={16} className="text-rose-600" />
          <span>Lịch Sử Thao Tác</span>
        </div>

        {/* Quick Undo / Redo Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 hover:bg-rose-100 text-rose-700 disabled:opacity-30 rounded-lg transition-colors"
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 hover:bg-rose-100 text-rose-700 disabled:opacity-30 rounded-lg transition-colors"
            title="Làm lại (Ctrl+Shift+Z)"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* History Stack List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {historyStack.length === 0 ? (
          <div className="py-10 text-center text-slate-400 flex flex-col items-center gap-2">
            <Clock size={28} className="text-slate-300" />
            <p>Chưa có lịch sử thay đổi</p>
          </div>
        ) : (
          historyStack.map((item, index) => {
            const isActive = index === currentIndex;
            const isFuture = index > currentIndex;

            return (
              <button
                key={item.id}
                onClick={() => onJumpToVersion(index)}
                className={`w-full text-left p-2 rounded-xl transition-all border flex items-center justify-between group ${
                  isActive
                    ? 'bg-rose-500 text-white font-medium border-rose-600 shadow-md'
                    : isFuture
                    ? 'opacity-40 hover:opacity-75 bg-slate-50 border-transparent text-slate-500'
                    : 'hover:bg-rose-50/60 border-transparent text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-white animate-pulse' : 'bg-rose-300'
                    }`}
                  />
                  <div className="truncate">
                    <span className="block truncate text-xs">{item.action}</span>
                    <span
                      className={`text-[9px] block font-mono ${
                        isActive ? 'text-rose-100' : 'text-slate-400'
                      }`}
                    >
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                {isActive && <Check size={14} className="shrink-0 text-white" />}
              </button>
            );
          })
        )}
      </div>

      <div className="p-2.5 border-t border-rose-100 bg-slate-50/50 text-[10px] text-slate-400 text-center">
        Click vào bất kỳ bước nào để nháy nhảy phiên bản (Jump To Version)
      </div>
    </div>
  );
};
