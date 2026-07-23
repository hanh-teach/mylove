import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Search,
  Plus,
  Star,
  Calendar,
  MapPin,
  Tag as TagIcon,
  Sparkles,
  Grid,
  List as ListIcon,
  Clock,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Share2,
  Trash2,
  Edit3,
  Eye,
  X,
  Check,
  Filter,
  ArrowUpDown,
  Bot,
  Layers,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { IMemory, MemoryType, MoodType, TimelineCategory } from '../../modules/memory/MemoryTypes';
import { MemoryService } from '../../modules/memory/MemoryService';

interface EditorMemoryPanelProps {
  onApplyToCanvas?: (memoryTitle: string, memoryContent: string, coverImage?: string) => void;
  onClose?: () => void;
  isMobileBottomSheet?: boolean;
}

export const EditorMemoryPanel: React.FC<EditorMemoryPanelProps> = ({
  onApplyToCanvas,
  onClose,
  isMobileBottomSheet = false,
}) => {
  const [memories, setMemories] = useState<IMemory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Filter & Search & View Mode State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'favorites' | MemoryType>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<TimelineCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'a-z' | 'most-viewed'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');

  // Selected Memory for Detail Modal
  const [activeMemory, setActiveMemory] = useState<IMemory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Create/Edit Modal State
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formLocation, setFormLocation] = useState<string>('Sài Gòn');
  const [formMood, setFormMood] = useState<MoodType>('Romantic');
  const [formType, setFormType] = useState<MemoryType>('image');
  const [formContent, setFormContent] = useState<string>('');
  const [formTags, setFormTags] = useState<string>('Love, Date');
  const [formCoverImage, setFormCoverImage] = useState<string>('https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80');

  // Load Memories on Mount
  useEffect(() => {
    loadMemoriesData();
  }, []);

  const loadMemoriesData = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = MemoryService.getMemories();
      setMemories(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load memories:', err);
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Filter & Sort
  const filteredMemories = MemoryService.filterAndSortMemories(
    memories,
    {
      searchQuery,
      type: selectedTypeFilter,
      category: selectedCategoryFilter,
    },
    sortBy
  );

  // Toggle Favorite
  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = MemoryService.toggleFavorite(id);
    if (updated) {
      setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
    }
  };

  // Delete Memory
  const handleDeleteMemory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa kỷ niệm này không?')) {
      const success = MemoryService.deleteMemory(id);
      if (success) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
        if (activeMemory?.id === id) {
          setIsDetailOpen(false);
          setActiveMemory(null);
        }
      }
    }
  };

  // Save Create / Edit Memory
  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Vui lòng nhập tiêu đề kỷ niệm.');
      return;
    }

    const tagsList = formTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingMemoryId) {
      // Update
      const updated = MemoryService.updateMemory(editingMemoryId, {
        title: formTitle,
        date: formDate,
        location: formLocation,
        mood: formMood,
        type: formType,
        content: formContent,
        tags: tagsList,
        coverImage: formCoverImage,
        aiSummary: `AI Summary cho "${formTitle}": Kỷ niệm ý nghĩa lưu giữ khoảnh khắc tuyệt vời.`
      });
      if (updated) {
        setMemories((prev) => prev.map((m) => (m.id === editingMemoryId ? updated : m)));
      }
    } else {
      // Create new
      const newMem = MemoryService.addMemory({
        title: formTitle,
        date: formDate,
        location: formLocation,
        mood: formMood,
        type: formType,
        content: formContent,
        tags: tagsList,
        coverImage: formCoverImage,
        isFavorite: false,
        aiSummary: `AI Summary cho "${formTitle}": Khắc ghi dấu ấn ý nghĩa trong hành trình cuộc sống.`
      });
      setMemories((prev) => [newMem, ...prev]);
    }

    // Reset and close
    setIsCreateOpen(false);
    setEditingMemoryId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormLocation('Sài Gòn');
    setFormMood('Romantic');
    setFormType('image');
    setFormContent('');
    setFormTags('Love, Date');
    setFormCoverImage('https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80');
  };

  const openEditModal = (memory: IMemory) => {
    setEditingMemoryId(memory.id);
    setFormTitle(memory.title);
    setFormDate(memory.date);
    setFormLocation(memory.location);
    setFormMood(memory.mood);
    setFormType(memory.type);
    setFormContent(memory.content);
    setFormTags(memory.tags.join(', '));
    setFormCoverImage(memory.coverImage || 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80');
    setIsCreateOpen(true);
  };

  // Apply to Editor Canvas
  const handleApplyToCanvas = (m: IMemory) => {
    if (onApplyToCanvas) {
      onApplyToCanvas(m.title, m.content, m.coverImage);
    }
  };

  const getMoodEmoji = (mood: MoodType) => {
    switch (mood) {
      case 'Romantic': return '💖';
      case 'Happy': return '✨';
      case 'Excited': return '🎉';
      case 'Gentle': return '🌸';
      case 'Magical': return '🪄';
      case 'Cozy': return '☕';
      default: return '❤️';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white text-slate-800 ${isMobileBottomSheet ? 'p-3' : 'p-4'}`}>
      {/* 1. Header & Actions */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xs">
            <Heart size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              Memory Workspace
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                {memories.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Quản lý kỷ niệm & kho tàng kiến thức
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setEditingMemoryId(null);
              resetForm();
              setIsCreateOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-xs"
            title="Thêm kỷ niệm mới"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Đóng panel"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Search & View Mode Switcher */}
      <div className="space-y-2 mb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm kỷ niệm, địa điểm, thẻ..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <button
            onClick={() => setSelectedTypeFilter('all')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 ${
              selectedTypeFilter === 'all'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setSelectedTypeFilter('favorites')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1 ${
              selectedTypeFilter === 'favorites'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Star size={11} className={selectedTypeFilter === 'favorites' ? 'fill-white' : ''} />
            Yêu thích
          </button>
          <button
            onClick={() => setSelectedTypeFilter('image')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 ${
              selectedTypeFilter === 'image'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📸 Ảnh
          </button>
          <button
            onClick={() => setSelectedTypeFilter('letter')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 ${
              selectedTypeFilter === 'letter'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            💌 Thư
          </button>
          <button
            onClick={() => setSelectedTypeFilter('video')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 ${
              selectedTypeFilter === 'video'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎬 Video
          </button>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-slate-100'}`}
              title="Gallery Grid View"
            >
              <Grid size={13} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-slate-100'}`}
              title="List View"
            >
              <ListIcon size={13} />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1 rounded-md transition-colors ${viewMode === 'timeline' ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-slate-100'}`}
              title="Timeline View"
            >
              <Clock size={13} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <ArrowUpDown size={12} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="a-z">Tên (A-Z)</option>
              <option value="most-viewed">Xem nhiều</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drag & Drop Instruction Badge */}
      <div className="bg-rose-50/55 border border-rose-100 rounded-xl px-3 py-2 flex items-center gap-2 mb-3 shrink-0">
        <Sparkles size={12} className="text-rose-500 animate-pulse" />
        <p className="text-[10px] text-rose-700 font-semibold leading-snug">
          💡 Kéo thả bất kỳ kỷ niệm nào vào Canvas để thiết kế và dàn trang tự động!
        </p>
      </div>

      {/* 3. Main Content Area: Loading / Error / Empty / List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
        {isLoading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-3 rounded-xl border border-rose-100 bg-rose-50/20 animate-pulse space-y-2">
                <div className="h-4 bg-rose-200/50 rounded w-3/4"></div>
                <div className="h-3 bg-rose-200/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="p-6 text-center space-y-3 bg-red-50 rounded-xl border border-red-200 text-red-800">
            <AlertCircle size={24} className="mx-auto text-red-600" />
            <p className="text-xs font-bold">Không thể tải dữ liệu kỷ niệm.</p>
            <button
              onClick={loadMemoriesData}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-semibold text-xs shadow-xs"
            >
              Thử lại
            </button>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="p-6 text-center space-y-3 bg-slate-50/80 rounded-xl border border-dashed border-rose-200">
            <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <Heart size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">No memories found</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Bắt đầu thêm kỷ niệm hoặc thay đổi từ khóa tìm kiếm.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMemoryId(null);
                resetForm();
                setIsCreateOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all inline-flex items-center gap-1 shadow-xs"
            >
              <Plus size={13} />
              Tạo Kỷ Niệm Mới
            </button>
          </div>
        ) : viewMode === 'timeline' ? (
          // TIMELINE VIEW
          <div className="relative pl-4 border-l-2 border-rose-200 space-y-4 py-2">
            {filteredMemories.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setActiveMemory(m);
                  setIsDetailOpen(true);
                }}
                draggable={true}
                onDragStart={(e) => {
                  const data = {
                    type: 'memory',
                    id: m.id,
                    title: m.title,
                    content: m.content,
                    coverImage: m.coverImage,
                    mood: m.mood,
                    date: m.date
                  };
                  e.dataTransfer.setData('application/json', JSON.stringify(data));
                }}
                className="relative pl-4 cursor-pointer group"
              >
                {/* Dot */}
                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-white shadow-xs group-hover:scale-125 transition-transform"></div>

                <div className="p-3 rounded-xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs transition-all space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Calendar size={10} />
                      {m.date}
                    </span>
                    <span className="text-xs">{getMoodEmoji(m.mood)}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-rose-600 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          // GRID GALLERY VIEW
          <div className="grid grid-cols-2 gap-2">
            {filteredMemories.map((m) => (
              <motion.div
                whileHover={{ y: -2 }}
                key={m.id}
                onClick={() => {
                  setActiveMemory(m);
                  setIsDetailOpen(true);
                }}
                draggable={true}
                onDragStart={(e) => {
                  const data = {
                    type: 'memory',
                    id: m.id,
                    title: m.title,
                    content: m.content,
                    coverImage: m.coverImage,
                    mood: m.mood,
                    date: m.date
                  };
                  e.dataTransfer.setData('application/json', JSON.stringify(data));
                }}
                className="group relative rounded-xl overflow-hidden bg-white border border-rose-100 hover:border-rose-300 shadow-2xs cursor-pointer flex flex-col"
              >
                {m.coverImage ? (
                  <div className="h-28 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={m.coverImage}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => handleToggleFavorite(e, m.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
                        m.isFavorite ? 'bg-rose-500 text-white shadow-md' : 'bg-black/30 text-white hover:bg-black/50'
                      }`}
                    >
                      <Star size={12} className={m.isFavorite ? 'fill-white' : ''} />
                    </button>
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white text-[9px] font-medium flex items-center gap-1">
                      {getMoodEmoji(m.mood)} {m.mood}
                    </span>
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-br from-rose-100 to-pink-50 p-2.5 flex items-center justify-between">
                    <span className="text-xl">{getMoodEmoji(m.mood)}</span>
                    <button
                      onClick={(e) => handleToggleFavorite(e, m.id)}
                      className={`p-1.5 rounded-full transition-all ${
                        m.isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-600'
                      }`}
                    >
                      <Star size={12} className={m.isFavorite ? 'fill-white' : ''} />
                    </button>
                  </div>
                )}

                <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1">
                  <div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={10} /> {m.date}
                    </p>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-rose-600 transition-colors">
                      {m.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-500 truncate max-w-[80px] flex items-center gap-0.5">
                      <MapPin size={9} /> {m.location}
                    </span>
                    <span className="px-1 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-[9px]">
                      Used by AI 12x
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // LIST VIEW
          <div className="space-y-2">
            {filteredMemories.map((m) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={m.id}
                onClick={() => {
                  setActiveMemory(m);
                  setIsDetailOpen(true);
                }}
                draggable={true}
                onDragStart={(e) => {
                  const data = {
                    type: 'memory',
                    id: m.id,
                    title: m.title,
                    content: m.content,
                    coverImage: m.coverImage,
                    mood: m.mood,
                    date: m.date
                  };
                  e.dataTransfer.setData('application/json', JSON.stringify(data));
                }}
                className="p-3 rounded-xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs cursor-pointer flex items-center gap-3 transition-all"
              >
                {m.coverImage ? (
                  <img
                    src={m.coverImage}
                    alt={m.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-rose-100 flex items-center justify-center text-xl shrink-0">
                    {getMoodEmoji(m.mood)}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                      <Calendar size={10} /> {m.date}
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(e, m.id)}
                      className={`p-1 rounded-full transition-all ${
                        m.isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500'
                      }`}
                    >
                      <Star size={14} className={m.isFavorite ? 'fill-rose-500' : ''} />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate hover:text-rose-600">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{m.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Memory Detail Modal / Drawer */}
      <AnimatePresence>
        {isDetailOpen && activeMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-rose-100 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
            >
              {/* Cover Image or Header */}
              {activeMemory.coverImage && (
                <div className="relative h-48 w-full bg-slate-900">
                  <img
                    src={activeMemory.coverImage}
                    alt={activeMemory.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <h2 className="text-white font-bold text-base leading-tight">
                      {activeMemory.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="p-4 space-y-3.5 text-xs">
                {!activeMemory.coverImage && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900">{activeMemory.title}</h2>
                    <button
                      onClick={() => setIsDetailOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-2 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar size={13} className="text-rose-500" />
                    <span>{activeMemory.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin size={13} className="text-rose-500" />
                    <span className="truncate">{activeMemory.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span>{getMoodEmoji(activeMemory.mood)}</span>
                    <span className="font-semibold">{activeMemory.mood}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                    <Bot size={13} />
                    <span>Used by AI: 12 times</span>
                  </div>
                </div>

                {/* AI Summary Box */}
                {activeMemory.aiSummary && (
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                    <h5 className="font-bold flex items-center gap-1 text-[11px]">
                      <Sparkles size={13} className="text-purple-600" />
                      AI Summary & Reflection
                    </h5>
                    <p className="text-[11px] text-purple-800 leading-relaxed">
                      {activeMemory.aiSummary}
                    </p>
                  </div>
                )}

                {/* Story Content */}
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Nội dung / Câu chuyện
                  </h5>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {activeMemory.content}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {activeMemory.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleApplyToCanvas(activeMemory);
                      setIsDetailOpen(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sparkles size={14} />
                    Áp dụng vào Canvas Editor
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailOpen(false);
                      openEditModal(activeMemory);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      handleDeleteMemory(e, activeMemory.id);
                    }}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Xóa kỷ niệm"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Create / Edit Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-rose-100 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingMemoryId ? 'Chỉnh sửa kỷ niệm' : 'Thêm kỷ niệm mới'}
                </h3>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveMemory} className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tiêu đề kỷ niệm *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ví dụ: Chuyến du lịch Đà Lạt đáng nhớ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ngày diễn ra</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Địa điểm</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cảm xúc</label>
                    <select
                      value={formMood}
                      onChange={(e: any) => setFormMood(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    >
                      <option value="Romantic">💖 Sâu lắng</option>
                      <option value="Happy">✨ Hạnh phúc</option>
                      <option value="Excited">🎉 Phấn khích</option>
                      <option value="Gentle">🌸 Nhẹ nhàng</option>
                      <option value="Magical">🪄 Kỳ diệu</option>
                      <option value="Cozy">☕ Ấm cúng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Loại kỷ niệm</label>
                    <select
                      value={formType}
                      onChange={(e: any) => setFormType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    >
                      <option value="image">📸 Ảnh / Album</option>
                      <option value="letter">📝 Thư & Bài viết</option>
                      <option value="video">🎬 Video</option>
                      <option value="music">🎵 Âm nhạc</option>
                      <option value="timeline">⏳ Dòng thời gian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ảnh bìa URL</label>
                  <input
                    type="text"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nội dung câu chuyện</label>
                  <textarea
                    rows={4}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Kể lại câu chuyện hoặc lời nhắn yêu thương..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thẻ (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Travel, Anniversary, Date"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Check size={15} />
                    {editingMemoryId ? 'Lưu thay đổi' : 'Thêm kỷ niệm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
