import React from 'react';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { Calendar, Heart } from 'lucide-react';

interface TimelineCardProps {
  memory: IMemory;
  onPreview: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ memory, onPreview, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onPreview}
      className="p-3 bg-white rounded-xl border border-rose-100 hover:border-rose-300 shadow-xs transition-all cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <Heart size={14} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <h5 className="font-serif font-bold text-xs text-rose-950 group-hover:text-rose-600 transition-colors">
            {memory.title}
          </h5>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Calendar size={10} className="text-rose-400" />
            {memory.date} {memory.location ? `• ${memory.location}` : ''}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
        Drag to Editor
      </span>
    </div>
  );
};
