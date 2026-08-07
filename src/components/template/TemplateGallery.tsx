import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Star, Clock, Search, BookOpen, Layers, Monitor, Tablet, Smartphone, Check, FolderPlus, Compass, ArrowRight, Bookmark, ChevronRight, HelpCircle
} from 'lucide-react';
import { useResponsive } from '../../modules/ui/ResponsiveManager';
import { Skeleton } from '../layout/Skeleton';
import { TemplateConfig, TemplateRegistry } from '../../modules/template/TemplateRegistry';
import { TemplateService } from '../../modules/template/TemplateService';
import { ThemeRegistry } from '../../modules/theme/ThemeRegistry';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (id: string) => void;
  onCreated?: () => void;
}

type CategoryType = 'All' | 'Personal' | 'Education' | 'Family' | 'Friendship' | 'Business';
type DeviceType = 'desktop' | 'tablet' | 'phone';

const CATEGORIES: { id: CategoryType; label: string; icon: string; count: number }[] = [
  { id: 'All', label: 'Tất cả mẫu', icon: '🎨', count: 16 },
  { id: 'Personal', label: 'Cá nhân (Journal)', icon: '📖', count: 3 },
  { id: 'Education', label: 'Giáo dục & Tri ân', icon: '🎓', count: 4 },
  { id: 'Family', label: 'Gia đình & Ngày lễ', icon: '🎂', count: 3 },
  { id: 'Friendship', label: 'Tình bạn & Thiệp', icon: '💌', count: 3 },
  { id: 'Business', label: 'Công việc & Thư mời', icon: '🤝', count: 3 }
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onCreated
}) => {
  const breakpoint = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');
  
  // Custom project creation state
  const [isPromptingName, setIsPromptingName] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  // Synchronize favorites and recents on mount/update
  useEffect(() => {
    setFavorites(TemplateService.getFavorites());
    setRecents(TemplateService.getRecents());
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Search & Filter
  const filteredTemplates = TemplateService.search(searchQuery).filter(tmpl => {
    if (activeCategory === 'All') return true;
    return tmpl.category === activeCategory;
  });

  // Sort favorites to top if in "All" or if favorited
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;
    return bFav - aFav; // Favorites first
  });

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = TemplateService.toggleFavorite(id);
    setFavorites(updated);
  };

  const handleOpenPreview = (tmpl: TemplateConfig) => {
    setSelectedTemplate(tmpl);
    setCustomTitle(tmpl.name.split(' (')[0]); // Default custom title
    setPreviewDevice('desktop');
  };

  const handleStartFromBlank = () => {
    // Create an empty project
    const project = TemplateService.createProjectFromTemplate('travel_journal', 'Dự án mới sáng tạo');
    // Clear layers to make it blank
    const { projectService } = require('../../modules/workspace/ProjectService');
    projectService.updateActiveProjectContent({
      title: 'Dự án trống',
      message: 'Soạn thảo nội dung của bạn...',
      placedItems: [],
      scene: 'plain',
      bgStyle: 'solid',
      fontStyle: 'playfair'
    });
    projectService.updateActiveProject({
      metadata: {
        layers: [
          {
            id: 'layer_title',
            type: 'text',
            name: 'Tiêu đề',
            x: 200,
            y: 200,
            width: 600,
            height: 80,
            zIndex: 1,
            metadata: { text: 'Dự Án Trống', fontStyle: 'playfair', fontSize: 32, align: 'center', color: '#1e293b' }
          },
          {
            id: 'layer_message',
            type: 'text',
            name: 'Lời chúc',
            x: 200,
            y: 320,
            width: 600,
            height: 120,
            zIndex: 2,
            metadata: { text: 'Bắt đầu kéo thả hoặc gõ nội dung tại đây...', fontStyle: 'playfair', fontSize: 20, align: 'center', color: '#475569' }
          }
        ]
      }
    });
    
    onSelectProject(project.id);
    onClose();
    if (onCreated) onCreated();
  };

  const handleCreateProject = () => {
    if (!selectedTemplate) return;
    
    // Create actual project
    const project = TemplateService.createProjectFromTemplate(
      selectedTemplate.id,
      customTitle || selectedTemplate.name
    );

    // Track usage
    TemplateService.addRecent(selectedTemplate.id);
    setRecents(TemplateService.getRecents());

    // Navigate to Editor
    onSelectProject(project.id);
    setIsPromptingName(false);
    setSelectedTemplate(null);
    onClose();
    if (onCreated) onCreated();
  };

  // Helper to render responsive preview on canvas simulation
  const renderPreviewCanvas = (tmpl: TemplateConfig, device: DeviceType) => {
    const theme = ThemeRegistry.getById(tmpl.themeId);
    
    let containerClass = "w-full h-[400px] border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between p-6 rounded-2xl relative transition-all duration-300 ";
    if (device === 'tablet') {
      containerClass += "max-w-[480px] h-[360px] mx-auto";
    } else if (device === 'phone') {
      containerClass += "max-w-[280px] h-[340px] mx-auto";
    } else {
      containerClass += "max-w-full h-[400px]";
    }

    // Custom background styling based on scene configuration
    let bgStyleClass = "bg-white text-slate-800";
    if (theme.scene === 'rose') bgStyleClass = "bg-rose-50/90 text-rose-950";
    else if (theme.scene === 'garden') bgStyleClass = "bg-emerald-50/90 text-emerald-950";
    else if (theme.scene === 'forest') bgStyleClass = "bg-emerald-900 text-emerald-50";
    else if (theme.scene === 'sunset') bgStyleClass = "bg-orange-50 text-orange-950";
    else if (theme.scene === 'ocean') bgStyleClass = "bg-blue-50 text-blue-950";
    else if (theme.scene === 'sakura') bgStyleClass = "bg-pink-50 text-pink-950";
    else if (theme.scene === 'sky') bgStyleClass = "bg-sky-50 text-sky-950";

    const fontStyleClass = 
      theme.fontStyle === 'playfair' ? 'font-serif' :
      theme.fontStyle === 'dancing' ? 'italic' :
      theme.fontStyle === 'pacifico' ? 'font-sans italic' :
      theme.fontStyle === 'caveat' ? 'font-mono' :
      theme.fontStyle === 'lora' ? 'font-serif' : 'font-sans';

    // Extract title text and message text
    const titleText = tmpl.layers.find(l => l.id === 'layer_title')?.metadata?.text || tmpl.name;
    const messageText = tmpl.layers.find(l => l.id === 'layer_message')?.metadata?.text || tmpl.description;

    return (
      <div className={`${containerClass} ${bgStyleClass} ${fontStyleClass}`} style={{
        borderColor: theme.borderColor,
        borderWidth: theme.borderStyle === 'none' ? 0 : theme.borderWidth,
        borderStyle: theme.borderStyle === 'double' ? 'double' : (theme.borderStyle === 'none' ? 'solid' : theme.borderStyle),
        borderRadius: `${theme.borderRadius}px`
      }}>
        {/* Simulating Floating Background Decoration */}
        {theme.bgStyle === 'hearts' && (
          <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden flex flex-wrap gap-4 p-4 text-rose-500">
            {Array.from({ length: 8 }).map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
        )}
        {theme.bgStyle === 'grid' && (
          <div className="absolute inset-0 pointer-events-none opacity-10" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}>
          </div>
        )}

        {/* Simulating Header */}
        <div className="text-[10px] text-center tracking-wider opacity-60 uppercase font-semibold">
          {theme.headerText || '✨ Canvas Composer Standard'}
        </div>

        {/* Simulating Body */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4 my-2 gap-2">
          <h4 className="text-sm sm:text-base font-bold leading-tight" style={{ color: theme.textColor }}>
            {titleText}
          </h4>
          <p className="text-[11px] leading-relaxed opacity-85 max-w-[90%] line-clamp-4">
            {messageText}
          </p>

          {/* Render mock mini blocks if any */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap justify-center">
            {tmpl.supportedBlocks.slice(2).map((block, bIdx) => (
              <span key={bIdx} className="text-[8px] bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 px-2 py-0.5 rounded-full font-medium">
                {block}
              </span>
            ))}
          </div>
        </div>

        {/* Simulating Footer */}
        <div className="text-[9px] text-center opacity-50 tracking-wide">
          {theme.footerText || 'Page 1 of 1 — Premium Template'}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900/65 backdrop-blur-sm overflow-hidden select-none">
      
      {/* 1. Main Gallery Container */}
      <div className="w-full h-full max-w-7xl mx-auto my-auto bg-white flex flex-col relative md:rounded-3xl shadow-2xl border-x border-slate-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-500" />
              <span>Giao Diện Khởi Tạo Dự Án Mới</span>
            </div>
            <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-2">
              Thư Viện Mẫu Thiết Kế <span className="text-[11px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full uppercase">Sprint 66</span>
            </h2>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleStartFromBlank}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all min-h-[36px]"
              title="Khởi tạo một trang trắng hoàn toàn tự do"
            >
              <FolderPlus size={14} className="text-slate-500" />
              <span>Tự Thiết Kế (Blank)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search & Top Filters */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-center bg-white shrink-0">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mẫu thiết kế (Ví dụ: 'teacher', 'birthday', 'speech')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                <X size={12} />
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden md:block">
            Hiển thị <span className="font-bold text-slate-700">{filteredTemplates.length}</span> mẫu thiết kế có sẵn
          </div>
        </div>

        {/* Sidebar & Grid Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Navigation (Category Filter) */}
          <div className="w-full md:w-60 lg:w-64 border-r border-slate-100 bg-slate-50/50 p-4 shrink-0 flex overflow-x-auto md:overflow-x-visible md:flex-col gap-1.5 scrollbar-none">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3.5 mb-2 hidden md:block">
              Danh Mục Mẫu
            </p>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 shrink-0 transition-all ${
                    isActive 
                      ? 'bg-rose-50 text-rose-900 font-bold shadow-2xs border-l-4 border-rose-500 rounded-l-none'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </div>
                  {isActive && <ChevronRight size={12} className="text-rose-600 hidden md:block" />}
                </button>
              );
            })}
          </div>

          {/* Grid View Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/20 space-y-6">
            
            {/* Recently Used Section */}
            {recents.length > 0 && searchQuery === '' && activeCategory === 'All' && (
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-500" />
                  <span>Sử dụng gần đây</span>
                </h4>
                <div className={`grid gap-3 ${breakpoint === 'desktop' ? 'grid-cols-4' : breakpoint === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {recents.map(id => {
                    const tmpl = TemplateRegistry.getById(id);
                    if (!tmpl) return null;
                    return (
                      <div 
                        key={id}
                        onClick={() => handleOpenPreview(tmpl)}
                        className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex items-center gap-3 hover:border-rose-300 transition-all cursor-pointer group hover:-translate-y-0.5"
                      >
                        <img 
                          src={tmpl.previewImage} 
                          alt={tmpl.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100" 
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 truncate leading-snug group-hover:text-rose-600 transition-colors">
                            {tmpl.name.split(' (')[0]}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            {tmpl.subcategory}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Template Library Grid */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={12} className="text-rose-500" />
                <span>Khuyên dùng & Phổ biến (Nhấp để xem trước)</span>
              </h4>

              {sortedTemplates.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white max-w-md mx-auto space-y-3">
                  <BookOpen size={36} className="text-slate-300 mx-auto" />
                  <div>
                    <p className="font-bold text-sm text-slate-700">Không tìm thấy mẫu phù hợp</p>
                    <p className="text-xs text-slate-400">Hãy thử nhập từ khóa tìm kiếm khác hoặc đổi danh mục nhé.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedTemplates.map(tmpl => {
                    const isFav = favorites.includes(tmpl.id);
                    return (
                      <motion.div
                        key={tmpl.id}
                        layout
                        onClick={() => handleOpenPreview(tmpl)}
                        className="group relative rounded-2xl bg-white border border-slate-200 hover:border-rose-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                      >
                        {/* Image Cover */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={tmpl.previewImage}
                            alt={tmpl.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Favorite Button Overlay */}
                          <button
                            onClick={(e) => handleToggleFavorite(e, tmpl.id)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-400 hover:text-amber-500 transition-colors shadow-2xs backdrop-blur-xs"
                          >
                            <Star size={14} fill={isFav ? '#f59e0b' : 'transparent'} className={isFav ? 'text-amber-500' : ''} />
                          </button>

                          {/* Difficulty Ribbon */}
                          <span className={`absolute bottom-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            tmpl.difficulty === 'Dễ' ? 'bg-emerald-100 text-emerald-800' :
                            tmpl.difficulty === 'Trung bình' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            ⚡ Độ khó: {tmpl.difficulty}
                          </span>
                        </div>

                        {/* Text Details */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between gap-2 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>{tmpl.category}</span>
                              <span>• {tmpl.pages} trang</span>
                            </div>
                            <h3 className="font-extrabold text-slate-800 text-sm leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
                              {tmpl.name.split(' (')[0]}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                              {tmpl.description}
                            </p>
                          </div>

                          {/* Footer Tags */}
                          <div className="flex items-center gap-1.5 flex-wrap overflow-hidden h-5 pt-1 border-t border-slate-50">
                            {tmpl.tags.slice(0, 3).map((tag, tagIdx) => (
                              <span key={tagIdx} className="text-[8px] bg-slate-50 text-slate-500 font-semibold px-2 py-0.5 rounded-md border border-slate-100">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Preview Modal / Bottom Sheet Panel */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
            >
              
              {/* Left Column: Responsive Simulation Canvas Preview */}
              <div className="flex-1 bg-slate-50 p-6 flex flex-col justify-between border-r border-slate-100 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Monitor size={12} className="text-rose-500" />
                      <span>Xem trước tương thích</span>
                    </span>

                    {/* Responsive Switcher pills */}
                    <div className="flex bg-slate-200/60 p-1 rounded-xl">
                      {(['desktop', 'tablet', 'phone'] as DeviceType[]).map(dev => (
                        <button
                          key={dev}
                          onClick={() => setPreviewDevice(dev)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 uppercase tracking-wide transition-all ${
                            previewDevice === dev 
                              ? 'bg-white text-slate-800 shadow-3xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {dev === 'desktop' && <Monitor size={12} />}
                          {dev === 'tablet' && <Tablet size={12} />}
                          {dev === 'phone' && <Smartphone size={12} />}
                          <span className="hidden sm:inline">{dev}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Render simulated Responsive Canvas */}
                  {renderPreviewCanvas(selectedTemplate, previewDevice)}
                </div>

                <div className="pt-4 text-center">
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1 leading-snug">
                    💡 Thử nghiệm co dãn kích thước để chuẩn bị xuất khẩu (Export) đa kích thước!
                  </p>
                </div>
              </div>

              {/* Right Column: Information panel & Project Prompt form */}
              <div className="w-full md:w-80 lg:w-96 p-6 flex flex-col justify-between overflow-y-auto shrink-0 border-t md:border-t-0 border-slate-100 bg-white">
                <div className="space-y-4">
                  
                  {/* Title Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                        <span>{selectedTemplate.category}</span>
                        <span>•</span>
                        <span>{selectedTemplate.subcategory}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                        {selectedTemplate.name.split(' (')[0]}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setIsPromptingName(false);
                      }}
                      className="p-1.5 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <p className="text-slate-400 font-semibold uppercase">Số trang</p>
                        <p className="font-bold text-slate-800">{selectedTemplate.pages} trang</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold uppercase">Độ khó</p>
                        <p className="font-bold text-slate-800">{selectedTemplate.difficulty}</p>
                      </div>
                    </div>
                    
                    <hr className="border-slate-200/60" />

                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Thích hợp cho</p>
                      <p className="font-bold text-slate-700 leading-relaxed mt-0.5">{selectedTemplate.suitableFor}</p>
                    </div>

                    <hr className="border-slate-200/60" />

                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Phong cách AI khuyến nghị</p>
                      <p className="font-medium text-slate-600 italic leading-relaxed mt-0.5">"{selectedTemplate.recommendedAIStyle}"</p>
                    </div>

                    <hr className="border-slate-200/60" />

                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Khối Layout tương tác</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTemplate.supportedBlocks.map((b, idx) => (
                          <span key={idx} className="text-[9px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-md border border-rose-100">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Form to name the project */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Đặt tên dự án của bạn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="VD: Nhật ký Sapa, Diễn văn của tôi..."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Final Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={handleCreateProject}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/10 flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles size={14} />
                    <span>Sử Dụng Mẫu & Tạo Dự Án</span>
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors"
                  >
                    Xem mẫu khác
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
