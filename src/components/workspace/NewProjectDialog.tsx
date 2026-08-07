import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, FolderPlus, Check } from 'lucide-react';
import { ProjectTemplate, PROJECT_TEMPLATES } from '../../modules/workspace/Project';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const THEME_COLORS = [
  '#e11d48', // Rose
  '#d97706', // Amber
  '#059669', // Emerald
  '#2563eb', // Blue
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#1e293b', // Slate
];

const EMOJI_ICONS = ['📁', '🌸', '💖', '🎂', '📖', '🎤', '📚', '📝', '💌', '🎨', '🌟', '🚀', '🎁', '🎓'];

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { createProject, selectProject } = useProjectWorkspace();

  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<ProjectTemplate>('card');
  const [category, setCategory] = useState('Chung');
  const [themeColor, setThemeColor] = useState('#e11d48');
  const [icon, setIcon] = useState('📁');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const created = createProject(
      title,
      template,
      category,
      themeColor,
      icon,
      description
    );

    selectProject(created.id);
    onClose();
    if (onCreated) onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
              <FolderPlus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">Tạo Dự Án Mới</h3>
              <p className="text-[11px] text-rose-100">Khởi tạo tài liệu sáng tạo trong Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Title Input */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">
              Tên dự án <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Graduation Speech, Teacher Card, Daily Journal..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-semibold text-slate-800"
              autoFocus
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">
              Loại mẫu (Template)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
              {Object.values(PROJECT_TEMPLATES).map((tmpl) => {
                const isSelected = template === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setTemplate(tmpl.id);
                      if (tmpl.labelVi) setCategory(tmpl.labelVi);
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all min-h-[64px] ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-2xs font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{tmpl.icon}</span>
                      {isSelected && <Check size={14} className="text-rose-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-xs leading-tight">{tmpl.label}</p>
                      <p className="text-[10px] text-slate-500 font-normal truncate">{tmpl.labelVi}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                Danh mục / Thẻ
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="VD: Tri ân, Kỷ niệm, Sinh nhật..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs font-medium text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                Mô tả vắn tắt
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mục đích hoặc ghi chú thêm..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Color & Icon Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                Màu chủ đạo (Theme)
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {THEME_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setThemeColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                      themeColor === c ? 'scale-110 ring-2 ring-slate-800 ring-offset-1' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {themeColor === c && <Check size={12} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                Biểu tượng
              </label>
              <div className="flex items-center gap-1.5 flex-wrap max-h-16 overflow-y-auto">
                {EMOJI_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`w-7 h-7 rounded-xl text-sm flex items-center justify-center transition-all ${
                      icon === ic ? 'bg-rose-100 border border-rose-300 font-bold scale-110' : 'hover:bg-slate-100'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-colors min-h-[40px]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold transition-all shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center gap-1.5 min-h-[40px]"
            >
              <Sparkles size={15} />
              <span>Tạo Dự Án</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
