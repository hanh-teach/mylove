import React, { useState } from 'react';
import { useMemoryPanel } from './useMemoryPanel';
import { MemorySearch } from './MemorySearch';
import { MemoryCard } from './MemoryCard';
import { TimelineCard } from './TimelineCard';
import { PhotoCard } from './PhotoCard';
import { MemoryPreview } from './MemoryPreview';
import { IMemory, TimelineCategory } from '../../../modules/memory/MemoryTypes';
import { Heart, Calendar, Image as ImageIcon, MapPin, Users, Star, X, Sparkles, Plus, BookOpen } from 'lucide-react';

interface MemoryPanelProps {
  onInsertMemory: (memory: IMemory) => void;
  onSelectForAI: (memory: IMemory | null) => void;
  selectedMemoryForAI: IMemory | null;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  onInsertMemory,
  onSelectForAI,
  selectedMemoryForAI,
  onClose,
  isMobileDrawer = false,
}) => {
  const {
    filteredMemories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activePreviewMemory,
    setActivePreviewMemory,
    toggleFavorite,
  } = useMemoryPanel();

  const [activeTab, setActiveTab] = useState<'all' | 'timeline' | 'photos' | 'favorites'>('all');

  const categories: { id: TimelineCategory | 'All' | 'Favorites'; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'All', icon: <Sparkles size={13} /> },
    { id: 'Favorites', label: 'Favorites', icon: <Star size={13} /> },
    { id: 'Photo', label: 'Photos & Videos', icon: <ImageIcon size={13} /> },
    { id: 'Travel', label: 'Travel', icon: <MapPin size={13} /> },
    { id: 'Love', label: 'Events & Timeline', icon: <Calendar size={13} /> },
  ];

  return (
    <div className={`bg-white/98 backdrop-blur-md flex flex-col h-full border-l border-rose-100 ${isMobileDrawer ? 'w-full rounded-t-3xl shadow-2xl max-h-[85vh]' : 'w-full lg:w-[360px] shadow-lg'}`}>
      {/* Header */}
      <div className="bg-rose-50/70 border-b border-rose-100 px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-rose-900 font-serif font-bold text-base">
          <BookOpen size={18} className="text-rose-600" />
          <span>Memory Collection</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-rose-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-3.5 border-b border-rose-100 shrink-0 space-y-3">
        <MemorySearch query={searchQuery} onChange={setSearchQuery} />

        {/* Categories / Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50/70 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected AI Banner */}
      {selectedMemoryForAI && (
        <div className="bg-rose-100/70 border-b border-rose-200 px-4 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-rose-900 truncate">
            <Sparkles size={13} className="text-rose-600 shrink-0" />
            <span className="font-semibold truncate">AI Active: {selectedMemoryForAI.title}</span>
          </div>
          <button
            onClick={() => onSelectForAI(null)}
            className="text-rose-600 hover:text-rose-900 font-bold text-[11px]"
          >
            Clear
          </button>
        </div>
      )}

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <p className="text-xs">No memories found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMemories.map(mem => {
              const isSelectedAI = selectedMemoryForAI?.id === mem.id;
              if (mem.type === 'image' && selectedCategory === 'Photo') {
                return (
                  <PhotoCard
                    key={mem.id}
                    memory={mem}
                    onPreview={() => setActivePreviewMemory(mem)}
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'memory', memory: mem }))}
                  />
                );
              }
              if (selectedCategory === 'Love' || mem.category === 'Love') {
                return (
                  <TimelineCard
                    key={mem.id}
                    memory={mem}
                    onPreview={() => setActivePreviewMemory(mem)}
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'memory', memory: mem }))}
                  />
                );
              }
              return (
                <MemoryCard
                  key={mem.id}
                  memory={mem}
                  onPreview={() => setActivePreviewMemory(mem)}
                  onToggleFavorite={() => toggleFavorite(mem.id)}
                  onSelectForAI={() => onSelectForAI(isSelectedAI ? null : mem)}
                  isSelectedForAI={isSelectedAI}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'memory', memory: mem }))}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {activePreviewMemory && (
        <MemoryPreview
          memory={activePreviewMemory}
          onClose={() => setActivePreviewMemory(null)}
          onSelectForAI={() => {
            onSelectForAI(selectedMemoryForAI?.id === activePreviewMemory.id ? null : activePreviewMemory);
          }}
          isSelectedForAI={selectedMemoryForAI?.id === activePreviewMemory.id}
        />
      )}
    </div>
  );
};
