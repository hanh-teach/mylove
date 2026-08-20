import React, { useState } from 'react';
import { ICollection } from '../../modules/memory/MemoryTypes';
import { X, Plus, FolderHeart, Edit2, Trash2, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CollectionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: ICollection[];
  onAddCollection: (data: Omit<ICollection, 'id' | 'createdAt' | 'updatedAt' | 'memoryIds'>) => void;
  onUpdateCollection: (id: string, updates: Partial<ICollection>) => void;
  onDeleteCollection: (id: string) => void;
}

const PRESET_ICONS = ['❤️', '🌸', '✈️', '🎂', '💌', '💍', '🌟', '☕', '🎵', '🎬', '🏞️', '🏠'];
const PRESET_COLORS = ['#ec4899', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#6366f1', '#14b8a6'];

export const CollectionManagerModal: React.FC<CollectionManagerModalProps> = ({
  isOpen,
  onClose,
  collections,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('❤️');
  const [color, setColor] = useState('#ec4899');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingId('NEW');
    setName('');
    setIcon('❤️');
    setColor('#ec4899');
    setDescription('');
  };

  const handleStartEdit = (col: ICollection) => {
    setEditingId(col.id);
    setName(col.name);
    setIcon(col.icon);
    setColor(col.color);
    setDescription(col.description || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId === 'NEW') {
      onAddCollection({
        name: name.trim(),
        icon,
        color,
        description: description.trim(),
      });
    } else if (editingId) {
      onUpdateCollection(editingId, {
        name: name.trim(),
        icon,
        color,
        description: description.trim(),
      });
    }

    setEditingId(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
                <FolderHeart size={18} />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Quản lý Bộ sưu tập (Collections)</h3>
                <p className="text-xs text-slate-500 font-medium">Gom nhóm và phân loại kỷ niệm theo chủ đề</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Create/Edit Form when active */}
            {editingId !== null ? (
              <form onSubmit={handleSave} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} />
                    {editingId === 'NEW' ? 'Tạo Bộ Sưu Tập Mới' : 'Chỉnh sửa Bộ Sưu Tập'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                  >
                    Hủy
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên bộ sưu tập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: ❤️ First Year, ✈️ Chuyến đi xa..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Biểu tượng (Icon)</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_ICONS.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setIcon(ic)}
                        className={`w-8 h-8 rounded-xl text-sm flex items-center justify-center transition-all ${
                          icon === ic
                            ? 'bg-rose-500 text-white shadow-xs scale-110'
                            : 'bg-white border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Màu sắc đại diện</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border-2 ${
                          color === c ? 'border-slate-800 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      >
                        {color === c && <Check size={12} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ý nghĩa của bộ sưu tập này..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {editingId === 'NEW' ? 'Tạo ngay' : 'Cập nhật'}
                </button>
              </form>
            ) : (
              <button
                onClick={handleStartCreate}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-all"
              >
                <Plus size={16} />
                + Tạo bộ sưu tập mới
              </button>
            )}

            {/* List of Collections */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Danh sách Bộ Sưu Tập hiện có ({collections.length})
              </h4>

              {collections.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  Chưa có bộ sưu tập nào. Nhấn "+ Tạo bộ sưu tập mới" để bắt đầu!
                </div>
              ) : (
                collections.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-xl text-lg flex items-center justify-center text-white shadow-xs shrink-0"
                        style={{ backgroundColor: col.color }}
                      >
                        {col.icon}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          {col.name}
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-slate-600 border border-slate-200 font-extrabold">
                            {col.memoryIds ? col.memoryIds.length : 0} kỷ niệm
                          </span>
                        </div>
                        {col.description && (
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{col.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(col)}
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Đổi tên / Sửa"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Xóa bộ sưu tập "${col.name}"? Các kỷ niệm bên trong vẫn giữ nguyên.`)) {
                            onDeleteCollection(col.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa bộ sưu tập"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
