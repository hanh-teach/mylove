import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Command, 
  Plus, 
  Clock, 
  Sparkles, 
  ImageIcon, 
  PenTool, 
  ArrowRight,
  Zap,
  Trash2,
  Archive,
  ChevronRight,
  History,
  Tag
} from 'lucide-react';
import { Project } from '../../modules/workspace/Project';
import { MemoryService } from '../../modules/memory/MemoryService';

interface ProjectCommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAction: (action: string, payload?: any) => void;
}

export const ProjectCommandCenter: React.FC<ProjectCommandCenterProps> = ({
  isOpen,
  onClose,
  project,
  onAction
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Quick actions
  const actions = useMemo(() => [
    { id: 'add-memory', label: 'Tạo Kỷ niệm mới', icon: <Plus size={18} />, category: 'Thao tác nhanh', shortcut: 'M' },
    { id: 'add-event', label: 'Thêm Mốc thời gian', icon: <Clock size={18} />, category: 'Thao tác nhanh', shortcut: 'T' },
    { id: 'ai-suggest', label: 'AI Gợi ý ý tưởng', icon: <Sparkles size={18} />, category: 'AI Assistant', shortcut: 'A' },
    { id: 'upload-asset', label: 'Tải lên hình ảnh', icon: <ImageIcon size={18} />, category: 'Media', shortcut: 'U' },
    { id: 'open-editor', label: 'Mở trình soạn thảo', icon: <PenTool size={18} />, category: 'Điều hướng', shortcut: 'E' },
    { id: 'export-pdf', label: 'Xuất PDF Preview', icon: <ArrowRight size={18} />, category: 'Xuất bản', shortcut: 'P' },
  ], []);

  // Search Results (Unified Search)
  const searchResults = useMemo(() => {
    if (!query) return [];
    
    const results: any[] = [];
    const q = query.toLowerCase();

    // 1. Search in Memories (Simplified for demo)
    const memories = MemoryService.getMemories().filter(m => 
      m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)
    );
    memories.forEach(m => results.push({ id: `mem-${m.id}`, label: m.title, icon: <Zap size={14} className="text-amber-500" />, category: 'Kỷ niệm', type: 'memory', original: m }));

    // 2. Search in Actions
    const filteredActions = actions.filter(a => a.label.toLowerCase().includes(q));
    results.push(...filteredActions.map(a => ({ ...a, type: 'action' })));

    return results;
  }, [query, actions]);

  const items = query ? searchResults : actions;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter') {
        const item = items[selectedIndex];
        if (item) handleSelect(item);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex]);

  const handleSelect = (item: any) => {
    if (item.type === 'action' || !item.type) {
      onAction(item.id);
    } else if (item.type === 'memory') {
      onAction('open-memory', item.original.id);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden border border-slate-200"
          >
            {/* Search Bar */}
            <div className="flex items-center px-6 py-5 border-b border-slate-100 gap-4">
              <Command size={22} className="text-slate-400" />
              <input 
                autoFocus
                placeholder="Tìm kiếm Kỷ niệm, Media, Timeline hoặc nhập lệnh..."
                className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-900 placeholder:text-slate-400"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">ESC</span>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto p-3">
              {items.length > 0 ? (
                <div className="space-y-1">
                  {items.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const showCategory = index === 0 || item.category !== items[index - 1].category;

                    return (
                      <React.Fragment key={item.id}>
                        {showCategory && (
                          <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {item.category}
                          </div>
                        )}
                        <button
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={() => handleSelect(item)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                            isSelected ? 'bg-slate-900 text-white shadow-lg translate-x-1' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={isSelected ? 'text-amber-400' : 'text-slate-400'}>
                              {item.icon}
                            </span>
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                          </div>
                          {item.shortcut && (
                            <div className={`flex items-center gap-1 ${isSelected ? 'opacity-40' : 'opacity-20'}`}>
                              <span className="text-[10px] font-black">⌘</span>
                              <span className="text-[10px] font-black">{item.shortcut}</span>
                            </div>
                          )}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                    <Search size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Không tìm thấy kết quả</p>
                    <p className="text-xs text-slate-500 mt-1">Thử tìm kiếm với từ khóa khác hoặc dùng lệnh nhanh.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200">↑↓</span>
                  <span>Di chuyển</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200">ENTER</span>
                  <span>Chọn</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LoveNote Command v1.0</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
