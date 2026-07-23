import React, { useState, useEffect } from 'react';
import { Search, X, Smile, Type, Square, Heart, Star, Sparkles, Gift, Cake, Users, Flower2, MousePointer2, FolderOpen, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface AssetsLibraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const stickerCategories = [
  { id: 'sticker', label: 'Sticker', icon: <Smile size={14} /> },
  { id: 'text', label: 'Chữ mẫu', icon: <Type size={14} /> },
  { id: 'frame', label: 'Khung', icon: <Square size={14} /> },
];

const mockStickers = [
  { id: '1', name: 'Trái tim', icon: <Heart size={32} className="text-rose-500" />, color: 'bg-rose-50' },
  { id: '2', name: 'Ngôi sao', icon: <Star size={32} className="text-amber-500" />, color: 'bg-amber-50' },
  { id: '3', name: 'Lấp lánh', icon: <Sparkles size={32} className="text-blue-500" />, color: 'bg-blue-50' },
  { id: '4', name: 'Mặt cười', icon: <Smile size={32} className="text-emerald-500" />, color: 'bg-emerald-50' },
  { id: '5', name: 'Hộp quà', icon: <Gift size={32} className="text-purple-500" />, color: 'bg-purple-50' },
  { id: '6', name: 'Bánh kem', icon: <Cake size={32} className="text-pink-500" />, color: 'bg-pink-50' },
  { id: '7', name: 'Cặp đôi', icon: <Users size={32} className="text-indigo-500" />, color: 'bg-indigo-50' },
  { id: '8', name: 'Bông hoa', icon: <Flower2 size={32} className="text-orange-500" />, color: 'bg-orange-50' },
];

export const AssetsLibraryPanel: React.FC<AssetsLibraryPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('sticker');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [width, setWidth] = useState(280);
  const [isPinned, setIsPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const filteredStickers = mockStickers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock loading state on tab change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape' && !isPinned) {
        onClose();
      }
      
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('asset-search-input')?.focus();
      }

      if (document.activeElement?.tagName !== 'INPUT') {
        if (e.key === 'Tab') {
          e.preventDefault();
          const currentIndex = stickerCategories.findIndex(c => c.id === activeTab);
          const nextIndex = (currentIndex + 1) % stickerCategories.length;
          setActiveTab(stickerCategories[nextIndex].id);
        }

        // Arrow Key Navigation
        if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
          e.preventDefault();
          setSelectedIndex(prev => {
            if (e.key === 'ArrowRight') return Math.min(prev + 1, filteredStickers.length - 1);
            if (e.key === 'ArrowLeft') return Math.max(prev - 1, 0);
            if (e.key === 'ArrowDown') return Math.min(prev + 4, filteredStickers.length - 1);
            if (e.key === 'ArrowUp') return Math.max(prev - 4, 0);
            return prev;
          });
        }

        if (e.key === 'Enter' && filteredStickers[selectedIndex]) {
          console.log('Selected sticker:', filteredStickers[selectedIndex].name);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activeTab, filteredStickers, selectedIndex, isPinned]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(240, e.clientX - 64), 480);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for Tablet (Drawer) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isPinned && onClose()}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[90] 2xl:hidden"
          />

          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: width }}
            className={`fixed inset-y-0 left-0 z-[100] lg:top-[72px] lg:bottom-4 lg:left-16 2xl:left-16 sm:h-auto h-[80%] sm:mt-0 mt-auto flex`}
          >
            {/* Resize Handle */}
            <div 
              onMouseDown={handleMouseDown}
              className="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize group z-50 hidden lg:block"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <Card 
              variant="elevated" 
              padding="none" 
              className="h-full w-full flex flex-col bg-white border-[#E5E7EB] rounded-t-[24px] sm:rounded-[16px] shadow-[0_4px_20px_rgba(16,24,40,0.06)] overflow-hidden"
            >
              {/* Header - Height 48px */}
              <div className="h-12 px-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FF2D55]" />
                  <Typography variant="body-sm" className="font-bold text-[#111827]">Thư viện Assets</Typography>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsPinned(!isPinned)} 
                    className={`p-1 rounded-lg transition-colors ${isPinned ? 'text-[#FF2D55] bg-rose-50' : 'text-slate-400 hover:bg-slate-50'}`}
                    title={isPinned ? 'Bỏ ghim' : 'Ghim panel'}
                  >
                    <Pin size={16} className={isPinned ? 'fill-current' : ''} />
                  </button>
                  <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="p-4 space-y-4 shrink-0">
                <div className="flex gap-1 p-1 bg-[#F8FAFC] rounded-[10px] border border-[#E5E7EB]">
                  {stickerCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[8px] transition-all text-[11px] font-bold ${
                        activeTab === cat.id 
                          ? 'bg-white text-[#FF2D55] shadow-sm border border-[#E5E7EB]' 
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search - Height 40px */}
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input 
                    id="asset-search-input"
                    type="text"
                    placeholder="Tìm kiếm nhãn dán, chữ..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    className="w-full h-10 pl-10 pr-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full text-xs focus:ring-1 focus:ring-[#FF2D55] focus:border-[#FF2D55] transition-all outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar relative">
                {isLoading ? (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#FF2D55]"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <Typography variant="label" className="mb-4 block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  STICKERS TRANG TRÍ (KÉO THẢ)
                </Typography>

                {filteredStickers.length > 0 ? (
                  <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                    {filteredStickers.map((sticker, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <div 
                          key={sticker.id} 
                          className="flex flex-col items-center gap-2 group cursor-grab active:cursor-grabbing"
                          onClick={() => setSelectedIndex(index)}
                        >
                          <motion.div 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-[48px] h-[48px] ${sticker.color} rounded-[12px] flex items-center justify-center shadow-sm border transition-all ${
                              isSelected ? 'ring-2 ring-[#FF2D55] border-white shadow-md' : 'border-white group-hover:shadow-md'
                            }`}
                          >
                            {React.cloneElement(sticker.icon as React.ReactElement, { size: 28 })}
                          </motion.div>
                          <Typography variant="caption" className={`text-[11px] font-medium text-center truncate w-full transition-colors ${
                            isSelected ? 'text-[#FF2D55] font-bold' : 'text-[#6B7280]'
                          }`}>
                            {sticker.name}
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Search size={32} className="text-slate-200" />
                    </div>
                    <Typography variant="body-sm" className="font-bold text-[#111827]">Không tìm thấy kết quả</Typography>
                    <Typography variant="caption" className="text-[#6B7280]">Thử tìm với từ khóa khác</Typography>
                  </div>
                )}
              </div>

              {/* Footer Action - Height 44px Button */}
              <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] shrink-0">
                <button 
                  className="w-full h-11 bg-[#111827] text-white hover:bg-slate-800 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  <FolderOpen size={18} />
                  Chèn từ Media Library
                </button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
