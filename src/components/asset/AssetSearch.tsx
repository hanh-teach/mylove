import React from 'react';
import { Search, X } from 'lucide-react';

interface AssetSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AssetSearch: React.FC<AssetSearchProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm tài nguyên theo tên hoặc tag...',
}) => {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 text-xs font-medium bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-xl transition-all outline-none text-slate-800 placeholder:text-slate-400"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          title="Xóa tìm kiếm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
