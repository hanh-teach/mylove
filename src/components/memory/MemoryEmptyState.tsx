import React from 'react';
import { Heart, Plus, Image, Sparkles, Search, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface MemoryEmptyStateProps {
  isSearchResult?: boolean;
  onClearFilters?: () => void;
  onCreateNew?: () => void;
}

export const MemoryEmptyState: React.FC<MemoryEmptyStateProps> = ({
  isSearchResult = false,
  onClearFilters,
  onCreateNew,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 md:p-16 rounded-3xl bg-white/80 backdrop-blur-md border border-rose-100/80 shadow-xs text-center flex flex-col items-center justify-center my-6"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner">
          {isSearchResult ? <Search size={36} /> : <Heart size={36} className="fill-rose-200 stroke-rose-500 animate-pulse" />}
        </div>
        <Sparkles size={20} className="absolute -top-1 -right-1 text-amber-400 animate-spin-slow" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">
        {isSearchResult ? 'Không tìm thấy kỷ niệm phù hợp' : 'Tạo kỷ niệm đầu tiên của bạn ✨'}
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {isSearchResult
          ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ các bộ lọc loại, cảm xúc, thẻ, thời gian để tìm lại khoảnh khắc mong muốn.'
          : 'Lưu giữ những chuyến đi đáng nhớ, bức thư tri ân, hình ảnh đẹp và mốc thời gian ý nghĩa trong hành trình cuộc sống.'}
      </p>

      {isSearchResult ? (
        <button
          onClick={onClearFilters}
          className="px-5 py-2.5 rounded-2xl bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-2 hover:bg-rose-100 hover:shadow-md transition-all active:scale-[0.98] shadow-xs"
        >
          <RefreshCw size={16} />
          Xóa tất cả bộ lọc
        </button>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            + Tạo kỷ niệm mới
          </button>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 rounded-2xl bg-white border border-rose-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-rose-50 hover:shadow-md transition-all active:scale-[0.98] shadow-xs"
          >
            <Image size={16} className="text-blue-500" />
            + Tải lên album ảnh
          </button>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-2 hover:bg-amber-100 hover:shadow-md transition-all active:scale-[0.98] shadow-xs"
          >
            <Sparkles size={16} className="text-amber-500" />
            + AI Viết Bài & Thư
          </button>
        </div>
      )}
    </motion.div>
  );
};
