import React, { useState } from 'react';
import { ICollection, IMemory, ITag } from '../../modules/memory/MemoryTypes';
import { MemoryService } from '../../modules/memory/MemoryService';
import { PhotoViewerModal } from './PhotoViewerModal';
import { X, Heart, Calendar, MapPin, Sparkles, Download, Edit3, Trash2, Eye, Tag as TagIcon, Clock, Image as ImageIcon, FileText, FolderHeart, ArrowRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryDetailPanelProps {
  memory: IMemory | null;
  allMemories?: IMemory[];
  allTags: ITag[];
  collections?: ICollection[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (memory: IMemory) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (memory: IMemory) => void;
  onSelectRelated?: (memory: IMemory) => void;
}

const moodEmojis: Record<string, string> = {
  Happy: '😊 Vui vẻ',
  Romantic: '✨ Sâu lắng',
  Excited: '🎉 Hào hứng',
  Gentle: '🌸 Dịu dàng',
  Magical: '✨ Diệu kỳ',
  Cozy: '☕ Ấm áp',
};

export const MemoryDetailPanel: React.FC<MemoryDetailPanelProps> = ({
  memory,
  allMemories = [],
  allTags,
  collections = [],
  isOpen,
  onClose,
  onEdit,
  onToggleFavorite,
  onDelete,
  onExport,
  onSelectRelated,
}) => {
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [initialPhotoIdx, setInitialPhotoIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!memory || !isOpen) return null;

  const tagColorMap = new Map(allTags.map(t => [t.name, t.color]));
  const collection = collections.find(c => c.id === memory.collectionId);

  // Compute related memories
  const relatedMemories = MemoryService.getRelatedMemories(memory, allMemories, 3);

  // Collect all photos for photo viewer
  const allPhotos: string[] = [];
  if (memory.coverImage) allPhotos.push(memory.coverImage);
  if (memory.mediaUrls) {
    memory.mediaUrls.forEach(url => {
      if (!allPhotos.includes(url)) allPhotos.push(url);
    });
  }

  const handleOpenPhoto = (idx: number) => {
    setInitialPhotoIdx(idx);
    setPhotoViewerOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className={`fixed inset-0 z-50 overflow-hidden flex ${isMobile ? 'items-end justify-center' : 'justify-end'}`}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-Over Drawer / Bottom Sheet */}
            <motion.div
              initial={isMobile ? { y: '100%', x: 0 } : { x: '100%', y: 0 }}
              animate={{ x: 0, y: 0 }}
              exit={isMobile ? { y: '100%', x: 0 } : { x: '100%', y: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className={`relative w-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden ${
                isMobile 
                  ? 'rounded-t-[32px] h-[88vh] max-h-[88vh] pb-safe' 
                  : 'max-w-2xl h-full'
              }`}
            >
              {/* Grab handle for mobile bottom sheet */}
              {isMobile && (
                <div className="w-full flex justify-center py-2 bg-rose-50/50 shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-slate-300/80" />
                </div>
              )}
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
                    <Sparkles size={20} />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Chi tiết kỷ niệm</h2>
                    <p className="text-xs text-slate-500">Love Note #4.0 Memory Engine</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleFavorite(memory.id)}
                    className={`p-2.5 rounded-full transition-all ${
                      memory.isFavorite
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-white text-slate-400 border border-slate-200 hover:text-rose-500'
                    }`}
                    title={memory.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart size={18} className={memory.isFavorite ? 'fill-white stroke-white' : ''} />
                  </button>
                  <button
                    onClick={() => onExport(memory)}
                    className="p-2.5 rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    title="Xuất kỉ niệm"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(memory)}
                    className="p-2.5 rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="Sửa kỷ niệm"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa kỷ niệm này?')) {
                        onDelete(memory.id);
                        onClose();
                      }
                    }}
                    className="p-2.5 rounded-full bg-white text-red-500 border border-slate-200 hover:bg-red-50 transition-colors"
                    title="Xóa kỷ niệm"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors ml-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Cover Header */}
                {memory.coverImage && (
                  <div
                    onClick={() => handleOpenPhoto(0)}
                    className="relative h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                  >
                    <img
                      src={memory.coverImage}
                      alt={memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <span className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={16} />
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                          {moodEmojis[memory.mood] || memory.mood}
                        </span>
                        {collection && (
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                            style={{ backgroundColor: collection.color }}
                          >
                            <span>{collection.icon}</span>
                            {collection.name}
                          </span>
                        )}
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
                        {memory.title}
                      </h1>
                    </div>
                  </div>
                )}

                {!memory.coverImage && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                        {moodEmojis[memory.mood] || memory.mood}
                      </span>
                      {collection && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                          style={{ backgroundColor: collection.color }}
                        >
                          <span>{collection.icon}</span>
                          {collection.name}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">{memory.title}</h1>
                  </div>
                )}

                {/* Metadata Info Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={16} className="text-rose-500" />
                    <div>
                      <div className="text-[10px] text-slate-400">Thời gian</div>
                      <div className="font-semibold text-slate-800">{memory.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} className="text-rose-500" />
                    <div>
                      <div className="text-[10px] text-slate-400">Địa điểm</div>
                      <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                        {memory.location || 'Chưa cập nhật'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Eye size={16} className="text-rose-500" />
                    <div>
                      <div className="text-[10px] text-slate-400">Lượt xem</div>
                      <div className="font-semibold text-slate-800">{memory.viewCount || 0} lần</div>
                    </div>
                  </div>
                </div>

                {/* AI Summary Card */}
                {memory.aiSummary && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border border-rose-200/80 shadow-xs">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
                      <Sparkles size={16} className="text-rose-500 animate-spin-slow" />
                      AI Memory Insight
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {memory.aiSummary}
                    </p>
                  </div>
                )}

                {/* Story / Love Letter Content */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-rose-500" />
                    Nội dung kỷ niệm & Lời nhắn
                  </h3>
                  <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-100 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif italic shadow-inner">
                    "{memory.content}"
                  </div>
                </div>

                {/* Personal Notes */}
                {memory.notes && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Ghi chú riêng tư
                    </h3>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {memory.notes}
                    </div>
                  </div>
                )}

                {/* Timeline Events Linked */}
                {memory.timelineEvents && memory.timelineEvents.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Clock size={16} className="text-sky-500" />
                      Mốc thời gian liên kết ({memory.timelineEvents.length})
                    </h3>
                    <div className="space-y-2 border-l-2 border-sky-200 pl-4 ml-2">
                      {memory.timelineEvents.map((event) => (
                        <div key={event.id} className="relative pb-2">
                          <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white" />
                          <div className="text-xs font-bold text-slate-800">{event.title}</div>
                          <div className="text-[11px] text-sky-600 font-medium mb-0.5">{event.date}</div>
                          {event.description && (
                            <div className="text-xs text-slate-600">{event.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Gallery */}
                {memory.mediaUrls && memory.mediaUrls.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <ImageIcon size={16} className="text-purple-500" />
                      Bộ sưu tập ảnh ({memory.mediaUrls.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {memory.mediaUrls.map((url, i) => {
                        const photoIndex = allPhotos.indexOf(url);
                        return (
                          <div
                            key={i}
                            onClick={() => handleOpenPhoto(photoIndex >= 0 ? photoIndex : 0)}
                            className="group relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs cursor-pointer"
                          >
                            <img
                              src={url}
                              alt={`Media ${i}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Maximize2 size={16} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {memory.tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TagIcon size={14} />
                      Danh sách thẻ
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag, idx) => {
                        const color = tagColorMap.get(tag) || '#f43f5e';
                        return (
                          <span
                            key={idx}
                            className="text-xs font-medium px-3 py-1 rounded-lg text-slate-800 bg-slate-100 flex items-center gap-1.5 border border-slate-200"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            #{tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Related Memories ("Gợi ý kỷ niệm liên quan") */}
                {relatedMemories.length > 0 && (
                  <div className="pt-4 border-t border-slate-200/80 space-y-3">
                    <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} />
                      Kỷ niệm tương tự có thể bạn muốn xem lại
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {relatedMemories.map((rel) => (
                        <div
                          key={rel.id}
                          onClick={() => onSelectRelated && onSelectRelated(rel)}
                          className="p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-100/60 border border-rose-100 transition-all cursor-pointer space-y-1.5 group"
                        >
                          <div className="text-xs font-bold text-slate-800 truncate group-hover:text-rose-600">
                            {rel.title}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center justify-between">
                            <span>{rel.date}</span>
                            <ArrowRight size={12} className="text-rose-500 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-400">
                  Lần cuối cập nhật: {new Date(memory.updatedAt).toLocaleDateString('vi-VN')}
                </span>
                <button
                  onClick={() => {
                    onEdit(memory);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Chỉnh sửa ngay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Photo Lightbox Modal */}
      <PhotoViewerModal
        images={allPhotos}
        initialIndex={initialPhotoIdx}
        isOpen={photoViewerOpen}
        onClose={() => setPhotoViewerOpen(false)}
        title={memory.title}
      />
    </>
  );
};

