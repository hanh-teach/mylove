import React, { useState } from 'react';
import { IMemory, ITag } from '../../modules/memory/MemoryTypes';
import { Heart, MapPin, Calendar, Eye, Copy, Trash2, Edit3, Download, ExternalLink, Image, FileText, Video, Music, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryCardProps {
  memory: IMemory;
  allTags: ITag[];
  onOpen: (memory: IMemory) => void;
  onEdit: (memory: IMemory) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDuplicate: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onExport: (memory: IMemory, e: React.MouseEvent) => void;
  onOpenRelated?: (id: string, e: React.MouseEvent) => void;
}

const moodEmojis: Record<string, string> = {
  Happy: '😊 Vui vẻ',
  Romantic: '✨ Sâu lắng',
  Excited: '🎉 Hào hứng',
  Gentle: '🌸 Dịu dàng',
  Magical: '✨ Diệu kỳ',
  Cozy: '☕ Ấm áp',
};

const moodColors: Record<string, string> = {
  Happy: 'bg-amber-100 text-amber-800 border-amber-200',
  Romantic: 'bg-rose-100 text-rose-800 border-rose-200',
  Excited: 'bg-purple-100 text-purple-800 border-purple-200',
  Gentle: 'bg-pink-100 text-pink-800 border-pink-200',
  Magical: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Cozy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const typeIcons: Record<string, React.ReactNode> = {
  image: <Image size={14} className="text-blue-500" />,
  letter: <FileText size={14} className="text-amber-500" />,
  video: <Video size={14} className="text-purple-500" />,
  music: <Music size={14} className="text-emerald-500" />,
  timeline: <Clock size={14} className="text-sky-500" />,
};

export const MemoryCard: React.FC<MemoryCardProps> = React.memo(({
  memory,
  allTags,
  onOpen,
  onEdit,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onExport,
  onOpenRelated,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);
    onToggleFavorite(memory.id, e);
  };

  const tagColorMap = new Map(allTags.map(t => [t.name, t.color]));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpen(memory)}
      className="group relative bg-white/90 backdrop-blur-md rounded-2xl border border-rose-100/90 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Cover Image / Gradient Header */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
        {memory.coverImage ? (
          <img
            src={memory.coverImage}
            alt={memory.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-rose-300 p-4 text-center">
            <Heart size={48} className="fill-rose-200/50 stroke-rose-400 mb-2 animate-pulse" />
            <span className="text-xs font-medium text-rose-600/80 line-clamp-2 px-2">{memory.content}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {/* Mood Badge */}
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${moodColors[memory.mood] || 'bg-white/80 text-slate-700'}`}>
            {moodEmojis[memory.mood] || memory.mood}
          </span>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-200 ${
              memory.isFavorite
                ? 'bg-rose-500 text-white scale-105'
                : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
            }`}
            title={memory.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart
              size={16}
              className={`${memory.isFavorite ? 'fill-white stroke-white' : ''} ${
                heartAnim ? 'animate-ping' : ''
              }`}
            />
          </button>
        </div>

        {/* Quick Hover Overlay Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center gap-2 p-3 z-20"
            >
              <button
                onClick={(e) => { e.stopPropagation(); onOpen(memory); }}
                className="p-2.5 rounded-full bg-white text-slate-800 hover:bg-rose-500 hover:text-white transition-colors shadow-md"
                title="Mở chi tiết"
              >
                <ExternalLink size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(memory); }}
                className="p-2.5 rounded-full bg-white text-slate-800 hover:bg-blue-500 hover:text-white transition-colors shadow-md"
                title="Chỉnh sửa"
              >
                <Edit3 size={16} />
              </button>
              {onOpenRelated && (
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenRelated(memory.id, e); }}
                  className="p-2.5 rounded-full bg-slate-900 text-white hover:bg-rose-600 transition-colors shadow-md"
                  title="Relationship Engine"
                >
                  <Sparkles size={16} />
                </button>
              )}
              <button
                onClick={(e) => onDuplicate(memory.id, e)}
                className="p-2.5 rounded-full bg-white text-slate-800 hover:bg-purple-500 hover:text-white transition-colors shadow-md"
                title="Nhân bản"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={(e) => onExport(memory, e)}
                className="p-2.5 rounded-full bg-white text-slate-800 hover:bg-emerald-500 hover:text-white transition-colors shadow-md"
                title="Xuất kỉ niệm"
              >
                <Download size={16} />
              </button>
              <button
                onClick={(e) => onDelete(memory.id, e)}
                className="p-2.5 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-md"
                title="Xóa kỷ niệm"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Count & Type Indicator Bottom Overlay */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-white drop-shadow-md z-10 pointer-events-none">
          <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
            {typeIcons[memory.type]}
            <span className="capitalize">{memory.type}</span>
          </span>
          <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
            <Eye size={12} />
            {memory.viewCount || 0}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-slate-800 text-base mb-1 group-hover:text-rose-600 transition-colors">
            {memory.title}
          </h3>

          {/* Collapsed View Meta (Always visible) */}
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-2 group-hover:hidden">
             <span className="flex items-center gap-1">
               <Calendar size={12} className="text-rose-300" />
               {memory.date}
             </span>
             {memory.location && (
               <span className="flex items-center gap-1">
                 <MapPin size={12} className="text-rose-300" />
                 {memory.location.split(',')[0]}
               </span>
             )}
          </div>
        </div>

        {/* Expanded View (Visible only on hover) */}
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={isHovered ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {/* Detailed Meta */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-3 pt-1 border-t border-slate-50">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-rose-400" />
              {memory.date}
            </span>
            {memory.location && (
              <span className="flex items-center gap-1" title={memory.location}>
                <MapPin size={13} className="text-rose-400" />
                {memory.location}
              </span>
            )}
          </div>

          {/* Snippet / Content Preview */}
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {memory.content}
          </p>

          {/* Tags Footer */}
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {memory.tags.slice(0, 3).map((tag, idx) => {
                const customColor = tagColorMap.get(tag) || '#f43f5e';
                return (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-700 bg-slate-50 border border-slate-100 flex items-center gap-1"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: customColor }}
                    />
                    {tag}
                  </span>
                );
              })}
              {memory.tags.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{memory.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});
