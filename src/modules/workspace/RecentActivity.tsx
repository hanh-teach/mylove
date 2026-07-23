import React from 'react';
import { Clock, CheckCircle2, Sparkles, Image as ImageIcon, BookOpen } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    { time: '09:30', title: 'Workflow Finished', desc: 'Story & Media pipeline completed', icon: <Sparkles size={14} className="text-emerald-600" /> },
    { time: '09:26', title: 'Memory Indexed', desc: 'Travel photo added to memory collection', icon: <BookOpen size={14} className="text-purple-600" /> },
    { time: '09:24', title: 'Image Generated', desc: 'Card banner artwork created via Imagen 3', icon: <ImageIcon size={14} className="text-pink-600" /> },
    { time: '09:21', title: 'Draft Generated', desc: 'AI content draft compiled', icon: <CheckCircle2 size={14} className="text-rose-600" /> },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-serif font-bold text-slate-900 text-base">Recent AI Activity</h4>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock size={12} /> Live Feed
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {activities.map((act, idx) => (
          <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
            <div className="p-2 rounded-xl bg-slate-50 shrink-0 mt-0.5">
              {act.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{act.title}</span>
                <span className="text-slate-400 text-[10px]">{act.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
