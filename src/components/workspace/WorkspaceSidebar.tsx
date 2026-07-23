import React from 'react';
import {
  FolderOpen,
  Star,
  Clock,
  Archive,
  Trash2,
  FolderPlus,
  Layers,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useProjectWorkspace, WorkspaceViewType } from '../../modules/workspace/WorkspaceContext';

interface WorkspaceSidebarProps {
  onOpenNewDialog?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  onOpenNewDialog,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const {
    projects,
    activeView,
    setActiveView,
    categoryFilter,
    setCategoryFilter,
  } = useProjectWorkspace();

  const countActive = projects.filter((p) => p.status !== 'trash' && p.status !== 'archived').length;
  const countFavorites = projects.filter((p) => p.favorite && p.status !== 'trash').length;
  const countArchive = projects.filter((p) => p.status === 'archived').length;
  const countTrash = projects.filter((p) => p.status === 'trash').length;

  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));

  const navItems: { id: WorkspaceViewType; label: string; icon: any; count: number; color: string }[] = [
    { id: 'projects', label: '📂 Projects', icon: FolderOpen, count: countActive, color: 'text-rose-500' },
    { id: 'favorites', label: '⭐ Favorites', icon: Star, count: countFavorites, color: 'text-amber-500' },
    { id: 'recent', label: '📝 Recent', icon: Clock, count: countActive, color: 'text-blue-500' },
    { id: 'archive', label: '🗄 Archive', icon: Archive, count: countArchive, color: 'text-slate-500' },
    { id: 'trash', label: '🗑 Trash', icon: Trash2, count: countTrash, color: 'text-red-500' },
  ];

  const handleSelectView = (view: WorkspaceViewType) => {
    setActiveView(view);
    setCategoryFilter('all');
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside className="w-full h-full bg-slate-900/95 text-slate-200 p-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Workspace Brand / Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">Love Note Workspace</h2>
              <p className="text-[10px] text-slate-400">Quản lý đa dự án 58.0</p>
            </div>
          </div>
        </div>

        {/* New Project Button */}
        {onOpenNewDialog && (
          <button
            onClick={() => {
              onOpenNewDialog();
              if (isMobileDrawer && onCloseMobileDrawer) onCloseMobileDrawer();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            <FolderPlus size={16} />
            <span>+ Tạo Dự Án Mới</span>
          </button>
        )}

        {/* Main Navigation Views */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Workspace Navigation
          </p>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={item.color} />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Categories / Tags Section */}
        {categories.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Danh mục
            </p>

            <button
              onClick={() => setCategoryFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium ${
                categoryFilter === 'all'
                  ? 'bg-slate-800 text-rose-400 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span>Tất cả danh mục</span>
              {categoryFilter === 'all' && <ChevronRight size={12} />}
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium truncate ${
                  categoryFilter === cat
                    ? 'bg-slate-800 text-rose-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span className="truncate">🏷️ {cat}</span>
                {categoryFilter === cat && <ChevronRight size={12} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-rose-400 animate-pulse" />
          <span>Love Note 4.0 Workspace</span>
        </div>
        <span className="font-mono text-[10px] text-slate-600">v58.0</span>
      </div>
    </aside>
  );
};
