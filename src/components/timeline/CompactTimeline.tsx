import React from 'react';
import { ICollection, IMemory, ITag, TIMELINE_CATEGORIES } from '../../modules/memory/MemoryTypes';
import { resolveMemoryCategory } from '../../modules/memory/MemoryService';
import { Calendar, MapPin, Heart, Edit, ArrowRight, Sparkles } from 'lucide-react';

interface CompactTimelineProps {
  memories: IMemory[];
  collections: ICollection[];
  allTags: ITag[];
  onSelectMemory: (memory: IMemory) => void;
  onEditMemory?: (memory: IMemory) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

const moodEmojis: Record<string, string> = {
  Happy: '😊 Vui vẻ',
  Romantic: '✨ Sâu lắng',
  Excited: '🎉 Hào hứng',
  Gentle: '🌸 Dịu dàng',
  Magical: '✨ Diệu kỳ',
  Cozy: '☕ Ấm áp'
};

export const CompactTimeline: React.FC<CompactTimelineProps> = ({
  memories,
  collections,
  allTags,
  onSelectMemory,
  onEditMemory,
  onToggleFavorite
}) => {
  const sortedMemories = React.useMemo(() => {
    return [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [memories]);

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
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-rose-100/80 bg-rose-50/30 flex items-center justify-between text-xs font-bold text-slate-600">
        <span>Danh sách sự kiện thu gọn ({sortedMemories.length})</span>
        <span>Sắp xếp theo thời gian</span>
      </div>

      <div className="divide-y divide-slate-100">
        {sortedMemories.map((mem) => {
          const categoryKey = mem.category || resolveMemoryCategory(mem);
          const categoryConfig = TIMELINE_CATEGORIES[categoryKey] || TIMELINE_CATEGORIES.Love;
          const collection = collections.find((c) => c.id === mem.collectionId);

          return (
            <div
              key={mem.id}
              id={`memory-node-${mem.id}`}
              onClick={() => onSelectMemory(mem)}
              className="p-4 hover:bg-rose-50/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Column: Icon, Title, Category */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border ${categoryConfig.badgeBg} ${categoryConfig.badgeBorder}`}
                >
                  <span>{categoryConfig.icon}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors truncate">
                      {mem.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${categoryConfig.badgeBg}`}>
                      {categoryConfig.label}
                    </span>
                    {collection && (
                      <span className="hidden md:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                        {collection.icon} {collection.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <Calendar size={12} />
                      {mem.date}
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin size={12} className="text-slate-400" />
                        {mem.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Mood, Actions & Arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold">
                  {moodEmojis[mem.mood] || mem.mood}
                </span>

                <div className="flex items-center gap-1">
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => onToggleFavorite(mem.id, e)}
                      className={`p-1.5 rounded-full transition-colors ${
                        mem.isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'
                      }`}
                    >
                      <Heart size={16} className={mem.isFavorite ? 'fill-rose-500' : ''} />
                    </button>
                  )}
                  {onEditMemory && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMemory(mem);
                      }}
                      className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit size={15} />
                    </button>
                  )}
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
