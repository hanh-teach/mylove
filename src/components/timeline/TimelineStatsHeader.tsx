import React from 'react';
import { IMemory, MemoryStats } from '../../modules/memory/MemoryTypes';
import { MemoryService } from '../../modules/memory/MemoryService';
import { Calendar, Heart, Clock, Sparkles, Award, Flame, CalendarCheck, TrendingUp } from 'lucide-react';

interface TimelineStatsHeaderProps {
  memories: IMemory[];
  stats: MemoryStats;
}

export const TimelineStatsHeader: React.FC<TimelineStatsHeaderProps> = ({ memories, stats }) => {
  const currentYear = new Date().getFullYear().toString();
  const eventsThisYear = memories.filter(m => m.date && m.date.startsWith(currentYear)).length;

  // Calculate years and months together
  const yearsTogether = Math.floor((stats.relationshipDays || 365) / 365);
  const remainingMonths = Math.floor(((stats.relationshipDays || 365) % 365) / 30);
  const yearsText = yearsTogether > 0
    ? `${yearsTogether} năm ${remainingMonths > 0 ? `${remainingMonths} tháng` : ''}`
    : `${stats.relationshipDays || 0} ngày`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* Stat 1: Total Events */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-rose-100/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
          <Heart size={20} className="fill-white" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng sự kiện</div>
          <div className="text-xl font-black text-slate-800 tracking-tight">
            {stats.total + (stats.timelineEvents || 0)} <span className="text-xs font-medium text-slate-500">mốc</span>
          </div>
        </div>
      </div>

      {/* Stat 2: Relationship Duration */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-rose-100/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
          <Clock size={20} />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bên nhau</div>
          <div className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
            {yearsText}
          </div>
        </div>
      </div>

      {/* Stat 3: Events this Year */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-rose-100/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
          <CalendarCheck size={20} />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Năm {currentYear}</div>
          <div className="text-xl font-black text-slate-800 tracking-tight">
            {eventsThisYear} <span className="text-xs font-medium text-slate-500">kỷ niệm</span>
          </div>
        </div>
      </div>

      {/* Stat 4: Most Active Month */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-rose-100/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
          <TrendingUp size={20} />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tháng nhiều nhất</div>
          <div className="text-sm font-black text-slate-800 tracking-tight truncate">
            {stats.mostActiveMonth || 'T02/2024'}
          </div>
        </div>
      </div>

      {/* Stat 5: Longest Streak */}
      <div className="col-span-2 sm:col-span-1 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-rose-100/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
          <Flame size={20} />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chuỗi kỷ niệm</div>
          <div className="text-xl font-black text-slate-800 tracking-tight">
            {stats.longestStreakMonths || 1} <span className="text-xs font-medium text-slate-500">tháng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
