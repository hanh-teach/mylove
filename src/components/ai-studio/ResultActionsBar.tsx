import React, { useState } from 'react';
import { Save, ExternalLink, Calendar, Download, Share2, RefreshCw, Check, Sparkles } from 'lucide-react';

interface ResultActionsBarProps {
  onSaveToMemories: () => void;
  onOpenInEditor: () => void;
  onAddToTimeline: () => void;
  onExport: () => void;
  onShare: () => void;
  onRegenerate: () => void;
  isGenerating?: boolean;
}

export const ResultActionsBar: React.FC<ResultActionsBarProps> = ({
  onSaveToMemories,
  onOpenInEditor,
  onAddToTimeline,
  onExport,
  onShare,
  onRegenerate,
  isGenerating = false
}) => {
  const [savedStatus, setSavedStatus] = useState<'idle' | 'memories' | 'timeline' | 'share'>('idle');

  const handleMemories = () => {
    onSaveToMemories();
    setSavedStatus('memories');
    setTimeout(() => setSavedStatus('idle'), 2500);
  };

  const handleTimeline = () => {
    onAddToTimeline();
    setSavedStatus('timeline');
    setTimeout(() => setSavedStatus('idle'), 2500);
  };

  const handleShareAction = () => {
    onShare();
    setSavedStatus('share');
    setTimeout(() => setSavedStatus('idle'), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Save to Memories */}
        <button
          onClick={handleMemories}
          className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all flex items-center gap-1.5 shadow-2xs"
        >
          {savedStatus === 'memories' ? <Check size={14} /> : <Save size={14} />}
          <span>{savedStatus === 'memories' ? 'Đã lưu Kỷ niệm!' : 'Lưu vào Kỷ niệm'}</span>
        </button>

        {/* Add to Timeline */}
        <button
          onClick={handleTimeline}
          className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold transition-all flex items-center gap-1.5 shadow-2xs"
        >
          {savedStatus === 'timeline' ? <Check size={14} /> : <Calendar size={14} />}
          <span>{savedStatus === 'timeline' ? 'Đã thêm Timeline!' : 'Thêm vào Timeline'}</span>
        </button>

        {/* Open in Editor */}
        <button
          onClick={onOpenInEditor}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold transition-all flex items-center gap-1.5"
        >
          <ExternalLink size={14} className="text-blue-600" />
          <span>Mở trong Editor</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Export */}
        <button
          onClick={onExport}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all flex items-center gap-1"
          title="Tải về File"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Xuất File</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShareAction}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all flex items-center gap-1"
          title="Chia sẻ"
        >
          {savedStatus === 'share' ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
          <span className="hidden sm:inline">{savedStatus === 'share' ? 'Đã copy' : 'Chia sẻ'}</span>
        </button>

        {/* Regenerate */}
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold transition-all flex items-center gap-1.5"
          title="Tạo lại kết quả mới"
        >
          <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
          <span>Tạo lại</span>
        </button>
      </div>
    </div>
  );
};
