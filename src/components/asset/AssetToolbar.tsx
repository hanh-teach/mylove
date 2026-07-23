import React from 'react';
import { AssetSearch } from './AssetSearch';
import { Upload, ArrowUpDown, Trash2, Folder } from 'lucide-react';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';

interface AssetToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'date' | 'name' | 'size';
  onSortByChange: (sortBy: 'date' | 'name' | 'size') => void;
  sortDirection: 'asc' | 'desc';
  onToggleSortDirection: () => void;
  onOpenUpload: () => void;
  isTrashView?: boolean;
  onClearTrash?: () => void;
  totalAssetsCount: number;
}

export const AssetToolbar: React.FC<AssetToolbarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onToggleSortDirection,
  onOpenUpload,
  isTrashView = false,
  onClearTrash,
  totalAssetsCount,
}) => {
  const { activeProject } = useProjectWorkspace();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border-b border-slate-200">
      {/* Left: Project Badge & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {activeProject && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shrink-0">
            <span>{activeProject.icon}</span>
            <span className="truncate max-w-[140px]">{activeProject.title}</span>
          </div>
        )}
        <AssetSearch value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Right: Actions (Sort, Upload / Clear Trash) */}
      <div className="flex items-center gap-2 shrink-0 justify-end">
        {/* Sort Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'date' | 'name' | 'size')}
            className="bg-transparent text-slate-700 font-semibold px-2 py-1 outline-none text-xs cursor-pointer"
          >
            <option value="date">Theo Ngày</option>
            <option value="name">Theo Tên</option>
            <option value="size">Theo Kích thước</option>
          </select>
          <button
            onClick={onToggleSortDirection}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            title={`Sắp xếp: ${sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}`}
          >
            <ArrowUpDown size={14} />
          </button>
        </div>

        {/* Upload Button or Clear Trash */}
        {isTrashView ? (
          onClearTrash && (
            <button
              onClick={onClearTrash}
              disabled={totalAssetsCount === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Trash2 size={14} />
              <span>Dọn sạch thùng rác</span>
            </button>
          )
        ) : (
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs transition-all shadow-sm shadow-rose-500/20 active:scale-95"
          >
            <Upload size={14} />
            <span>+ Upload Asset</span>
          </button>
        )}
      </div>
    </div>
  );
};
