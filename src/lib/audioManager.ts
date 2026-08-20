import { audioCacheService } from '../modules/audio/AudioCacheService';

// Global Audio Singleton Manager for NoteMe v2.0
export interface AudioTrack {
  id: string;
  label: string;
  description: string;
  url: string;
}

export const AUDIO_PRESETS: AudioTrack[] = [
  {
    id: 'piano',
    label: '🎹 Piano Nhẹ Nhàng',
    description: 'Bản độc tấu Piano du dương, êm dịu',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3'
  },
  {
    id: 'acoustic',
    label: '🎸 Acoustic Sâu Lắng',
    description: 'Tiếng đàn Guitar mộc mạc, trầm ấm',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_841d1a6170.mp3?filename=gentle-acoustic-guitar-7370.mp3'
  },
  {
    id: 'lofi',
    label: '☕ Giai Điệu Thư Thái',
    description: 'Âm hưởng Chill Lofi ngọt ngào, thư giãn nhẹ nhàng',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-chill-medium-112191.mp3'
  }
];

type AudioStateListener = (isPlaying: boolean, currentUrl: string) => void;

class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentUrl: string = AUDIO_PRESETS[0].url;
  private listeners: Set<AudioStateListener> = new Set();

  private constructor() {
    // Schedule background preload of presets in idle time for instant 0ms playback & offline capability
    if (typeof window !== 'undefined') {
      const startPreload = () => {
        audioCacheService.preloadTracks(AUDIO_PRESETS.map(t => t.url));
      };
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(startPreload, { timeout: 3000 });
      } else {
        setTimeout(startPreload, 1500);
      }
    }
  }

  public static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    // Send initial state immediately
    listener(this.isPlaying, this.currentUrl);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isPlaying, this.currentUrl));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentUrl(): string {
    return this.currentUrl;
  }

  public async playTrack(url?: string): Promise<boolean> {
    const targetUrl = url || this.currentUrl || AUDIO_PRESETS[0].url;

    // If already playing the same URL, do nothing
    if (this.audio && this.currentUrl === targetUrl && this.isPlaying) {
      return true;
    }

    // Stop existing audio if playing
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.currentUrl = targetUrl;

    // Resolve local Object URL from IndexedDB cache if present, or fetch + cache
    let playableUrl = targetUrl;
    try {
      playableUrl = await audioCacheService.getOrFetchAudioUrl(targetUrl);
    } catch (e) {
      playableUrl = targetUrl;
    }

    this.audio = new Audio(playableUrl);
    this.audio.loop = true;
    this.audio.volume = 0.6;

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.notify();
      return true;
    } catch (err) {
      console.warn('Browser blocked autoplay or audio error:', err);
      // Fallback state update
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public toggle(trackUrl?: string) {
    if (trackUrl && trackUrl !== this.currentUrl) {
      // Switching to a different track
      this.playTrack(trackUrl);
    } else if (this.isPlaying) {
      this.pause();
    } else {
      this.playTrack(trackUrl || this.currentUrl);
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.notify();
  }
}

export const globalAudio = GlobalAudioManager.getInstance();
