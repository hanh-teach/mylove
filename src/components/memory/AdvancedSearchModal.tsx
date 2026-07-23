import React, { useState } from 'react';
import { ICollection, ITag, MemoryFilterOptions } from '../../modules/memory/MemoryTypes';
import { X, Search, Filter, Calendar, MapPin, Smile, FolderHeart, Tag as TagIcon, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterOptions: MemoryFilterOptions;
  collections: ICollection[];
  tags: ITag[];
  onApplyFilters: (newFilters: Partial<MemoryFilterOptions>) => void;
  onResetFilters: () => void;
}

const MOODS = [
  { id: 'all', label: 'Tất cả cảm xúc' },
  { id: 'Happy', label: '😊 Happy (Vui vẻ)' },
  { id: 'Romantic', label: '✨ Romantic (Sâu lắng)' },
  { id: 'Excited', label: '🎉 Excited (Hào hứng)' },
  { id: 'Gentle', label: '🌸 Gentle (Dịu dàng)' },
  { id: 'Magical', label: '✨ Magical (Diệu kỳ)' },
  { id: 'Cozy', label: '☕ Cozy (Ấm áp)' },
];

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  filterOptions,
  collections,
  tags,
  onApplyFilters,
  onResetFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState(filterOptions.searchQuery || '');
  const [startDate, setStartDate] = useState(filterOptions.startDate || '');
  const [endDate, setEndDate] = useState(filterOptions.endDate || '');
  const [locationQuery, setLocationQuery] = useState(filterOptions.locationQuery || '');
  const [mood, setMood] = useState(filterOptions.mood || 'all');
  const [collectionId, setCollectionId] = useState(filterOptions.collectionId || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>(filterOptions.selectedTags || []);

  if (!isOpen) return null;

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters({
      searchQuery,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      locationQuery: locationQuery || undefined,
      mood: mood as any,
      collectionId: collectionId || 'all',
      selectedTags,
    });
    onClose();
  };

  const handleReset = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setLocationQuery('');
    setMood('all');
    setCollectionId('all');
    setSelectedTags([]);
    onResetFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
                <Filter size={18} />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Tìm kiếm Nâng cao (Advanced Search)</h3>
                <p className="text-xs text-slate-500 font-medium">Lọc kỷ niệm theo nhiều tiêu chí kết hợp</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleApply} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Search size={14} className="text-rose-500" />
                Từ khóa tìm kiếm
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên kỷ niệm, địa điểm, từ khóa..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar size={14} className="text-rose-500" />
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar size={14} className="text-rose-500" />
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Location & Collection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-rose-500" />
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="VD: Đà Lạt, Thảo Điền..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FolderHeart size={14} className="text-rose-500" />
                  Bộ sưu tập
                </label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="all">Tất cả Bộ sưu tập</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mood Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Smile size={14} className="text-rose-500" />
                Cảm xúc (Mood)
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              >
                {MOODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Multiple Tags selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <TagIcon size={14} className="text-rose-500" />
                Chọn thẻ (Tags)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((t) => {
                  const isSel = selectedTags.includes(t.name);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isSel
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs scale-105'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                Đặt lại bộ lọc
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
