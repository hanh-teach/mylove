import React from 'react';
import { AssetCategory } from '../../modules/asset/AssetModel';
import {
  Layers,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Sparkles,
  Star,
  Trash2,
  Clock,
  LayoutTemplate,
  Mountain,
  Smile
} from 'lucide-react';

export type AssetFilterCategory = AssetCategory | 'all' | 'recent' | 'favorite' | 'trash';

interface AssetFilterProps {
  activeCategory: AssetFilterCategory;
  onSelectCategory: (category: AssetFilterCategory) => void;
  counts?: Record<string, number>;
}

export const AssetFilter: React.FC<AssetFilterProps> = ({
  activeCategory,
  onSelectCategory,
  counts = {},
}) => {
  const filterItems: { id: AssetFilterCategory; label: string; icon: React.ReactNode; badgeColor?: string }[] = [
    { id: 'all', label: 'Tất cả tài nguyên', icon: <Layers size={15} /> },
    { id: 'recent', label: 'Gần đây', icon: <Clock size={15} className="text-cyan-500" /> },
    { id: 'favorite', label: 'Đã đánh dấu', icon: <Star size={15} className="text-amber-500" /> },
    { id: 'image', label: 'Hình ảnh', icon: <ImageIcon size={15} className="text-rose-500" /> },
    { id: 'video', label: 'Video', icon: <Video size={15} className="text-purple-500" /> },
    { id: 'audio', label: 'Âm thanh', icon: <Music size={15} className="text-amber-500" /> },
    { id: 'icon', label: 'Icons & Stickers', icon: <Smile size={15} className="text-fuchsia-500" /> },
    { id: 'background', label: 'Hình nền', icon: <Mountain size={15} className="text-sky-500" /> },
    { id: 'template', label: 'Templates', icon: <LayoutTemplate size={15} className="text-indigo-500" /> },
    { id: 'document', label: 'File đính kèm', icon: <FileText size={15} className="text-blue-500" /> },
    { id: 'ai', label: 'AI Generated', icon: <Sparkles size={15} className="text-emerald-500" />, badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'trash', label: 'Thùng rác', icon: <Trash2 size={15} className="text-slate-400" /> },
  ];

  return (
    <div className="flex flex-col gap-1 w-full">
      {filterItems.map((item) => {
        const isActive = activeCategory === item.id;
        const count = counts[item.id] ?? 0;

        return (
          <button
            key={item.id}
            onClick={() => onSelectCategory(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
              isActive
                ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </div>
            {count > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  isActive
                    ? 'bg-rose-600 text-white'
                    : item.badgeColor || 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
