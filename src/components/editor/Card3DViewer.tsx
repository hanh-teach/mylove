import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Play, Pause, Volume2, Edit3, Heart, Image as ImageIcon, BookOpen, Music, Check, Share2, Layers, Award, ShieldCheck, Tag, Globe, Sliders, Flower2, Star, Snowflake, Activity, Film } from 'lucide-react';
import { Button } from '../ui/Button';
import { BeatParticleCanvas, ParticleShapeType } from '../audio/BeatParticleCanvas';
import { AudioVisualizerSpectrum } from '../audio/AudioVisualizerSpectrum';
import { WebCardShareModal } from './WebCardShareModal';
import { StandaloneCardPreviewModal } from './StandaloneCardPreviewModal';
import { VideoPublishingStudioModal } from './export/VideoPublishingStudioModal';
import { globalAudio, AUDIO_PRESETS } from '../../lib/audioManager';
import { webAudioDsp, EqPresetType } from '../../modules/audio/WebAudioDspEngine';

export interface Card3DViewerProps {
  title: string;
  message: string;
  senderName?: string;
  receiverName?: string;
  categoryLabel?: string;
  poemText?: string;
  photoUrl?: string;
  placedItems?: any[];
  bgStyle?: string;
  textColor?: string;
  fontStyle?: string;
  audioUrl?: string;
  onOpenCustomCategory?: () => void;
  onClose3DView?: () => void;
}

export const Card3DViewer: React.FC<Card3DViewerProps> = ({
  title = 'Kỷ Niệm Yêu Thương',
  message = 'Gửi trọn niềm tin và sự trân quý chân thành nhất.',
  senderName = 'Người Gửi',
  receiverName = 'Thân Gửi',
  categoryLabel = 'Thiệp Kỷ Niệm',
  poemText,
  photoUrl = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
  placedItems = [],
  bgStyle = 'rose',
  audioUrl,
  onOpenCustomCategory,
  onClose3DView
}) => {
  // Flip State: 0 = Closed (Front Cover), 1 = Opened (Inside Pages), 2 = Closed (Back Cover)
  const [pageState, setPageState] = useState<0 | 1 | 2>(0);
  
  // 3D Rotation angles for drag inspection
  const [rotX, setRotX] = useState(12);
  const [rotY, setRotY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);

  // Audio Playback & DSP
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showParticleOverlay, setShowParticleOverlay] = useState(true);
  const [particleShape, setParticleShape] = useState<ParticleShapeType>('sakura');
  const [eqPreset, setEqPreset] = useState<EqPresetType>('acoustic-warmth');
  const [showEqMenu, setShowEqMenu] = useState(false);

  // Theme Colors
  const [cardTheme, setCardTheme] = useState<'rose' | 'gold' | 'purple' | 'classic' | 'emerald'>('rose');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStandalonePreviewOpen, setIsStandalonePreviewOpen] = useState(false);
  const [isPublishingStudioOpen, setIsPublishingStudioOpen] = useState(false);

  const getThemeStyles = () => {
    switch (cardTheme) {
      case 'gold':
        return {
          coverBg: 'bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700',
          coverBorder: 'border-amber-300',
          insideBg: 'bg-amber-50/95 dark:bg-slate-900',
          accentText: 'text-amber-800 dark:text-amber-300',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          ribbon: 'from-yellow-400 to-amber-600',
          visColor: 'amber' as const
        };
      case 'purple':
        return {
          coverBg: 'bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950',
          coverBorder: 'border-purple-400',
          insideBg: 'bg-purple-50/95 dark:bg-slate-900',
          accentText: 'text-purple-900 dark:text-purple-300',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
          ribbon: 'from-purple-400 to-indigo-600',
          visColor: 'purple' as const
        };
      case 'emerald':
        return {
          coverBg: 'bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950',
          coverBorder: 'border-emerald-400',
          insideBg: 'bg-emerald-50/95 dark:bg-slate-900',
          accentText: 'text-emerald-900 dark:text-emerald-300',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          ribbon: 'from-teal-400 to-emerald-600',
          visColor: 'emerald' as const
        };
      case 'classic':
        return {
          coverBg: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black',
          coverBorder: 'border-slate-600',
          insideBg: 'bg-slate-50 dark:bg-slate-950',
          accentText: 'text-slate-900 dark:text-slate-100',
          badgeBg: 'bg-slate-200 text-slate-800 border-slate-400',
          ribbon: 'from-slate-400 to-slate-700',
          visColor: 'cyan' as const
        };
      case 'rose':
      default:
        return {
          coverBg: 'bg-gradient-to-br from-rose-600 via-pink-600 to-rose-800',
          coverBorder: 'border-pink-300',
          insideBg: 'bg-rose-50/95 dark:bg-slate-900',
          accentText: 'text-rose-900 dark:text-pink-300',
          badgeBg: 'bg-pink-100 text-rose-800 border-pink-300',
          ribbon: 'from-rose-400 to-pink-600',
          visColor: 'pink' as const
        };
    }
  };

  const theme = getThemeStyles();

  // Mouse / Touch Drag to Orbit 3D Card
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, rx: rotX, ry: rotY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setRotY(dragStartRef.current.ry + dx * 0.4);
    setRotX(Math.max(-40, Math.min(40, dragStartRef.current.rx - dy * 0.4)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const reset3DAngle = () => {
    setRotX(12);
    setRotY(0);
  };

  // Subscribe to Global Audio Singleton
  const [selectedTrackUrl, setSelectedTrackUrl] = useState(globalAudio.getCurrentUrl());

  useEffect(() => {
    const unsubscribe = globalAudio.subscribe((playing, currentUrl) => {
      setIsPlayingAudio(playing);
      setSelectedTrackUrl(currentUrl);
    });
    return unsubscribe;
  }, []);

  // Web Audio DSP Auto Crossfade on Card Flip
  const handlePageFlip = (newPage: 0 | 1 | 2) => {
    setPageState(newPage);

    if (newPage === 1) {
      // Opening inside pages -> Fade-in background music smoothly
      if (!isPlayingAudio) {
        globalAudio.playTrack(selectedTrackUrl || audioUrl || AUDIO_PRESETS[0].url);
      }
      webAudioDsp.fadeIn(1.2, 0.7);
    } else {
      // Closing or flipping to back cover -> subtle soft volume reduction
      webAudioDsp.setVolume(0.4, true);
    }
  };

  const toggleAudio = (trackUrl?: string) => {
    globalAudio.toggle(trackUrl || selectedTrackUrl || audioUrl);
  };

  const handleTrackChange = (newUrl: string) => {
    setSelectedTrackUrl(newUrl);
    globalAudio.playTrack(newUrl);
    webAudioDsp.fadeIn(0.8, 0.7);
  };

  const handleEqChange = (preset: EqPresetType) => {
    setEqPreset(preset);
    webAudioDsp.setEqPreset(preset);
  };

  return (
    <div className="w-full h-full min-h-[680px] bg-slate-950 text-white rounded-3xl p-4 md:p-8 flex flex-col justify-between relative overflow-hidden select-none border border-slate-800 shadow-2xl">
      {/* Background Particle Visualizer Overlay */}
      {showParticleOverlay && (
        <div className="absolute inset-0 z-0 opacity-45 pointer-events-none">
          <BeatParticleCanvas
            width={1200}
            height={700}
            interactiveControls={false}
            shape={particleShape}
          />
        </div>
      )}

      {/* Top Controls Toolbar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">Chế Độ Trải Nghiệm Thiệp 3D</h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                Web Audio DSP v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Lật mở thiệp chân thực, hiệu ứng hạt tương tác & Bộ xử lý âm thanh DSP mượt mà
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Particle Shape Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setParticleShape('sakura')}
              className={`p-1.5 rounded-lg text-xs transition ${particleShape === 'sakura' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Hoa Sakura rơi"
            >
              <Flower2 size={13} />
            </button>
            <button
              type="button"
              onClick={() => setParticleShape('stardust')}
              className={`p-1.5 rounded-lg text-xs transition ${particleShape === 'stardust' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Bụi sao Stardust"
            >
              <Star size={13} />
            </button>
            <button
              type="button"
              onClick={() => setParticleShape('heart')}
              className={`p-1.5 rounded-lg text-xs transition ${particleShape === 'heart' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Trái tim tình yêu"
            >
              <Heart size={13} />
            </button>
            <button
              type="button"
              onClick={() => setParticleShape('snow')}
              className={`p-1.5 rounded-lg text-xs transition ${particleShape === 'snow' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tuyết rơi mùa đông"
            >
              <Snowflake size={13} />
            </button>
          </div>

          {/* Equalizer DSP Preset Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEqMenu(!showEqMenu)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${showEqMenu ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}`}
              title="Bộ lọc âm thanh DSP Equalizer"
            >
              <Sliders size={13} />
              <span className="hidden md:inline">EQ: {eqPreset === 'acoustic-warmth' ? 'Mộc Mạc' : eqPreset === 'lofi-dream' ? 'Lofi' : eqPreset === 'vocal-clarity' ? 'Trong Trẻo' : eqPreset === 'spatial-hall' ? 'Vòm 3D' : 'Phẳng'}</span>
            </button>

            {showEqMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-40 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Bộ Lọc EQ DSP
                </div>
                {[
                  { id: 'acoustic-warmth', label: 'Acoustic Ấm Áp' },
                  { id: 'lofi-dream', label: 'Lofi Dreamy' },
                  { id: 'vocal-clarity', label: 'Trong Trẻo Lead' },
                  { id: 'spatial-hall', label: 'Không Gian Vòm 3D' },
                  { id: 'bass-boost', label: 'Trầm Sâu Bass' },
                  { id: 'flat', label: 'Nguyên Bản Flat' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleEqChange(item.id as EqPresetType);
                      setShowEqMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition ${eqPreset === item.id ? 'bg-pink-500/20 text-pink-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span>{item.label}</span>
                    {eqPreset === item.id && <Check size={12} className="text-pink-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Web Share Button */}
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsShareModalOpen(true)}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs py-1.5 px-3 rounded-xl shadow-md flex items-center gap-1.5 font-bold"
          >
            <Globe size={14} />
            <span>Xuất Bản Web 3D</span>
          </Button>

          {/* Video Studio Button */}
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsPublishingStudioOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs py-1.5 px-3 rounded-xl shadow-md flex items-center gap-1.5 font-bold"
          >
            <Film size={14} />
            <span>Xuất Video 60FPS</span>
          </Button>

          {/* Custom Category Button */}
          {onOpenCustomCategory && (
            <Button
              type="button"
              variant="outlined"
              onClick={onOpenCustomCategory}
              className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs py-1.5 px-3 flex items-center gap-1.5 rounded-xl"
            >
              <Tag size={14} className="text-pink-400" />
              <span>Đổi Chủ Đề</span>
            </Button>
          )}

          {/* Audio Track Selector & Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <select
              value={selectedTrackUrl}
              onChange={(e) => handleTrackChange(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-slate-200 focus:outline-none px-2 py-0.5 cursor-pointer"
            >
              {AUDIO_PRESETS.map((track) => (
                <option key={track.id} value={track.url} className="bg-slate-900 text-white">
                  {track.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => toggleAudio()}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Volume2 size={13} className={isPlayingAudio ? 'animate-bounce' : ''} />
              <span>{isPlayingAudio ? 'Tắt' : 'Bật nhạc'}</span>
            </button>
          </div>

          {/* Reset Angle */}
          <button
            type="button"
            onClick={reset3DAngle}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
            title="Đặt lại góc nhìn 3D"
          >
            <RotateCcw size={15} />
          </button>

          {/* Close / Return */}
          {onClose3DView && (
            <Button
              type="button"
              variant="primary"
              onClick={onClose3DView}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs py-1.5 px-3 rounded-xl border border-slate-700"
            >
              Về Canvas 2D
            </Button>
          )}
        </div>
      </div>

      {/* 3D Canvas Stage Area */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center my-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ perspective: '1400px' }}
      >
        {/* 3D Card Container */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY + (pageState === 1 ? -15 : 0)}deg)`,
            width: 'min(90vw, 760px)',
            height: 'min(55vw, 440px)',
          }}
        >
          {/* ==================== CLOSED FRONT COVER ==================== */}
          {pageState === 0 && (
            <motion.div
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              onClick={() => handlePageFlip(1)}
              className={`w-full h-full rounded-3xl ${theme.coverBg} border-2 ${theme.coverBorder} p-6 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden cursor-pointer group`}
            >
              {/* Foil Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Decorative Frame */}
              <div className="border border-white/30 rounded-2xl p-6 h-full flex flex-col justify-between items-center text-center relative z-10">
                <div className="flex items-center gap-2 text-white/80 text-xs font-mono tracking-widest uppercase">
                  <Sparkles size={14} className="text-yellow-300" />
                  <span>{categoryLabel}</span>
                  <Sparkles size={14} className="text-yellow-300" />
                </div>

                <div className="space-y-3 my-auto max-w-md">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-rose-200 shadow-inner group-hover:scale-110 transition-transform">
                    <Heart size={32} className="fill-white/80 text-white" />
                  </div>
                  <h1 className="text-2xl md:text-4xl font-serif font-black text-white drop-shadow-md tracking-tight leading-tight">
                    {title}
                  </h1>
                  <p className="text-xs md:text-sm text-pink-100/90 italic font-serif">
                    Thân gửi: <span className="font-bold underline">{receiverName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white/90 text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/20 group-hover:bg-white/20 transition-all">
                  <span>Nhấn để mở thiệp 3D</span>
                  <BookOpen size={14} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== OPENED INSIDE PAGES (LEFT & RIGHT) ==================== */}
          {pageState === 1 && (
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full grid grid-cols-1 md:grid-cols-2 rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Spine shadow divide line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 -ml-1 bg-gradient-to-r from-black/40 via-black/80 to-black/40 z-20 pointer-events-none hidden md:block" />

              {/* INSIDE LEFT PAGE - PHOTO & MILESTONE */}
              <div className={`p-6 ${theme.insideBg} text-slate-900 dark:text-slate-100 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${theme.badgeBg}`}>
                      {categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Trang 1 / 2</span>
                  </div>

                  {/* Photo Frame */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md aspect-video group">
                    <img
                      src={photoUrl}
                      alt="Card Photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-pink-300 font-bold flex items-center gap-1">
                      <Award size={12} />
                      <span>Kỷ niệm đáng nhớ</span>
                    </div>
                  </div>
                </div>

                {/* Poem / Highlight Text */}
                <div className="my-2 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                  <p className="text-xs italic font-serif text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {poemText || 'Nắm tay qua vạn nẻo đường,\nTình trao trọn vẹn yêu thương đong đầy.'}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Dành tặng: <strong>{receiverName}</strong></span>
                  <span>Tạo bởi LoveNote Studio</span>
                </div>
              </div>

              {/* INSIDE RIGHT PAGE - WISH & SIGNATURE */}
              <div className={`p-6 ${theme.insideBg} text-slate-900 dark:text-slate-100 flex flex-col justify-between relative`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-base font-black font-serif ${theme.accentText}`}>
                      {title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">Trang 2 / 2</span>
                  </div>

                  {/* Wish Message */}
                  <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[140px] flex items-center justify-center text-center">
                    <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-serif leading-relaxed italic">
                      "{message}"
                    </p>
                  </div>
                </div>

                {/* Signature Block */}
                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Trân trọng & Thân thương,</span>
                    <span className="font-bold font-serif text-rose-600 dark:text-rose-400 text-sm">
                      {senderName}
                    </span>
                  </div>

                  {/* Page Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => handlePageFlip(0)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                    >
                      ← Đóng bìa thiệp
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePageFlip(2)}
                      className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      Xem mặt sau →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== CLOSED BACK COVER ==================== */}
          {pageState === 2 && (
            <motion.div
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              onClick={() => handlePageFlip(1)}
              className={`w-full h-full rounded-3xl ${theme.coverBg} border-2 ${theme.coverBorder} p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden cursor-pointer text-center text-white`}
            >
              <div className="border border-white/20 rounded-2xl p-6 h-full flex flex-col justify-between items-center">
                <div className="text-xs font-mono text-white/70"> LoveNote 3D Memory Card</div>

                <div className="space-y-3">
                  <ShieldCheck size={36} className="mx-auto text-yellow-300" />
                  <h3 className="text-lg font-serif font-bold">Lưu Giữ Khoảnh Khắc Đẹp</h3>
                  <p className="text-xs text-pink-100/80 max-w-xs mx-auto">
                    Mối duyên lành được gói trọn trong từng lời chúc và nụ cười.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePageFlip(1);
                  }}
                  className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold transition-all cursor-pointer"
                >
                  Lật về trang trong
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Theme Color Selector, Real-time Visualizer & Interaction Tips */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-xl p-3 px-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Tông màu:</span>
          {[
            { id: 'rose', name: 'Hồng Lãng Mạn', color: 'bg-rose-500' },
            { id: 'gold', name: 'Vàng Hoàng Gia', color: 'bg-amber-500' },
            { id: 'purple', name: 'Tím Mộng Mơ', color: 'bg-purple-600' },
            { id: 'emerald', name: 'Xanh Ngọc Phích', color: 'bg-emerald-600' },
            { id: 'classic', name: 'Đen Sang Trọng', color: 'bg-slate-800' },
          ].map(t => (
            <button
              type="button"
              key={t.id}
              onClick={() => setCardTheme(t.id as any)}
              className={`w-6 h-6 rounded-full ${t.color} border-2 transition-all cursor-pointer ${
                cardTheme === t.id ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              title={t.name}
            />
          ))}
        </div>

        {/* Embedded Live FFT Visualizer */}
        <div className="flex items-center gap-3">
          <AudioVisualizerSpectrum
            isPlaying={isPlayingAudio}
            colorScheme={theme.visColor}
            width={220}
            height={36}
            showModeToggle={true}
          />
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>💡 Kéo chuột để xoay 3D • Chạm để lật thiệp</span>
        </div>
      </div>

      {/* Web Share Modal */}
      <WebCardShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenStandalonePreview={() => {
          setIsShareModalOpen(false);
          setIsStandalonePreviewOpen(true);
        }}
        cardData={{
          title,
          message,
          senderName,
          receiverName,
          categoryLabel,
          photoUrl
        }}
      />

      {/* Standalone Live Card Preview Modal */}
      <StandaloneCardPreviewModal
        isOpen={isStandalonePreviewOpen}
        onClose={() => setIsStandalonePreviewOpen(false)}
        cardData={{
          title,
          message,
          senderName,
          receiverName,
          categoryLabel,
          photoUrl
        }}
      />

      {/* Advanced Video Publishing Studio Modal */}
      <VideoPublishingStudioModal
        isOpen={isPublishingStudioOpen}
        onClose={() => setIsPublishingStudioOpen(false)}
        cardData={{
          title,
          message,
          senderName,
          receiverName,
          photoUrl,
          audioUrl: selectedTrackUrl || audioUrl,
          scene: cardTheme,
          placedItems
        }}
      />
    </div>
  );
};
