import React from 'react';
import { Sparkles, BookOpen, Clock, Download, Image as ImageIcon, Cpu } from 'lucide-react';

export const StatisticsCard: React.FC = () => {
  const stats = [
    { label: 'Writing Projects', value: '128', icon: <Sparkles size={16} className="text-rose-600" />, bg: 'bg-rose-50' },
    { label: 'Memory Collection', value: '354', icon: <BookOpen size={16} className="text-pink-600" />, bg: 'bg-pink-50' },
    { label: 'Life Timeline', value: '86', icon: <Clock size={16} className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Exports & Shares', value: '24', icon: <Download size={16} className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Images Generated', value: '512', icon: <ImageIcon size={16} className="text-indigo-600" />, bg: 'bg-indigo-50' },
    { label: 'AI Credits', value: '9,450', icon: <Cpu size={16} className="text-amber-600" />, bg: 'bg-amber-50' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-serif font-bold text-slate-900 text-base">Workspace Statistics</h4>
        <span className="text-xs text-slate-400">All-Time Activity</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${stat.bg} shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">{stat.label}</span>
              <span className="font-serif font-bold text-slate-900 text-base">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
