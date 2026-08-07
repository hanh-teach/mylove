import React from 'react';
import { MemoryStats } from '../../modules/memory/MemoryTypes';
import { Heart, Calendar, MapPin, Smile, Tag, Flame, Sparkles, Image, Mail, Film, Music, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface EnhancedStatsDashboardProps {
  stats: MemoryStats;
}

export const EnhancedStatsDashboard: React.FC<EnhancedStatsDashboardProps> = ({ stats }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-rose-100/90 shadow-xs space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
              <Sparkles size={18} />
            </span>
            Thống kê Hành trình Kỷ niệm (Memory Analytics)
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Chỉ số phân tích kỷ niệm và nội dung sáng tạo trong bộ sưu tập
          </p>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Days Together Card */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-white/20">
              <Heart size={16} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100">Hành trình</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black leading-none">{stats.relationshipDays}</div>
            <div className="text-[11px] font-bold text-rose-100 mt-1">Ngày Bên Nhau</div>
          </div>
        </motion.div>

        {/* Total Memories */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
              <Clock size={16} />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng số</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black leading-none">{stats.total}</div>
            <div className="text-[11px] font-bold text-slate-500 mt-1">Kỷ niệm đã lưu</div>
          </div>
        </motion.div>

        {/* Active Month */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
              <Calendar size={16} />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sôi nổi nhất</span>
          </div>
          <div className="mt-3">
            <div className="text-base sm:text-lg font-black leading-tight text-amber-700 truncate">
              {stats.mostActiveMonth}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1">Tháng nhiều kỷ niệm</div>
          </div>
        </motion.div>

        {/* Favorite Location */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
              <MapPin size={16} />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Địa điểm</span>
          </div>
          <div className="mt-3">
            <div className="text-base sm:text-lg font-black leading-tight text-emerald-700 truncate">
              {stats.favoriteLocation}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1">Nơi yêu thích nhất</div>
          </div>
        </motion.div>

        {/* Favorite Mood */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
              <Smile size={16} />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cảm xúc</span>
          </div>
          <div className="mt-3">
            <div className="text-base sm:text-lg font-black leading-tight text-purple-700 truncate">
              {stats.favoriteMood}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1">Tâm trạng chủ đạo</div>
          </div>
        </motion.div>

        {/* Top Tag */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
              <Tag size={16} />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Chủ đề</span>
          </div>
          <div className="mt-3">
            <div className="text-base sm:text-lg font-black leading-tight text-indigo-700 truncate">
              #{stats.topTag}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1">Thẻ phổ biến nhất</div>
          </div>
        </motion.div>
      </div>

      {/* Media & Type Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Phân loại nội dung lưu trữ
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <span className="p-2 rounded-lg bg-rose-100 text-rose-600">
              <Image size={16} />
            </span>
            <div>
              <div className="font-black text-slate-800">{stats.photos}</div>
              <div className="text-[10px] text-slate-500">Hình ảnh</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <span className="p-2 rounded-lg bg-pink-100 text-pink-600">
              <Mail size={16} />
            </span>
            <div>
              <div className="font-black text-slate-800">{stats.letters}</div>
              <div className="text-[10px] text-slate-500">Thư & Lời nhắn</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <span className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Film size={16} />
            </span>
            <div>
              <div className="font-black text-slate-800">{stats.videos}</div>
              <div className="text-[10px] text-slate-500">Thước phim</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <span className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Music size={16} />
            </span>
            <div>
              <div className="font-black text-slate-800">{stats.music}</div>
              <div className="text-[10px] text-slate-500">Giai điệu</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <span className="p-2 rounded-lg bg-red-100 text-red-600">
              <Heart size={16} />
            </span>
            <div>
              <div className="font-black text-slate-800">{stats.favorites}</div>
              <div className="text-[10px] text-slate-500">Yêu thích</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
