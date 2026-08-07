import React from 'react';
import { Search, X } from 'lucide-react';

interface MemorySearchProps {
  query: string;
  onChange: (q: string) => void;
}

export const MemorySearch: React.FC<MemorySearchProps> = ({ query, onChange }) => {
  return (
    <div className="relative w-full">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search memories, photos, places..."
        className="w-full pl-9 pr-8 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-xs text-rose-950 placeholder:text-rose-300 focus:outline-none focus:border-rose-500 transition-colors"
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};
