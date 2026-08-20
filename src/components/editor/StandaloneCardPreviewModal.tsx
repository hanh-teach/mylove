import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, X, Heart, Share2, Globe, ShieldCheck, CornerDownLeft } from 'lucide-react';
import { Card3DViewer } from './Card3DViewer';
import { globalAudio, AUDIO_PRESETS } from '../../lib/audioManager';

interface StandaloneCardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    title: string;
    message: string;
    senderName?: string;
    receiverName?: string;
    categoryLabel?: string;
    photoUrl?: string;
  };
}

export const StandaloneCardPreviewModal: React.FC<StandaloneCardPreviewModalProps> = ({
  isOpen,
  onClose,
  cardData
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(globalAudio.getIsPlaying());

  if (!isOpen) return null;

  const handleToggleAudio = () => {
    globalAudio.toggle();
    setIsPlayingAudio(globalAudio.getIsPlaying());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Standalone Header */}
      <div className="h-14 px-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center">
            <Globe size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">
                {cardData.title || 'Trang Kỷ Niệm Độc Lập'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Live Custom Domain
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Giao diện công khai tối ưu di động & máy tính
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle in standalone header */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isPlayingAudio
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Volume2 size={14} className={isPlayingAudio ? 'animate-bounce' : ''} />
            <span>{isPlayingAudio ? 'Tắt Nhạc' : 'Bật Nhạc Nền'}</span>
          </button>

          {/* Close button returning to editor */}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CornerDownLeft size={14} />
            <span>Quay Lại Soạn Thảo</span>
          </button>
        </div>
      </div>

      {/* Main 3D Experience Viewer Stage */}
      <div className="flex-1 w-full h-full p-2 sm:p-6 bg-slate-950 flex items-center justify-center overflow-auto">
        <div className="w-full max-w-5xl h-full max-h-[800px]">
          <Card3DViewer
            title={cardData.title}
            message={cardData.message}
            senderName={cardData.senderName}
            receiverName={cardData.receiverName}
            categoryLabel={cardData.categoryLabel}
            photoUrl={cardData.photoUrl}
            onClose3DView={onClose}
          />
        </div>
      </div>

      {/* Discrete Footer Note */}
      <div className="h-10 px-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>NoteMe v2.0 — Chế độ hiển thị riêng tư bảo mật</span>
        </div>
        <span>Lật mở thiệp để đọc thông điệp gửi trao</span>
      </div>
    </div>
  );
};
