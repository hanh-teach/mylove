import React from 'react';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { Star, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';

interface MemoryCardProps {
  memory: IMemory;
  onPreview: () => void;
  onToggleFavorite: () => void;
  onSelectForAI: () => void;
  isSelectedForAI: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onPreview,
  onToggleFavorite,
  onSelectForAI,
  isSelectedForAI,
  onDragStart,
}) => {
  const photoCount = memory.mediaUrls?.length || (memory.coverImage ? 1 : 0);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onPreview}
      className={`group relative bg-white rounded-xl border p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col gap-2 ${
        isSelectedForAI ? 'border-rose-500 bg-rose-50/30' : 'border-rose-100 hover:border-rose-300'
      }`}
    >
      {memory.coverImage && (
        <div className="relative rounded-lg overflow-hidden h-28 bg-rose-100">
          <img src={memory.coverImage} alt={memory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px]">
            <ImageIcon size={11} />
            <span>{photoCount}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`absolute top-2 left-2 p-1.5 rounded-full bg-white/80 backdrop-blur-xs transition-colors ${
              memory.isFavorite ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
            }`}
          >
            <Star size={12} fill={memory.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h4 className="font-serif font-bold text-xs text-rose-950 line-clamp-1">{memory.title}</h4>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar size={11} className="text-rose-400" />
            {memory.date}
          </span>
          {memory.location && (
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <MapPin size={11} className="text-rose-400" />
              {memory.location}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-rose-50">
        <span className="text-[10px] bg-rose-100/70 text-rose-700 px-2 py-0.5 rounded-md font-medium">
          {memory.mood || 'Memory'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onSelectForAI(); }}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
            isSelectedForAI 
              ? 'bg-rose-600 text-white shadow-xs' 
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          {isSelectedForAI ? 'Selected for AI' : 'Use in AI'}
        </button>
      </div>
    </div>
  );
};
