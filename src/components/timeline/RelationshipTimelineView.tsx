import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ICollection,
  IMemory,
  ITag,
  MoodType,
  TimelineCategory,
  TimelineViewMode,
  TIMELINE_CATEGORIES
} from '../../modules/memory/MemoryTypes';
import { MemoryService, resolveMemoryCategory } from '../../modules/memory/MemoryService';
import { TimelineToolbar } from './TimelineToolbar';
import { VerticalTimeline } from './VerticalTimeline';
import { HorizontalTimeline } from './HorizontalTimeline';
import { CalendarTimeline } from './CalendarTimeline';
import { TimelineDetailDrawer } from './TimelineDetailDrawer';
import { MemoryModal } from '../memory/MemoryModal';
import { assetStore } from '../../modules/asset/AssetStore';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import {
  Heart,
  Plus,
  Sparkles,
  Search,
  BookOpen,
  Calendar as CalendarIcon,
  MapPin,
  Tag as TagIcon,
  ChevronRight,
  Trash2,
  Edit2,
  Clock,
  Download,
  Check,
  Briefcase,
  Layers,
  HelpCircle,
  FolderPlus,
  FileText,
  Volume2,
  Video,
  Image as ImageIcon,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RelationshipTimelineViewProps {
  onOpenCreateModalCustom?: () => void;
}

export const RelationshipTimelineView: React.FC<RelationshipTimelineViewProps> = () => {
  // Core Data
  const [memories, setMemories] = useState<IMemory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [projectAssets, setProjectAssets] = useState<ProjectAsset[]>([]);

  // Toolbar & View State
  const [viewMode, setViewMode] = useState<TimelineViewMode>(() => {
    const saved = sessionStorage.getItem('timeline_view_mode');
    return (saved as TimelineViewMode) || 'vertical';
  });

  useEffect(() => {
    sessionStorage.setItem('timeline_view_mode', viewMode);
  }, [viewMode]);

  // Scroll Persistence
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('timeline_scroll_pos');
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem('timeline_scroll_pos', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TimelineCategory | 'all'>('all');
  const [activeYear, setActiveYear] = useState<string | 'all'>('all');
  const [activeMonth, setActiveMonth] = useState<string | 'all'>('all');
  const [activeMood, setActiveMood] = useState<MoodType | 'all'>('all');
  const [activeCollectionId, setActiveCollectionId] = useState<string | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals & Drawers
  const [selectedMemory, setSelectedMemory] = useState<IMemory | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryToEdit, setMemoryToEdit] = useState<IMemory | null>(null);

  // AI Context switches state per memory ID
  const [aiContextSources, setAiContextSources] = useState<Record<string, {
    photos: boolean;
    journal: boolean;
    notes: boolean;
    speech: boolean;
    memory: boolean;
    tags: boolean;
  }>>({});

  // AI draft generating state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Load Data
  const refreshData = useCallback(() => {
    setMemories(MemoryService.getMemories());
    setTags(MemoryService.getTags());
    setCollections(MemoryService.getCollections());
    setProjectAssets(assetStore.getAssets ? assetStore.getAssets() : []);
  }, []);

  useEffect(() => {
    refreshData();
    // Subscribe to asset store updates
    const unsubscribe = assetStore.subscribe ? assetStore.subscribe(() => {
      setProjectAssets(assetStore.getAssets ? assetStore.getAssets() : []);
    }) : () => {};
    return unsubscribe;
  }, [refreshData]);

  // Load AI context switches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('love_note_timeline_ai_sources_v1');
      if (stored) {
        setAiContextSources(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load AI sources toggles', e);
    }
  }, []);

  // Sync AI source toggles to local storage
  const handleToggleAiSource = (
    memoryId: string,
    key: 'photos' | 'journal' | 'notes' | 'speech' | 'memory' | 'tags'
  ) => {
    const defaultSources = {
      photos: true,
      journal: true,
      notes: true,
      speech: true,
      memory: true,
      tags: true
    };
    const current = aiContextSources[memoryId] || defaultSources;
    const updated = {
      ...aiContextSources,
      [memoryId]: {
        ...current,
        [key]: !current[key]
      }
    };
    setAiContextSources(updated);
    localStorage.setItem('love_note_timeline_ai_sources_v1', JSON.stringify(updated));
  };

  // Get active AI toggles for a memory
  const getAiSourcesForMemory = (memoryId: string) => {
    return aiContextSources[memoryId] || {
      photos: true,
      journal: true,
      notes: true,
      speech: true,
      memory: true,
      tags: true
    };
  };

  // Compute available years
  const availableYears = useMemo(() => {
    const ySet = new Set<string>();
    memories.forEach((m) => {
      if (m.date) ySet.add(m.date.substring(0, 4));
    });
    return Array.from(ySet).sort().reverse();
  }, [memories]);

  // Filter Memories
  const filteredMemories = useMemo(() => {
    return MemoryService.filterAndSortMemories(
      memories,
      {
        searchQuery,
        type: showFavoritesOnly ? 'favorites' : 'all',
        category: activeCategory,
        year: activeYear,
        month: activeMonth,
        mood: activeMood,
        collectionId: activeCollectionId
      },
      'oldest' // Chronological order
    );
  }, [
    memories,
    searchQuery,
    showFavoritesOnly,
    activeCategory,
    activeYear,
    activeMonth,
    activeMood,
    activeCollectionId
  ]);

  // Studio Timeline Stats Dashboard calculations
  const studioStats = useMemo(() => {
    const totalEvents = memories.length;
    let photoCount = 0;
    let videoCount = 0;
    let diaryCount = 0;
    let documentCount = 0;

    memories.forEach((m) => {
      // Calculate photo counts
      if (m.type === 'image') {
        photoCount += m.mediaUrls?.length || 1;
      } else if (m.mediaUrls && m.mediaUrls.length > 0) {
        photoCount += m.mediaUrls.length;
      }

      // Calculate video counts
      if (m.type === 'video' || m.tags?.includes('Video') || m.tags?.includes('video')) {
        videoCount += 1;
      }

      // Calculate diary / story counts
      if (m.type === 'letter' || (m.content && m.content.length > 50)) {
        diaryCount += 1;
      }

      // Calculate document / certificate / graduation / achievements
      if (
        m.category === 'Graduation' ||
        m.category === 'Achievement' ||
        m.tags?.includes('Certificate') ||
        m.tags?.includes('Bằng cấp')
      ) {
        documentCount += 1;
      }
    });

    return {
      events: totalEvents,
      photos: photoCount || 24, // Fallback base value if freshly initialized
      videos: videoCount || 3,
      diaries: diaryCount || 12,
      documents: documentCount || 5
    };
  }, [memories]);

  // Drop an asset onto a specific memory card (bound immediately)
  const handleDropAssetOnMemory = (e: React.DragEvent, memoryId: string) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data && data.type === 'asset' && data.assetId) {
          const asset = assetStore.getAssetById(data.assetId);
          if (asset && asset.url) {
            const memory = memories.find((m) => m.id === memoryId);
            if (memory) {
              const currentUrls = memory.mediaUrls || [];
              if (!currentUrls.includes(asset.url)) {
                const updatedUrls = [...currentUrls, asset.url];
                const updatedMemory = {
                  ...memory,
                  mediaUrls: updatedUrls,
                  coverImage: memory.coverImage || asset.url
                };
                MemoryService.updateMemory(memoryId, updatedMemory);
                refreshData();

                // If currently open, sync inspector
                if (selectedMemory && selectedMemory.id === memoryId) {
                  setSelectedMemory(updatedMemory);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error binding asset on memory:', err);
    }
  };

  // Update memory date (e.g. from dropping on a calendar date)
  const handleUpdateMemoryDate = useCallback((id: string, newDate: string) => {
    const memory = memories.find((m) => m.id === id);
    if (memory) {
      const updatedMemory = {
        ...memory,
        date: newDate
      };
      MemoryService.updateMemory(id, updatedMemory);
      refreshData();

      // Sync inspector if active
      if (selectedMemory && selectedMemory.id === id) {
        setSelectedMemory(updatedMemory);
      }
    }
  }, [memories, selectedMemory, refreshData]);

  // Selected memory click handler
  const handleSelectMemory = useCallback((memory: IMemory) => {
    setSelectedMemory(memory);
    setIsDetailDrawerOpen(true);
    MemoryService.incrementViewCount(memory.id);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setMemoryToEdit(null);
    setIsMemoryModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((memory: IMemory) => {
    setMemoryToEdit(memory);
    setIsMemoryModalOpen(true);
  }, []);

  const handleToggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = MemoryService.toggleFavorite(id);
    if (updated) {
      refreshData();
      if (selectedMemory && selectedMemory.id === id) {
        setSelectedMemory(updated);
      }
    }
  }, [selectedMemory, refreshData]);

  const handleDeleteMemory = useCallback((id: string) => {
    const memory = memories.find(m => m.id === id);
    if (!memory) return;

    MemoryService.deleteMemory(id);
    refreshData();
    
    if (selectedMemory && selectedMemory.id === id) {
      setIsDetailDrawerOpen(false);
      setSelectedMemory(null);
    }

    // Standardized Toast with Undo
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: `Đã xóa mốc kỷ niệm "${memory.title}"`,
        type: 'success',
        duration: 5000,
        onUndo: () => {
          MemoryService.addMemory(memory);
          refreshData();
        }
      }
    }));
  }, [memories, selectedMemory, refreshData]);

  const handleExportMemory = useCallback((memory: IMemory) => {
    MemoryService.exportMemoryAsText(memory);
  }, []);

  const handleSaveMemory = useCallback((
    data: Omit<IMemory, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>,
    idToUpdate?: string
  ) => {
    if (idToUpdate) {
      MemoryService.updateMemory(idToUpdate, data);
    } else {
      MemoryService.addMemory(data);
    }
    refreshData();
    setIsMemoryModalOpen(false);
  }, [refreshData]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveYear('all');
    setActiveMonth('all');
    setActiveMood('all');
    setActiveCollectionId('all');
    setShowFavoritesOnly(false);
  }, []);

  // Quick Navigation
  const handleJumpToToday = useCallback(() => {
    if (filteredMemories.length === 0) return;
    const todayStr = new Date().toISOString().substring(0, 10);
    let closest = filteredMemories[0];
    let minDiff = Math.abs(new Date(closest.date).getTime() - new Date(todayStr).getTime());

    filteredMemories.forEach((m) => {
      const diff = Math.abs(new Date(m.date).getTime() - new Date(todayStr).getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = m;
      }
    });

    const el = document.getElementById(`memory-node-${closest.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filteredMemories]);

  const handleJumpToBeginning = useCallback(() => {
    if (filteredMemories.length === 0) return;
    const first = filteredMemories[0];
    const el = document.getElementById(`memory-node-${first.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filteredMemories]);

  const handleJumpToAnniversary = useCallback(() => {
    if (filteredMemories.length === 0) return;
    const anniversaryMem = filteredMemories.find(
      (m) => m.tags.includes('Anniversary') || m.tags.includes('Wedding')
    ) || filteredMemories[0];
    const el = document.getElementById(`memory-node-${anniversaryMem.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filteredMemories]);

  // AI Generation simulation/typewriter logic
  const handleGenerateAIDraft = async (memory: IMemory) => {
    if (!memory) return;
    setIsGeneratingAI(true);
    // Simulate smart analysis based on active source switches
    const sources = getAiSourcesForMemory(memory.id);
    await new Promise((r) => setTimeout(r, 2000));

    let contentPieces = [];
    if (sources.memory) contentPieces.push(`Sự kiện: "${memory.title}" vào ngày ${memory.date} tại ${memory.location || 'lớp học'}`);
    if (sources.journal && memory.content) contentPieces.push(`Nhật ký cảm nhận: "${memory.content.substring(0, 80)}..."`);
    if (sources.photos && memory.mediaUrls && memory.mediaUrls.length > 0) contentPieces.push(`Phân tích hình ảnh: Chứa ${memory.mediaUrls.length} khoảnh khắc quý giá`);
    if (sources.tags && memory.tags && memory.tags.length > 0) contentPieces.push(`Thẻ liên kết: ${memory.tags.join(', ')}`);

    const summaryDraft = `✨ [AI DRAFT STUDIO] Tóm tắt tổng hợp từ dữ liệu Timeline:\n\nSự kiện ý nghĩa "${memory.title}" đã được kết nối với hệ thống nội dung của bạn. ${
      sources.photos ? `Hệ thống hình ảnh (${memory.mediaUrls?.length || 1} tệp) thể hiện bầu không khí vô cùng rạng rỡ.` : ''
    } ${
      sources.journal ? `Tâm tình ghi lại thể hiện một cảm xúc "${memory.mood}" đong đầy và sâu sắc.` : ''
    }\n\n👉 Ý tưởng sáng tạo: Hãy chuyển hóa tư liệu này thành bài viết tri ân hoặc kịch bản truyền cảm hứng trong Editor!`;

    // Update memory locally
    const updatedMemory = {
      ...memory,
      aiSummary: summaryDraft
    };
    MemoryService.updateMemory(memory.id, updatedMemory);
    refreshData();
    setSelectedMemory(updatedMemory);
    setIsGeneratingAI(false);
  };

  // Compile real-time text payload shown in inspector
  const compiledPayloadPreview = useMemo(() => {
    if (!selectedMemory) return '';
    const sources = getAiSourcesForMemory(selectedMemory.id);
    const parts: string[] = [];

    if (sources.memory) {
      parts.push(`[Sự Kiện] Title: ${selectedMemory.title} | Date: ${selectedMemory.date} | Location: ${selectedMemory.location || 'N/A'}`);
    }
    if (sources.journal && selectedMemory.content) {
      parts.push(`[Nhật Ký] "${selectedMemory.content}"`);
    }
    if (sources.photos) {
      const pCount = selectedMemory.type === 'image' ? (selectedMemory.mediaUrls?.length || 1) : (selectedMemory.mediaUrls?.length || 0);
      parts.push(`[Hình Ảnh] ${pCount} tệp đính kèm (${selectedMemory.coverImage ? 'Có ảnh bìa' : 'Không có ảnh bìa'})`);
    }
    if (sources.speech) {
      parts.push(`[Lời Thoại] ${selectedMemory.tags?.includes('Speech') ? 'Chứa file ghi âm giọng nói' : 'Trạng thái: Trống'}`);
    }
    if (sources.notes && selectedMemory.notes) {
      parts.push(`[Ghi Chú] "${selectedMemory.notes}"`);
    }
    if (sources.tags && selectedMemory.tags && selectedMemory.tags.length > 0) {
      parts.push(`[Thẻ Phân Loại] #${selectedMemory.tags.join(' #')}`);
    }

    return parts.join('\n\n');
  }, [selectedMemory, aiContextSources]);

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
      {/* 1. Header Banner & Dynamic Stats */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-rose-100 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-xs">
              <Sparkles size={22} className="fill-white" />
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Timeline Studio & Life Journey
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 uppercase tracking-wider">
              Studio 4.0
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-2xl leading-relaxed">
            Trung tâm tổ chức và kết nối nội dung theo trục thời gian tuyến tính. Kết nối ảnh, nhật ký, lời thoại, mốc kỷ niệm thành dữ liệu cho AI sáng tạo nội dung.
          </p>
        </div>

        {/* 5-Column High-Fidelity Stats Counter Panel */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 p-2 bg-slate-50/50 rounded-2xl border border-slate-200/60 shrink-0">
          <div className="text-center px-2 py-1.5 border-r border-slate-200 last:border-0">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase">Events</div>
            <div className="text-sm md:text-base font-black text-slate-800">{studioStats.events}</div>
          </div>
          <div className="text-center px-2 py-1.5 border-r border-slate-200 last:border-0">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase">Photos</div>
            <div className="text-sm md:text-base font-black text-slate-800 text-blue-600">{studioStats.photos}</div>
          </div>
          <div className="text-center px-2 py-1.5 border-r border-slate-200 last:border-0">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase">Videos</div>
            <div className="text-sm md:text-base font-black text-slate-800 text-purple-600">{studioStats.videos}</div>
          </div>
          <div className="text-center px-2 py-1.5 border-r border-slate-200 last:border-0">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase">Notes</div>
            <div className="text-sm md:text-base font-black text-slate-800 text-emerald-600">{studioStats.diaries}</div>
          </div>
          <div className="text-center px-2 py-1.5 last:border-0">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase">Docs</div>
            <div className="text-sm md:text-base font-black text-slate-800 text-amber-600">{studioStats.documents}</div>
          </div>
        </div>
      </div>

      {/* 2. Responsive Multi-Panel Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL 1: Left Panel - Sidebar (Filters, Statistics & Draggable Asset Library Dock) */}
        <div className="col-span-12 lg:col-span-3 space-y-6 lg:sticky lg:top-4 h-auto max-h-[calc(100vh-140px)] overflow-y-auto pr-1 pb-4 scrollbar-none">
          {/* Quick Filter Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Bộ lọc thông minh</h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Event categories select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mốc chủ đề</label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as any)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="all">✨ Tất cả loại ({Object.keys(TIMELINE_CATEGORIES).length})</option>
                {Object.values(TIMELINE_CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Favorite status filter */}
            <button
              onClick={() => setShowFavoritesOnly(prev => !prev)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                showFavoritesOnly
                  ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart size={14} className={showFavoritesOnly ? 'fill-white text-white' : 'text-rose-500'} />
                <span>Yêu thích nổi bật</span>
              </span>
              <span className="text-[10px] font-black">{memories.filter(m => m.isFavorite).length}</span>
            </button>
          </div>

          {/* DRAGGABLE ASSET & MEDIA DOCK */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-rose-500" />
                Thư viện Ảnh & Đính kèm
              </h3>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                Kéo tệp đa phương tiện thả trực tiếp vào thẻ sự kiện bất kỳ để liên kết nhanh không cần mở popup!
              </p>
            </div>

            {/* Asset Dock Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-xl scrollbar-none">
              {projectAssets.length > 0 ? (
                projectAssets.map((asset) => (
                  <div
                    key={asset.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'asset', assetId: asset.id }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 cursor-grab active:cursor-grabbing hover:border-rose-400 transition-all shadow-2xs"
                    title={`Kéo thả: ${asset.title}`}
                  >
                    {asset.type === 'image' || asset.type === 'ai' ? (
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-1 text-center">
                        {asset.type === 'audio' ? (
                          <Volume2 size={16} className="text-blue-500" />
                        ) : asset.type === 'video' ? (
                          <Video size={16} className="text-purple-500" />
                        ) : (
                          <FileText size={16} className="text-amber-500" />
                        )}
                        <span className="text-[8px] font-bold text-slate-600 truncate w-full mt-1 px-1">
                          {asset.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[9px] font-black text-white px-1.5 py-0.5 rounded-md bg-rose-500">
                        Kéo thả
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-6 text-center text-[11px] text-slate-400">
                  Thư viện chưa có ảnh nào.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL 2: Middle Panel - Main Timeline Canvas */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Main Controls, Toolbar & Add Event Action */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500 text-white font-extrabold text-[10px] uppercase">
                  Màn canvas chính
                </span>
                <span className="text-xs font-black text-slate-700">
                  Hiển thị {filteredMemories.length} / {memories.length} mốc thời gian
                </span>
              </div>

              {/* High prominence Add Timeline Event Button */}
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all shrink-0"
              >
                <Plus size={16} />
                + Tạo sự kiện mới
              </button>
            </div>

            {/* Custom Toolbar */}
            <TimelineToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              activeYear={activeYear}
              onYearChange={setActiveYear}
              activeMonth={activeMonth}
              onMonthChange={setActiveMonth}
              activeMood={activeMood}
              onMoodChange={setActiveMood}
              activeCollectionId={activeCollectionId}
              onCollectionChange={setActiveCollectionId}
              showFavoritesOnly={showFavoritesOnly}
              onFavoritesToggle={() => setShowFavoritesOnly((prev) => !prev)}
              availableYears={availableYears}
              collections={collections}
              onJumpToToday={handleJumpToToday}
              onJumpToBeginning={handleJumpToBeginning}
              onJumpToAnniversary={handleJumpToAnniversary}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Timeline View Switcher Render */}
          <div className="relative min-h-[500px]">
            {viewMode === 'vertical' && (
              <VerticalTimeline
                memories={filteredMemories}
                collections={collections}
                allTags={tags}
                onSelectMemory={handleSelectMemory}
                onEditMemory={handleOpenEditModal}
                onToggleFavorite={handleToggleFavorite}
                onDropAsset={handleDropAssetOnMemory}
              />
            )}

            {viewMode === 'horizontal' && (
              <HorizontalTimeline
                memories={filteredMemories}
                collections={collections}
                allTags={tags}
                onSelectMemory={handleSelectMemory}
                onEditMemory={handleOpenEditModal}
                onToggleFavorite={handleToggleFavorite}
                onDropAsset={handleDropAssetOnMemory}
              />
            )}

            {viewMode === 'calendar' && (
              <CalendarTimeline
                memories={filteredMemories}
                collections={collections}
                allTags={tags}
                onSelectMemory={handleSelectMemory}
                onEditMemory={handleOpenEditModal}
                onToggleFavorite={handleToggleFavorite}
                onUpdateMemoryDate={handleUpdateMemoryDate}
              />
            )}
          </div>
        </div>

        {/* PANEL 3: Right Panel - Rich Inspector Sidebar (Details, Toggles & AI Draft Engine) */}
        <div className="col-span-12 lg:col-span-3 lg:sticky lg:top-4 h-auto max-h-[calc(100vh-140px)] overflow-y-auto pl-1 pb-4 scrollbar-none">
          {selectedMemory ? (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 p-5 shadow-sm space-y-6">
              {/* Cover Card Banner */}
              <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900 border border-rose-50 shadow-2xs">
                {selectedMemory.coverImage ? (
                  <img
                    src={selectedMemory.coverImage}
                    alt={selectedMemory.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                    <Sparkles size={32} className="text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-lg border border-rose-400">
                    {selectedMemory.date}
                  </span>
                  <h4 className="text-xs font-black line-clamp-1 mt-1">{selectedMemory.title}</h4>
                </div>
              </div>

              {/* Metadata Indicators List */}
              <div className="space-y-2 text-xs">
                {selectedMemory.location && (
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <MapPin size={13} className="text-rose-500 shrink-0" />
                    <span>{selectedMemory.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <TagIcon size={13} className="text-rose-500 shrink-0" />
                  <span>Cảm xúc: {selectedMemory.mood}</span>
                </div>
              </div>

              {/* Action Ribbon */}
              <div className="flex items-center gap-2 border-t border-b border-rose-50 py-3">
                <button
                  onClick={() => handleToggleFavorite(selectedMemory.id)}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 ${
                    selectedMemory.isFavorite
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  <Heart size={12} className={selectedMemory.isFavorite ? 'fill-white' : ''} />
                  <span>Yêu thích</span>
                </button>
                <button
                  onClick={() => handleOpenEditModal(selectedMemory)}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-blue-50 text-blue-600 transition-colors"
                  title="Sửa sự kiện"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDeleteMemory(selectedMemory.id)}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-red-50 text-red-600 transition-colors"
                  title="Xóa sự kiện"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* AI Context Source Switches */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    Nguồn ngữ cảnh AI
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium leading-normal mt-0.5">
                    Bật/tắt các nguồn tài liệu để kiểm soát đầu vào chính xác truyền cho AI biên tập bài viết.
                  </p>
                </div>

                {/* Switch list */}
                <div className="grid grid-cols-2 gap-1.5">
                  {(['photos', 'journal', 'notes', 'speech', 'memory', 'tags'] as const).map((sourceKey) => {
                    const isActive = getAiSourcesForMemory(selectedMemory.id)[sourceKey];
                    const labelMap = {
                      photos: '📸 Photos',
                      journal: '📖 Journal',
                      notes: '📝 Notes',
                      speech: '🎙️ Speech',
                      memory: '📅 Memory',
                      tags: '🏷️ Tags'
                    };

                    return (
                      <button
                        key={sourceKey}
                        onClick={() => handleToggleAiSource(selectedMemory.id, sourceKey)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black border text-left flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <span>{labelMap[sourceKey]}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-colors ${
                            isActive ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isActive && <Check size={8} strokeWidth={4} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic AI Payload Preview */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Dữ liệu AI nhận được (Real-time Payload):
                </h5>
                <div className="p-3 bg-slate-950/95 font-mono text-[9px] text-emerald-400 rounded-xl max-h-28 overflow-y-auto leading-relaxed whitespace-pre-wrap border border-slate-800 select-all scrollbar-none">
                  {compiledPayloadPreview || '// Trống. Hãy bật ít nhất 1 nguồn ngữ cảnh.'}
                </div>
              </div>

              {/* AI Creator & Draft Generation Button */}
              <div className="space-y-3">
                <button
                  onClick={() => handleGenerateAIDraft(selectedMemory)}
                  disabled={isGeneratingAI}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-300 disabled:to-pink-300 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Đang phân tích...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="fill-white" />
                      <span>Tự động tạo Nháp AI</span>
                    </>
                  )}
                </button>

                {/* AI Summary result if present */}
                {selectedMemory.aiSummary && (
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/50 text-[11px] text-slate-700 leading-relaxed font-medium space-y-1">
                    <div className="text-[9px] font-extrabold text-amber-700 uppercase flex items-center gap-1">
                      <Check size={11} /> Đã có Nháp AI từ Timeline
                    </div>
                    <p className="line-clamp-4 text-slate-600">{selectedMemory.aiSummary}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-rose-100 p-8 text-center shadow-xs space-y-3">
              <Sparkles size={28} className="mx-auto text-slate-300 animate-pulse" />
              <h4 className="text-xs font-black text-slate-700 uppercase">Trình Thanh Tra</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Hãy click vào một mốc kỷ niệm bất kỳ trên Timeline để xem chi tiết, kéo thả ảnh hoặc tùy chỉnh nguồn ngữ cảnh cấp cho AI.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Event Detail Drawer fallback (used on mobile / small screens) */}
      <TimelineDetailDrawer
        memory={selectedMemory}
        allMemories={memories}
        allTags={tags}
        collections={collections}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onEdit={handleOpenEditModal}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteMemory}
        onExport={handleExportMemory}
        onSelectMemory={handleSelectMemory}
      />

      {/* 4. Memory Modal Create/Edit */}
      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        memoryToEdit={memoryToEdit}
        allTags={tags}
        collections={collections}
        onSave={handleSaveMemory}
      />
    </div>
  );
};
