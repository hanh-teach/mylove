import React, { useRef, useState } from 'react';
import { ICollection, IMemory, ITag, TIMELINE_CATEGORIES } from '../../modules/memory/MemoryTypes';
import { resolveMemoryCategory } from '../../modules/memory/MemoryService';
import { TimelineCard } from './TimelineCard';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';

interface HorizontalTimelineProps {
  memories: IMemory[];
  collections: ICollection[];
  allTags: ITag[];
  onSelectMemory: (memory: IMemory) => void;
  onEditMemory?: (memory: IMemory) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onDropAsset?: (e: React.DragEvent, memoryId: string) => void;
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  memories,
  collections,
  allTags,
  onSelectMemory,
  onEditMemory,
  onToggleFavorite,
  onDropAsset
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Chronological sort
  const sortedMemories = React.useMemo(() => {
    return [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [memories]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (memories.length === 0) {
    return (
      <div className="p-12 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-rose-100 text-slate-500 shadow-2xs space-y-3">
        <Sparkles size={32} className="mx-auto text-rose-300" />
        <h3 className="text-base font-bold text-slate-700">Chưa tìm thấy sự kiện nào</h3>
        <p className="text-xs text-slate-500">Hãy thử thay đổi điều kiện lọc hoặc tạo kỷ niệm mới.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-rose-100/90 shadow-xs space-y-4">
      {/* Scroll Navigation Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-rose-500 text-white font-bold">
            <Calendar size={18} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-800">Dòng thời gian nằm ngang</h3>
            <p className="text-[11px] text-slate-500">Cuộn sang trái/phải để theo dõi hành trình kỷ niệm</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-all shadow-2xs"
            title="Cuộn sang trái"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-all shadow-2xs"
            title="Cuộn sang phản"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Ribbon Timeline Axis Container */}
      <div className="relative pt-8 pb-12">
        {/* Central Horizontal Axis Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300 rounded-full z-0" />

        {/* Horizontal Scrollable Items */}
        <div
          ref={containerRef}
          className="flex items-center gap-6 overflow-x-auto pb-6 pt-2 px-4 scrollbar-none z-10 relative scroll-smooth"
        >
          {sortedMemories.map((mem, index) => {
            const categoryKey = mem.category || resolveMemoryCategory(mem);
            const categoryConfig = TIMELINE_CATEGORIES[categoryKey] || TIMELINE_CATEGORIES.Love;

            return (
              <div
                key={mem.id}
                id={`memory-node-${mem.id}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(mem.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverId(null);
                  if (onDropAsset) onDropAsset(e, mem.id);
                }}
                className={`shrink-0 w-80 space-y-3 relative group rounded-3xl p-2 transition-all ${
                  dragOverId === mem.id ? 'bg-rose-100/50 scale-[1.01] ring-2 ring-rose-400 border border-dashed border-rose-300' : ''
                }`}
              >
                {/* Connector Dot */}
                <div
                  onClick={() => onSelectMemory(mem)}
                  className="w-8 h-8 rounded-full bg-white border-3 border-rose-500 shadow-md mx-auto flex items-center justify-center cursor-pointer group-hover:scale-125 transition-transform z-20 relative"
                  title={mem.title}
                >
                  <span className="text-xs">{categoryConfig.icon}</span>
                </div>

                {/* Date Badge */}
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-extrabold text-xs shadow-2xs">
                    {mem.date}
                  </span>
                </div>

                {/* Timeline Card */}
                <TimelineCard
                  memory={mem}
                  collections={collections}
                  allTags={allTags}
                  onClick={onSelectMemory}
                  onEdit={onEditMemory}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
