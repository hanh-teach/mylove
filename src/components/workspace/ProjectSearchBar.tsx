import React from 'react';
import { Search, X } from 'lucide-react';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';

export const ProjectSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useProjectWorkspace();

  return (
    <div className="relative w-full max-w-md">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm dự án, thiệp, bài viết, từ khóa..."
        className="w-full pl-10 pr-9 py-2 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all shadow-2xs"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          title="Xóa tìm kiếm"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
