import React from 'react';
import { ICollection, IMemory, ITag, TIMELINE_CATEGORIES } from '../../modules/memory/MemoryTypes';
import { MemoryService, resolveMemoryCategory } from '../../modules/memory/MemoryService';
import {
  X,
  Calendar,
  MapPin,
  Heart,
  Tag as TagIcon,
  FolderHeart,
  Edit,
  Trash2,
  Download,
  Eye,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineDetailDrawerProps {
  memory: IMemory | null;
  allMemories: IMemory[];
  allTags: ITag[];
  collections: ICollection[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (memory: IMemory) => void;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onExport: (memory: IMemory) => void;
  onSelectMemory: (memory: IMemory) => void;
}

const moodEmojis: Record<string, string> = {
  Happy: '😊 Vui vẻ',
  Romantic: '✨ Sâu lắng',
  Excited: '🎉 Hào hứng',
  Gentle: '🌸 Dịu dàng',
  Magical: '✨ Diệu kỳ',
  Cozy: '☕ Ấm áp'
};

export const TimelineDetailDrawer: React.FC<TimelineDetailDrawerProps> = ({
  memory,
  allMemories,
  allTags,
  collections,
  isOpen,
  onClose,
  onEdit,
  onToggleFavorite,
  onDelete,
  onExport,
  onSelectMemory
}) => {
  if (!memory) return null;

  const categoryKey = memory.category || resolveMemoryCategory(memory);
  const categoryConfig = TIMELINE_CATEGORIES[categoryKey] || TIMELINE_CATEGORIES.Love;
  const collection = collections.find(c => c.id === memory.collectionId);

  // Compute related memories
  const relatedMemories = MemoryService.getRelatedMemories(memory, allMemories, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col z-10 border-l border-rose-100"
          >
            {/* Header Banner */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
              {memory.coverImage ? (
                <img
                  src={memory.coverImage}
                  alt={memory.title}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center">
                  <Sparkles size={64} className="text-white/40 animate-pulse" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all shadow-md z-20"
                title="Đóng (Esc)"
              >
                <X size={20} />
              </button>

              {/* Badges on Banner */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
                <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 ${categoryConfig.badgeBg} border ${categoryConfig.badgeBorder}`}>
                  <span>{categoryConfig.icon}</span>
                  <span>{categoryConfig.label}</span>
                </span>

                {collection && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-md flex items-center gap-1">
                    <span>{collection.icon}</span>
                    <span>{collection.name}</span>
                  </span>
                )}
              </div>

              {/* Title & Metadata Over Banner */}
              <div className="absolute bottom-4 left-4 right-4 text-white z-20 space-y-2">
                <div className="flex items-center gap-3 text-xs font-bold text-rose-200">
                  <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    <Calendar size={13} className="text-rose-400" />
                    {memory.date}
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    <MapPin size={13} className="text-rose-400" />
                    {memory.location || 'Chưa cập nhật'}
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    {moodEmojis[memory.mood] || memory.mood}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                  {memory.title}
                </h2>
              </div>
            </div>

            {/* Drawer Body Contents */}
            <div className="p-6 sm:p-8 space-y-8 flex-1">
              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onToggleFavorite(memory.id, e)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      memory.isFavorite
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
                    }`}
                  >
                    <Heart size={15} className={memory.isFavorite ? 'fill-white' : ''} />
                    <span>{memory.isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
                  </button>

                  <button
                    onClick={() => onExport(memory)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Download size={15} />
                    <span>Xuất file</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onEdit(memory);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-blue-50 text-blue-600 transition-all"
                    title="Chỉnh sửa Event"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(memory.id);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-red-50 text-red-600 transition-all"
                    title="Xóa Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Story Content / Love Letter */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-rose-500" />
                  Câu chuyện & Tâm sự
                </h3>
                <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100/80 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {memory.content}
                </div>
              </div>

              {/* AI Summary if present */}
              {memory.aiSummary && (
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Tóm tắt AI
                  </h3>
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-amber-950 text-xs leading-relaxed font-medium">
                    {memory.aiSummary}
                  </div>
                </div>
              )}

              {/* Media Gallery Grid */}
              {memory.mediaUrls && memory.mediaUrls.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-rose-500" />
                    Bộ sưu tập hình ảnh ({memory.mediaUrls.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {memory.mediaUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="h-32 rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs group relative"
                      >
                        <img
                          src={url}
                          alt={`Gallery ${idx}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags & Private Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tags */}
                {memory.tags && memory.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <TagIcon size={14} className="text-rose-500" />
                      Thẻ phân loại
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {memory.tags.map((tag, idx) => {
                        const tagObj = allTags.find(t => t.name === tag);
                        return (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/80"
                            style={tagObj ? { backgroundColor: `${tagObj.color}15`, color: tagObj.color } : {}}
                          >
                            #{tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Private Notes */}
                {memory.notes && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Eye size={14} className="text-purple-500" />
                      Ghi chú riêng tư
                    </h3>
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-purple-900 text-xs italic">
                      "{memory.notes}"
                    </div>
                  </div>
                )}
              </div>

              {/* Related Memories */}
              {relatedMemories.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-rose-500" />
                      Kỷ niệm liên quan
                    </span>
                    <span className="text-[10px] text-slate-400">Gợi ý tự động</span>
                  </h3>

                  <div className="space-y-2.5">
                    {relatedMemories.map(rel => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectMemory(rel)}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-200 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          {rel.coverImage ? (
                            <img
                              src={rel.coverImage}
                              alt={rel.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center font-bold text-xs shrink-0">
                              ❤️
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                              {rel.title}
                            </h4>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{rel.date}</span>
                              <span>•</span>
                              <span>{rel.location}</span>
                            </div>
                          </div>
                        </div>

                        <ArrowRight size={16} className="text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
