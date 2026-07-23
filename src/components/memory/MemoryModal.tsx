import React, { useState, useEffect } from 'react';
import { ICollection, IMemory, ITag, MemoryType, MoodType } from '../../modules/memory/MemoryTypes';
import { X, Sparkles, Image, MapPin, Calendar, Heart, Plus, Tag as TagIcon, FileText, Video, Music, Clock, FolderHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryToEdit: IMemory | null;
  allTags: ITag[];
  collections?: ICollection[];
  onSave: (memoryData: Omit<IMemory, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>, idToUpdate?: string) => void;
  onQuickGenerateAI?: (title: string, content: string) => Promise<string>;
}

const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
];

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  memoryToEdit,
  allTags,
  collections = [],
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<MoodType>('Romantic');
  const [type, setType] = useState<MemoryType>('image');
  const [collectionId, setCollectionId] = useState<string | undefined>(undefined);
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    if (memoryToEdit) {
      setTitle(memoryToEdit.title);
      setDate(memoryToEdit.date);
      setLocation(memoryToEdit.location || '');
      setMood(memoryToEdit.mood);
      setType(memoryToEdit.type);
      setCollectionId(memoryToEdit.collectionId);
      setCoverImage(memoryToEdit.coverImage || '');
      setContent(memoryToEdit.content);
      setAiSummary(memoryToEdit.aiSummary || '');
      setNotes(memoryToEdit.notes || '');
      setIsFavorite(memoryToEdit.isFavorite);
      setSelectedTags(memoryToEdit.tags || []);
    } else {
      // Reset form
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setLocation('');
      setMood('Romantic');
      setType('image');
      setCollectionId(collections[0]?.id);
      setCoverImage(SAMPLE_COVERS[0]);
      setContent('');
      setAiSummary('');
      setNotes('');
      setIsFavorite(false);
      setSelectedTags(['Anniversary']);
    }
  }, [memoryToEdit, isOpen, collections]);

  if (!isOpen) return null;

  const handleToggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const handleGenerateAISummary = () => {
    if (!content.trim()) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generated = `Kỷ niệm "${title || 'đáng nhớ'}" ghi dấu ấn đặc biệt với lời nhắn ấm áp, mở ra những phút giây lắng đọng giàu cảm xúc.`;
      setAiSummary(generated);
      setIsGeneratingAI(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave(
      {
        title: title.trim(),
        date,
        location: location.trim(),
        mood,
        type,
        collectionId,
        coverImage,
        content: content.trim(),
        aiSummary: aiSummary.trim() || undefined,
        notes: notes.trim() || undefined,
        isFavorite,
        tags: selectedTags,
        mediaUrls: coverImage ? [coverImage] : []
      },
      memoryToEdit ? memoryToEdit.id : undefined
    );

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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-md">
                <Heart size={20} className="fill-white" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {memoryToEdit ? 'Chỉnh sửa kỷ niệm' : 'Tạo kỷ niệm mới'}
                </h2>
                <p className="text-xs text-slate-500">Lưu giữ khoảnh khắc ngọt ngào của hai bạn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white text-slate-500 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tiêu đề kỷ niệm *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Chuyến đi Đà Lạt đầu tiên, Sinh nhật em..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Loại kỷ niệm
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MemoryType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="image">🖼️ Ảnh chụp</option>
                  <option value="letter">✉️ Bức thư & Bài viết</option>
                  <option value="video">🎬 Thước phim</option>
                  <option value="music">🎵 Bài hát</option>
                  <option value="timeline">⏱️ Mốc thời gian</option>
                </select>
              </div>
            </div>

            {/* Date, Location, Mood, Collection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Ngày tháng
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="VD: Đà Lạt, Thảo Điền, Home..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Cảm xúc (Mood)
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as MoodType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Romantic">✨ Sâu lắng</option>
                  <option value="Happy">😊 Vui vẻ</option>
                  <option value="Excited">🎉 Hào hứng</option>
                  <option value="Gentle">🌸 Dịu dàng</option>
                  <option value="Magical">✨ Diệu kỳ</option>
                  <option value="Cozy">☕ Ấm áp</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Bộ sưu tập
                </label>
                <select
                  value={collectionId || ''}
                  onChange={(e) => setCollectionId(e.target.value || undefined)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                >
                  <option value="">Không thuộc bộ sưu tập</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.icon} {col.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content / Love Letter */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Nội dung kỷ niệm & Lời nhắn *
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết lại những kỷ niệm đáng nhớ, cảm xúc hay lời nhắn gửi chân thành..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none resize-y leading-relaxed"
              />
            </div>

            {/* AI Summary Assistant */}
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-rose-500" />
                  Tóm tắt kỷ niệm bằng AI
                </span>
                <button
                  type="button"
                  onClick={handleGenerateAISummary}
                  disabled={isGeneratingAI || !content.trim()}
                  className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-[11px] hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {isGeneratingAI ? 'Đang tạo...' : 'Tạo tóm tắt AI'}
                </button>
              </div>
              <input
                type="text"
                value={aiSummary}
                onChange={(e) => setAiSummary(e.target.value)}
                placeholder="Nội dung tóm tắt AI sẽ tự động sinh tại đây..."
                className="w-full p-2 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none"
              />
            </div>

            {/* Cover Image URL & Sample Picker */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Link ảnh bìa (Cover Image URL)
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none mb-2"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Chọn mẫu nhanh:</span>
                <div className="flex gap-1.5 overflow-x-auto py-1">
                  {SAMPLE_COVERS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverImage(url)}
                      className={`w-9 h-9 rounded-lg overflow-hidden border-2 shrink-0 ${
                        coverImage === url ? 'border-rose-500 scale-105' : 'border-slate-200'
                      }`}
                    >
                      <img src={url} alt={`Sample ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags Checkboxes */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                <TagIcon size={14} />
                Gắn thẻ (Select Tags)
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.name)}
                      className={`px-3 py-1 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: isSelected ? '#ffffff' : tag.color }}
                      />
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes & Favorite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Ghi chú riêng
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú cá nhân..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 border-slate-300"
                  />
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                    Đánh dấu là Yêu thích (Favorite)
                  </span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                {memoryToEdit ? 'Lưu thay đổi' : 'Tạo kỷ niệm ngay'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
