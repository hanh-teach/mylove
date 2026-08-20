import React, { useState, useRef, useEffect } from 'react';
import { Scissors, Play, Pause, RotateCcw, Check, Clock, Volume2, Music, Sparkles, X } from 'lucide-react';

interface AudioTrimmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: {
    id: string;
    label: string;
    url: string;
    trimStart?: number;
    trimDuration?: number;
  };
  onSaveTrim: (trimStart: number, trimDuration: number) => void;
}

export const AudioTrimmerModal: React.FC<AudioTrimmerModalProps> = ({
  isOpen,
  onClose,
  track,
  onSaveTrim
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(180); // Default 3 mins if un-loaded
  const [trimStart, setTrimStart] = useState<number>(track.trimStart || 0);
  const [trimDuration, setTrimDuration] = useState<number>(track.trimDuration || 30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(track.trimStart || 0);

  useEffect(() => {
    setTrimStart(track.trimStart || 0);
    setTrimDuration(track.trimDuration || 30);
    setCurrentTime(track.trimStart || 0);
    setIsPlaying(false);
  }, [track, isOpen]);

  // Handle audio metadata load
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = Math.round(audioRef.current.duration) || 180;
      setTotalDuration(dur);
    }
  };

  // Handle play/pause preview
  const togglePlayPreview = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = trimStart;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  // Time update monitoring to loop within the selected range
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    const endTime = trimStart + trimDuration;
    if (cur >= endTime || cur < trimStart) {
      audioRef.current.currentTime = trimStart;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyPreset = (startSec: number, durSec: number) => {
    const validStart = Math.min(startSec, Math.max(0, totalDuration - 10));
    const validDur = Math.min(durSec, totalDuration - validStart);
    setTrimStart(validStart);
    setTrimDuration(validDur);
    setCurrentTime(validStart);

    if (audioRef.current) {
      audioRef.current.currentTime = validStart;
    }
  };

  const handleSave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    onSaveTrim(trimStart, trimDuration);
    onClose();
  };

  if (!isOpen) return null;

  const endTime = Math.min(totalDuration, trimStart + trimDuration);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-rose-500 to-pink-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Cắt & Chọn Đoạn Nhạc Nền
              </h3>
              <p className="text-xs text-white/90">
                Lắng nghe & chọn chính xác điệp khúc cho video thiệp
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Current Track Info */}
          <div className="flex items-center justify-between bg-violet-50/80 p-3.5 rounded-xl border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-xs">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800">{track.label}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Tổng thời lượng: {formatTime(totalDuration)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={togglePlayPreview}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-violet-600 hover:bg-violet-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Tạm dừng' : 'Nghe thử'}</span>
            </button>
          </div>

          <audio 
            ref={audioRef}
            src={track.url}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            preload="metadata"
            className="hidden"
          />

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Gợi ý chọn nhanh đoạn hay nhất:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset(0, 30)}
                className="px-3 py-2 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-all cursor-pointer text-center"
              >
                🎵 Dạo đầu (0s - 30s)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(Math.floor(totalDuration * 0.25), 30)}
                className="px-3 py-2 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-all cursor-pointer text-center"
              >
                🔥 Điệp khúc (30s)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(Math.floor(totalDuration * 0.55), 30)}
                className="px-3 py-2 bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-all cursor-pointer text-center"
              >
                ✨ Cao trào (30s)
              </button>
            </div>
          </div>

          {/* Sliders Controls */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Start Time Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span>Thời điểm bắt đầu:</span>
                <span className="text-violet-600 font-bold bg-violet-100 px-2 py-0.5 rounded-md">
                  {formatTime(trimStart)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, totalDuration - 5)}
                step={1}
                value={trimStart}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTrimStart(val);
                  if (val + trimDuration > totalDuration) {
                    setTrimDuration(totalDuration - val);
                  }
                  if (audioRef.current) {
                    audioRef.current.currentTime = val;
                  }
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span>Độ dài đoạn phát:</span>
                <span className="text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded-md">
                  {trimDuration} giây
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={Math.min(60, totalDuration - trimStart)}
                step={1}
                value={trimDuration}
                onChange={(e) => setTrimDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Visual Time Segment Summary */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Đoạn phát chọn:
              </span>
              <span className="font-bold text-slate-800">
                {formatTime(trimStart)} ➔ {formatTime(endTime)} ({trimDuration}s)
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-rose-500 hover:from-violet-700 hover:to-rose-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Áp dụng đoạn nhạc này</span>
          </button>
        </div>

      </div>
    </div>
  );
};
