import React from 'react';
import { IGenerationHistoryItem } from './types';
import { History, Eye, Clock, Coins, Heart, FileText, Film, Image as ImageIcon, Music, BookOpen, Mail, Users } from 'lucide-react';

interface GenerationHistoryPanelProps {
  history: IGenerationHistoryItem[];
  onReopenHistoryItem: (item: IGenerationHistoryItem) => void;
}

export const GenerationHistoryPanel: React.FC<GenerationHistoryPanelProps> = ({
  history,
  onReopenHistoryItem
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'love_letter': return <Heart size={14} className="text-rose-500 fill-rose-500" />;
      case 'romantic_image': return <ImageIcon size={14} className="text-purple-500" />;
      case 'memory_video': return <Film size={14} className="text-amber-500" />;
      case 'playlist': return <Music size={14} className="text-cyan-500" />;
      case 'story': return <BookOpen size={14} className="text-emerald-500" />;
      case 'anniversary_card': return <Mail size={14} className="text-pink-500" />;
      case 'relationship_advice': return <Users size={14} className="text-blue-500" />;
      default: return <FileText size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-rose-500 text-white shadow-xs">
            <History size={18} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-800">Lịch sử sáng tạo (Generation History)</h3>
            <p className="text-[11px] text-slate-500">Lưu vết kết quả, chi phí ước tính và thời lượng thực thi</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-400">
          {history.length} Tác phẩm
        </span>
      </div>

      {history.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400">
          Chưa có lịch sử tạo nội dung nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-slate-50/80 hover:bg-rose-50/40 border border-slate-200 hover:border-rose-200 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    {getTypeIcon(item.taskType)}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onReopenHistoryItem(item)}
                  className="px-2.5 py-1 rounded-xl bg-rose-500 text-white hover:bg-rose-600 font-bold text-[10px] flex items-center gap-1 shadow-2xs shrink-0"
                >
                  <Eye size={12} />
                  <span>Xem</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2 bg-white/60 p-2 rounded-xl border border-slate-100 italic">
                "{item.result.text || item.promptUsed}"
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  <span>{(item.durationMs / 1000).toFixed(1)}s</span>
                </span>
                <span className="flex items-center gap-1">
                  <Coins size={11} className="text-amber-500" />
                  <span>{item.estimatedCost}</span>
                </span>
                <span className="font-extrabold text-emerald-600">
                  {item.status === 'completed' ? 'Thành công' : 'Lỗi'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
