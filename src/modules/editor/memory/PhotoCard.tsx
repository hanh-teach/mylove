import React from 'react';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { Image as ImageIcon } from 'lucide-react';

interface PhotoCardProps {
  memory: IMemory;
  onPreview: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ memory, onPreview, onDragStart }) => {
  const imageUrl = memory.coverImage || (memory.mediaUrls && memory.mediaUrls[0]);

  if (!imageUrl) return null;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onPreview}
      className="relative group rounded-xl overflow-hidden aspect-square bg-rose-100 shadow-xs border border-rose-100 cursor-pointer"
    >
      <img src={imageUrl} alt={memory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
        <span className="text-[11px] font-bold truncate">{memory.title}</span>
        <span className="text-[9px] text-rose-200">{memory.date}</span>
      </div>
    </div>
  );
};
