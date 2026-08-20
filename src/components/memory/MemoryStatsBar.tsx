import React from 'react';
import { MemoryStats } from '../../modules/memory/MemoryTypes';
import { Heart, Image, FileText, Video, Music, Calendar, Sparkles } from 'lucide-react';

interface MemoryStatsBarProps {
  stats: MemoryStats;
}

export const MemoryStatsBar: React.FC<MemoryStatsBarProps> = ({ stats }) => {
  const statItems = [
    { label: 'Tổng kỷ niệm', count: stats.total, icon: Sparkles, color: 'from-pink-500 to-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Thư & Bài viết', count: stats.letters, icon: FileText, color: 'from-amber-500 to-orange-500', text: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Hình ảnh', count: stats.photos, icon: Image, color: 'from-blue-500 to-cyan-500', text: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Thước phim', count: stats.videos, icon: Video, color: 'from-purple-500 to-indigo-500', text: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Âm nhạc', count: stats.music, icon: Music, color: 'from-emerald-500 to-teal-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Mốc thời gian', count: stats.timelineEvents, icon: Calendar, color: 'from-sky-500 to-blue-600', text: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Yêu thích', count: stats.favorites, icon: Heart, color: 'from-rose-500 to-red-600', text: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-rose-100/80 shadow-xs hover:shadow-md transition-all duration-300 group"
          >
            <div className={`p-2.5 rounded-xl ${item.bg} ${item.text} mr-3 group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={18} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">{item.label}</div>
              <div className="text-lg font-bold text-slate-800">{item.count}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
