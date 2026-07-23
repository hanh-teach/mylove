import React from 'react';
import { ICollection, IMemory, ITag, TIMELINE_CATEGORIES } from '../../modules/memory/MemoryTypes';
import { resolveMemoryCategory } from '../../modules/memory/MemoryService';
import { Calendar, MapPin, Heart, ArrowRight, Eye, Edit, Tag as TagIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineCardProps {
  memory: IMemory;
  collections: ICollection[];
  allTags: ITag[];
  onClick: (memory: IMemory) => void;
  onEdit?: (memory: IMemory) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  compact?: boolean;
}

const moodEmojis: Record<string, string> = {
  Happy: '😊 Vui vẻ',
  Romantic: '✨ Sâu lắng',
  Excited: '🎉 Hào hứng',
  Gentle: '🌸 Dịu dàng',
  Magical: '✨ Diệu kỳ',
  Cozy: '☕ Ấm áp'
};

export const TimelineCardComponent: React.FC<TimelineCardProps> = ({
  memory,
  collections,
  allTags,
  onClick,
  onEdit,
  onToggleFavorite,
  compact = false
}) => {
  const categoryKey = memory.category || resolveMemoryCategory(memory);
  const categoryConfig = TIMELINE_CATEGORIES[categoryKey] || TIMELINE_CATEGORIES.Love;
  const collection = collections.find(c => c.id === memory.collectionId);

  if (compact) {
    return (
      <div
        onClick={() => onClick(memory)}
        className="group relative bg-white/90 hover:bg-white border border-slate-200/80 hover:border-rose-300 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 shadow-2xs border ${categoryConfig.badgeBg} ${categoryConfig.badgeBorder}`}
          >
            <span>{categoryConfig.icon}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 group-hover:text-rose-600 transition-colors truncate">
                {memory.title}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${categoryConfig.badgeBg}`}>
                {categoryConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>{memory.date}</span>
              <span>•</span>
              <span className="truncate">{memory.location || 'Chưa có vị trí'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-600 hidden sm:inline-block">
            {moodEmojis[memory.mood] || memory.mood}
          </span>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    );
  }

  // Compute attachment metrics for detailed display
  const photoCount = memory.type === 'image' ? (memory.mediaUrls?.length || 1) : 0;
  const videoCount = memory.type === 'video' ? 1 : 0;
  const hasDiary = memory.type === 'letter' || (memory.content && memory.content.length > 50);
  const hasSpeech = memory.tags?.includes('Speech') || memory.notes?.toLowerCase().includes('speech') || memory.content?.toLowerCase().includes('ghi âm');
  const hasAIDraft = !!memory.aiSummary;
  const hasWorkflow = memory.tags?.includes('Workflow') || (memory.notes && memory.notes.toLowerCase().includes('quy trình'));

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(memory)}
      className="group relative bg-white/95 hover:bg-white border border-slate-200/90 hover:border-rose-300 rounded-3xl p-5 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1 border ${categoryConfig.badgeBg} ${categoryConfig.badgeBorder}`}
            >
              <span>{categoryConfig.icon}</span>
              <span>{categoryConfig.label}</span>
            </span>

            {collection && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center gap-1">
                <span>{collection.icon}</span>
                <span>{collection.name}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                onClick={(e) => onToggleFavorite(memory.id, e)}
                className={`p-1.5 rounded-full transition-colors ${
                  memory.isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'
                }`}
                title="Yêu thích"
              >
                <Heart size={16} className={memory.isFavorite ? 'fill-rose-500' : ''} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(memory);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Chỉnh sửa"
              >
                <Edit size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {memory.coverImage && (
          <div className="w-full h-44 rounded-2xl overflow-hidden mb-3 shadow-2xs relative bg-slate-100">
            <img
              src={memory.coverImage}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-black text-slate-800 group-hover:text-rose-600 transition-colors leading-snug mb-2">
          {memory.title}
        </h3>

        {/* Story Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {memory.content}
        </p>

        {/* Attachment Badges / Metrics - Dynamic Indicators */}
        <div className="flex flex-wrap gap-1.5 mb-4 pt-1">
          {photoCount > 0 && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
              📸 {photoCount} Ảnh
            </span>
          )}
          {videoCount > 0 && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
              🎬 {videoCount} Video
            </span>
          )}
          {hasDiary && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
              📖 Diary
            </span>
          )}
          {hasSpeech && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-100 flex items-center gap-1">
              🎙️ Speech
            </span>
          )}
          {hasAIDraft && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
              ✨ AI Draft
            </span>
          )}
          {hasWorkflow && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-pink-50 text-pink-700 border border-pink-100 flex items-center gap-1">
              ⚡ Workflow
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Metadata */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-slate-700">
            <Calendar size={13} className="text-rose-500" />
            {memory.date}
          </span>
          {memory.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-rose-500" />
              <span className="truncate max-w-[120px]">{memory.location}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-rose-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
          <span>Open</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export const TimelineCard = React.memo(TimelineCardComponent);
