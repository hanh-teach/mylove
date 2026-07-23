import React, { useState } from 'react';
import { ICollection, IMemory, ITag, TIMELINE_CATEGORIES } from '../../modules/memory/MemoryTypes';
import { resolveMemoryCategory } from '../../modules/memory/MemoryService';
import { TimelineCard } from './TimelineCard';
import { Calendar, ChevronDown, ChevronUp, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VerticalTimelineProps {
  memories: IMemory[];
  collections: ICollection[];
  allTags: ITag[];
  onSelectMemory: (memory: IMemory) => void;
  onEditMemory?: (memory: IMemory) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onDropAsset?: (e: React.DragEvent, memoryId: string) => void;
}

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  memories,
  collections,
  allTags,
  onSelectMemory,
  onEditMemory,
  onToggleFavorite,
  onDropAsset
}) => {
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Group memories chronologically by Year
  const memoriesByYear = React.useMemo(() => {
    const sorted = [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const groups: Record<string, IMemory[]> = {};

    sorted.forEach((m) => {
      const year = m.date ? m.date.substring(0, 4) : 'Khác';
      if (!groups[year]) groups[year] = [];
      groups[year].push(m);
    });

    return groups;
  }, [memories]);

  const years = Object.keys(memoriesByYear).sort();

  // Track collapsed years state (default: all expanded)
  const [collapsedYears, setCollapsedYears] = useState<Record<string, boolean>>({});

  const toggleYearCollapse = (year: string) => {
    setCollapsedYears((prev) => ({ ...prev, [year]: !prev[year] }));
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
    <div className="space-y-12 relative py-4">
      {years.map((year) => {
        const yearMemories = memoriesByYear[year];
        const isCollapsed = collapsedYears[year];

        return (
          <div key={year} id={`year-section-${year}`} className="relative space-y-6">
            {/* Sticky Year Header */}
            <div className="sticky top-20 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md p-3.5 px-6 rounded-3xl border border-rose-200/90 shadow-md">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-2xl bg-rose-500 text-white font-black text-sm shadow-xs flex items-center gap-2">
                  <Calendar size={16} />
                  Năm {year}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {yearMemories.length} sự kiện kỷ niệm
                </span>
              </div>

              <button
                onClick={() => toggleYearCollapse(year)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center gap-1 transition-all"
              >
                <span>{isCollapsed ? 'Mở rộng' : 'Thu gọn'}</span>
                {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            {/* Year Group Content */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative border-l-2 sm:border-l-4 border-rose-200/80 ml-4 sm:ml-12 space-y-8 pl-6 sm:pl-10"
                >
                  {yearMemories.map((mem, index) => {
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
                        className={`relative group rounded-3xl p-2 transition-all ${
                          dragOverId === mem.id ? 'bg-rose-100/50 scale-[1.01] ring-2 ring-rose-400 border border-dashed border-rose-300' : ''
                        }`}
                      >
                        {/* Node Dot on thread */}
                        <div
                          onClick={() => onSelectMemory(mem)}
                          className="absolute -left-[32px] sm:-left-[48px] top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-3 border-rose-500 shadow-md group-hover:scale-125 transition-all cursor-pointer z-20 flex items-center justify-center"
                          title={`${mem.title} (${mem.date})`}
                        >
                          <span className="text-xs">{categoryConfig.icon}</span>
                        </div>

                        {/* Date label */}
                        <div className="mb-2 text-xs font-black text-slate-700 flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-extrabold">
                            {mem.date}
                          </span>
                          <span className="text-slate-500 font-medium">{mem.location}</span>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
