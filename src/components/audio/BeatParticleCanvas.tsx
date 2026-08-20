import React, { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, Music, Sliders, Play, Pause, Flower2, Snowflake, Star } from 'lucide-react';
import { webAudioDsp } from '../../modules/audio/WebAudioDspEngine';

export type ParticleShapeType = 'heart' | 'sakura' | 'stardust' | 'snow';

export interface ParticleSettings {
  colorPreset: 'pink-rose' | 'red-velvet' | 'gold-sparkle' | 'purple-dream' | 'winter-cyan';
  density: 'low' | 'medium' | 'high';
  speed: number;
  beatSensitivity: number; // 0.8 to 2.0
  particleShape: ParticleShapeType;
  isBeatSynced: boolean;
}

interface BeatParticleCanvasProps {
  audioElement?: HTMLAudioElement | null;
  audioUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  interactiveControls?: boolean;
  shape?: ParticleShapeType;
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
  swayFreq: number;
  swayAmp: number;
}

export const BeatParticleCanvas: React.FC<BeatParticleCanvasProps> = ({
  audioElement,
  audioUrl,
  width = 800,
  height = 450,
  className = '',
  interactiveControls = false,
  shape = 'heart'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const [settings, setSettings] = useState<ParticleSettings>({
    colorPreset: shape === 'sakura' ? 'pink-rose' : shape === 'stardust' ? 'gold-sparkle' : shape === 'snow' ? 'winter-cyan' : 'pink-rose',
    density: 'medium',
    speed: 1.0,
    beatSensitivity: 1.3,
    particleShape: shape,
    isBeatSynced: true
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [beatPulse, setBeatPulse] = useState(1);

  // Sync external shape prop if changed
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      particleShape: shape,
      colorPreset: shape === 'sakura' ? 'pink-rose' : shape === 'stardust' ? 'gold-sparkle' : shape === 'snow' ? 'winter-cyan' : prev.colorPreset
    }));
  }, [shape]);

  // Color mappings
  const getColorPalette = (preset: string): string[] => {
    switch (preset) {
      case 'red-velvet':
        return ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fca5a5'];
      case 'gold-sparkle':
        return ['#f59e0b', '#d97706', '#fbbf24', '#fef08a', '#ffffff'];
      case 'purple-dream':
        return ['#a855f7', '#9333ea', '#c084fc', '#e9d5ff', '#f472b6'];
      case 'winter-cyan':
        return ['#38bdf8', '#0ea5e9', '#7dd3fc', '#e0f2fe', '#ffffff'];
      case 'pink-rose':
      default:
        return ['#ec4899', '#f43f5e', '#fb7185', '#f472b6', '#fbcfe8', '#ffe4e6'];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];

    // Helper: Draw Heart
    const drawHeart = (ctx: CanvasRenderingContext2D, size: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, topCurveHeight / 2, 0, size);
      ctx.bezierCurveTo(size, topCurveHeight / 2, size / 2, -size / 2, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
    };

    // Helper: Draw Sakura Petal
    const drawSakura = (ctx: CanvasRenderingContext2D, size: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.9, size * 0.2, 0, size);
      ctx.bezierCurveTo(-size * 0.9, size * 0.2, -size * 0.7, -size * 0.6, 0, -size);
      ctx.closePath();
      ctx.fill();

      // Notch detail at top of petal
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = alpha * 0.5;
      ctx.arc(0, -size * 0.3, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    };

    // Helper: Draw Stardust Star
    const drawStardust = (ctx: CanvasRenderingContext2D, size: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.35;
      let rot = (Math.PI / 2) * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    // Helper: Draw Snow Flake
    const drawSnow = (ctx: CanvasRenderingContext2D, size: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Attach audio element to DSP engine if available
    if (audioElement) {
      try {
        webAudioDsp.attachMediaElement(audioElement);
      } catch (e) {}
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get energy from WebAudio DSP engine
      const energy = webAudioDsp.getAudioEnergy();
      const isBeatPeak = energy.isBeat;

      if (isBeatPeak) {
        setBeatPulse(1.35);
      } else {
        setBeatPulse((prev) => Math.max(1.0, prev - dt * 2.5));
      }

      const targetCount = settings.density === 'high' ? 70 : settings.density === 'medium' ? 40 : 18;
      const palette = getColorPalette(settings.colorPreset);
      const shapeType = settings.particleShape;

      // Spawn on beat burst
      if (isBeatPeak && settings.isBeatSynced && particles.length < targetCount + 15) {
        const spawnCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < spawnCount; i++) {
          const isFalling = shapeType === 'sakura' || shapeType === 'snow';
          particles.push({
            x: Math.random() * canvas.width,
            y: isFalling ? -10 : canvas.height + 15,
            size: Math.random() * 10 + 6,
            vx: (Math.random() - 0.5) * 50 * settings.speed,
            vy: (isFalling ? 1 : -1) * (Math.random() * 80 + 40) * settings.speed,
            alpha: 0.95,
            color: palette[Math.floor(Math.random() * palette.length)],
            rotation: (Math.random() - 0.5) * Math.PI,
            vRot: (Math.random() - 0.5) * 2.5,
            pulseScale: 1.2,
            life: 0,
            maxLife: Math.random() * 2.5 + 2,
            swayFreq: Math.random() * 3 + 1,
            swayAmp: Math.random() * 25 + 10
          });
        }
      }

      // Maintain background particles
      while (particles.length < targetCount) {
        const isFalling = shapeType === 'sakura' || shapeType === 'snow';
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 8 + 5,
          vx: (Math.random() - 0.5) * 30 * settings.speed,
          vy: (isFalling ? 1 : -1) * (Math.random() * 45 + 15) * settings.speed,
          alpha: Math.random() * 0.6 + 0.3,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: (Math.random() - 0.5) * Math.PI,
          vRot: (Math.random() - 0.5) * 1.5,
          pulseScale: 1,
          life: Math.random() * 2,
          maxLife: Math.random() * 3 + 3,
          swayFreq: Math.random() * 2 + 1,
          swayAmp: Math.random() * 20 + 8
        });
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Sway motion
        const sway = Math.sin(now * 0.002 * p.swayFreq) * p.swayAmp * dt;
        p.x += p.vx * dt + sway;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;

        // Interactive mouse wind repulsion
        if (mousePosRef.current.active) {
          const dx = p.x - mousePosRef.current.x;
          const dy = p.y - mousePosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            const force = (1 - dist / 120) * 150 * dt;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Fade in and out
        const lifeRatio = p.life / p.maxLife;
        let currentAlpha = p.alpha;
        if (lifeRatio < 0.2) {
          currentAlpha = (lifeRatio / 0.2) * p.alpha;
        } else if (lifeRatio > 0.7) {
          currentAlpha = ((1 - lifeRatio) / 0.3) * p.alpha;
        }

        // Audio reactivity scale
        const renderScale = p.size * (1 + (energy.bass * 0.35));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (shapeType === 'sakura') {
          drawSakura(ctx, renderScale, p.color, currentAlpha);
        } else if (shapeType === 'stardust') {
          drawStardust(ctx, renderScale, p.color, currentAlpha);
        } else if (shapeType === 'snow') {
          drawSnow(ctx, renderScale, p.color, currentAlpha);
        } else {
          drawHeart(ctx, renderScale, p.color, currentAlpha);
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render(performance.now());

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [settings, audioElement]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full pointer-events-auto cursor-crosshair block"
      />

      {interactiveControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-xs text-white z-20">
          <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, particleShape: 'heart' }))}
              className={`p-1.5 rounded-lg transition ${settings.particleShape === 'heart' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Trái tim tình yêu"
            >
              <Heart size={14} />
            </button>
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, particleShape: 'sakura' }))}
              className={`p-1.5 rounded-lg transition ${settings.particleShape === 'sakura' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Cánh hoa Sakura"
            >
              <Flower2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, particleShape: 'stardust' }))}
              className={`p-1.5 rounded-lg transition ${settings.particleShape === 'stardust' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Bụi sao Stardust"
            >
              <Star size={14} />
            </button>
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, particleShape: 'snow' }))}
              className={`p-1.5 rounded-lg transition ${settings.particleShape === 'snow' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tuyết rơi mùa đông"
            >
              <Snowflake size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-medium">Tốc độ:</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={settings.speed}
              onChange={(e) => setSettings((s) => ({ ...s, speed: parseFloat(e.target.value) }))}
              className="w-16 h-1 accent-pink-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
