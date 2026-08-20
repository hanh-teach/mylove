import React, { useEffect, useRef, useState } from 'react';
import { webAudioDsp, AudioEnergyMetrics } from '../../modules/audio/WebAudioDspEngine';
import { Activity, BarChart2, Radio, Sparkles } from 'lucide-react';

export type VisualizerMode = 'frequency-bars' | 'neon-waveform' | 'radial-pulse';

interface AudioVisualizerSpectrumProps {
  isPlaying?: boolean;
  mode?: VisualizerMode;
  colorScheme?: 'pink' | 'amber' | 'purple' | 'cyan' | 'emerald';
  width?: number;
  height?: number;
  className?: string;
  showModeToggle?: boolean;
  onEnergyUpdate?: (energy: AudioEnergyMetrics) => void;
}

export const AudioVisualizerSpectrum: React.FC<AudioVisualizerSpectrumProps> = ({
  isPlaying = true,
  mode: initialMode = 'frequency-bars',
  colorScheme = 'pink',
  width = 360,
  height = 70,
  className = '',
  showModeToggle = false,
  onEnergyUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentMode, setCurrentMode] = useState<VisualizerMode>(initialMode);
  const animFrameRef = useRef<number | null>(null);

  const getColors = () => {
    switch (colorScheme) {
      case 'amber':
        return {
          primary: '#f59e0b',
          secondary: '#fbbf24',
          glow: 'rgba(245, 158, 11, 0.4)',
          gradientStart: '#fbbf24',
          gradientEnd: '#d97706'
        };
      case 'purple':
        return {
          primary: '#a855f7',
          secondary: '#c084fc',
          glow: 'rgba(168, 85, 247, 0.4)',
          gradientStart: '#c084fc',
          gradientEnd: '#7e22ce'
        };
      case 'cyan':
        return {
          primary: '#06b6d4',
          secondary: '#67e8f9',
          glow: 'rgba(6, 182, 212, 0.4)',
          gradientStart: '#22d3ee',
          gradientEnd: '#0891b2'
        };
      case 'emerald':
        return {
          primary: '#10b981',
          secondary: '#6ee7b7',
          glow: 'rgba(16, 185, 129, 0.4)',
          gradientStart: '#34d399',
          gradientEnd: '#059669'
        };
      case 'pink':
      default:
        return {
          primary: '#f43f5e',
          secondary: '#fda4af',
          glow: 'rgba(244, 63, 94, 0.4)',
          gradientStart: '#fb7185',
          gradientEnd: '#e11d48'
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const colors = getColors();

      ctx.clearRect(0, 0, w, h);

      if (!isPlaying) {
        // Subtle resting line
        ctx.beginPath();
        ctx.strokeStyle = colors.glow;
        ctx.lineWidth = 2;
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();

        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const freqData = webAudioDsp.getFrequencyData();
      const timeData = webAudioDsp.getTimeDomainData();
      const energy = webAudioDsp.getAudioEnergy();
      if (onEnergyUpdate) {
        onEnergyUpdate(energy);
      }

      phase += 0.05 + energy.bass * 0.08;

      if (currentMode === 'frequency-bars') {
        const barCount = 28;
        const barSpacing = 4;
        const totalSpacing = (barCount - 1) * barSpacing;
        const barWidth = Math.max(3, (w - totalSpacing) / barCount);

        const gradient = ctx.createLinearGradient(0, h, 0, 0);
        gradient.addColorStop(0, colors.gradientEnd);
        gradient.addColorStop(0.7, colors.gradientStart);
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 8;

        for (let i = 0; i < barCount; i++) {
          // Sample frequencies symmetrically
          const dataIndex = Math.floor((i / barCount) * (freqData.length * 0.7));
          const rawVal = freqData[dataIndex] || 0;
          // Apply minimum height for pleasing visual rhythm
          const normalized = (rawVal / 255);
          const barHeight = Math.max(4, normalized * (h * 0.85) + Math.sin(phase + i * 0.3) * 3);

          const x = i * (barWidth + barSpacing);
          const y = h - barHeight;
          const radius = Math.min(barWidth / 2, 3);

          // Rounded top bar
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + barWidth - radius, y);
          ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
          ctx.lineTo(x + barWidth, h);
          ctx.lineTo(x, h);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      } else if (currentMode === 'neon-waveform') {
        // Multi-layer glowing wave
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;

        for (let layer = 0; layer < 2; layer++) {
          ctx.beginPath();
          ctx.strokeStyle = layer === 0 ? colors.primary : colors.secondary;
          ctx.globalAlpha = layer === 0 ? 0.9 : 0.4;

          const sliceWidth = w / (timeData.length - 1);
          let x = 0;

          for (let i = 0; i < timeData.length; i++) {
            const v = timeData[i] / 128.0;
            const amp = (v - 1) * (h * 0.4) * (1 + layer * 0.3);
            const y = (h / 2) + amp + Math.sin(phase + i * 0.15 + layer) * (3 * energy.mid + 1);

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      } else if (currentMode === 'radial-pulse') {
        // Centered concentric pulsing rings
        const cx = w / 2;
        const cy = h / 2;
        const maxRadius = Math.min(w, h) * 0.42;

        const baseRadius = maxRadius * (0.4 + energy.overall * 0.5);

        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 14;

        // Outer glow circle
        ctx.beginPath();
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 3;
        ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner halo
        ctx.beginPath();
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;
        ctx.arc(cx, cy, baseRadius * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        // Center core
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.9;
        ctx.arc(cx, cy, 3 + energy.bass * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, currentMode, colorScheme]);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl"
        style={{ width: `${width}px`, height: `${height}px` }}
      />

      {showModeToggle && (
        <div className="flex items-center gap-1.5 mt-2 bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-1 rounded-full text-xs">
          <button
            type="button"
            onClick={() => setCurrentMode('frequency-bars')}
            className={`p-1.5 rounded-full transition-colors ${currentMode === 'frequency-bars' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Dải tần phổ Bars"
          >
            <BarChart2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMode('neon-waveform')}
            className={`p-1.5 rounded-full transition-colors ${currentMode === 'neon-waveform' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Sóng âm Neon Wave"
          >
            <Activity size={13} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMode('radial-pulse')}
            className={`p-1.5 rounded-full transition-colors ${currentMode === 'radial-pulse' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Vòng nhịp Halo Pulse"
          >
            <Radio size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
