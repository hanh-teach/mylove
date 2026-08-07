import React from 'react';
import {
  ArrowUpDown,
  Filter,
  Plus,
  FolderPlus,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { SortField } from '../../modules/workspace/ProjectSorter';
import { ProjectSearchBar } from './ProjectSearchBar';

interface ProjectToolbarProps {
  onOpenNewDialog?: () => void;
}

export const ProjectToolbar: React.FC<ProjectToolbarProps> = ({ onOpenNewDialog }) => {
  const {
    activeView,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filteredProjects,
  } = useProjectWorkspace();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SortField;
    setSortBy(val);
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'favorites':
        return '⭐ Dự Án Yêu Thích';
      case 'recent':
        return '📝 Dự Án Sửa Gần Đây';
      case 'archive':
        return '🗄 Kho Lưu Trữ (Archive)';
      case 'trash':
        return '🗑 Thùng Rác (Trash)';
      default:
        return '📂 Tất Cả Dự Án Workspace';
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      {/* Top Row: Title + Search + Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Title & Count */}
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
            {getViewTitle()}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold font-mono">
            {filteredProjects.length}
          </span>
        </div>

        {/* Search Bar & New Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <ProjectSearchBar />

          {onOpenNewDialog && (
            <button
              onClick={onOpenNewDialog}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <FolderPlus size={16} />
              <span className="hidden sm:inline">+ Tạo mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Sort & Filter controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <span className="font-semibold text-slate-700">Sắp xếp:</span>
          
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
          >
            <option value="date">Sửa đổi gần nhất</option>
            <option value="recent">Mới tạo gần nhất</option>
            <option value="name">Tên A - Z</option>
            <option value="category">Theo danh mục</option>
          </select>

          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1"
            title="Đảo chiều sắp xếp"
          >
            <ArrowUpDown size={14} />
            <span className="text-[10px] uppercase font-mono">{sortDirection}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
          Auto-saved local workspace
        </div>
      </div>
    </div>
  );
};
