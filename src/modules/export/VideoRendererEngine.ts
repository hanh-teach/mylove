import { decorRegistry, sceneConfig } from '../../shared/constants';
import { SceneType } from '../../shared/types';
import { getIconSvgMarkup } from './ExportHelper';
import { ParticleShapeType } from '../../components/audio/BeatParticleCanvas';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export type VideoAspectRatio = '16:9' | '9:16' | '1:1' | '4:5';
export type VideoResolution = '1080p' | '720p' | '480p';

export interface VideoRenderConfig {
  title: string;
  message?: string;
  senderName?: string;
  receiverName?: string;
  scene?: string;
  fontStyle?: string;
  placedItems?: any[];
  photoUrl?: string;
  audioUrl?: string;
  audioVolume?: number; // 0 to 1
  audioFadeIn?: boolean;
  aspectRatio?: VideoAspectRatio;
  resolution?: VideoResolution;
  fps?: number; // 15, 30 or 60
  durationSec?: number; // 2.5 to 15
  particleEffect?: ParticleShapeType | 'none';
  particleDensity?: 'low' | 'medium' | 'high';
  quality?: 'draft' | 'standard' | 'high';
  onProgress?: (progress: number, currentFrame: number, totalFrames: number) => void;
}

export interface VideoDimensions {
  width: number;
  height: number;
}

export function getVideoDimensions(aspectRatio: VideoAspectRatio = '16:9', resolution: VideoResolution = '1080p'): VideoDimensions {
  if (resolution === '1080p') {
    switch (aspectRatio) {
      case '9:16':
        return { width: 1080, height: 1920 };
      case '1:1':
        return { width: 1080, height: 1080 };
      case '4:5':
        return { width: 1080, height: 1350 };
      case '16:9':
      default:
        return { width: 1920, height: 1080 };
    }
  } else if (resolution === '720p') {
    switch (aspectRatio) {
      case '9:16':
        return { width: 720, height: 1280 };
      case '1:1':
        return { width: 720, height: 720 };
      case '4:5':
        return { width: 720, height: 900 };
      case '16:9':
      default:
        return { width: 1280, height: 720 };
    }
  } else {
    // 480p
    switch (aspectRatio) {
      case '9:16':
        return { width: 480, height: 854 };
      case '1:1':
        return { width: 480, height: 480 };
      case '4:5':
        return { width: 480, height: 600 };
      case '16:9':
      default:
        return { width: 854, height: 480 };
    }
  }
}

export function getGifDimensions(aspectRatio: VideoAspectRatio = '16:9'): VideoDimensions {
  switch (aspectRatio) {
    case '9:16':
      return { width: 360, height: 640 };
    case '1:1':
      return { width: 440, height: 440 };
    case '4:5':
      return { width: 400, height: 500 };
    case '16:9':
    default:
      return { width: 600, height: 338 };
  }
}

interface ParticleState {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
  swayFreq: number;
  swayAmp: number;
}

export class VideoRendererEngine {
  private static instance: VideoRendererEngine;

  public static getInstance(): VideoRendererEngine {
    if (!this.instance) {
      this.instance = new VideoRendererEngine();
    }
    return this.instance;
  }

  /**
   * Helper to load an image element safely with CORS support
   */
  public async loadImage(src: string): Promise<HTMLImageElement | null> {
    if (!src) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Retry without crossOrigin if local or data url
        if (src.startsWith('data:') || src.startsWith('blob:')) {
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => resolve(null);
          fallbackImg.src = src;
        } else {
          resolve(null);
        }
      };
      img.src = src;
    });
  }

  /**
   * Helper to render a single visual frame onto canvas context
   */
  private renderFrameCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    timeSec: number,
    fps: number,
    c1: string,
    c2: string,
    c3: string,
    photoImg: HTMLImageElement | null,
    aspectRatio: VideoAspectRatio,
    particleEffect: ParticleShapeType | 'none',
    particles: ParticleState[],
    placedItems: any[],
    decorImagesMap: Map<string, HTMLImageElement>,
    cleanTitle: string,
    cleanMessage: string,
    chosenFont: string,
    senderName?: string,
    receiverName?: string
  ) {
    // 1. Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, c1);
    grad.addColorStop(0.5, c2);
    grad.addColorStop(1, c3);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Photo Overlay with Soft Zoom
    if (photoImg && photoImg.width > 0) {
      ctx.save();
      const zoom = 1.0 + Math.sin(timeSec * 0.5) * 0.04;
      const photoW = width * 0.85;
      const photoH = height * 0.55;
      const photoX = (width - photoW) / 2;
      const photoY = (height * 0.25) - (aspectRatio === '9:16' ? (height * 0.05) : 30);

      ctx.translate(photoX + photoW / 2, photoY + photoH / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-(photoX + photoW / 2), -(photoY + photoH / 2));

      // Draw photo rounded frame
      ctx.beginPath();
      const r = Math.min(24, width * 0.04);
      ctx.moveTo(photoX + r, photoY);
      ctx.arcTo(photoX + photoW, photoY, photoX + photoW, photoY + photoH, r);
      ctx.arcTo(photoX + photoW, photoY + photoH, photoX, photoY + photoH, r);
      ctx.arcTo(photoX, photoY + photoH, photoX, photoY, r);
      ctx.arcTo(photoX, photoY, photoX + photoW, photoY, r);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
      ctx.restore();

      // Photo border & glow
      ctx.save();
      ctx.lineWidth = Math.max(2, width * 0.005);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 16;
      ctx.strokeRect(photoX, photoY, photoW, photoH);
      ctx.restore();
    }

    // 3. Render Floating Particles
    if (particleEffect !== 'none') {
      const dt = 1 / fps;
      for (const p of particles) {
        p.y += p.vy * dt;
        p.x += p.vx * dt + Math.sin(timeSec * 2 * p.swayFreq) * p.swayAmp * dt;
        p.rotation += p.vRot * dt;

        // Wrap edges
        if (p.y > height + 20) p.y = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (particleEffect === 'sakura') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
          ctx.closePath();
          ctx.fill();
        } else if (particleEffect === 'heart') {
          ctx.beginPath();
          const topCurve = p.size * 0.3;
          ctx.moveTo(0, topCurve);
          ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, topCurve / 2, 0, p.size);
          ctx.bezierCurveTo(p.size, topCurve / 2, p.size / 2, -p.size / 2, 0, topCurve);
          ctx.closePath();
          ctx.fill();
        } else {
          // Stardust / Snow
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 4. Placed Decor Items
    for (const item of placedItems) {
      const decor = decorRegistry[item.type];
      if (!decor) continue;

      let animOffsetY = 0, animOffsetX = 0, animScale = item.scale || 1, animRotate = item.rotation || 0;
      if (item.animation === 'float') {
        animOffsetY = Math.sin(timeSec * 3 + item.x) * 10;
        animOffsetX = Math.cos(timeSec * 2 + item.y) * 5;
      } else if (item.animation === 'pulse') {
        animScale *= (1 + Math.sin(timeSec * 5) * 0.15);
      } else if (item.animation === 'spin') {
        animRotate += (timeSec * 120) % 360;
      }

      ctx.save();
      const cx = (width / 2) + (item.x * (width / 800)) + animOffsetX;
      const cy = (height / 2) + (item.y * (height / 600)) + animOffsetY;
      ctx.translate(cx, cy);
      ctx.rotate((animRotate * Math.PI) / 180);
      ctx.scale(animScale, animScale);

      if (decor.type === 'image' || decor.type === 'icon') {
        const preloadedImg = decorImagesMap.get(item.type);
        if (preloadedImg && preloadedImg.complete && preloadedImg.width > 0) {
          const decorSize = Math.round(width * 0.08);
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 8;
          ctx.drawImage(preloadedImg, -decorSize / 2, -decorSize / 2, decorSize, decorSize);
        }
      }
      ctx.restore();
    }

    // 5. Title & Message Typography with Floating Sine Waves
    const textFloatY = Math.sin(timeSec * 2.5) * (height * 0.015);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const titleY = photoImg ? height * 0.65 : height * 0.42;
    const messageY = titleY + (aspectRatio === '9:16' ? (height * 0.1) : (height * 0.14));

    // Title Shadow & Text
    const titleFontSize = Math.round(width * (aspectRatio === '9:16' ? 0.055 : 0.042));
    ctx.font = `bold ${titleFontSize}px ${chosenFont}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    if (cleanTitle) {
      const words = cleanTitle.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      const maxTextWidth = width * 0.9;
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      const lineHeight = titleFontSize * 1.3;
      const startY = titleY - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + (index * lineHeight) + textFloatY);
      });
    }

    // Message Text
    if (cleanMessage) {
      const msgFontSize = Math.round(width * (aspectRatio === '9:16' ? 0.035 : 0.026));
      ctx.font = `${msgFontSize}px ${chosenFont}`;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      
      const words = cleanMessage.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      const maxTextWidth = width * 0.9;
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      const lineHeight = msgFontSize * 1.3;
      const startY = messageY - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + (index * lineHeight) + textFloatY);
      });
    }

    // Sender & Receiver Subtext
    if (senderName || receiverName) {
      const subFontSize = Math.round(width * 0.022);
      ctx.font = `italic ${subFontSize}px ${chosenFont}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const footerText = receiverName && senderName
        ? `Gửi ${receiverName} • Từ ${senderName}`
        : receiverName ? `Thân gửi ${receiverName}` : `Từ ${senderName}`;
      ctx.fillText(footerText, width / 2, height - (height * 0.08));
    }

    ctx.restore();
  }

  /**
   * Main render method: records an animated canvas stream with optional audio track mixing
   */
  public async renderVideo(config: VideoRenderConfig): Promise<Blob> {
    const {
      title = 'LoveNote Card',
      message = '',
      senderName = '',
      receiverName = '',
      scene = 'rose',
      fontStyle = 'playfair',
      placedItems = [],
      photoUrl,
      audioUrl,
      audioVolume = 0.8,
      audioFadeIn = true,
      aspectRatio = '16:9',
      resolution = '720p',
      fps = 30,
      durationSec = 4.0,
      particleEffect = 'sakura',
      particleDensity = 'medium',
      onProgress
    } = config;

    const { width, height } = getVideoDimensions(aspectRatio, resolution);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D Context could not be created for video rendering');
    }

    // Preload photo & decor assets
    const photoImg = photoUrl ? await this.loadImage(photoUrl) : null;
    const decorImagesMap = new Map<string, HTMLImageElement>();
    for (const item of placedItems) {
      const decor = decorRegistry[item.type];
      if (!decor || decorImagesMap.has(item.type)) continue;

      if (decor.type === 'image' && typeof decor.content === 'string') {
        const loaded = await this.loadImage((item as any)._prefetchedContent || decor.content);
        if (loaded) decorImagesMap.set(item.type, loaded);
      } else if (decor.type === 'icon') {
        const itemColor = sceneConfig[scene as SceneType]?.accent?.replace('text-', '') || 'rose-500';
        const svgMarkup = getIconSvgMarkup(item.type, itemColor);
        const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const loaded = await this.loadImage(svgUrl);
        if (loaded) decorImagesMap.set(item.type, loaded);
        URL.revokeObjectURL(svgUrl);
      }
    }

    // Set up Web Audio stream mixer if audioUrl is present
    let audioStreamTrack: MediaStreamTrack | null = null;
    let audioCtx: AudioContext | null = null;
    let audioSource: AudioBufferSourceNode | HTMLAudioElement | null = null;

    if (audioUrl && typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtxClass();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        const destination = audioCtx.createMediaStreamDestination();
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(audioVolume, audioCtx.currentTime);
        if (audioFadeIn) {
          gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, audioVolume), audioCtx.currentTime + 1.2);
        }
        gainNode.connect(destination);

        // Fetch and decode audio
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(gainNode);
        source.start(0);
        audioSource = source;

        const tracks = destination.stream.getAudioTracks();
        if (tracks.length > 0) {
          audioStreamTrack = tracks[0];
        }
      } catch (err) {
        console.warn('[VideoRendererEngine] Audio decoding or streaming failed, continuing with silent video:', err);
      }
    }

    // Prepare MediaStream & MediaRecorder
    let combinedStream: MediaStream;
    const canvasStream = canvas.captureStream ? canvas.captureStream(fps) : (canvas as any).mozCaptureStream ? (canvas as any).mozCaptureStream(fps) : null;

    if (!canvasStream) {
      throw new Error('Trình duyệt không hỗ trợ Canvas Stream capture');
    }

    if (audioStreamTrack) {
      combinedStream = new MediaStream([...canvasStream.getVideoTracks(), audioStreamTrack]);
    } else {
      combinedStream = canvasStream;
    }

    let mimeType = 'video/webm;codecs=vp9';
    if (typeof MediaRecorder !== 'undefined') {
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      }
    }

    const recordedChunks: Blob[] = [];
    let recorder: MediaRecorder | null = null;
    let recordingPromise: Promise<Blob>;

    if (typeof MediaRecorder !== 'undefined') {
      recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: resolution === '1080p' ? 8000000 : 4000000
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      recordingPromise = new Promise<Blob>((resolve, reject) => {
        if (!recorder) return;
        recorder.onstop = () => {
          try {
            combinedStream.getTracks().forEach(t => t.stop());
          } catch (e) {}
          resolve(new Blob(recordedChunks, { type: mimeType }));
        };
        recorder.onerror = (e) => {
          try {
            combinedStream.getTracks().forEach(t => t.stop());
          } catch (err) {}
          reject(e);
        };
      });

      recorder.start();
    } else {
      recordingPromise = Promise.resolve(new Blob([], { type: 'video/mp4' }));
    }

    // Color theme gradients
    const sceneGradients: Record<string, [string, string, string]> = {
      rose: ['#ffe4e6', '#fecdd3', '#fda4af'],
      garden: ['#d1fae5', '#a7f3d0', '#6ee7b7'],
      forest: ['#064e3b', '#065f46', '#047857'],
      sunset: ['#fed7aa', '#fdba74', '#fb923c'],
      ocean: ['#bfdbfe', '#93c5fd', '#60a5fa'],
      sakura: ['#fbcfe8', '#f9a8d4', '#f472b6'],
      sky: ['#bae6fd', '#7dd3fc', '#38bdf8'],
      plain: ['#ffffff', '#f8fafc', '#f1f5f9']
    };
    const [c1, c2, c3] = sceneGradients[scene] || sceneGradients.rose;

    // Font styles
    const fontFamilies: Record<string, string> = {
      playfair: '"Playfair Display", serif',
      dancing: '"Dancing Script", cursive',
      pacifico: '"Pacifico", cursive',
      caveat: '"Caveat", cursive',
      lora: '"Lora", serif',
      nunito: '"Nunito", sans-serif',
      lobster: '"Lobster", cursive',
      merriweather: '"Merriweather", serif'
    };
    const chosenFont = fontFamilies[fontStyle] || fontFamilies.playfair;

    // Initialize particles
    const particles: ParticleState[] = [];
    const particleCount = particleDensity === 'high' ? 45 : particleDensity === 'medium' ? 25 : 12;
    const particleColors = scene === 'forest' ? ['#a7f3d0', '#6ee7b7', '#34d399'] : scene === 'sunset' ? ['#fde047', '#f59e0b', '#fb923c'] : ['#f472b6', '#fb7185', '#fda4af', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 6,
        vx: (Math.random() - 0.5) * 30,
        vy: particleEffect === 'sakura' || particleEffect === 'snow' ? Math.random() * 40 + 20 : -(Math.random() * 40 + 20),
        alpha: Math.random() * 0.7 + 0.3,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        rotation: (Math.random() - 0.5) * Math.PI,
        vRot: (Math.random() - 0.5) * 2,
        swayFreq: Math.random() * 2 + 1,
        swayAmp: Math.random() * 15 + 5
      });
    }

    const totalFrames = Math.floor(fps * durationSec);
    const frameDelay = 1000 / fps;

    // Clean text strings
    const cleanTitle = (title || '').replace(/<\/?[^>]+(>|$)/g, '').trim();
    const cleanMessage = (message || '').replace(/<\/?[^>]+(>|$)/g, '').trim();

    // RENDER LOOP
    for (let frame = 0; frame < totalFrames; frame++) {
      const timeSec = frame / fps;
      const progressRatio = frame / totalFrames;

      if (onProgress) {
        onProgress(Math.round(progressRatio * 100), frame + 1, totalFrames);
      }

      this.renderFrameCanvas(
        ctx,
        width,
        height,
        timeSec,
        fps,
        c1,
        c2,
        c3,
        photoImg,
        aspectRatio,
        particleEffect,
        particles,
        placedItems,
        decorImagesMap,
        cleanTitle,
        cleanMessage,
        chosenFont,
        senderName,
        receiverName
      );

      // Small tick delay to yield frame
      await new Promise((r) => setTimeout(r, frameDelay));
    }

    // Stop recording and cleanup
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }

    if (audioSource && typeof (audioSource as any).stop === 'function') {
      try {
        (audioSource as any).stop();
      } catch (e) {}
    }
    if (audioCtx && typeof audioCtx.close === 'function') {
      try {
        await audioCtx.close();
      } catch (e) {}
    }

    if (onProgress) {
      onProgress(100, totalFrames, totalFrames);
    }

    return await recordingPromise;
  }

  /**
   * Render animated GIF from canvas frames with high performance palette quantization
   */
  public async renderGif(config: VideoRenderConfig): Promise<Blob> {
    const {
      title = 'LoveNote Card',
      message = '',
      senderName = '',
      receiverName = '',
      scene = 'rose',
      fontStyle = 'playfair',
      placedItems = [],
      photoUrl,
      aspectRatio = '16:9',
      fps = 15,
      durationSec = 3.0,
      particleEffect = 'sakura',
      particleDensity = 'medium',
      onProgress
    } = config;

    const { width, height } = getGifDimensions(aspectRatio);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Canvas 2D Context could not be created for GIF rendering');
    }

    // Preload photo & decor assets
    const photoImg = photoUrl ? await this.loadImage(photoUrl) : null;
    const decorImagesMap = new Map<string, HTMLImageElement>();
    for (const item of placedItems) {
      const decor = decorRegistry[item.type];
      if (!decor || decorImagesMap.has(item.type)) continue;

      if (decor.type === 'image' && typeof decor.content === 'string') {
        const loaded = await this.loadImage((item as any)._prefetchedContent || decor.content);
        if (loaded) decorImagesMap.set(item.type, loaded);
      } else if (decor.type === 'icon') {
        const itemColor = sceneConfig[scene as SceneType]?.accent?.replace('text-', '') || 'rose-500';
        const svgMarkup = getIconSvgMarkup(item.type, itemColor);
        const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const loaded = await this.loadImage(svgUrl);
        if (loaded) decorImagesMap.set(item.type, loaded);
        URL.revokeObjectURL(svgUrl);
      }
    }

    const sceneGradients: Record<string, [string, string, string]> = {
      rose: ['#ffe4e6', '#fecdd3', '#fda4af'],
      garden: ['#d1fae5', '#a7f3d0', '#6ee7b7'],
      forest: ['#064e3b', '#065f46', '#047857'],
      sunset: ['#fed7aa', '#fdba74', '#fb923c'],
      ocean: ['#bfdbfe', '#93c5fd', '#60a5fa'],
      sakura: ['#fbcfe8', '#f9a8d4', '#f472b6'],
      sky: ['#bae6fd', '#7dd3fc', '#38bdf8'],
      plain: ['#ffffff', '#f8fafc', '#f1f5f9']
    };
    const [c1, c2, c3] = sceneGradients[scene] || sceneGradients.rose;

    const fontFamilies: Record<string, string> = {
      playfair: '"Playfair Display", serif',
      dancing: '"Dancing Script", cursive',
      pacifico: '"Pacifico", cursive',
      caveat: '"Caveat", cursive',
      lora: '"Lora", serif',
      nunito: '"Nunito", sans-serif',
      lobster: '"Lobster", cursive',
      merriweather: '"Merriweather", serif'
    };
    const chosenFont = fontFamilies[fontStyle] || fontFamilies.playfair;

    const particles: ParticleState[] = [];
    const particleCount = particleDensity === 'high' ? 30 : particleDensity === 'medium' ? 18 : 10;
    const particleColors = scene === 'forest' ? ['#a7f3d0', '#6ee7b7', '#34d399'] : scene === 'sunset' ? ['#fde047', '#f59e0b', '#fb923c'] : ['#f472b6', '#fb7185', '#fda4af', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 4,
        vx: (Math.random() - 0.5) * 20,
        vy: particleEffect === 'sakura' || particleEffect === 'snow' ? Math.random() * 30 + 15 : -(Math.random() * 30 + 15),
        alpha: Math.random() * 0.7 + 0.3,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        rotation: (Math.random() - 0.5) * Math.PI,
        vRot: (Math.random() - 0.5) * 2,
        swayFreq: Math.random() * 2 + 1,
        swayAmp: Math.random() * 10 + 4
      });
    }

    const totalFrames = Math.max(10, Math.floor(fps * durationSec));
    const gif = GIFEncoder();

    const cleanTitle = (title || '').replace(/<\/?[^>]+(>|$)/g, '').trim();
    const cleanMessage = (message || '').replace(/<\/?[^>]+(>|$)/g, '').trim();

    for (let frame = 0; frame < totalFrames; frame++) {
      const timeSec = frame / fps;
      const progressRatio = frame / totalFrames;

      if (onProgress) {
        onProgress(Math.round(progressRatio * 100), frame + 1, totalFrames);
      }

      this.renderFrameCanvas(
        ctx,
        width,
        height,
        timeSec,
        fps,
        c1,
        c2,
        c3,
        photoImg,
        aspectRatio,
        particleEffect,
        particles,
        placedItems,
        decorImagesMap,
        cleanTitle,
        cleanMessage,
        chosenFont,
        senderName,
        receiverName
      );

      const imageData = ctx.getImageData(0, 0, width, height);
      const palette = quantize(imageData.data, 256);
      const index = applyPalette(imageData.data, palette);
      gif.writeFrame(index, width, height, {
        palette,
        delay: Math.round((1 / fps) * 1000),
        repeat: 0
      });

      if (frame % 4 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    gif.finish();

    if (onProgress) {
      onProgress(100, totalFrames, totalFrames);
    }

    const buffer = gif.bytesView();
    return new Blob([buffer], { type: 'image/gif' });
  }
}

export const videoRendererEngine = VideoRendererEngine.getInstance();
