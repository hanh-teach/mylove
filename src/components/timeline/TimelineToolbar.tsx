import React from 'react';
import { ICollection, MoodType, TIMELINE_CATEGORIES, TimelineCategory, TimelineViewMode } from '../../modules/memory/MemoryTypes';
import {
  Search,
  Filter,
  Calendar,
  Sparkles,
  Heart,
  X,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  ArrowUpCircle,
  Clock,
  LayoutList,
  Rows,
  CalendarHeart
} from 'lucide-react';

interface TimelineToolbarProps {
  viewMode: TimelineViewMode;
  onViewModeChange: (mode: TimelineViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: TimelineCategory | 'all';
  onCategoryChange: (cat: TimelineCategory | 'all') => void;
  activeYear: string | 'all';
  onYearChange: (year: string | 'all') => void;
  activeMonth: string | 'all';
  onMonthChange: (month: string | 'all') => void;
  activeMood: MoodType | 'all';
  onMoodChange: (mood: MoodType | 'all') => void;
  activeCollectionId: string | 'all';
  onCollectionChange: (colId: string | 'all') => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
  availableYears: string[];
  collections: ICollection[];
  onJumpToToday: () => void;
  onJumpToBeginning: () => void;
  onJumpToAnniversary: () => void;
  onResetFilters: () => void;
}

export const TimelineToolbar: React.FC<TimelineToolbarProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeYear,
  onYearChange,
  activeMonth,
  onMonthChange,
  activeMood,
  onMoodChange,
  activeCollectionId,
  onCollectionChange,
  showFavoritesOnly,
  onFavoritesToggle,
  availableYears,
  collections,
  onJumpToToday,
  onJumpToBeginning,
  onJumpToAnniversary,
  onResetFilters
}) => {
  const hasActiveFilters =
    searchQuery ||
    activeCategory !== 'all' ||
    activeYear !== 'all' ||
    activeMonth !== 'all' ||
    activeMood !== 'all' ||
    activeCollectionId !== 'all' ||
    showFavoritesOnly;

  return (
    <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-rose-100/90 shadow-xs space-y-4">
      {/* Row 1: Search, View Mode Switcher, Quick Jumps */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Realtime Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm mốc thời gian theo tiêu đề, địa điểm, nội dung, thẻ..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 3 View Mode Toggle Toolbar */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 self-start lg:self-auto">
          <button
            onClick={() => onViewModeChange('vertical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'vertical'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dòng thời gian trục dọc"
          >
            <Clock size={15} />
            <span>Vertical</span>
          </button>

          <button
            onClick={() => onViewModeChange('horizontal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'horizontal'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dòng thời gian trục ngang"
          >
            <Rows size={15} />
            <span>Horizontal</span>
          </button>

          <button
            onClick={() => onViewModeChange('calendar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'calendar'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dòng thời gian chế độ Lịch"
          >
            <CalendarHeart size={15} />
            <span>Calendar</span>
          </button>
        </div>

        {/* Navigation Jump Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={onJumpToToday}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all flex items-center gap-1 border border-slate-200"
          >
            <Compass size={14} className="text-rose-500" />
            <span>Hôm nay</span>
          </button>

          <button
            onClick={onJumpToBeginning}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all flex items-center gap-1 border border-slate-200"
          >
            <ArrowUpCircle size={14} className="text-blue-500" />
            <span>Khởi đầu</span>
          </button>

          <button
            onClick={onJumpToAnniversary}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all flex items-center gap-1 border border-slate-200"
          >
            <CalendarHeart size={14} className="text-pink-500" />
            <span>Kỷ niệm</span>
          </button>
        </div>
      </div>

      {/* Row 2: Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'all'
              ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
              : 'bg-slate-100/80 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          ✨ Tất cả loại ({Object.keys(TIMELINE_CATEGORIES).length})
        </button>

        {Object.values(TIMELINE_CATEGORIES).map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isActive
                  ? `${cat.badgeBg} ${cat.badgeBorder} shadow-xs ring-2 ring-rose-400`
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Row 3: Multi-condition Filters & Year Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Year Ribbon / Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Calendar size={13} className="text-rose-500" />
            Năm:
          </span>
          <button
            onClick={() => onYearChange('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeYear === 'all'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            Tất cả
          </button>
          {availableYears.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeYear === y
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Dropdowns: Month, Mood, Collection & Favorites Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Month Selector */}
          <select
            value={activeMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả Tháng</option>
            {Array.from({ length: 12 }, (_, i) => {
              const mNum = (i + 1).toString().padStart(2, '0');
              return (
                <option key={mNum} value={mNum}>
                  Tháng {mNum}
                </option>
              );
            })}
          </select>

          {/* Mood Selector */}
          <select
            value={activeMood}
            onChange={(e) => onMoodChange(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả Cảm xúc</option>
            <option value="Romantic">✨ Sâu lắng</option>
            <option value="Happy">😊 Vui vẻ</option>
            <option value="Excited">🎉 Hào hứng</option>
            <option value="Gentle">🌸 Dịu dàng</option>
            <option value="Magical">✨ Diệu kỳ</option>
            <option value="Cozy">☕ Ấm áp</option>
          </select>

          {/* Collection Selector */}
          <select
            value={activeCollectionId}
            onChange={(e) => onCollectionChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none max-w-[140px] truncate"
          >
            <option value="all">Tất cả Bộ sưu tập</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.icon} {col.name}
              </option>
            ))}
          </select>

          {/* Favorites Toggle Button */}
          <button
            onClick={onFavoritesToggle}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border ${
              showFavoritesOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
            }`}
          >
            <Heart size={14} className={showFavoritesOnly ? 'fill-white' : 'text-rose-500'} />
            <span>Yêu thích</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
