import React, { useState } from 'react';
import { ICollection, ITag } from '../../modules/memory/MemoryTypes';
import { CheckSquare, Trash2, Heart, FolderHeart, Tag as TagIcon, Download, X, Check, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BulkActionsBarProps {
  selectedIds: string[];
  totalCount: number;
  collections: ICollection[];
  tags: ITag[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkToggleFavorite: (isFav: boolean) => void;
  onBulkMoveCollection: (collectionId: string) => void;
  onBulkAddTag: (tagName: string) => void;
  onBulkExport: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedIds,
  totalCount,
  collections,
  tags,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkToggleFavorite,
  onBulkMoveCollection,
  onBulkAddTag,
  onBulkExport,
}) => {
  const [showColPicker, setShowColPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);

  if (selectedIds.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3"
      >
        {/* Left Count & Select All */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-extrabold text-xs shadow-xs">
            Đã chọn {selectedIds.length} / {totalCount}
          </span>

          <button
            onClick={selectedIds.length === totalCount ? onDeselectAll : onSelectAll}
            className="text-xs text-slate-300 hover:text-white font-semibold underline flex items-center gap-1"
          >
            <CheckSquare size={14} />
            {selectedIds.length === totalCount ? 'Bỏ chọn' : 'Chọn tất cả'}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Favorite */}
          <button
            onClick={() => onBulkToggleFavorite(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
            title="Thêm yêu thích hàng loạt"
          >
            <Heart size={15} />
            Yêu thích
          </button>

          {/* Move Collection Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowColPicker(!showColPicker);
                setShowTagPicker(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all text-xs font-bold flex items-center gap-1"
            >
              <FolderHeart size={15} className="text-pink-400" />
              Gom Bộ Sưu Tập
            </button>

            {showColPicker && (
              <div className="absolute bottom-12 left-0 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase px-2 py-1">Chuyển sang:</div>
                {collections.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onBulkMoveCollection(c.id);
                      setShowColPicker(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-700 flex items-center gap-2"
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Tag Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTagPicker(!showTagPicker);
                setShowColPicker(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all text-xs font-bold flex items-center gap-1"
            >
              <TagIcon size={15} className="text-emerald-400" />
              Thêm Thẻ
            </button>

            {showTagPicker && (
              <div className="absolute bottom-12 left-0 w-44 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase px-2 py-1">Gắn thẻ:</div>
                {tags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onBulkAddTag(t.name);
                      setShowTagPicker(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-700 flex items-center gap-2"
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="truncate">#{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button
            onClick={onBulkExport}
            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
            title="Xuất các kỷ niệm đã chọn"
          >
            <Download size={15} />
            Xuất file
          </button>

          {/* Delete */}
          <button
            onClick={onBulkDelete}
            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 transition-all text-xs font-bold flex items-center gap-1 ml-1"
            title="Xóa hàng loạt"
          >
            <Trash2 size={15} />
            Xóa ({selectedIds.length})
          </button>

          {/* Close */}
          <button
            onClick={onDeselectAll}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title="Hủy chọn"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
