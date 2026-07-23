import React, { useState } from 'react';
import { ITag, IMemory } from '../../modules/memory/MemoryTypes';
import { X, Plus, Tag as TagIcon, Edit3, Trash2, GitMerge, Check, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: ITag[];
  memories: IMemory[];
  onAddTag: (name: string, color: string) => void;
  onUpdateTag: (id: string, name: string, color: string) => void;
  onDeleteTag: (id: string) => void;
  onMergeTags: (sourceTagId: string, targetTagId: string) => void;
}

const COLOR_PRESETS = [
  '#f43f5e', // Rose
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
];

export const TagManagerModal: React.FC<TagManagerModalProps> = ({
  isOpen,
  onClose,
  tags,
  memories,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
  onMergeTags,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#f43f5e');

  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const [isMerging, setIsMerging] = useState(false);
  const [sourceTagId, setSourceTagId] = useState('');
  const [targetTagId, setTargetTagId] = useState('');

  if (!isOpen) return null;

  // Count usage of each tag
  const getTagUsageCount = (tagName: string) => {
    return memories.filter(m => m.tags.includes(tagName)).length;
  };

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    onAddTag(newTagName, newTagColor);
    setNewTagName('');
  };

  const startEdit = (tag: ITag) => {
    setEditingTagId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    onUpdateTag(id, editName, editColor);
    setEditingTagId(null);
  };

  const handleMerge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTagId || !targetTagId || sourceTagId === targetTagId) return;
    onMergeTags(sourceTagId, targetTagId);
    setIsMerging(false);
    setSourceTagId('');
    setTargetTagId('');
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

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/60">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
                <TagIcon size={20} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-800">Quản lý Thẻ (Tag Manager)</h2>
                <p className="text-xs text-slate-500">Tạo, sửa, đổi màu và gộp các thẻ kỷ niệm</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Create Tag Form */}
            <form onSubmit={handleCreateTag} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tạo thẻ mới
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nhập tên thẻ (VD: SinhNhật, DuLịch)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {COLOR_PRESETS.slice(0, 4).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewTagColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          newTagColor === c ? 'scale-125 ring-2 ring-offset-1 ring-slate-800' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-600 transition-colors shrink-0"
                  >
                    <Plus size={16} />
                    Tạo thẻ
                  </button>
                </div>
              </div>
            </form>

            {/* Merge Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Danh sách thẻ ({tags.length})
              </span>
              <button
                type="button"
                onClick={() => setIsMerging(!isMerging)}
                className={`text-xs font-medium px-3 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isMerging
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <GitMerge size={14} />
                {isMerging ? 'Tắt chế độ gộp thẻ' : 'Gộp 2 thẻ'}
              </button>
            </div>

            {/* Merge Tag Form */}
            {isMerging && (
              <form onSubmit={handleMerge} className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-3">
                <div className="font-bold text-purple-900 flex items-center gap-2">
                  <GitMerge size={16} />
                  Gộp 2 thẻ thành một
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Thẻ nguồn (Sẽ xóa sau gộp)
                    </label>
                    <select
                      value={sourceTagId}
                      onChange={(e) => setSourceTagId(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                    >
                      <option value="">-- Chọn thẻ nguồn --</option>
                      {tags.map(t => (
                        <option key={t.id} value={t.id}>#{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Thẻ đích (Giữ lại)
                    </label>
                    <select
                      value={targetTagId}
                      onChange={(e) => setTargetTagId(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                    >
                      <option value="">-- Chọn thẻ đích --</option>
                      {tags.map(t => (
                        <option key={t.id} value={t.id}>#{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!sourceTagId || !targetTagId || sourceTagId === targetTagId}
                  className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold text-xs disabled:opacity-50 hover:bg-purple-700 transition-colors"
                >
                  Xác nhận gộp thẻ
                </button>
              </form>
            )}

            {/* Tags List */}
            <div className="space-y-2">
              {tags.map((tag) => {
                const isEditingThis = editingTagId === tag.id;
                const count = getTagUsageCount(tag.name);

                return (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-rose-200 transition-colors"
                  >
                    {isEditingThis ? (
                      <div className="flex-1 flex items-center gap-2 mr-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2 py-1 rounded-lg border border-slate-300 text-xs"
                        />
                        <div className="flex gap-1">
                          {COLOR_PRESETS.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setEditColor(c)}
                              className={`w-5 h-5 rounded-full ${editColor === c ? 'ring-2 ring-slate-800' : ''}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => saveEdit(tag.id)}
                          className="p-1.5 rounded-lg bg-emerald-500 text-white"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-semibold text-slate-800 text-xs">#{tag.name}</span>
                        <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {count} kỷ niệm
                        </span>
                      </div>
                    )}

                    {!isEditingThis && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(tag)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Sửa tên/màu"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Xóa thẻ #${tag.name}? Các kỷ niệm sẽ không còn thẻ này.`)) {
                              onDeleteTag(tag.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa thẻ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
            >
              Hoàn tất
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
