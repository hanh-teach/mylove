import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, Music, Sliders, Play, Pause } from 'lucide-react';

export interface ParticleSettings {
  colorPreset: 'pink-rose' | 'red-velvet' | 'gold-sparkle' | 'purple-dream';
  density: 'low' | 'medium' | 'high';
  speed: number;
  beatSensitivity: number; // 0.8 to 2.0
  particleShape: 'heart' | 'sparkle' | 'star';
  isBeatSynced: boolean;
}

interface BeatParticleCanvasProps {
  audioElement?: HTMLAudioElement | null;
  audioUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  interactiveControls?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
  pulseScale: number;
  life: number;
  maxLife: number;
}

export const BeatParticleCanvas: React.FC<BeatParticleCanvasProps> = ({
  audioElement,
  audioUrl,
  width = 800,
  height = 450,
  className = '',
  interactiveControls = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [settings, setSettings] = useState<ParticleSettings>({
    colorPreset: 'pink-rose',
    density: 'medium',
    speed: 1.0,
    beatSensitivity: 1.3,
    particleShape: 'heart',
    isBeatSynced: true
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState<number>(120);
  const [beatPulse, setBeatPulse] = useState(1);

  // Color mappings
  const getColorPalette = (preset: string): string[] => {
    switch (preset) {
      case 'red-velvet':
        return ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5'];
      case 'gold-sparkle':
        return ['#f59e0b', '#d97706', '#fbbf24', '#fef08a', '#ffffff'];
      case 'purple-dream':
        return ['#a855f7', '#9333ea', '#c084fc', '#e9d5ff', '#f472b6'];
      case 'pink-rose':
      default:
        return ['#ec4899', '#f43f5e', '#fb7185', '#f472b6', '#fbcfe8'];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];

    // Helper to draw a heart shape on canvas
    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;

      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(
        -size / 2, -size / 2,
        -size, topCurveHeight / 2,
        0, size
      );
      // top right curve
      ctx.bezierCurveTo(
        size, topCurveHeight / 2,
        size / 2, -size / 2,
        0, topCurveHeight
      );
      ctx.closePath();
      ctx.fill();

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.restore();
    };

    // Helper to draw sparkle
    const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Initialize Web Audio API Analyser if audio element is present
    let internalAudio: HTMLAudioElement | null = audioElement || null;

    if (!internalAudio && audioUrl) {
      internalAudio = new Audio(audioUrl);
      internalAudio.loop = true;
    }

    const setupAudio = () => {
      if (!internalAudio) return;
      try {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 128;
            analyser.smoothingTimeConstant = 0.8;

            const source = ctx.createMediaElementSource(internalAudio);
            source.connect(analyser);
            analyser.connect(ctx.destination);

            audioCtxRef.current = ctx;
            analyserRef.current = analyser;
          }
        }
      } catch (e) {
        // Audio element might already be connected to a node
      }
    };

    if (internalAudio) {
      internalAudio.onplay = () => {
        setIsPlaying(true);
        setupAudio();
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      };
      internalAudio.onpause = () => setIsPlaying(false);
    }

    // Animation Loop
    let lastTime = performance.now();
    const dataArray = new Uint8Array(64);

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let currentBassEnergy = 0;
      let isBeatPeak = false;

      // Analyze Audio if available
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        // Bass range index 0 to 8
        let sumBass = 0;
        for (let i = 0; i < 8; i++) {
          sumBass += dataArray[i];
        }
        currentBassEnergy = sumBass / 8; // 0 to 255

        if (currentBassEnergy > 140 * (2 - settings.beatSensitivity)) {
          isBeatPeak = true;
          setBeatPulse(1.3);
        } else {
          setBeatPulse(prev => Math.max(1.0, prev - dt * 2));
        }
      } else {
        // Simulated heartbeat if no audio stream
        const simulatedPulse = 1 + Math.sin(now * 0.005) * 0.15;
        setBeatPulse(simulatedPulse);
        if (Math.random() < 0.05 * settings.speed) {
          isBeatPeak = true;
        }
      }

      // Max particle target based on density
      const targetCount = settings.density === 'high' ? 80 : settings.density === 'medium' ? 45 : 20;
      const palette = getColorPalette(settings.colorPreset);

      // Spawn beat particles on peak
      if (isBeatPeak && particles.length < targetCount + 20) {
        const spawnCount = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < spawnCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            size: Math.random() * 12 + 8,
            vx: (Math.random() - 0.5) * 60 * settings.speed,
            vy: -(Math.random() * 120 + 80) * settings.speed,
            alpha: 0.9,
            color: palette[Math.floor(Math.random() * palette.length)],
            rotation: (Math.random() - 0.5) * Math.PI,
            vRot: (Math.random() - 0.5) * 2,
            pulseScale: 1,
            life: 0,
            maxLife: Math.random() * 2 + 2
          });
        }
      }

      // Maintain baseline floating particles
      while (particles.length < targetCount) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 10 + 6,
          vx: (Math.random() - 0.5) * 30 * settings.speed,
          vy: -(Math.random() * 40 + 20) * settings.speed,
          alpha: Math.random() * 0.5 + 0.3,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: (Math.random() - 0.5) * Math.PI,
          vRot: (Math.random() - 0.5) * 1.5,
          pulseScale: 1,
          life: 0,
          maxLife: Math.random() * 3 + 2
        });
      }

      // Update & Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;

        // Fade out
        const lifeRatio = p.life / p.maxLife;
        p.alpha = Math.max(0, 1 - lifeRatio);

        // Render particle
        const effectiveSize = p.size * (settings.isBeatSynced ? beatPulse : 1);
        if (settings.particleShape === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, effectiveSize, p.color, p.alpha);
        } else {
          drawHeart(ctx, p.x, p.y, effectiveSize, p.color, p.alpha, p.rotation);
        }

        // Remove dead
        if (p.life >= p.maxLife || p.y < -30 || p.x < -30 || p.x > canvas.width + 30) {
          particles.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [settings, audioElement, audioUrl]);

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl ${className}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto block"
      />

      {/* Overlay Title */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-rose-300">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        <span>Beat-synced Heart Particles</span>
      </div>

      {/* Interactive Control Panel */}
      {interactiveControls && (
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="flex items-center justify-between font-bold text-white mb-1">
            <span className="flex items-center gap-1.5">
              <Sliders size={14} className="text-rose-400" />
              Tùy chỉnh Hiệu ứng Hạt đập theo Nhạc
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">
              Audio Reactive
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Color Preset */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Màu sắc Hạt:</label>
              <select
                value={settings.colorPreset}
                onChange={e => setSettings({ ...settings, colorPreset: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="pink-rose">🌸 Hồng Lãng Mạn</option>
                <option value="red-velvet">❤️ Đỏ Nồng Nàn</option>
                <option value="gold-sparkle">✨ Vàng Kim Lấp Lánh</option>
                <option value="purple-dream">💜 Tím Mộng Mơ</option>
              </select>
            </div>

            {/* Density */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Mật độ Hạt:</label>
              <select
                value={settings.density}
                onChange={e => setSettings({ ...settings, density: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="low">Thưa (Nhẹ nhàng)</option>
                <option value="medium">Vừa phải (Khuyên dùng)</option>
                <option value="high">Dày đặc (Rực rỡ)</option>
              </select>
            </div>

            {/* Sensitivity */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Mức Nhạy Nhịp Beat:</label>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={settings.beatSensitivity}
                onChange={e => setSettings({ ...settings, beatSensitivity: parseFloat(e.target.value) })}
                className="w-full accent-rose-500"
              />
            </div>

            {/* Shape */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Hình dáng Hạt:</label>
              <select
                value={settings.particleShape}
                onChange={e => setSettings({ ...settings, particleShape: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="heart">💖 Trái tim tình yêu</option>
                <option value="sparkle">✨ Bọt khí bùng nổ</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
