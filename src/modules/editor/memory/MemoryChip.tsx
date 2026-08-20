import React from 'react';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { Heart, X } from 'lucide-react';

interface MemoryChipProps {
  memory: IMemory;
  onRemove: () => void;
}

export const MemoryChip: React.FC<MemoryChipProps> = ({ memory, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-xs font-serif text-rose-900 shadow-2xs my-1 mr-2 animate-fadeIn">
      <Heart size={12} className="text-rose-600 shrink-0" fill="currentColor" />
      <span className="font-bold truncate max-w-[180px]">{memory.title}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-rose-200/60 rounded-full text-rose-500 hover:text-rose-700 transition-colors ml-0.5"
        title="Remove memory chip"
      >
        <X size={12} />
      </button>
    </div>
  );
};
