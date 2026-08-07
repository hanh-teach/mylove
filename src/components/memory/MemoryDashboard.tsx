import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ICollection,
  IMemory,
  ITag,
  MemoryFilterOptions,
  MemorySortOption,
  MemoryType,
  MoodType
} from '../../modules/memory/MemoryTypes';
import { MemoryService } from '../../modules/memory/MemoryService';
import { MemoryStatsBar } from './MemoryStatsBar';
import { MemoryCard } from './MemoryCard';
import { MemoryListItem } from './MemoryListItem';
import { MemoryDetailPanel } from './MemoryDetailPanel';
import { MemoryModal } from './MemoryModal';
import { TagManagerModal } from './TagManagerModal';
import { CollectionManagerModal } from './CollectionManagerModal';
import { AlbumView } from './AlbumView';
import { MemoryTimelineView } from './MemoryTimelineView';
import { RelationshipMapView } from './RelationshipMapView';
import { EnhancedStatsDashboard } from './EnhancedStatsDashboard';
import { BulkActionsBar } from './BulkActionsBar';
import { AdvancedSearchModal } from './AdvancedSearchModal';
import { MemoryEmptyState } from './MemoryEmptyState';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import {
  Search,
  Filter,
  ArrowUpDown,
  Grid,
  List,
  Plus,
  Tag as TagIcon,
  Heart,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  X,
  Clock,
  RotateCcw,
  FolderHeart,
  Layers,
  Map,
  BarChart3,
  SearchCode,
  CheckSquare,
  Square,
  Bookmark,
  Check,
  Eye,
  Trash2,
  Edit3,
  Copy,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ExtendedViewMode = 'collections' | 'grid' | 'list' | 'album' | 'timeline' | 'map' | 'stats';

export const MemoryDashboard: React.FC<{ onOpenRelated?: (id: string) => void }> = ({ onOpenRelated }) => {
  // Core Data State
  const [memories, setMemories] = useState<IMemory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [viewMode, setViewMode] = useState<ExtendedViewMode>(() => {
    const saved = sessionStorage.getItem('memory_view_mode');
    return (saved as ExtendedViewMode) || 'collections';
  });

  useEffect(() => {
    sessionStorage.setItem('memory_view_mode', viewMode);
  }, [viewMode]);

  // Scroll Persistence
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('memory_scroll_pos');
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem('memory_scroll_pos', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [galleryLayout, setGalleryLayout] = useState<'standard' | 'masonry' | 'compact'>('standard');

  // Search, Filters & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'favorites' | MemoryType>('all');
  const [activeMood, setActiveMood] = useState<MoodType | 'all'>('all');
  const [activeYear, setActiveYear] = useState<string | 'all'>('all');
  const [activeMonth, setActiveMonth] = useState<string | 'all'>('all');
  const [activeTag, setActiveTag] = useState<string | 'all'>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<MemorySortOption>('newest');

  // Smart Filters State
  const [activeSmartFilter, setActiveSmartFilter] = useState<'all' | 'last-week' | 'last-month' | 'this-year' | 'favorites' | 'ai-tagged'>('all');

  // Advanced Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const { activeProject, logActivity } = useProjectWorkspace();
  const [selectedMultipleTags, setSelectedMultipleTags] = useState<string[]>([]);

  // Selection & Bulk Actions State
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);
  const [draggedMemoryId, setDraggedMemoryId] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedMemory, setSelectedMemory] = useState<IMemory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryToEdit, setMemoryToEdit] = useState<IMemory | null>(null);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isCollectionManagerOpen, setIsCollectionManagerOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Responsive device tracking
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Initial Data
  const [isLoading, setIsLoading] = useState(true);
  const refreshAllData = useCallback(() => {
    setMemories(MemoryService.getMemories());
    setTags(MemoryService.getTags());
    setCollections(MemoryService.getCollections());
    
    // Simulate loading for polish
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Compute stats
  const stats = useMemo(() => MemoryService.calculateStats(memories), [memories]);

  // Compute available years & locations
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    memories.forEach(m => {
      if (m.date) years.add(m.date.split('-')[0]);
    });
    return Array.from(years).sort().reverse();
  }, [memories]);

  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    memories.forEach(m => {
      if (m.location) locs.add(m.location.trim());
    });
    return Array.from(locs).sort();
  }, [memories]);

  // AI Suggestions clustering algorithm
  const aiSuggestions = useMemo(() => {
    // Find memories that do not belong to any collection
    const uncollected = memories.filter(m => !m.collectionId);
    const dateGroups: Record<string, IMemory[]> = {};
    uncollected.forEach(m => {
      if (m.date) {
        if (!dateGroups[m.date]) dateGroups[m.date] = [];
        dateGroups[m.date].push(m);
      }
    });

    const locationGroups: Record<string, IMemory[]> = {};
    uncollected.forEach(m => {
      if (m.location && m.location !== 'Chưa cập nhật' && m.location !== '') {
        const key = m.location.trim();
        if (!locationGroups[key]) locationGroups[key] = [];
        locationGroups[key].push(m);
      }
    });

    const suggestions: {
      id: string;
      type: 'date' | 'location';
      key: string;
      memories: IMemory[];
      defaultName: string;
      defaultIcon: string;
      defaultColor: string;
    }[] = [];

    // Grouping by Date (requires at least 2 memories on the exact same date to suggest)
    Object.entries(dateGroups).forEach(([date, items]) => {
      if (items.length >= 2) {
        const formattedDate = new Date(date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
        suggestions.push({
          id: `suggest-date-${date}`,
          type: 'date',
          key: date,
          memories: items,
          defaultName: `Ngày đặc biệt ${formattedDate}`,
          defaultIcon: '🎂',
          defaultColor: '#f59e0b'
        });
      }
    });

    // Grouping by Location (requires at least 2 memories at the same location)
    Object.entries(locationGroups).forEach(([loc, items]) => {
      if (items.length >= 2 && !suggestions.some(s => s.type === 'location' && s.key === loc)) {
        suggestions.push({
          id: `suggest-loc-${loc}`,
          type: 'location',
          key: loc,
          memories: items,
          defaultName: `Hành trình ${loc}`,
          defaultIcon: '✈️',
          defaultColor: '#3b82f6'
        });
      }
    });

    return suggestions;
  }, [memories]);

  // Filter & Sort memories
  const filterOptions: MemoryFilterOptions = useMemo(() => ({
    searchQuery: debouncedSearch,
    type: activeType,
    mood: activeMood,
    year: activeYear,
    month: activeMonth,
    tag: activeTag,
    collectionId: selectedCollectionId,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    locationQuery: selectedLocation !== 'all' ? selectedLocation : undefined,
    selectedTags: selectedMultipleTags.length > 0 ? selectedMultipleTags : undefined,
  }), [
    debouncedSearch,
    activeType,
    activeMood,
    activeYear,
    activeMonth,
    activeTag,
    selectedCollectionId,
    startDate,
    endDate,
    selectedLocation,
    selectedMultipleTags,
  ]);

  const filteredMemories = useMemo(() => {
    let result = MemoryService.filterAndSortMemories(memories, filterOptions, sortBy);

    // Apply Smart Filters on top
    if (activeSmartFilter === 'last-week') {
      const oneWeekAgo = Date.now() - 7 * 86400000;
      result = result.filter(m => new Date(m.date).getTime() >= oneWeekAgo);
    } else if (activeSmartFilter === 'last-month') {
      const oneMonthAgo = Date.now() - 30 * 86400000;
      result = result.filter(m => new Date(m.date).getTime() >= oneMonthAgo);
    } else if (activeSmartFilter === 'this-year') {
      const currentYear = new Date().getFullYear().toString();
      result = result.filter(m => m.date.startsWith(currentYear));
    } else if (activeSmartFilter === 'favorites') {
      result = result.filter(m => m.isFavorite);
    } else if (activeSmartFilter === 'ai-tagged') {
      result = result.filter(m => m.tags.includes('AI Generated') || m.aiSummary);
    }

    return result;
  }, [memories, filterOptions, sortBy, activeSmartFilter]);

  // Handlers
  const handleOpenDetail = useCallback((memory: IMemory) => {
    setSelectedMemory(memory);
    setIsDetailOpen(true);
    MemoryService.incrementViewCount(memory.id);
    refreshAllData();
  }, [refreshAllData]);

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
      refreshAllData();
      if (selectedMemory && selectedMemory.id === id) {
        setSelectedMemory(updated);
      }
    }
  }, [selectedMemory, refreshAllData]);

  const handleDuplicateMemory = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = MemoryService.duplicateMemory(id);
    if (duplicated) {
      refreshAllData();
    }
  }, [refreshAllData]);

  const handleDeleteMemory = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const memory = memories.find(m => m.id === id);
    if (!memory) return;

    MemoryService.deleteMemory(id);
    refreshAllData();
    
    if (selectedMemory && selectedMemory.id === id) {
      setIsDetailOpen(false);
      setSelectedMemory(null);
    }

    // Standardized Toast with Undo
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        message: `Đã xóa kỷ niệm "${memory.title}"`,
        type: 'success',
        duration: 5000,
        onUndo: () => {
          MemoryService.addMemory(memory);
          refreshAllData();
        }
      }
    }));
  }, [memories, selectedMemory, refreshAllData]);

  const handleExportMemory = useCallback((memory: IMemory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    MemoryService.exportMemoryAsText(memory);
  }, []);

  const handleSaveMemory = useCallback((
    data: Omit<IMemory, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>,
    idToUpdate?: string
  ) => {
    if (idToUpdate) {
      MemoryService.updateMemory(idToUpdate, data);
      logActivity(activeProject?.id || '', 'edit', `Cập nhật kỷ niệm: ${data.title}`);
    } else {
      MemoryService.addMemory(data);
      logActivity(activeProject?.id || '', 'add', `Thêm kỷ niệm mới: ${data.title}`);
    }
    refreshAllData();
  }, [refreshAllData, logActivity, activeProject?.id]);

  // Selection & Bulk Actions
  const handleToggleSelectMemory = useCallback((id: string) => {
    setSelectedMemoryIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedMemoryIds.length === filteredMemories.length) {
      setSelectedMemoryIds([]);
    } else {
      setSelectedMemoryIds(filteredMemories.map(m => m.id));
    }
  }, [selectedMemoryIds.length, filteredMemories]);

  const handleBulkDelete = useCallback(() => {
    if (confirm(`Xóa ${selectedMemoryIds.length} kỷ niệm đã chọn?`)) {
      MemoryService.bulkDeleteMemories(selectedMemoryIds);
      setSelectedMemoryIds([]);
      refreshAllData();
    }
  }, [selectedMemoryIds, refreshAllData]);

  const handleBulkToggleFavorite = useCallback((isFav: boolean) => {
    MemoryService.bulkToggleFavorite(selectedMemoryIds, isFav);
    refreshAllData();
  }, [selectedMemoryIds, refreshAllData]);

  const handleBulkMoveCollection = useCallback((colId: string) => {
    MemoryService.bulkMoveToCollection(selectedMemoryIds, colId);
    setSelectedMemoryIds([]);
    refreshAllData();
  }, [selectedMemoryIds, refreshAllData]);

  const handleBulkAddTag = useCallback((tagName: string) => {
    MemoryService.bulkAddTag(selectedMemoryIds, tagName);
    setSelectedMemoryIds([]);
    refreshAllData();
  }, [selectedMemoryIds, refreshAllData]);

  const handleBulkExport = useCallback(() => {
    const selectedList = memories.filter(m => selectedMemoryIds.includes(m.id));
    MemoryService.exportMemoriesAsBatch(selectedList);
    setSelectedMemoryIds([]);
  }, [memories, selectedMemoryIds]);

  // Collection Handlers
  const handleAddCollection = useCallback((data: { name: string; description?: string; color: string; icon: string; coverImage?: string }) => {
    MemoryService.addCollection(data);
    refreshAllData();
  }, [refreshAllData]);

  const handleUpdateCollection = useCallback((id: string, data: Partial<ICollection>) => {
    MemoryService.updateCollection(id, data);
    refreshAllData();
  }, [refreshAllData]);

  const handleDeleteCollection = useCallback((id: string) => {
    MemoryService.deleteCollection(id);
    if (selectedCollectionId === id) setSelectedCollectionId('all');
    refreshAllData();
  }, [selectedCollectionId, refreshAllData]);

  // Drag & Drop Handlers for Collection Assignment
  const handleDragStart = (e: React.DragEvent, memoryId: string) => {
    e.dataTransfer.setData('text/plain', memoryId);
    setDraggedMemoryId(memoryId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnCollection = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    const memoryId = e.dataTransfer.getData('text/plain') || draggedMemoryId;
    if (memoryId) {
      MemoryService.assignMemoryToCollection(memoryId, collectionId);
      refreshAllData();
    }
    setDraggedMemoryId(null);
  };

  // Tag Manager Handlers
  const handleAddTag = useCallback((name: string, color: string) => {
    MemoryService.addTag(name, color);
    refreshAllData();
  }, [refreshAllData]);

  const handleUpdateTag = useCallback((id: string, name: string, color: string) => {
    MemoryService.updateTag(id, name, color);
    refreshAllData();
  }, [refreshAllData]);

  const handleDeleteTag = useCallback((id: string) => {
    MemoryService.deleteTag(id);
    refreshAllData();
  }, [refreshAllData]);

  const handleMergeTags = useCallback((sourceId: string, targetId: string) => {
    MemoryService.mergeTags(sourceId, targetId);
    refreshAllData();
  }, [refreshAllData]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveType('all');
    setActiveMood('all');
    setActiveYear('all');
    setActiveMonth('all');
    setActiveTag('all');
    setSelectedCollectionId('all');
    setStartDate('');
    setEndDate('');
    setSelectedLocation('all');
    setSelectedMultipleTags([]);
    setActiveSmartFilter('all');
  }, []);

  const handleCreateCollectionFromSuggestion = (suggestion: typeof aiSuggestions[0]) => {
    const newCol = MemoryService.addCollection({
      name: suggestion.defaultName,
      icon: suggestion.defaultIcon,
      color: suggestion.defaultColor,
      description: `Bộ sưu tập gợi ý thông minh từ các kỷ niệm vào ${suggestion.type === 'date' ? 'ngày ' + suggestion.key : 'địa điểm ' + suggestion.key}`
    });

    if (newCol) {
      suggestion.memories.forEach(m => {
        MemoryService.assignMemoryToCollection(m.id, newCol.id);
      });
      refreshAllData();
    }
  };

  const hasActiveFilters = searchQuery || activeType !== 'all' || activeMood !== 'all' || activeYear !== 'all' || activeMonth !== 'all' || activeTag !== 'all' || selectedCollectionId !== 'all' || startDate || endDate || selectedLocation !== 'all' || selectedMultipleTags.length > 0 || activeSmartFilter !== 'all';

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/80 backdrop-blur-md p-6 rounded-3xl border border-border-subtle shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
              <Heart size={20} className="fill-white" />
            </span>
            <h1 className="text-2xl font-black text-text-main tracking-tight">
              Thư viện Kỷ niệm 2.0
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs uppercase tracking-wider">
              Sprint 63
            </span>
          </div>
          <p className="text-xs text-text-muted font-medium">
            Quản lý kỷ niệm hình ảnh và thước phim theo Bộ sưu tập cao cấp giống Apple Photos & Notion Gallery
          </p>
        </div>

        {/* Top Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsCollectionManagerOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-surface border border-border-base text-text-main text-xs font-bold flex items-center gap-2 hover:bg-surface-elevated transition-all shadow-2xs"
          >
            <FolderHeart size={16} className="text-rose-500" />
            Quản lý Bộ sưu tập
          </button>
          <button
            onClick={() => setIsTagManagerOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-surface border border-border-base text-text-main text-xs font-bold flex items-center gap-2 hover:bg-surface-elevated transition-all shadow-2xs"
          >
            <TagIcon size={16} className="text-rose-500" />
            Quản lý Thẻ (Tags)
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Thêm kỷ niệm mới
          </button>
        </div>
      </div>

      {/* Statistics Bar */}
      <MemoryStatsBar stats={stats} />

      {/* AI Suggestion Bar (Smart Clusters) */}
      <AnimatePresence>
        {aiSuggestions.length > 0 && viewMode === 'collections' && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 rounded-3xl bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-purple-500/5 border border-rose-500/10 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-3">
                <span className="p-3 rounded-2xl bg-rose-500 text-white shadow-md self-start shrink-0">
                  <Sparkles size={18} className="animate-pulse" />
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-text-main flex items-center gap-1.5">
                    Gợi ý Gom Nhóm Thông Minh từ AI
                  </h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Có vẻ như bạn có <b>{aiSuggestions[0].memories.length}</b> kỷ niệm chưa phân loại vào cùng một nhóm ({aiSuggestions[0].type === 'date' ? 'ngày ' + aiSuggestions[0].key : 'địa điểm ' + aiSuggestions[0].key}). Bạn có muốn gom chúng lại không?
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleCreateCollectionFromSuggestion(aiSuggestions[0])}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Tạo Bộ Sưu Tập
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collections Carousel / Drag-Drop Bar */}
      <div className="bg-surface/90 backdrop-blur-md p-4 rounded-3xl border border-border-subtle shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-text-muted px-1">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-text-muted">
            <FolderHeart size={15} className="text-rose-500" />
            Bộ sưu tập kỷ niệm ({collections.length})
          </span>
          <button
            onClick={() => setIsCollectionManagerOpen(true)}
            className="text-xs text-rose-500 hover:underline flex items-center gap-1"
          >
            + Quản lý bộ sưu tập
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCollectionId('all');
              if (viewMode === 'collections') setViewMode('grid');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
              selectedCollectionId === 'all' && viewMode !== 'collections'
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                : 'bg-surface text-text-muted border-border-base hover:bg-rose-500/10 hover:text-rose-500'
            }`}
          >
            <Sparkles size={14} />
            Tất cả kỷ niệm
          </button>

          {collections.map((col) => (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnCollection(e, col.id)}
              onClick={() => {
                setSelectedCollectionId(col.id);
                if (viewMode === 'collections') setViewMode('grid');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 select-none ${
                selectedCollectionId === col.id && viewMode !== 'collections'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                  : 'bg-surface text-text-main border-border-base hover:border-rose-500 hover:bg-rose-500/5'
              }`}
            >
              <span>{col.icon}</span>
              <span>{col.name}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-surface-elevated text-text-muted font-extrabold">
                {col.memoryIds.length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Bar: Search, Filters, Views */}
      <div className="bg-surface/90 backdrop-blur-md p-4 rounded-3xl border border-border-subtle shadow-xs space-y-3">
        {/* Row 1: Search Input & Extended View Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm kỷ niệm theo tiêu đề, nội dung, địa điểm, cảm xúc..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-border-base text-xs font-medium bg-surface-elevated text-text-main focus:bg-surface focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Extended View Modes Toggle */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-2xl bg-surface-elevated border border-border-subtle shrink-0">
            {[
              { id: 'collections', label: 'Bộ sưu tập', icon: FolderHeart },
              { id: 'grid', label: 'Thư viện (Gallery)', icon: Grid },
              { id: 'list', label: 'Danh sách', icon: List },
              { id: 'album', label: 'Theo năm', icon: Layers },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'map', label: 'Bản đồ', icon: Map },
              { id: 'stats', label: 'Thống kê', icon: BarChart3 },
            ].map((v) => {
              const Icon = v.icon;
              const isActive = viewMode === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as ExtendedViewMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-surface text-rose-500 shadow-xs'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  <Icon size={15} />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Type Filter Pills & Advanced Search Button */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'Tất cả kỷ niệm', icon: Sparkles },
              { id: 'favorites', label: '❤️ Yêu thích', icon: Heart },
              { id: 'image', label: '🖼️ Hình ảnh', icon: Grid },
              { id: 'letter', label: '✉️ Thư & Bài viết', icon: Grid },
              { id: 'video', label: '🎬 Thước phim', icon: Grid },
              { id: 'music', label: '🎵 Âm nhạc', icon: Grid },
              { id: 'timeline', label: '⏱️ Mốc thời gian', icon: Clock },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id as any)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeType === t.id
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-surface-elevated text-text-muted hover:bg-rose-500/10 hover:text-rose-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdvancedSearchOpen(true)}
            className="px-3.5 py-1.5 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500/20 transition-colors shrink-0"
          >
            <SearchCode size={15} />
            Lọc nâng cao
          </button>
        </div>

        {/* Smart Filters (Time Frames & Quick Favorites) */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border-subtle pt-2 pb-1 scrollbar-none">
          <span className="text-[11px] font-extrabold text-text-muted uppercase tracking-wider mr-1.5 shrink-0 flex items-center gap-1">
            <Filter size={12} />
            Bộ lọc nhanh:
          </span>
          {[
            { id: 'all', label: 'Tất cả thời gian' },
            { id: 'last-week', label: 'Tuần qua' },
            { id: 'last-month', label: 'Tháng qua' },
            { id: 'this-year', label: 'Năm nay' },
            { id: 'favorites', label: 'Được Yêu thích ❤️' },
            { id: 'ai-tagged', label: 'Có AI Gợi ý ✨' }
          ].map((sf) => (
            <button
              key={sf.id}
              onClick={() => setActiveSmartFilter(sf.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSmartFilter === sf.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-surface-elevated hover:bg-rose-500/10 hover:text-rose-500 text-text-muted'
              }`}
            >
              {sf.label}
            </button>
          ))}
        </div>

        {/* Row 3: Mood, Tag, Year, Month & Select All Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle text-xs">
          {/* Select All Toggle */}
          <button
            onClick={handleSelectAll}
            className="px-2.5 py-1.5 rounded-xl border border-border-base bg-surface-elevated font-bold text-text-main hover:bg-surface transition-colors flex items-center gap-1.5"
          >
            {selectedMemoryIds.length === filteredMemories.length && filteredMemories.length > 0 ? (
              <CheckSquare size={14} className="text-rose-500" />
            ) : (
              <Square size={14} className="text-text-muted" />
            )}
            {selectedMemoryIds.length > 0 ? `Đã chọn (${selectedMemoryIds.length})` : 'Chọn nhiều'}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-elevated border border-border-base px-3 py-1.5 rounded-xl text-xs">
            <ArrowUpDown size={14} className="text-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MemorySortOption)}
              className="bg-transparent font-bold text-text-main focus:outline-none text-xs cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="a-z">Tên A → Z</option>
              <option value="most-viewed">Xem nhiều nhất</option>
              <option value="recently-edited">Mới sửa đổi</option>
            </select>
          </div>

          {/* Mood Filter */}
          <select
            value={activeMood}
            onChange={(e) => setActiveMood(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl border border-border-base bg-surface font-medium text-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả Cảm xúc (Mood)</option>
            <option value="Romantic">✨ Sâu lắng</option>
            <option value="Happy">😊 Vui vẻ</option>
            <option value="Excited">🎉 Hào hứng</option>
            <option value="Gentle">🌸 Dịu dàng</option>
            <option value="Magical">✨ Diệu kỳ</option>
            <option value="Cozy">☕ Ấm áp</option>
          </select>

          {/* Tag Filter */}
          <select
            value={activeTag}
            onChange={(e) => setActiveTag(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-border-base bg-surface font-medium text-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả Thẻ (Tag)</option>
            {tags.map((t) => (
              <option key={t.id} value={t.name}>
                #{t.name}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={activeYear}
            onChange={(e) => setActiveYear(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-border-base bg-surface font-medium text-text-main focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả Năm</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20 transition-colors flex items-center gap-1 ml-auto"
            >
              <RotateCcw size={12} />
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Main View Display Area */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="p-3 bg-surface rounded-3xl border border-border-subtle shadow-sm space-y-3">
               <div className="w-full h-40 bg-surface-elevated animate-pulse rounded-2xl" />
               <div className="space-y-2">
                 <div className="h-4 w-3/4 bg-surface-elevated animate-pulse rounded-full" />
                 <div className="h-3 w-1/2 bg-surface-elevated animate-pulse rounded-full" />
               </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'collections' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-text-main flex items-center gap-2">
              📂 Các Thư Mục Kỷ Niệm
            </h2>
            <p className="text-xs text-text-muted">
              Kéo thả các kỷ niệm vào để phân loại nhanh
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {collections.map((col) => {
              // Find memories belonging to this collection
              const colMemories = memories.filter(m => m.collectionId === col.id);
              // Find first cover image or use a beautiful romantic placeholder
              const coverImg = colMemories.find(m => m.coverImage)?.coverImage ||
                (colMemories.length > 0 && colMemories[0].mediaUrls && colMemories[0].mediaUrls[0]) ||
                'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80';

              return (
                <motion.div
                  key={col.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnCollection(e, col.id)}
                  onClick={() => {
                    setSelectedCollectionId(col.id);
                    setViewMode('grid');
                  }}
                  className="group relative bg-surface rounded-3xl border border-border-base shadow-sm hover:shadow-xl hover:border-rose-500 transition-all duration-300 p-3 cursor-pointer flex flex-col justify-between select-none"
                >
                  {/* Photo Stack Cover style */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-rose-500/5 mb-3.5 shadow-2xs">
                    {/* Shadow cards for stack look */}
                    <div className="absolute inset-0 bg-surface-elevated rounded-2xl rotate-2 translate-y-1 group-hover:rotate-6 transition-transform" />
                    <div className="absolute inset-0 bg-surface-elevated rounded-2xl -rotate-2 -translate-y-1 group-hover:-rotate-3 transition-transform" />

                    {/* Main cover image */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden border border-border-subtle">
                      <img
                        src={coverImg}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    </div>

                    {/* Folder icon overlay */}
                    <span className="absolute bottom-3 left-3 text-2xl drop-shadow-md">
                      {col.icon}
                    </span>

                    {/* Badge Count */}
                    <span className="absolute top-3 right-3 bg-surface/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-text-main shadow-sm">
                      {colMemories.length} kỷ niệm
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-text-main text-sm md:text-base group-hover:text-rose-500 transition-colors tracking-tight line-clamp-1">
                      {col.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                      {col.description || 'Chưa có mô tả cho bộ sưu tập này'}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Quick Create Collection Card */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => setIsCollectionManagerOpen(true)}
              className="group border-2 border-dashed border-border-strong rounded-3xl bg-surface hover:bg-surface-elevated p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <div className="p-3.5 rounded-full bg-rose-500/10 text-rose-500 mb-2 group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <span className="text-sm font-extrabold text-text-main">Tạo bộ sưu tập mới</span>
              <span className="text-xs text-text-muted mt-1">Phân loại kỷ niệm theo cách riêng của bạn</span>
            </motion.div>
          </div>
        </div>
      ) : viewMode === 'stats' ? (
        <EnhancedStatsDashboard stats={stats} />
      ) : viewMode === 'map' ? (
        <RelationshipMapView memories={filteredMemories} allTags={tags} onOpenMemory={handleOpenDetail} />
      ) : viewMode === 'timeline' ? (
        <MemoryTimelineView
          memories={filteredMemories}
          allTags={tags}
          onOpenMemory={handleOpenDetail}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : viewMode === 'album' ? (
        <AlbumView
          memories={filteredMemories}
          collections={collections}
          allTags={tags}
          onOpenMemory={handleOpenDetail}
          onEditMemory={handleOpenEditModal}
          onToggleFavorite={handleToggleFavorite}
          onDuplicateMemory={handleDuplicateMemory}
          onDeleteMemory={handleDeleteMemory}
          onExportMemory={handleExportMemory}
        />
      ) : filteredMemories.length === 0 ? (
        <MemoryEmptyState
          isSearchResult={Boolean(hasActiveFilters)}
          onClearFilters={handleResetFilters}
          onCreateNew={handleOpenCreateModal}
        />
      ) : (
        <div>
          {/* Gallery Sub-layout Selector inside grid mode */}
          {viewMode === 'grid' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 bg-surface-elevated border border-border-subtle p-2.5 rounded-2xl text-xs">
              <span className="text-text-muted font-bold flex items-center gap-1.5 ml-1">
                <Info size={14} className="text-rose-500 shrink-0" />
                Kiểu trình diễn Thư viện:
              </span>

              <div className="flex items-center gap-1.5">
                {[
                  { id: 'standard', label: 'Lưới tiêu chuẩn' },
                  { id: 'masonry', label: 'Xếp gạch (Masonry)' },
                  { id: 'compact', label: 'Thu gọn (Compact)' }
                ].map((ly) => (
                  <button
                    key={ly.id}
                    onClick={() => setGalleryLayout(ly.id as any)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      galleryLayout === ly.id
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : 'bg-surface hover:bg-rose-500/5 text-text-main'
                    }`}
                  >
                    {ly.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3 px-1 text-xs text-text-muted font-medium">
            <span>
              Hiển thị <b>{filteredMemories.length}</b> kỷ niệm
            </span>
            <span>Kéo thả thẻ kỷ niệm vào Bộ sưu tập ở trên để sắp xếp nhanh</span>
          </div>

          {viewMode === 'grid' ? (
            galleryLayout === 'masonry' ? (
              /* Masonry layout */
              <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {filteredMemories.map((m) => {
                  const isSelected = selectedMemoryIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as React.DragEvent, m.id)}
                      className="break-inside-avoid relative group cursor-grab active:cursor-grabbing pb-1"
                    >
                      {/* Checkbox Overlay */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelectMemory(m.id);
                        }}
                        className={`absolute top-3 left-3 z-30 p-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-110'
                            : 'bg-surface/90 text-text-muted border-border-base opacity-0 group-hover:opacity-100 hover:text-text-main'
                        }`}
                      >
                        <CheckSquare size={16} />
                      </button>

                      <MemoryCard
                        memory={m}
                        allTags={tags}
                        onOpen={handleOpenDetail}
                        onEdit={handleOpenEditModal}
                        onToggleFavorite={handleToggleFavorite}
                        onDuplicate={handleDuplicateMemory}
                        onDelete={handleDeleteMemory}
                        onExport={handleExportMemory}
                        onOpenRelated={onOpenRelated ? (id) => onOpenRelated(id) : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            ) : galleryLayout === 'compact' ? (
              /* Compact layout (Apple Photos square tile look) */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredMemories.map((m) => {
                  const isSelected = selectedMemoryIds.includes(m.id);
                  const coverThumb = m.coverImage ||
                    (m.mediaUrls && m.mediaUrls[0]) ||
                    'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80';

                  return (
                    <motion.div
                      key={m.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => handleOpenDetail(m)}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, m.id)}
                      className="relative h-40 rounded-2xl overflow-hidden border border-border-subtle cursor-pointer shadow-2xs group select-none"
                    >
                      <img
                        src={coverThumb}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                      {/* Overlays */}
                      <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSelectMemory(m.id);
                            }}
                            className={`p-1 rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                                : 'bg-slate-950/40 text-white border-white/20 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <CheckSquare size={14} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(m.id);
                            }}
                            className={`p-1 rounded-lg transition-all ${
                              m.isFavorite
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-950/40 text-white opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <Heart size={14} className={m.isFavorite ? 'fill-white' : ''} />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-xs tracking-tight line-clamp-1">
                            {m.title}
                          </h4>
                          <span className="text-[10px] text-white/80 block">
                            {m.date}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Standard grid layout (5 cols on Desktop, 3 cols on tablet, 2 cols on mobile) */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredMemories.map((m) => {
                  const isSelected = selectedMemoryIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, m.id)}
                      className="relative group cursor-grab active:cursor-grabbing"
                    >
                      {/* Checkbox Overlay for Bulk Select */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelectMemory(m.id);
                        }}
                        className={`absolute top-3 left-3 z-30 p-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-110'
                            : 'bg-surface/80 text-text-muted border-border-base opacity-0 group-hover:opacity-100 hover:text-text-main'
                        }`}
                      >
                        <CheckSquare size={16} />
                      </button>

                      <MemoryCard
                        memory={m}
                        allTags={tags}
                        onOpen={handleOpenDetail}
                        onEdit={handleOpenEditModal}
                        onToggleFavorite={handleToggleFavorite}
                        onDuplicate={handleDuplicateMemory}
                        onDelete={handleDeleteMemory}
                        onExport={handleExportMemory}
                        onOpenRelated={onOpenRelated ? (id) => onOpenRelated(id) : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* List Layout */
            <div className="space-y-3">
              {filteredMemories.map((m) => {
                const isSelected = selectedMemoryIds.includes(m.id);
                return (
                  <div key={m.id} className="relative group flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSelectMemory(m.id)}
                      className={`p-2 rounded-xl border transition-all shrink-0 ${
                        isSelected
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-surface text-text-muted border-border-base hover:text-text-main'
                      }`}
                    >
                      <CheckSquare size={16} />
                    </button>
                    <div className="flex-1">
                      <MemoryListItem
                        memory={m}
                        allTags={tags}
                        onOpen={handleOpenDetail}
                        onEdit={handleOpenEditModal}
                        onToggleFavorite={handleToggleFavorite}
                        onDuplicate={handleDuplicateMemory}
                        onDelete={handleDeleteMemory}
                        onExport={handleExportMemory}
                        onOpenRelated={onOpenRelated ? (id) => onOpenRelated(id) : undefined}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedIds={selectedMemoryIds}
        totalCount={filteredMemories.length}
        collections={collections}
        tags={tags}
        onSelectAll={handleSelectAll}
        onDeselectAll={() => setSelectedMemoryIds([])}
        onBulkDelete={handleBulkDelete}
        onBulkToggleFavorite={handleBulkToggleFavorite}
        onBulkMoveCollection={handleBulkMoveCollection}
        onBulkAddTag={handleBulkAddTag}
        onBulkExport={handleBulkExport}
      />

      {/* Modals & Drawers */}
      <MemoryDetailPanel
        memory={selectedMemory}
        allMemories={memories}
        allTags={tags}
        collections={collections}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleOpenEditModal}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteMemory}
        onExport={handleExportMemory}
        onSelectRelated={(rel) => setSelectedMemory(rel)}
      />

      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        memoryToEdit={memoryToEdit}
        allTags={tags}
        collections={collections}
        onSave={handleSaveMemory}
      />

      <CollectionManagerModal
        isOpen={isCollectionManagerOpen}
        onClose={() => setIsCollectionManagerOpen(false)}
        collections={collections}
        onAddCollection={handleAddCollection}
        onUpdateCollection={handleUpdateCollection}
        onDeleteCollection={handleDeleteCollection}
      />

      <TagManagerModal
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        tags={tags}
        memories={memories}
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
        onMergeTags={handleMergeTags}
      />

      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        filterOptions={{
          searchQuery,
          type: activeType,
          mood: activeMood,
          collectionId: selectedCollectionId,
          startDate,
          endDate,
          locationQuery: selectedLocation === 'all' ? '' : selectedLocation,
          selectedTags: selectedMultipleTags,
        }}
        collections={collections}
        tags={tags}
        onApplyFilters={(filters) => {
          if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
          if (filters.startDate !== undefined) setStartDate(filters.startDate);
          if (filters.endDate !== undefined) setEndDate(filters.endDate);
          if (filters.mood !== undefined) setActiveMood(filters.mood);
          if (filters.type !== undefined) setActiveType(filters.type);
          if (filters.collectionId !== undefined) setSelectedCollectionId(filters.collectionId);
          if (filters.locationQuery !== undefined) setSelectedLocation(filters.locationQuery || 'all');
          if (filters.selectedTags !== undefined) setSelectedMultipleTags(filters.selectedTags);
        }}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
