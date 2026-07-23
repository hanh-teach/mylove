import React from 'react';
import { Menu, Bell, Search, Plus, User } from 'lucide-react';
import { useNotifications } from '../../modules/workspace/notifications/NotificationService';
import { WorkspaceSwitcher } from '../../components/shell/WorkspaceSwitcher';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';

interface HeaderProps {
  title: string;
  onToggleMenu: () => void;
  onOpenQuickActions: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onToggleMenu, 
  onOpenQuickActions, 
  onOpenNotifications 
}) => {
  const { unreadCount } = useNotifications();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-14 lg:h-[72px] bg-white/80 backdrop-blur-md border-b border-border-base px-4 flex items-center justify-between z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMenu} 
          className="p-2 2xl:hidden rounded-xl text-text-muted hover:bg-surface-elevated transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-4">
          <WorkspaceSwitcher />
          <div className="hidden lg:block w-px h-6 bg-border-subtle" />
          <Typography variant="title" className="hidden lg:block text-text-main truncate">
            {title}
          </Typography>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="hidden md:flex items-center bg-surface-elevated border border-border-base rounded-full px-3 py-1.5 cursor-pointer hover:border-slate-300 transition-all group"
        >
          <Search size={16} className="text-text-muted group-hover:text-slate-900 transition-colors" />
          <span className="text-sm px-2 w-48 text-text-muted">Tìm kiếm nhanh...</span>
        </div>

        <button 
          onClick={onOpenNotifications} 
          className="p-2 text-text-muted hover:bg-surface-elevated rounded-xl transition-colors relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
          )}
        </button>

        <Button 
          variant="primary" 
          size="sm" 
          onClick={onOpenQuickActions}
          className="hidden sm:flex"
          leftIcon={<Plus size={18} />}
        >
          Tạo mới
        </Button>
        
        <button className="sm:hidden p-2 bg-primary text-white rounded-xl">
          <Plus size={20} />
        </button>

        <div className="w-px h-6 bg-border-subtle mx-1" />
        
        <button className="w-8 h-8 rounded-full bg-slate-200 border border-border-base overflow-hidden flex items-center justify-center">
          <User size={16} className="text-text-muted" />
        </button>
      </div>
    </header>
  );
};
