import React, { useState, useMemo } from 'react';
import { ICollection, IMemory, ITag } from '../../modules/memory/MemoryTypes';
import { MemoryCard } from './MemoryCard';
import { ChevronDown, ChevronRight, FolderHeart, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AlbumViewProps {
  memories: IMemory[];
  collections: ICollection[];
  allTags: ITag[];
  onOpenMemory: (memory: IMemory) => void;
  onEditMemory: (memory: IMemory) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicateMemory: (id: string, e: React.MouseEvent) => void;
  onDeleteMemory: (id: string) => void;
  onExportMemory: (memory: IMemory) => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  memories,
  collections,
  allTags,
  onOpenMemory,
  onEditMemory,
  onToggleFavorite,
  onDuplicateMemory,
  onDeleteMemory,
  onExportMemory,
}) => {
  // Map collectionId to Collection
  const collectionMap = useMemo(() => {
    return new Map(collections.map((c) => [c.id, c]));
  }, [collections]);

  // Group memories by Year -> then by Album/Collection
  const yearlyAlbums = useMemo(() => {
    const yearsMap = new Map<
      string,
      Map<string, { collection?: ICollection; items: IMemory[] }>
    >();

    memories.forEach((mem) => {
      const year = mem.date ? mem.date.substring(0, 4) : 'Khác';

      if (!yearsMap.has(year)) {
        yearsMap.set(year, new Map());
      }
      const albumGroup = yearsMap.get(year)!;

      const colKey = mem.collectionId || 'uncategorized';
      if (!albumGroup.has(colKey)) {
        albumGroup.set(colKey, {
          collection: collectionMap.get(colKey),
          items: [],
        });
      }
      albumGroup.get(colKey)!.items.push(mem);
    });

    // Convert to sorted structure
    const sortedYears = Array.from(yearsMap.entries()).sort(
      (a, b) => b[0].localeCompare(a[0])
    );

    return sortedYears.map(([year, albumsMap]) => ({
      year,
      albums: Array.from(albumsMap.entries()).map(([colId, data]) => ({
        colId,
        collection: data.collection,
        items: data.items,
      })),
    }));
  }, [memories, collectionMap]);

  // Track expanded years (default all open)
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      yearlyAlbums.forEach((y) => {
        initial[y.year] = true;
      });
      return initial;
    }
  );

  // Track expanded albums
  const [expandedAlbums, setExpandedAlbums] = useState<Record<string, boolean>>({});

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleAlbum = (albumKey: string) => {
    setExpandedAlbums((prev) => ({ ...prev, [albumKey]: !prev[albumKey] }));
  };

  if (memories.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-100 text-slate-500">
        Chưa có kỷ niệm nào để hiển thị Album.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {yearlyAlbums.map(({ year, albums }) => {
        const isYearExpanded = expandedYears[year] !== false;
        const totalYearMemories = albums.reduce((acc, a) => acc + a.items.length, 0);

        return (
          <div
            key={year}
            className="bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs overflow-hidden"
          >
            {/* Year Accordion Header */}
            <button
              onClick={() => toggleYear(year)}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-pink-50/30 to-white hover:bg-rose-50 transition-colors border-b border-rose-100/80"
            >
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-xs font-black text-sm">
                  <Calendar size={18} />
                </span>
                <div className="text-left">
                  <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    Năm {year}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700">
                      {albums.length} Album ({totalYearMemories} kỷ niệm)
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Nhật ký hình ảnh và kỷ niệm trong năm {year}
                  </p>
                </div>
              </div>

              <span className="p-2 rounded-xl bg-white text-slate-600 border border-slate-200">
                {isYearExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
            </button>

            {/* Year Content */}
            <AnimatePresence>
              {isYearExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 sm:p-6 space-y-5"
                >
                  {albums.map(({ colId, collection, items }) => {
                    const albumKey = `${year}-${colId}`;
                    const isAlbumExpanded = expandedAlbums[albumKey] !== false;

                    const title = collection ? collection.name : 'Album Tổng hợp & Khác';
                    const icon = collection ? collection.icon : '📂';
                    const color = collection ? collection.color : '#ec4899';
                    const coverThumb =
                      items.find((i) => i.coverImage)?.coverImage ||
                      items[0]?.mediaUrls?.[0] ||
                      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80';

                    return (
                      <div
                        key={albumKey}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 shadow-2xs"
                      >
                        {/* Album Card Header */}
                        <div
                          onClick={() => toggleAlbum(albumKey)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Album Thumbnail */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-2xs">
                              <img
                                src={coverThumb}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                              <span
                                className="absolute top-0 right-0 w-3.5 h-3.5 rounded-bl-lg"
                                style={{ backgroundColor: color }}
                              />
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-base">{icon}</span>
                                {title}
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  {items.length} items
                                </span>
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                {collection?.description || `Nhóm kỷ niệm thuộc mốc năm ${year}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <span className="text-xs text-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              {isAlbumExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                            </span>
                            <span className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600">
                              {isAlbumExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                          </div>
                        </div>

                        {/* Album Items Grid */}
                        <AnimatePresence>
                          {isAlbumExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-200/60"
                            >
                              {items.map((m) => (
                                <MemoryCard
                                  key={m.id}
                                  memory={m}
                                  allTags={allTags}
                                  onOpen={onOpenMemory}
                                  onEdit={onEditMemory}
                                  onToggleFavorite={onToggleFavorite}
                                  onDuplicate={onDuplicateMemory}
                                  onDelete={onDeleteMemory}
                                  onExport={onExportMemory}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
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
