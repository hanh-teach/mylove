import React from 'react';
import { Clock, Check, Sparkles, Plus, Edit2, Link } from 'lucide-react';

interface TimelineEntry {
  id: string;
  timestamp: string;
  action: 'created' | 'modified' | 'referenced' | 'ai_used';
  itemTitle: string;
  description: string;
}

const mockEntries: TimelineEntry[] = [
  {
    id: 't1',
    timestamp: new Date().toISOString(),
    action: 'ai_used',
    itemTitle: 'Gia đình Nguyễn Văn A',
    description: 'AI đã sử dụng thông tin này để soạn thảo thư chúc mừng.'
  },
  {
    id: 't2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'referenced',
    itemTitle: 'Đà Lạt',
    description: 'Được liên kết với Kỷ niệm "Chuyến đi 2022".'
  },
  {
    id: 't3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    action: 'modified',
    itemTitle: 'Sở thích ẩm thực',
    description: 'Đã cập nhật thêm thông tin về món lẩu gà lá é.'
  },
  {
    id: 't4',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    action: 'created',
    itemTitle: 'Gia đình Nguyễn Văn A',
    description: 'Khởi tạo đối tượng tri thức mới.'
  }
];

export const KnowledgeTimeline: React.FC = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
          <Clock size={16} />
          Knowledge Timeline
        </h3>
        <button className="text-[10px] font-black uppercase text-rose-600 hover:underline">
          Xem tất cả
        </button>
      </div>

      <div className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {mockEntries.map((entry) => (
          <div key={entry.id} className="relative pl-10 group">
            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${getActionColor(entry.action)}`}>
              {getActionIcon(entry.action)}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getActionColor(entry.action).replace('bg-', 'bg-opacity-10 text-').replace('text-', 'text-')}`}>
                  {entry.action.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900">{entry.itemTitle}</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'created': return <Plus size={12} />;
    case 'modified': return <Edit2 size={12} />;
    case 'referenced': return <Link size={12} />;
    case 'ai_used': return <Sparkles size={12} />;
    default: return <Check size={12} />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'created': return 'bg-emerald-500 text-white';
    case 'modified': return 'bg-blue-500 text-white';
    case 'referenced': return 'bg-amber-500 text-white';
    case 'ai_used': return 'bg-rose-500 text-white';
    default: return 'bg-slate-500 text-white';
  }
};
