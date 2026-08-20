import React, { useState, useMemo } from 'react';
import { IPromptTemplate } from './types';
import { Search, Heart, Copy, Edit2, Sparkles, Check, Plus, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromptLibraryPanelProps {
  prompts: IPromptTemplate[];
  onUsePrompt: (prompt: IPromptTemplate) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicatePrompt: (prompt: IPromptTemplate) => void;
  onAddNewPrompt: (newPrompt: IPromptTemplate) => void;
}

const CATEGORIES: Array<IPromptTemplate['category'] | 'All'> = [
  'All',
  'First Date',
  'Wedding',
  'Long Distance',
  'Birthday',
  'Valentine',
  'Apology',
  'Proposal',
  'Missing You'
];

export const PromptLibraryPanel: React.FC<PromptLibraryPanelProps> = ({
  prompts,
  onUsePrompt,
  onToggleFavorite,
  onDuplicatePrompt,
  onAddNewPrompt
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IPromptTemplate['category'] | 'All'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // New Prompt Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<IPromptTemplate['category']>('First Date');
  const [newPromptText, setNewPromptText] = useState('');

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [prompts, selectedCategory, searchQuery]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPromptText.trim()) return;

    const created: IPromptTemplate = {
      id: `custom-p-${Date.now()}`,
      title: newTitle,
      description: 'Mẫu Prompt tùy chỉnh của bạn',
      category: newCategory,
      creativeType: 'love_letter',
      promptText: newPromptText,
      isFavorite: false,
      tags: ['Custom', newCategory]
    };

    onAddNewPrompt(created);
    setNewTitle('');
    setNewPromptText('');
    setIsCreatingCustom(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-rose-500 text-white shadow-xs">
            <Sparkles size={18} className="fill-white" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-800">Thư viện Prompt Mẫu (Prompt Library)</h3>
            <p className="text-[11px] text-slate-500">Các mẫu gợi ý thiết kế riêng cho sáng tạo văn bản & kỷ niệm</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingCustom(prev => !prev)}
          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-rose-200 shrink-0 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Thêm Prompt Mới</span>
        </button>
      </div>

      {/* New Custom Prompt Form Collapsible */}
      <AnimatePresence>
        {isCreatingCustom && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreatePrompt}
            className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 overflow-hidden text-xs"
          >
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              <Plus size={14} /> Tạo mẫu Prompt cá nhân
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Tiêu đề mẫu Prompt..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="p-2 rounded-xl border border-rose-200 bg-white font-medium"
                required
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="p-2 rounded-xl border border-rose-200 bg-white font-medium"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Nội dung chi tiết Prompt..."
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-rose-200 bg-white font-medium h-20"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-bold shadow-xs"
              >
                Lưu Prompt
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search Bar & Category Pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mẫu prompt theo tiêu đề, chủ đề, từ khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? '✨ Tất cả chủ đề' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
        {filteredPrompts.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-rose-50/30 border border-slate-200 hover:border-rose-200 transition-all space-y-2 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800">
                  {p.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleFavorite(p.id)}
                    className={`p-1 rounded-full ${p.isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'}`}
                    title="Yêu thích"
                  >
                    <Heart size={15} className={p.isFavorite ? 'fill-rose-500' : ''} />
                  </button>
                  <button
                    onClick={() => onDuplicatePrompt(p)}
                    className="p-1 rounded-full text-slate-400 hover:text-blue-600"
                    title="Nhân bản"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-black text-slate-800 group-hover:text-rose-600 transition-colors">
                {p.title}
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug">
                {p.promptText}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Tag size={11} />
                <span>{p.tags.join(', ')}</span>
              </div>

              <button
                onClick={() => onUsePrompt(p)}
                className="px-3 py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all"
              >
                <span>Dùng Prompt</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
