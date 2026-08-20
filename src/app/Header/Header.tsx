import React from 'react';
import { 
  Menu, Bell, Search, Plus, User, Home, Settings, Download, ChevronDown, 
  Sparkles, PenTool, Type, Music, Palette, Minus, Flower, Check, Video, Crown 
} from 'lucide-react';
import { useNotifications } from '../../modules/workspace/notifications/NotificationService';
import { WorkspaceSwitcher } from '../../components/shell/WorkspaceSwitcher';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { AppTabType } from '../../types';
import { useCurrentUser } from '../../modules/workspace/WorkspaceZustandStore';
import { isOwnerUser } from '../../shared/utils/authPermissions';

export interface HeaderProps {
  title: string;
  activeTab?: AppTabType;
  onSelectTab?: (tab: AppTabType) => void;
  onToggleMenu: () => void;
  onOpenQuickActions: () => void;
  onOpenNotifications: () => void;
  onGoHome?: () => void;
  onOpenStudioEditor?: () => void;
  onOpenAuth?: () => void;

  // Customization controls
  showSettingsMenu?: boolean;
  onToggleSettingsMenu?: () => void;
  bgStyle?: string;
  cycleBgStyle?: () => void;
  fontStyle?: string;
  cycleFont?: () => void;
  currentMusic?: any;
  musicTracks?: any[];
  setCurrentMusic?: (track: any) => void;
  showMusicMenu?: boolean;
  setShowMusicMenu?: (show: boolean) => void;
  textColor?: string;
  textColors?: any[];
  setTextColor?: (color: string) => void;
  showTextColorMenu?: boolean;
  setShowTextColorMenu?: (show: boolean) => void;
  textSize?: number;
  setTextSize?: (size: any) => void;
  showTextSizeMenu?: boolean;
  setShowTextSizeMenu?: (show: boolean) => void;
  showPalette?: boolean;
  setShowPalette?: (show: boolean) => void;
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
  generateVideo?: () => void;
  updateActiveProjectContent?: (data: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  activeTab,
  onSelectTab,
  onToggleMenu, 
  onOpenQuickActions, 
  onOpenNotifications,
  onGoHome,
  onOpenStudioEditor,
  onOpenAuth,
  showSettingsMenu = false,
  onToggleSettingsMenu,
  bgStyle,
  cycleBgStyle,
  fontStyle,
  cycleFont,
  currentMusic,
  musicTracks,
  setCurrentMusic,
  showMusicMenu,
  setShowMusicMenu,
  textColor,
  textColors,
  setTextColor,
  showTextColorMenu,
  setShowTextColorMenu,
  textSize = 1,
  setTextSize,
  showTextSizeMenu,
  setShowTextSizeMenu,
  showPalette,
  setShowPalette,
  isEditing,
  setIsEditing,
  generateVideo,
  updateActiveProjectContent
}) => {
  const { unreadCount } = useNotifications();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-14 lg:h-[72px] bg-white/90 backdrop-blur-md border-b border-border-base px-3 sm:px-4 flex items-center justify-between z-40 shadow-xs">
      {/* Left Section: Menu Toggle + Navigation Group */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={onToggleMenu} 
          className="p-2 2xl:hidden rounded-xl text-text-muted hover:bg-surface-elevated transition-colors"
          title="Mở menu điều hướng"
        >
          <Menu size={20} />
        </button>

        <WorkspaceSwitcher />

        <div className="hidden lg:block w-px h-6 bg-border-subtle" />

        {/* MAIN NAVIGATION MENU (Trang Chủ, Tùy Chỉnh) */}
        <nav className="flex items-center gap-1 bg-rose-50/70 p-1 rounded-2xl border border-rose-100/80">
          {/* 1. Trang Chủ */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'card' || activeTab === 'home'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
              }`}
              title="Về Trang Chủ"
            >
              <Home size={15} />
              <span className="hidden sm:inline">Trang Chủ</span>
            </button>
          )}

          {/* 2. TÙY CHỈNH (Mở/Tắt thanh công cụ bên dưới) */}
          <button
            onClick={() => {
              if (onSelectTab && activeTab !== 'card') {
                onSelectTab('card');
              }
              if (onToggleSettingsMenu) {
                onToggleSettingsMenu();
              }
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              showSettingsMenu
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
            title="Bật/tắt thanh Tùy chỉnh ở dưới"
          >
            <Settings size={15} className={showSettingsMenu ? 'rotate-90 transition-transform duration-300' : 'transition-transform duration-300'} />
            <span className="hidden sm:inline">Tùy Chỉnh</span>
          </button>
        </nav>
      </div>
      
      {/* Right Section: Search, Notifications, Create, User */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="hidden md:flex items-center bg-surface-elevated border border-border-base rounded-full px-3 py-1.5 cursor-pointer hover:border-slate-300 transition-all group"
        >
          <Search size={16} className="text-text-muted group-hover:text-slate-900 transition-colors" />
          <span className="text-sm px-2 w-32 xl:w-48 text-text-muted truncate">Tìm kiếm nhanh...</span>
        </div>

        <button 
          onClick={onOpenNotifications} 
          className="p-2 text-text-muted hover:bg-surface-elevated rounded-xl transition-colors relative"
          title="Thông báo"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
          )}
        </button>

        <button
          onClick={onOpenQuickActions}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all shadow-xs"
          title="Tạo mới"
        >
          <Plus size={18} />
        </button>

        <div className="w-px h-6 bg-border-subtle mx-0.5" />
        
        {(() => {
          const currentUser = useCurrentUser();
          const isOwner = isOwnerUser(currentUser?.role, currentUser?.email);
          return (
            <button 
              onClick={onOpenAuth}
              className={`relative w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center transition-all hover:scale-105 ${
                isOwner 
                  ? 'bg-gradient-to-tr from-amber-400 to-rose-500 border-amber-300 text-slate-950 shadow-sm' 
                  : 'bg-slate-200 border-border-base text-slate-700 hover:bg-slate-300'
              }`}
              title={currentUser?.email ? `Đã đăng nhập: ${currentUser.email} (${currentUser.role})` : "Đăng nhập / Xác thực"}
            >
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : isOwner ? (
                <Crown size={16} className="text-slate-950 font-bold" />
              ) : (
                <User size={16} className="text-text-muted" />
              )}
              {isOwner && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 border border-white rounded-full animate-ping" />
              )}
            </button>
          );
        })()}
      </div>
    </header>
  );
};


