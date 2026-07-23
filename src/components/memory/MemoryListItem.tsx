import React from 'react';
import { IMemory, ITag } from '../../modules/memory/MemoryTypes';
import { Heart, MapPin, Calendar, Eye, Copy, Trash2, Edit3, Download, ExternalLink, Image, FileText, Video, Music, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface MemoryListItemProps {
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

const typeIcons: Record<string, React.ReactNode> = {
  image: <Image size={14} className="text-blue-500" />,
  letter: <FileText size={14} className="text-amber-500" />,
  video: <Video size={14} className="text-purple-500" />,
  music: <Music size={14} className="text-emerald-500" />,
  timeline: <Clock size={14} className="text-sky-500" />,
};

export const MemoryListItem: React.FC<MemoryListItemProps> = React.memo(({
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
  const tagColorMap = new Map(allTags.map(t => [t.name, t.color]));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      onClick={() => onOpen(memory)}
      className="group bg-white/90 backdrop-blur-md rounded-2xl border border-rose-100/90 shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer mb-3"
    >
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Cover Thumbnail */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-rose-50 shrink-0 border border-rose-100">
          {memory.coverImage ? (
            <img
              src={memory.coverImage}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rose-300">
              <Heart size={28} className="fill-rose-100 stroke-rose-300" />
            </div>
          )}
          <span className="absolute top-1 left-1 p-1 rounded-md bg-black/50 text-white backdrop-blur-xs">
            {typeIcons[memory.type]}
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-rose-600 transition-colors">
              {memory.title}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
              {moodEmojis[memory.mood] || memory.mood}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-rose-400" />
              {memory.date}
            </span>
            {memory.location && (
              <span className="flex items-center gap-1 truncate max-w-[180px]">
                <MapPin size={13} className="text-rose-400" />
                {memory.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye size={13} className="text-slate-400" />
              {memory.viewCount || 0}
            </span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-1">
            {memory.content}
          </p>

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {memory.tags.map((tag, idx) => {
                const color = tagColorMap.get(tag) || '#f43f5e';
                return (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md text-slate-700 bg-slate-100 flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    #{tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 self-end md:self-center shrink-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={(e) => onToggleFavorite(memory.id, e)}
          className={`p-2 rounded-xl border transition-all ${
            memory.isFavorite
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-white text-slate-400 border-slate-200 hover:text-rose-500 hover:border-rose-300'
          }`}
          title={memory.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        >
          <Heart size={16} className={memory.isFavorite ? 'fill-white stroke-white' : ''} />
        </button>
        <button
          onClick={() => onOpen(memory)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          title="Xem chi tiết"
        >
          <ExternalLink size={16} />
        </button>
        <button
          onClick={() => onEdit(memory)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          title="Sửa"
        >
          <Edit3 size={16} />
        </button>
        {onOpenRelated && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenRelated(memory.id, e); }}
            className="p-2 rounded-xl bg-slate-900 text-white hover:bg-rose-600 transition-colors"
            title="Relationship Engine"
          >
            <Sparkles size={16} />
          </button>
        )}
        <button
          onClick={(e) => onDuplicate(memory.id, e)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
          title="Nhân bản"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={(e) => onExport(memory, e)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          title="Xuất kỉ niệm"
        >
          <Download size={16} />
        </button>
        <button
          onClick={(e) => onDelete(memory.id, e)}
          className="p-2 rounded-xl bg-slate-100 text-red-600 hover:bg-red-50 transition-colors"
          title="Xóa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
});
