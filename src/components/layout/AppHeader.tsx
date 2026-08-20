import React from 'react';
import { Menu, Bell, Search, Plus, User } from 'lucide-react';
import { useNotifications } from '../../modules/workspace/notifications/NotificationService';

interface AppHeaderProps {
  onToggleMenu: () => void;
  onOpenQuickActions: () => void;
  onOpenNotifications: () => void;
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleMenu, onOpenQuickActions, onOpenNotifications, title }) => {
  const { unreadCount } = useNotifications();
  
  return (
    <header className="fixed top-0 left-0 sm:left-64 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-40 shadow-sm transition-colors">
      <div className="flex items-center gap-2">
        <button onClick={onToggleMenu} className="p-2 sm:hidden rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">{title}</h1>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <Search size={20} />
        </button>
        <button onClick={onOpenNotifications} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative">
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />}
        </button>
        <button onClick={onOpenQuickActions} className="p-2 bg-slate-900 dark:bg-rose-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-rose-700 transition-colors">
          <Plus size={20} />
        </button>
      </div>
    </header>
  );
};
