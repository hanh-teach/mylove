import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Video, Download, Share2, Sparkles, Music, Play, Pause,
  Volume2, VolumeX, Sliders, Check, Smartphone, Monitor, Instagram,
  Square, Film, Loader2, Flower2, Heart, Star, Snowflake, Zap, Copy, Image as ImageIcon
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { AUDIO_PRESETS, globalAudio } from '../../../lib/audioManager';
import { videoRendererEngine, VideoAspectRatio, VideoResolution } from '../../../modules/export/VideoRendererEngine';
import { ParticleShapeType } from '../../audio/BeatParticleCanvas';
import { triggerFileDownload } from '../../../modules/export/downloadUtils';

interface VideoPublishingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: {
    title: string;
    message?: string;
    senderName?: string;
    receiverName?: string;
    scene?: string;
    fontStyle?: string;
    photoUrl?: string;
    audioUrl?: string;
    placedItems?: any[];
  };
}

export const VideoPublishingStudioModal: React.FC<VideoPublishingStudioModalProps> = ({
  isOpen,
  onClose,
  cardData
}) => {
  // Video & Animation Configuration
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
  const [resolution, setResolution] = useState<VideoResolution>('720p');
  const [fps, setFps] = useState<number>(30);
  const [durationSec, setDurationSec] = useState<number>(3.5);
  const [particleEffect, setParticleEffect] = useState<ParticleShapeType | 'none'>('sakura');
  const [particleDensity, setParticleDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedFormat, setSelectedFormat] = useState<'mp4' | 'webm' | 'gif'>('mp4');

  // Audio Configuration
  const [selectedAudioUrl, setSelectedAudioUrl] = useState<string>(cardData.audioUrl || AUDIO_PRESETS[0].url);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const [audioFadeIn, setAudioFadeIn] = useState<boolean>(true);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);

  // Rendering State
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [currentFrameInfo, setCurrentFrameInfo] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Sync initial audio
  useEffect(() => {
    if (cardData.audioUrl) {
      setSelectedAudioUrl(cardData.audioUrl);
    }
  }, [cardData.audioUrl]);

  // Audio Preview toggle
  const togglePreviewAudio = () => {
    if (isPreviewPlaying) {
      globalAudio.stop();
      setIsPreviewPlaying(false);
    } else {
      globalAudio.playTrack(selectedAudioUrl);
      setIsPreviewPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      globalAudio.stop();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [generatedUrl]);

  // Real-time Canvas Preview Animation Loop
  useEffect(() => {
    if (!isOpen) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const renderPreviewFrame = (now: number) => {
      const timeSec = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#fff1f2');
      grad.addColorStop(0.5, '#fecdd3');
      grad.addColorStop(1, '#fda4af');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Floating text effect
      const textFloatY = Math.sin(timeSec * 2.5) * 4;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Title
      ctx.font = `bold ${Math.round(w * 0.055)}px "Playfair Display", serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      ctx.fillText(cardData.title || 'LoveNote Card', w / 2, h * 0.45 + textFloatY);

      // Message
      if (cardData.message) {
        ctx.font = `${Math.round(w * 0.035)}px "Lora", serif`;
        ctx.fillText(cardData.message.slice(0, 50) + (cardData.message.length > 50 ? '...' : ''), w / 2, h * 0.58 + textFloatY);
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(renderPreviewFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(renderPreviewFrame);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, aspectRatio, cardData]);

  // Start Video / GIF Export
  const handleStartRender = async () => {
    setIsRendering(true);
    setRenderProgress(0);
    setGeneratedBlob(null);
    setGeneratedUrl(null);

    try {
      let blob: Blob;

      if (selectedFormat === 'gif') {
        blob = await videoRendererEngine.renderGif({
          title: cardData.title,
          message: cardData.message,
          senderName: cardData.senderName,
          receiverName: cardData.receiverName,
          scene: cardData.scene || 'rose',
          fontStyle: cardData.fontStyle || 'playfair',
          photoUrl: cardData.photoUrl,
          aspectRatio,
          fps: 15,
          durationSec: Math.min(durationSec, 4.0),
          particleEffect,
          particleDensity,
          onProgress: (progress, current, total) => {
            setRenderProgress(progress);
            setCurrentFrameInfo({ current, total });
          }
        });
      } else {
        blob = await videoRendererEngine.renderVideo({
          title: cardData.title,
          message: cardData.message,
          senderName: cardData.senderName,
          receiverName: cardData.receiverName,
          scene: cardData.scene || 'rose',
          fontStyle: cardData.fontStyle || 'playfair',
          photoUrl: cardData.photoUrl,
          audioUrl: selectedAudioUrl,
          audioVolume,
          audioFadeIn,
          aspectRatio,
          resolution,
          fps,
          durationSec,
          particleEffect,
          particleDensity,
          onProgress: (progress, current, total) => {
            setRenderProgress(progress);
            setCurrentFrameInfo({ current, total });
          }
        });
      }

      setGeneratedBlob(blob);
      const url = URL.createObjectURL(blob);
      setGeneratedUrl(url);
    } catch (err: any) {
      console.error('[VideoPublishingStudio] Lỗi khi kết xuất:', err);
      alert('Có lỗi xảy ra khi tạo animation: ' + (err?.message || 'Vui lòng thử lại'));
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedBlob) return;
    const filename = `lovenote-card-${selectedFormat === 'gif' ? 'animation' : 'video'}-${Date.now()}.${selectedFormat}`;
    await triggerFileDownload(generatedBlob, filename);
  };

  const handleShare = async () => {
    if (!generatedBlob) return;
    const filename = `lovenote-card-${selectedFormat === 'gif' ? 'animation' : 'video'}-${Date.now()}.${selectedFormat}`;
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([generatedBlob], filename, { type: generatedBlob.type })] })) {
      try {
        await navigator.share({
          title: cardData.title,
          text: selectedFormat === 'gif' ? 'Xem thiệp ảnh động GIF của mình nhé!' : 'Xem video thiệp động của mình nhé!',
          files: [new File([generatedBlob], filename, { type: generatedBlob.type })]
        });
      } catch (e) {
        handleDownload();
      }
    } else {
      handleDownload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 text-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <Film size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Xưởng Xuất Bản Video & GIF Động
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
                  {selectedFormat === 'gif' ? 'Animated GIF Engine' : '60 FPS HD Engine'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Xuất video động kèm hòa âm Web Audio hoặc ảnh động GIF tương thích Zalo, Messenger, WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 overflow-y-auto flex-1">
          {/* Left Column: Live Preview & Rendering Monitor */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Monitor size={14} className="text-pink-400" />
                  Khung Hình Xem Trước (Aspect: {aspectRatio})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedFormat === 'gif' ? `GIF • ${durationSec}s • 15 FPS` : `${resolution} • ${fps} FPS • ${durationSec}s`}
                </span>
              </div>

              {/* Video / GIF Preview Container */}
              <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner group">
                {generatedUrl ? (
                  selectedFormat === 'gif' ? (
                    <img
                      src={generatedUrl}
                      alt="Animated GIF Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video
                      src={generatedUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <canvas
                    ref={previewCanvasRef}
                    width={640}
                    height={360}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                )}

                {/* Live Rendering Overlay Progress */}
                <AnimatePresence>
                  {isRendering && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30"
                    >
                      <Loader2 size={36} className="text-pink-500 animate-spin mb-3" />
                      <h4 className="text-sm font-bold text-white mb-1">
                        {selectedFormat === 'gif' ? 'Đang tạo ảnh GIF động tối ưu...' : 'Đang kết xuất video thiệp...'}
                      </h4>
                      <p className="text-xs text-slate-400 mb-4 font-mono">
                        Khung hình: {currentFrameInfo.current} / {currentFrameInfo.total} ({renderProgress}%)
                      </p>

                      {/* Progress Bar */}
                      <div className="w-64 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-150"
                          style={{ width: `${renderProgress}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Audio Track & Visualizer Preview Strip (Only relevant for video) */}
            {selectedFormat !== 'gif' ? (
              <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePreviewAudio}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isPreviewPlaying
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                    title="Nghe thử nhạc nền"
                  >
                    {isPreviewPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Music size={13} className="text-pink-400" />
                      <span>Nhạc nền video</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {AUDIO_PRESETS.find((p) => p.url === selectedAudioUrl)?.label || 'Bản nhạc tùy chọn'}
                    </div>
                  </div>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <Volume2 size={14} className="text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioVolume}
                    onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                  <ImageIcon size={16} />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white block">Định dạng GIF động (Không tiếng)</span>
                  Tối ưu dung lượng nhẹ 1-2MB, lặp lại mượt mà, dễ gửi qua tin nhắn chat Zalo / Messenger.
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Settings & Export Triggers */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Format Selection Buttons */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">
                  Định dạng xuất (Export Format)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mp4', label: 'MP4 Video', desc: 'Có nhạc HD', icon: Film },
                    { id: 'gif', label: 'GIF Động', desc: 'Gửi tin nhắn', icon: ImageIcon },
                    { id: 'webm', label: 'WebM Video', desc: 'Web mượt', icon: Video }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        setSelectedFormat(fmt.id as any);
                        setGeneratedUrl(null);
                        setGeneratedBlob(null);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        selectedFormat === fmt.id
                          ? 'bg-gradient-to-br from-pink-600/30 to-rose-600/30 border-pink-500 text-pink-300 font-bold shadow-md shadow-pink-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <fmt.icon size={16} className={selectedFormat === fmt.id ? 'text-pink-400' : ''} />
                      <span className="text-xs">{fmt.label}</span>
                      <span className="text-[9px] text-slate-400">{fmt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">
                  Tỉ lệ khung hình (Aspect Ratio)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '16:9', label: '16:9', desc: 'Ngang TV/YT', icon: Monitor },
                    { id: '9:16', label: '9:16', desc: 'Story/TikTok', icon: Smartphone },
                    { id: '1:1', label: '1:1', desc: 'Vuông Feed', icon: Square },
                    { id: '4:5', label: '4:5', desc: 'Chân dung', icon: Instagram }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAspectRatio(item.id as VideoAspectRatio)}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        aspectRatio === item.id
                          ? 'bg-pink-600/20 border-pink-500 text-pink-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <item.icon size={15} />
                      <span className="text-xs">{item.label}</span>
                      <span className="text-[9px] text-slate-400">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Resolution Selector (Video only) */}
              {selectedFormat !== 'gif' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Độ phân giải</label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value as VideoResolution)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-bold text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="1080p">1080p Full HD (Sắc nét)</option>
                      <option value="720p">720p HD (Tối ưu nhẹ)</option>
                      <option value="480p">480p SD (Xuất cực nhanh)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Tốc độ khung hình (FPS)</label>
                    <select
                      value={fps}
                      onChange={(e) => setFps(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-bold text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="60">60 FPS (Siêu mượt)</option>
                      <option value="30">30 FPS (Tiêu chuẩn)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Duration & Particle Effect Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Thời lượng vòng lặp</label>
                  <select
                    value={durationSec}
                    onChange={(e) => setDurationSec(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-bold text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="3.0">3.0 Giây (Chuẩn GIF)</option>
                    <option value="4.0">4.0 Giây (Vừa vặn)</option>
                    <option value="6.0">6.0 Giây (Trọn vẹn)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Hiệu ứng hạt rơi</label>
                  <select
                    value={particleEffect}
                    onChange={(e) => setParticleEffect(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-bold text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="sakura">🌸 Hoa Sakura</option>
                    <option value="heart">💖 Trái tim yêu thương</option>
                    <option value="stardust">✨ Bụi sao lấp lánh</option>
                    <option value="snow">❄️ Tuyết mùa đông</option>
                    <option value="none">Không dùng hiệu ứng</option>
                  </select>
                </div>
              </div>

              {/* Audio Library Picker (Video only) */}
              {selectedFormat !== 'gif' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Chọn bản nhạc nền</label>
                  <select
                    value={selectedAudioUrl}
                    onChange={(e) => setSelectedAudioUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-bold text-white focus:outline-none focus:border-pink-500"
                  >
                    {AUDIO_PRESETS.map((t) => (
                      <option key={t.id} value={t.url}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {!generatedUrl ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleStartRender}
                  disabled={isRendering}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2"
                >
                  {isRendering ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang tạo {selectedFormat === 'gif' ? 'ảnh GIF' : 'video'} ({renderProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>
                        {selectedFormat === 'gif' ? 'Bắt Đầu Tạo Ảnh GIF Động' : 'Bắt Đầu Kết Xuất Video'}
                      </span>
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleDownload}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      <span>{selectedFormat === 'gif' ? 'Tải GIF Về' : 'Tải Video Về'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleShare}
                      className="w-full py-2.5 border-slate-700 text-white hover:bg-slate-800 font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Share2 size={16} />
                      <span>Chia Sẻ</span>
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedUrl(null);
                      setGeneratedBlob(null);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-200 py-1"
                  >
                    ← Thiết lập lại thông số khác
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
