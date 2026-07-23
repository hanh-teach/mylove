import { useState, useEffect, useMemo } from 'react';
import { IMemory, TimelineCategory, MoodType } from '../../memory/MemoryTypes';
import { INITIAL_MEMORIES } from '../../memory/MemoryService';

export function useMemoryPanel() {
  const [memories, setMemories] = useState<IMemory[]>(INITIAL_MEMORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory | 'All' | 'Favorites'>('All');
  const [activePreviewMemory, setActivePreviewMemory] = useState<IMemory | null>(null);
  const [selectedMemoryForAI, setSelectedMemoryForAI] = useState<IMemory | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('love_note_memories_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMemories(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      if (selectedCategory === 'Favorites') {
        return m.isFavorite;
      }
      if (selectedCategory !== 'All') {
        // match category or type
        return m.category === selectedCategory || 
          (selectedCategory === 'Photo' && m.type === 'image') ||
          (selectedCategory === 'Letter' && m.type === 'letter');
      }

      return true;
    });
  }, [memories, searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    const updated = memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
    setMemories(updated);
    try {
      localStorage.setItem('love_note_memories_v2', JSON.stringify(updated));
    } catch (e) {}
  };

  return {
    memories,
    filteredMemories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activePreviewMemory,
    setActivePreviewMemory,
    selectedMemoryForAI,
    setSelectedMemoryForAI,
    toggleFavorite,
  };
}
