import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  Plus, 
  Settings, 
  ChevronLeft, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Archive, 
  Trash2, 
  Home, 
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useNotifications } from '../../modules/workspace/notifications/NotificationService';
import { Project } from '../../modules/workspace/Project';

export type ProjectSaveStatus = 'clean' | 'modified' | 'saving' | 'error';

interface AppHeaderProps {
  onToggleMenu: () => void;
  onOpenQuickActions: () => void;
  onOpenNotifications: () => void;
  title: string;
  isHome?: boolean;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
  onGoHome?: () => void;
  
  // New Project-centric props
  activeProject?: Project | null;
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  onRenameProject?: (id: string, title: string) => void;
  onDuplicateProject?: (id: string) => void;
  onArchiveProject?: (id: string) => void;
  onTrashProject?: (id: string) => void;
  projectStatus?: ProjectSaveStatus;
  onManualSave?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  onToggleMenu, 
  onOpenQuickActions, 
  onOpenNotifications, 
  title,
  isHome = false,
  onOpenSearch,
  onOpenSettings,
  onGoHome,
  
  activeProject,
  activeTab,
  onSelectTab,
  onRenameProject,
  onDuplicateProject,
  onArchiveProject,
  onTrashProject,
  projectStatus = 'clean',
  onManualSave
}) => {
  const { unreadCount } = useNotifications();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };
    if (isActionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsOpen]);
  
  if (isHome) {
    return (
      <header className="fixed top-0 left-0 sm:left-64 right-0 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-40 shadow-xs">
        <div className="flex items-center gap-2">
          {/* LNOS Brand Logo & Title */}
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <span className="font-serif font-black text-slate-900 tracking-tight text-base sm:text-lg">
              LoveNote
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            title="Tìm kiếm (Ctrl+K)"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search</span>
          </button>
          
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            title="Cài đặt hệ thống"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>
    );
  }

  const handleRename = () => {
    setIsActionsOpen(false);
    if (!activeProject || !onRenameProject) return;
    const newName = prompt('Nhập tên mới cho Project:', activeProject.title);
    if (newName && newName.trim()) {
      onRenameProject(activeProject.id, newName.trim());
    }
  };

  const handleDuplicate = () => {
    setIsActionsOpen(false);
    if (!activeProject || !onDuplicateProject) return;
    onDuplicateProject(activeProject.id);
  };

  const handleArchive = () => {
    setIsActionsOpen(false);
    if (!activeProject || !onArchiveProject) return;
    if (confirm(`Bạn chắc chắn muốn lưu trữ Project "${activeProject.title}"?`)) {
      onArchiveProject(activeProject.id);
      if (onGoHome) onGoHome();
    }
  };

  const handleTrash = () => {
    setIsActionsOpen(false);
    if (!activeProject || !onTrashProject) return;
    if (confirm(`Bạn có muốn chuyển Project "${activeProject.title}" vào thùng rác?`)) {
      onTrashProject(activeProject.id);
      if (onGoHome) onGoHome();
    }
  };

  const isDeepInModule = activeTab && activeTab !== 'project-dashboard';

  const handleBack = () => {
    if (onSelectTab) {
      if (activeTab === 'card') {
        onSelectTab('project-dashboard');
      } else {
        onSelectTab('card');
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 sm:left-64 right-0 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-40 shadow-xs">
      <div className="flex items-center gap-2 overflow-hidden">
        {/* 🏠 Home Button */}
        <button
          onClick={onGoHome}
          className="p-1.5 sm:p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center gap-1.5 font-bold shrink-0 border border-rose-100 bg-rose-50/50"
          title="Về Home"
        >
          <Home size={16} />
          <span className="hidden sm:inline text-[11px] font-extrabold uppercase tracking-wider text-rose-600">Home</span>
        </button>

        {/* ← Back Button - visible when user is deep inside any editor or asset list */}
        {isDeepInModule && onSelectTab && (
          <button
            onClick={handleBack}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-all flex items-center gap-1 font-bold shrink-0 border border-slate-200 bg-white"
            title="Quay lại"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Back</span>
          </button>
        )}

        <button onClick={onToggleMenu} className="p-2 sm:hidden rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
          <Menu size={20} />
        </button>

        {/* Project Icon & Title */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 overflow-hidden">
          {activeProject && (
            <span className="text-base shrink-0">{activeProject.icon || '📁'}</span>
          )}
          <h1 className="font-bold text-slate-800 truncate text-sm sm:text-base">
            {activeProject ? activeProject.title : title}
          </h1>
          {activeProject && (
            <div className="ml-1 hidden sm:flex items-center">
              {projectStatus === 'clean' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md">
                  <Check size={10} /> Đã lưu
                </span>
              )}
              {projectStatus === 'saving' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md">
                  <RefreshCw size={10} className="animate-spin" /> Đang lưu
                </span>
              )}
              {projectStatus === 'error' && (
                <button 
                  onClick={onManualSave}
                  className="flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:bg-rose-100 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md transition-colors"
                  title="Nhấn để thử lưu lại"
                >
                  <AlertCircle size={10} /> Không thể lưu
                </button>
              )}
              {projectStatus === 'modified' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md">
                  Chưa lưu
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {projectStatus === 'error' && activeProject && (
          <button 
            onClick={onManualSave}
            className="sm:hidden p-1.5 text-rose-600 bg-rose-50 rounded-lg mr-1 flex items-center gap-1 text-[10px] font-bold uppercase"
          >
            Lưu lại
          </button>
        )}
        <button onClick={onOpenSearch} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <Search size={20} />
        </button>
        <button onClick={onOpenNotifications} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative">
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />}
        </button>
        
        {/* ⋮ Project Standard Actions Dropdown */}
        {activeProject && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsActionsOpen(!isActionsOpen)} 
              className={`p-2 rounded-xl transition-colors ${isActionsOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Thao tác Project"
            >
              <MoreVertical size={20} />
            </button>
            
            {isActionsOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg py-2 z-50 text-xs font-semibold">
                <button
                  onClick={handleRename}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit2 size={14} className="text-slate-400" />
                  Đổi tên Project
                </button>
                <button
                  onClick={handleDuplicate}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Copy size={14} className="text-slate-400" />
                  Nhân bản Project
                </button>
                <button
                  onClick={handleArchive}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Archive size={14} className="text-slate-400" />
                  Lưu trữ Project
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleTrash}
                  className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 size={14} className="text-rose-400" />
                  Xóa tạm Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
