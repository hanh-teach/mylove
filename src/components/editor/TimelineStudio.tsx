import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarRange, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  FileText, 
  Paperclip, 
  Image as ImageIcon, 
  Heart, 
  Filter as FilterIcon, 
  ArrowUp, 
  ArrowDown, 
  Smartphone, 
  Laptop, 
  Check, 
  Link as LinkIcon, 
  Wand2, 
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { timelineStore } from '../../modules/timeline/TimelineStore';
import { Timeline, TimelineItem } from '../../modules/timeline/TimelineModel';
import { AssetPickerModal } from '../asset/AssetPickerModal';
import { MemoryPickerModal } from '../timeline/MemoryPickerModal';
import { MemoryService } from '../../modules/memory/MemoryService';
import { assetStore } from '../../modules/asset/AssetStore';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import { IMemory } from '../../modules/memory/MemoryTypes';

interface TimelineStudioProps {
  currentEditorTitle?: string;
  currentEditorMessage?: string;
  onApplyDraftToEditor?: (title: string, message: string) => void;
  onOpenAIAssistant?: () => void;
}

export const TimelineStudio: React.FC<TimelineStudioProps> = ({
  currentEditorTitle = '',
  currentEditorMessage = '',
  onApplyDraftToEditor,
  onOpenAIAssistant
}) => {
  const { activeProject } = useProjectWorkspace();

  // Mode Override (Desktop, Android Stepper, iOS Native Card)
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'android' | 'ios'>('desktop');

  // Core State
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  
  // Modals & Pickers
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isMemoryPickerOpen, setIsMemoryPickerOpen] = useState(false);
  const [activeItemIdForAttach, setActiveItemIdForAttach] = useState<string | null>(null);

  // Form Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsAI, setFormIsAI] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending' | 'ai' | 'manual'>('all');

  // Load timeline and items
  useEffect(() => {
    if (activeProject) {
      const tl = timelineStore.getOrCreateTimeline(activeProject.id, activeProject.title, activeProject.template);
      setTimeline(tl);
      setItems(timelineStore.getTimelineItems(tl.id));
    }
  }, [activeProject]);

  const refreshTimeline = () => {
    if (timeline) {
      const updatedTl = timelineStore.getOrCreateTimeline(timeline.projectId, activeProject?.title || 'Dự án');
      setTimeline({ ...updatedTl });
      setItems(timelineStore.getTimelineItems(timeline.id));
    }
  };

  // Drag-and-drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Filter and Search list
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (activeFilter === 'completed') return item.completed;
      if (activeFilter === 'pending') return !item.completed;
      if (activeFilter === 'ai') return item.aiGenerated;
      if (activeFilter === 'manual') return !item.aiGenerated;
      return true;
    });
  }, [items, searchQuery, activeFilter]);

  // Compute attached drafts/images helper
  const getAttachedMemory = (memoryId: string): IMemory | undefined => {
    return MemoryService.getMemories().find(m => m.id === memoryId);
  };

  const getAttachedAsset = (assetId: string): ProjectAsset | undefined => {
    return assetStore.getAssetById(assetId);
  };

  // Completion toggler
  const handleToggleComplete = (itemId: string, currentStatus: boolean) => {
    timelineStore.updateTimelineItem(itemId, { completed: !currentStatus });
    refreshTimeline();
  };

  // Add Item
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeline || !formTitle.trim()) return;

    timelineStore.addTimelineItem(timeline.id, {
      title: formTitle,
      description: formDescription,
      assetIds: [],
      memoryIds: [],
      draftId: null,
      workflowId: null,
      aiGenerated: formIsAI,
      completed: false,
      order: items.length
    });

    setFormTitle('');
    setFormDescription('');
    setFormIsAI(false);
    setIsCreateModalOpen(false);
    refreshTimeline();
  };

  // Save Edit Item
  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formTitle.trim()) return;

    timelineStore.updateTimelineItem(editingItem.id, {
      title: formTitle,
      description: formDescription,
      aiGenerated: formIsAI
    });

    setEditingItem(null);
    setIsEditModalOpen(false);
    refreshTimeline();
  };

  const handleStartEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormIsAI(item.aiGenerated);
    setIsEditModalOpen(true);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bước này khỏi lộ trình?')) {
      timelineStore.deleteTimelineItem(itemId);
      refreshTimeline();
    }
  };

  // Reordering moves
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (!timeline) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    timelineStore.reorderTimelineItems(timeline.id, newItems.map(i => i.id));
    refreshTimeline();
  };

  // HTML5 Drag-and-Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!timeline || !draggedItemId) return;

    const draggedIndex = items.findIndex(item => item.id === draggedItemId);
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    const reordered = [...items];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    timelineStore.reorderTimelineItems(timeline.id, reordered.map(i => i.id));
    setDraggedItemId(null);
    refreshTimeline();
  };

  // Attach Asset handler
  const handleOpenAssetPicker = (itemId: string) => {
    setActiveItemIdForAttach(itemId);
    setIsAssetPickerOpen(true);
  };

  const handleSelectAsset = (asset: ProjectAsset) => {
    if (!activeItemIdForAttach) return;
    const item = items.find(i => i.id === activeItemIdForAttach);
    if (item) {
      const currentAssets = item.assetIds || [];
      if (!currentAssets.includes(asset.id)) {
        timelineStore.updateTimelineItem(activeItemIdForAttach, {
          assetIds: [...currentAssets, asset.id]
        });
      }
    }
    setIsAssetPickerOpen(false);
    setActiveItemIdForAttach(null);
    refreshTimeline();
  };

  // Attach Memory handler
  const handleOpenMemoryPicker = (itemId: string) => {
    setActiveItemIdForAttach(itemId);
    setIsMemoryPickerOpen(true);
  };

  const handleSelectMemory = (memory: IMemory) => {
    if (!activeItemIdForAttach) return;
    const item = items.find(i => i.id === activeItemIdForAttach);
    if (item) {
      const currentMemories = item.memoryIds || [];
      if (!currentMemories.includes(memory.id)) {
        timelineStore.updateTimelineItem(activeItemIdForAttach, {
          memoryIds: [...currentMemories, memory.id]
        });
      }
    }
    setIsMemoryPickerOpen(false);
    setActiveItemIdForAttach(null);
    refreshTimeline();
  };

  // Attach Current Editor Draft (Current Version)
  const handleAttachCurrentDraft = (itemId: string) => {
    if (!currentEditorTitle && !currentEditorMessage) {
      alert('Chưa có nội dung bản nháp trong Editor để đính kèm.');
      return;
    }
    
    const draftId = `draft_${Date.now()}`;
    const draftMeta = {
      title: currentEditorTitle,
      message: currentEditorMessage,
      timestamp: new Date().toLocaleString('vi-VN')
    };

    timelineStore.updateTimelineItem(itemId, {
      draftId,
      description: `${items.find(i => i.id === itemId)?.description || ''}\n[Đính kèm nháp: "${currentEditorTitle}"]`.trim()
    });

    // Also persist draft meta locally so we can restore it
    localStorage.setItem(`timeline_draft_data_${draftId}`, JSON.stringify(draftMeta));
    alert(`Đã đính kèm bản nháp hiện tại ("${currentEditorTitle || 'Chưa đặt tên'}") vào bước này!`);
    refreshTimeline();
  };

  // Restore attached draft to Editor
  const handleRestoreDraft = (draftId: string) => {
    const draftJson = localStorage.getItem(`timeline_draft_data_${draftId}`);
    if (draftJson && onApplyDraftToEditor) {
      try {
        const data = JSON.parse(draftJson);
        onApplyDraftToEditor(data.title, data.message);
        alert(`Đã khôi phục bản nháp "${data.title}" vào Editor!`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Remove attached item
  const handleRemoveAttachment = (itemId: string, type: 'asset' | 'memory' | 'draft', targetId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (type === 'asset') {
      timelineStore.updateTimelineItem(itemId, {
        assetIds: (item.assetIds || []).filter(id => id !== targetId)
      });
    } else if (type === 'memory') {
      timelineStore.updateTimelineItem(itemId, {
        memoryIds: (item.memoryIds || []).filter(id => id !== targetId)
      });
    } else if (type === 'draft') {
      timelineStore.updateTimelineItem(itemId, {
        draftId: null
      });
    }
    refreshTimeline();
  };

  // AI Recommendation system based on step goals & attachments
  const getAIRecommendation = (item: TimelineItem) => {
    const titleLower = item.title.toLowerCase();
    
    if (!item.completed) {
      // Step: Select template / card
      if (titleLower.includes('template') || titleLower.includes('chọn') || titleLower.includes('khởi đầu')) {
        return {
          text: `Bạn đang chọn chủ đề "${activeProject?.category || 'Chung'}". Bạn muốn AI gợi ý một bố cục thẩm mỹ có sẵn?`,
          actionLabel: 'Gợi ý ngay',
          action: () => onOpenAIAssistant?.()
        };
      }
      
      // Step: Collect photo / images
      if ((titleLower.includes('ảnh') || titleLower.includes('hình') || titleLower.includes('photo') || titleLower.includes('asset')) && (!item.assetIds || item.assetIds.length === 0)) {
        return {
          text: 'Bạn chưa đính kèm hình ảnh kỷ niệm nào vào bước này. Thêm ảnh từ Thư viện?',
          actionLabel: 'Thêm ảnh',
          action: () => handleOpenAssetPicker(item.id)
        };
      }

      // Step: Collect memories
      if ((titleLower.includes('kỷ niệm') || titleLower.includes('memory') || titleLower.includes('memories')) && (!item.memoryIds || item.memoryIds.length === 0)) {
        return {
          text: 'Bước này yêu cầu liên kết kỷ niệm thực tế. Liên kết từ nhật ký kỷ niệm của bạn?',
          actionLabel: 'Chọn kỷ niệm',
          action: () => handleOpenMemoryPicker(item.id)
        };
      }

      // Step: Write content
      if ((titleLower.includes('viết') || titleLower.includes('nội dung') || titleLower.includes('thư') || titleLower.includes('chúc') || titleLower.includes('soạn')) && !item.draftId) {
        return {
          text: 'AI có thể hỗ trợ tối ưu hóa và làm mượt mà văn bản nháp của bạn.',
          actionLabel: 'Sáng tạo với AI',
          action: () => onOpenAIAssistant?.()
        };
      }

      // Default recommendation
      return {
        text: 'Đính kèm các tài nguyên và đánh giá bước này để theo dõi tiến trình tốt nhất.',
        actionLabel: 'Liên kết Assets',
        action: () => handleOpenAssetPicker(item.id)
      };
    }

    return null;
  };

  // AI Intelligent workflow assistant response integration
  // When AI writes content, it adapts to the active step
  const activeStepForAI = useMemo(() => {
    return items.find(i => !i.completed);
  }, [items]);

  if (!activeProject || !timeline) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-xs max-w-md mx-auto mt-10">
        <AlertCircle className="mx-auto text-rose-500 mb-3" size={32} />
        <h3 className="font-bold text-slate-800 text-sm">Chưa có dự án nào được mở</h3>
        <p className="text-xs text-slate-500 mt-1">Hãy chọn hoặc tạo mới một dự án trong Workspace để bắt đầu lập lộ trình Timeline.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {/* Top Controller Bar */}
      <div className="p-4 bg-white border-b border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="font-black text-slate-800 text-sm sm:text-base flex items-center gap-2">
            <CalendarRange size={18} className="text-rose-500" />
            <span>Timeline Studio: {timeline.title}</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Lộ trình Story-Builder kết nối nội dung, kỷ niệm và trí tuệ nhân tạo AI</p>
        </div>

        {/* Device view switcher & Add Event */}
        <div className="flex items-center gap-2 w-full sm:w-auto self-end">
          <div className="bg-slate-100 p-0.5 rounded-xl flex items-center gap-0.5 text-slate-500">
            <button 
              onClick={() => setLayoutMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${layoutMode === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              title="Giao diện máy tính"
            >
              <Laptop size={14} />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button 
              onClick={() => setLayoutMode('android')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${layoutMode === 'android' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              title="Stepper Android"
            >
              <Smartphone size={14} className="text-green-600" />
              <span>Android</span>
            </button>
            <button 
              onClick={() => setLayoutMode('ios')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${layoutMode === 'ios' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              title="iOS Cards"
            >
              <Smartphone size={14} className="text-indigo-600" />
              <span>iOS</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Plus size={14} />
            <span>Thêm bước</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Banner */}
      <div className="px-4 py-3 bg-white border-b border-rose-50 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs font-extrabold text-slate-700 min-w-[50px]">Tiến trình:</span>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${timeline.progress}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
            {timeline.progress}%
          </span>
        </div>

        {/* AI Active Indicator */}
        {activeStepForAI && (
          <div className="hidden lg:flex items-center gap-2 bg-slate-900 text-white rounded-xl py-1 px-2.5 border border-slate-800 text-[11px] shrink-0">
            <Sparkles size={11} className="text-rose-400 fill-rose-400 animate-pulse" />
            <span className="font-medium">AI định hướng bước:</span>
            <span className="font-extrabold text-rose-300 truncate max-w-[120px]">{activeStepForAI.title}</span>
          </div>
        )}
      </div>

      {/* Filters, Search & Layout Viewports */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Toolbar & Filters (Only show if not strict android mockup view or if requested) */}
        <div className="p-3 bg-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Tìm kiếm bước..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-400"
            />
          </div>

          <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto py-1">
            <FilterIcon size={12} className="text-slate-400 mr-1 shrink-0" />
            {(['all', 'completed', 'pending', 'ai', 'manual'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all shrink-0 ${
                  activeFilter === filter 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {filter === 'all' ? 'Tất cả' : filter === 'completed' ? 'Đã xong' : filter === 'pending' ? 'Chưa xong' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Layout Renderer based on layoutMode state */}
        <div className="flex-1 overflow-y-auto p-4 flex justify-center">
          
          {/* ====================================
              DESKTOP VIEW (Vertical Timeline)
             ==================================== */}
          {layoutMode === 'desktop' && (
            <div className="w-full max-w-4xl space-y-6">
              {filteredItems.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-2xs">
                  <CalendarRange className="mx-auto text-slate-300 mb-2" size={36} />
                  <p className="text-xs text-slate-500 font-semibold">Không tìm thấy bước nào trong Timeline phù hợp.</p>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-rose-200/80 space-y-6">
                  {filteredItems.map((item, index) => {
                    const aiRec = getAIRecommendation(item);

                    return (
                      <div 
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`relative group bg-white rounded-2xl border transition-all p-4 ${
                          item.completed 
                            ? 'border-emerald-100 bg-emerald-50/5/10 shadow-2xs' 
                            : 'border-slate-100 shadow-2xs hover:shadow-xs hover:border-rose-100'
                        } ${draggedItemId === item.id ? 'opacity-40 border-dashed border-rose-400' : ''}`}
                      >
                        {/* Bullet bullet connection */}
                        <div 
                          onClick={() => handleToggleComplete(item.id, item.completed)}
                          className={`absolute -left-10 sm:-left-12 top-4 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center cursor-pointer transition-all shadow-md z-10 ${
                            item.completed 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-rose-400 text-white hover:bg-rose-500'
                          }`}
                        >
                          {item.completed ? <Check size={14} strokeWidth={3} /> : <span className="text-[10px] font-extrabold">{index + 1}</span>}
                        </div>

                        {/* Event details */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-bold text-slate-800 text-xs sm:text-sm ${item.completed ? 'line-through text-slate-500' : ''}`}>
                                {item.title}
                              </h3>
                              {item.aiGenerated ? (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-0.5">
                                  <Sparkles size={8} className="fill-indigo-300" />
                                  <span>AI Step</span>
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-50 text-slate-500 border border-slate-100">
                                  Manual
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium whitespace-pre-wrap">{item.description}</p>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleMoveOrder(index, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-20 transition-all"
                              title="Di chuyển lên"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              onClick={() => handleMoveOrder(index, 'down')}
                              disabled={index === items.length - 1}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-20 transition-all"
                              title="Di chuyển xuống"
                            >
                              <ArrowDown size={12} />
                            </button>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 rounded-md hover:bg-rose-50 text-rose-500 transition-all"
                              title="Sửa"
                            >
                              <FileText size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 rounded-md hover:bg-rose-100 text-rose-600 transition-all"
                              title="Xóa"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Attachments Section */}
                        <div className="mt-3.5 pt-3.5 border-t border-dashed border-slate-100 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                              <Paperclip size={10} />
                              <span>Tài nguyên đính kèm ({ (item.assetIds?.length || 0) + (item.memoryIds?.length || 0) + (item.draftId ? 1 : 0) })</span>
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenAssetPicker(item.id)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[9px] font-bold flex items-center gap-0.5"
                              >
                                <ImageIcon size={9} />
                                <span>+ Asset</span>
                              </button>
                              <button
                                onClick={() => handleOpenMemoryPicker(item.id)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[9px] font-bold flex items-center gap-0.5"
                              >
                                <Heart size={9} />
                                <span>+ Memory</span>
                              </button>
                              <button
                                onClick={() => handleAttachCurrentDraft(item.id)}
                                className="px-2 py-0.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-md text-[9px] font-bold flex items-center gap-0.5 border border-transparent hover:border-rose-100"
                                title="Đính kèm bản nháp hiện tại từ Editor"
                              >
                                <FileText size={9} />
                                <span>+ Nháp hiện tại</span>
                              </button>
                            </div>
                          </div>

                          {/* Render Attached Elements */}
                          {((item.assetIds?.length || 0) + (item.memoryIds?.length || 0) + (item.draftId ? 1 : 0)) > 0 && (
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                              {/* Assets */}
                              {item.assetIds?.map(assetId => {
                                const asset = getAttachedAsset(assetId);
                                if (!asset) return null;
                                return (
                                  <div key={assetId} className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl pl-1 pr-2 py-1 text-[10px] text-slate-700 font-semibold group/att max-w-[150px] truncate relative">
                                    {asset.type === 'image' && asset.url ? (
                                      <img src={asset.url} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-md object-cover border border-slate-200" />
                                    ) : (
                                      <ImageIcon size={12} className="text-rose-500" />
                                    )}
                                    <span className="truncate">{asset.title}</span>
                                    <button 
                                      onClick={() => handleRemoveAttachment(item.id, 'asset', assetId)}
                                      className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-rose-600 ml-1 transition-colors"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                );
                              })}

                              {/* Memories */}
                              {item.memoryIds?.map(memId => {
                                const mem = getAttachedMemory(memId);
                                if (!mem) return null;
                                return (
                                  <div key={memId} className="flex items-center gap-1 bg-rose-50 border border-rose-100 rounded-xl pl-1.5 pr-2 py-1 text-[10px] text-rose-700 font-semibold max-w-[150px] truncate relative">
                                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                                    <span className="truncate">{mem.title}</span>
                                    <button 
                                      onClick={() => handleRemoveAttachment(item.id, 'memory', memId)}
                                      className="p-0.5 hover:bg-rose-100 rounded-full text-rose-400 hover:text-rose-700 ml-1 transition-colors"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                );
                              })}

                              {/* Attached Draft */}
                              {item.draftId && (
                                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-xl pl-1.5 pr-2 py-1 text-[10px] text-amber-800 font-semibold max-w-[180px] truncate relative">
                                  <FileText size={10} className="text-amber-600" />
                                  <span 
                                    className="underline cursor-pointer hover:text-amber-900 truncate"
                                    onClick={() => handleRestoreDraft(item.draftId!)}
                                    title="Click để khôi phục bản nháp này vào Editor"
                                  >
                                    Bản nháp đính kèm
                                  </span>
                                  <button 
                                    onClick={() => handleRemoveAttachment(item.id, 'draft', item.draftId!)}
                                    className="p-0.5 hover:bg-amber-100 rounded-full text-amber-400 hover:text-amber-700 ml-1 transition-colors"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* AI Recommendation Panel */}
                        {aiRec && (
                          <div className="mt-3 bg-gradient-to-r from-rose-50/50 to-pink-50/30 p-2.5 rounded-xl border border-rose-100/50 flex items-center justify-between gap-3 text-[11px] text-slate-700 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Sparkles size={12} className="text-rose-500 animate-bounce shrink-0" />
                              <span>{aiRec.text}</span>
                            </div>
                            <button
                              onClick={aiRec.action}
                              className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-600 font-extrabold rounded-lg shrink-0 transition-all text-[10px]"
                            >
                              {aiRec.actionLabel}
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}


          {/* ====================================
              ANDROID VIEW (Horizontal Stepper)
             ==================================== */}
          {layoutMode === 'android' && (
            <div className="w-full max-w-sm bg-slate-900 text-white rounded-[40px] border-[10px] border-slate-950 p-6 flex flex-col h-[580px] shadow-2xl relative overflow-hidden">
              {/* Speaker & camera mockup */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full" />
              
              {/* Android Header */}
              <div className="pt-2 pb-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-400">09:41</span>
                <span className="text-[11px] font-black tracking-wide text-center">🤖 Android Stepper View</span>
                <span className="text-[10px] text-slate-400">100%</span>
              </div>

              {/* Stepper container */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                <div className="flex items-center gap-1 mb-2 bg-slate-800/40 p-2 rounded-xl">
                  <CheckCircle size={14} className="text-rose-400 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-300 truncate">Hành trình: {timeline.progress}% hoàn thành</span>
                </div>

                <div className="space-y-4 relative">
                  {/* Stepper line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-800" />

                  {items.map((item, index) => (
                    <div key={item.id} className="relative pl-9 flex flex-col gap-1 text-slate-200">
                      {/* Step index */}
                      <div 
                        onClick={() => handleToggleComplete(item.id, item.completed)}
                        className={`absolute left-0 top-0.5 w-8.5 h-8.5 rounded-full border border-slate-800 flex items-center justify-center font-extrabold text-[11px] cursor-pointer transition-colors ${
                          item.completed 
                            ? 'bg-emerald-500 text-white border-emerald-400' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {item.completed ? '✓' : index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[11px] font-bold ${item.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                            {item.title}
                          </span>
                          {item.aiGenerated && (
                            <span className="px-1 bg-rose-500/20 text-rose-300 text-[8px] font-black rounded">AI</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>

                      {/* Attached indicator dots */}
                      {((item.assetIds?.length || 0) + (item.memoryIds?.length || 0) + (item.draftId ? 1 : 0)) > 0 && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] text-slate-500">Đã gắn:</span>
                          <div className="flex gap-1">
                            {item.assetIds?.map((_, i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Asset" />)}
                            {item.memoryIds?.map((_, i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-rose-400" title="Memory" />)}
                            {item.draftId && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Draft" />}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Android Soft key navbar */}
              <div className="pt-2 border-t border-slate-800 flex justify-around text-slate-500 text-xs shrink-0">
                <span>◀</span>
                <span>●</span>
                <span>■</span>
              </div>
            </div>
          )}


          {/* ====================================
              IOS VIEW (Native Cards Layout)
             ==================================== */}
          {layoutMode === 'ios' && (
            <div className="w-full max-w-sm bg-slate-50 text-slate-900 rounded-[40px] border-[10px] border-slate-900 p-6 flex flex-col h-[580px] shadow-2xl relative overflow-hidden">
              {/* Notch mockup */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl" />
              
              {/* iOS Header */}
              <div className="pt-3 pb-4 flex items-center justify-between shrink-0 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-800">09:41</span>
                <span className="text-[11px] font-black tracking-wide text-center">🍎 iOS Native Cards</span>
                <span className="text-[11px] text-slate-800">📶</span>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-0.5">
                <div className="flex items-center justify-between mb-1.5 bg-rose-50 border border-rose-100 p-2.5 rounded-2xl">
                  <span className="text-[10px] font-extrabold text-rose-800">CÂU CHUYỆN HOÀN THÀNH</span>
                  <span className="text-[12px] font-black text-rose-600">{timeline.progress}%</span>
                </div>

                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-2 items-center">
                        <button 
                          onClick={() => handleToggleComplete(item.id, item.completed)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            item.completed 
                              ? 'bg-rose-500 border-rose-400 text-white' 
                              : 'border-slate-300 hover:border-rose-400'
                          }`}
                        >
                          {item.completed && <Check size={10} strokeWidth={4} />}
                        </button>

                        <div className="min-w-0">
                          <h4 className={`text-[11px] font-black ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-bold block">Bước {index + 1}</span>
                        </div>
                      </div>

                      {item.aiGenerated && (
                        <span className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-indigo-50 text-indigo-600">AI</span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                    {/* Quick indicator of attached elements */}
                    {((item.assetIds?.length || 0) + (item.memoryIds?.length || 0) + (item.draftId ? 1 : 0)) > 0 && (
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50 text-[9px] text-slate-400 font-bold">
                        <Paperclip size={8} />
                        <span>Đã đính kèm { (item.assetIds?.length || 0) + (item.memoryIds?.length || 0) + (item.draftId ? 1 : 0) } tài liệu</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full" />
            </div>
          )}

        </div>
      </div>


      {/* ====================================================
          MODALS & PICKERS FOR ATTACHMENTS & FORMS
         ==================================================== */}

      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        onSelectAsset={handleSelectAsset}
      />

      {/* Memory Picker Modal */}
      <MemoryPickerModal
        isOpen={isMemoryPickerOpen}
        onClose={() => setIsMemoryPickerOpen(false)}
        onSelectMemory={handleSelectMemory}
      />

      {/* Create Step Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-rose-50 flex items-center justify-between bg-rose-50/20">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CalendarRange size={16} className="text-rose-500" />
                <span>Thêm bước hành trình mới</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleCreateItem} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Tiêu đề bước</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ngày 1: Ghi âm lời dặn dò"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Mô tả / Mục tiêu</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả cụ thể nhiệm vụ của bước này..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isAiStep"
                  checked={formIsAI}
                  onChange={(e) => setFormIsAI(e.target.checked)}
                  className="w-4 h-4 text-rose-500 border-slate-300 rounded-sm focus:ring-rose-400"
                />
                <label htmlFor="isAiStep" className="text-xs text-slate-700 font-bold flex items-center gap-1 cursor-pointer">
                  <Sparkles size={12} className="text-indigo-500" />
                  <span>Bước hỗ trợ bởi Trí tuệ Nhân tạo (AI Step)</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Step Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-rose-50 flex items-center justify-between bg-rose-50/20">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText size={16} className="text-rose-500" />
                <span>Chỉnh sửa bước hành trình</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEditItem} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Tiêu đề bước</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Mô tả / Mục tiêu</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isAiStepEdit"
                  checked={formIsAI}
                  onChange={(e) => setFormIsAI(e.target.checked)}
                  className="w-4 h-4 text-rose-500 border-slate-300 rounded-sm focus:ring-rose-400"
                />
                <label htmlFor="isAiStepEdit" className="text-xs text-slate-700 font-bold flex items-center gap-1 cursor-pointer">
                  <Sparkles size={12} className="text-indigo-500" />
                  <span>Bước hỗ trợ bởi Trí tuệ Nhân tạo (AI Step)</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
