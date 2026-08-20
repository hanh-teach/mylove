// Web Audio DSP Engine with Crossfade, EQ, and Real-time FFT Frequency Analysis
// For NoteMe v2.0 3D Cards & Studio Audio Experience

export type EqPresetType = 'flat' | 'acoustic-warmth' | 'lofi-dream' | 'vocal-clarity' | 'bass-boost' | 'spatial-hall';

export interface AudioEnergyMetrics {
  bass: number;       // 0 to 1
  mid: number;        // 0 to 1
  treble: number;     // 0 to 1
  overall: number;    // 0 to 1
  isBeat: boolean;
}

export class WebAudioDspEngine {
  private static instance: WebAudioDspEngine | null = null;

  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private currentElement: HTMLAudioElement | null = null;

  // Nodes
  private gainNode: GainNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  private warmthFilter: BiquadFilterNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  // Analysis buffers
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private timeData: Uint8Array<ArrayBuffer> | null = null;
  private prevEnergy: number = 0;
  private currentPreset: EqPresetType = 'flat';

  private constructor() {
    // Lazy initialized on first user gesture or audio attach
  }

  public static getInstance(): WebAudioDspEngine {
    if (!WebAudioDspEngine.instance) {
      WebAudioDspEngine.instance = new WebAudioDspEngine();
    }
    return WebAudioDspEngine.instance;
  }

  private initAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Attach an HTMLAudioElement into the DSP pipeline
   */
  public attachMediaElement(element: HTMLAudioElement): void {
    if (!element) return;
    if (this.currentElement === element && this.sourceNode) {
      return;
    }

    const ctx = this.initAudioContext();
    if (!ctx) return;

    // Disconnect existing source if any
    this.cleanupSource();

    try {
      this.currentElement = element;
      element.crossOrigin = 'anonymous';

      // Create nodes
      this.sourceNode = ctx.createMediaElementSource(element);
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(element.volume || 0.7, ctx.currentTime);

      // 3-Band Equalizer & Warmth filter
      this.bassFilter = ctx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.setValueAtTime(250, ctx.currentTime);
      this.bassFilter.gain.setValueAtTime(0, ctx.currentTime);

      this.midFilter = ctx.createBiquadFilter();
      this.midFilter.type = 'peaking';
      this.midFilter.frequency.setValueAtTime(1500, ctx.currentTime);
      this.midFilter.Q.setValueAtTime(1.0, ctx.currentTime);
      this.midFilter.gain.setValueAtTime(0, ctx.currentTime);

      this.trebleFilter = ctx.createBiquadFilter();
      this.trebleFilter.type = 'highshelf';
      this.trebleFilter.frequency.setValueAtTime(4000, ctx.currentTime);
      this.trebleFilter.gain.setValueAtTime(0, ctx.currentTime);

      this.warmthFilter = ctx.createBiquadFilter();
      this.warmthFilter.type = 'lowpass';
      this.warmthFilter.frequency.setValueAtTime(20000, ctx.currentTime);

      // Analyser Node for FFT visualization
      this.analyserNode = ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.82;

      this.freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.timeData = new Uint8Array(this.analyserNode.frequencyBinCount);

      // Pipeline chain: Source -> Bass -> Mid -> Treble -> Warmth -> Gain -> Analyser -> Destination
      this.sourceNode.connect(this.bassFilter);
      this.bassFilter.connect(this.midFilter);
      this.midFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.warmthFilter);
      this.warmthFilter.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(ctx.destination);

      // Apply initial preset
      this.applyPreset(this.currentPreset);
    } catch (err) {
      console.warn('[WebAudioDspEngine] Failed to route audio node through DSP:', err);
    }
  }

  /**
   * Smooth volume fade in with exponential ramp to prevent audio clicking
   */
  public fadeIn(durationSeconds: number = 1.0, targetVolume: number = 0.7): void {
    const ctx = this.initAudioContext();
    if (!ctx || !this.gainNode) {
      if (this.currentElement) this.currentElement.volume = targetVolume;
      return;
    }

    const now = ctx.currentTime;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(0.001, now);
    this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, targetVolume), now + durationSeconds);
  }

  /**
   * Smooth volume fade out with exponential ramp
   */
  public async fadeOut(durationSeconds: number = 0.8, pauseAfter: boolean = false): Promise<void> {
    const ctx = this.initAudioContext();
    if (!ctx || !this.gainNode) {
      if (this.currentElement && pauseAfter) {
        this.currentElement.pause();
      }
      return;
    }

    const now = ctx.currentTime;
    const currentGain = Math.max(0.001, this.gainNode.gain.value);
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(currentGain, now);
    this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    return new Promise((resolve) => {
      setTimeout(() => {
        if (pauseAfter && this.currentElement) {
          this.currentElement.pause();
        }
        resolve();
      }, durationSeconds * 1000);
    });
  }

  /**
   * Set dynamic target volume smoothly
   */
  public setVolume(volume: number, smooth: boolean = true): void {
    const ctx = this.initAudioContext();
    const clamped = Math.max(0, Math.min(1, volume));

    if (!ctx || !this.gainNode) {
      if (this.currentElement) this.currentElement.volume = clamped;
      return;
    }

    const now = ctx.currentTime;
    if (smooth) {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), now);
      this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, clamped), now + 0.15);
    } else {
      this.gainNode.gain.setValueAtTime(clamped, now);
    }
  }

  /**
   * Equalizer Presets
   */
  public setEqPreset(preset: EqPresetType): void {
    this.currentPreset = preset;
    this.applyPreset(preset);
  }

  public getEqPreset(): EqPresetType {
    return this.currentPreset;
  }

  private applyPreset(preset: EqPresetType): void {
    const ctx = this.ctx;
    if (!ctx || !this.bassFilter || !this.midFilter || !this.trebleFilter || !this.warmthFilter) {
      return;
    }

    const now = ctx.currentTime;
    const transition = 0.3;

    switch (preset) {
      case 'acoustic-warmth':
        // Boost low-mids, gentle roll-off on extreme highs for natural warmth
        this.bassFilter.gain.setTargetAtTime(4.5, now, transition);
        this.midFilter.frequency.setTargetAtTime(1200, now, transition);
        this.midFilter.gain.setTargetAtTime(2.0, now, transition);
        this.trebleFilter.gain.setTargetAtTime(-1.5, now, transition);
        this.warmthFilter.frequency.setTargetAtTime(14000, now, transition);
        break;

      case 'lofi-dream':
        // Vintage lowpass cutoff + mid-hump
        this.bassFilter.gain.setTargetAtTime(3.0, now, transition);
        this.midFilter.frequency.setTargetAtTime(900, now, transition);
        this.midFilter.gain.setTargetAtTime(4.0, now, transition);
        this.trebleFilter.gain.setTargetAtTime(-6.0, now, transition);
        this.warmthFilter.frequency.setTargetAtTime(7500, now, transition);
        break;

      case 'vocal-clarity':
        // High clarity on vocal/lead instruments
        this.bassFilter.gain.setTargetAtTime(-2.0, now, transition);
        this.midFilter.frequency.setTargetAtTime(2500, now, transition);
        this.midFilter.gain.setTargetAtTime(3.5, now, transition);
        this.trebleFilter.gain.setTargetAtTime(4.0, now, transition);
        this.warmthFilter.frequency.setTargetAtTime(20000, now, transition);
        break;

      case 'bass-boost':
        // Rich deep low end
        this.bassFilter.gain.setTargetAtTime(7.0, now, transition);
        this.midFilter.gain.setTargetAtTime(-1.0, now, transition);
        this.trebleFilter.gain.setTargetAtTime(1.0, now, transition);
        this.warmthFilter.frequency.setTargetAtTime(18000, now, transition);
        break;

      case 'spatial-hall':
        this.bassFilter.gain.setTargetAtTime(2.0, now, transition);
        this.midFilter.gain.setTargetAtTime(-2.5, now, transition);
        this.trebleFilter.gain.setTargetAtTime(3.5, now, transition);
        this.warmthFilter.frequency.setTargetAtTime(16000, now, transition);
        break;

      case 'flat':
      default:
        this.bassFilter.gain.setTargetAtTime(0, now, transition);
        this.midFilter.gain.setTargetAtTime(0, now, transition);
        this.trebleFilter.gain.setTargetAtTime(0, now, transition);
        this.warmthFilter.frequency.setTargetAtTime(20000, now, transition);
        break;
    }
  }

  /**
   * Get Real-time Frequency Spectrum Data for Visualizers
   */
  public getFrequencyData(): Uint8Array<ArrayBuffer> {
    if (!this.analyserNode) {
      return new Uint8Array(64);
    }
    if (!this.freqData || this.freqData.length !== this.analyserNode.frequencyBinCount) {
      this.freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
    }
    this.analyserNode.getByteFrequencyData(this.freqData);
    return this.freqData;
  }

  /**
   * Get Real-time Time Domain (Waveform) Data
   */
  public getTimeDomainData(): Uint8Array<ArrayBuffer> {
    if (!this.analyserNode) {
      return new Uint8Array(64);
    }
    if (!this.timeData || this.timeData.length !== this.analyserNode.frequencyBinCount) {
      this.timeData = new Uint8Array(this.analyserNode.frequencyBinCount);
    }
    this.analyserNode.getByteTimeDomainData(this.timeData);
    return this.timeData;
  }

  /**
   * Extract energy bands for audio-reactive animations
   */
  public getAudioEnergy(): AudioEnergyMetrics {
    const data = this.getFrequencyData();
    const len = data.length;
    if (len === 0) {
      return { bass: 0, mid: 0, treble: 0, overall: 0, isBeat: false };
    }

    // Bin segments:
    // Bass: ~20Hz - 250Hz (first 10% of bins)
    // Mid: ~250Hz - 2500Hz (10% to 50% of bins)
    // Treble: ~2500Hz - 20000Hz (50% to 100% of bins)
    const bassEnd = Math.floor(len * 0.12);
    const midEnd = Math.floor(len * 0.5);

    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    for (let i = 0; i < len; i++) {
      const val = data[i] / 255;
      if (i < bassEnd) {
        bassSum += val;
      } else if (i < midEnd) {
        midSum += val;
      } else {
        trebleSum += val;
      }
    }

    const bass = bassSum / Math.max(1, bassEnd);
    const mid = midSum / Math.max(1, midEnd - bassEnd);
    const treble = trebleSum / Math.max(1, len - midEnd);
    const overall = (bass * 0.5 + mid * 0.3 + treble * 0.2);

    const isBeat = bass > 0.45 && (bass - this.prevEnergy > 0.12);
    this.prevEnergy = bass;

    return { bass, mid, treble, overall, isBeat };
  }

  private cleanupSource(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }
  }

  public destroy(): void {
    this.cleanupSource();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
    WebAudioDspEngine.instance = null;
  }
}

export const webAudioDsp = WebAudioDspEngine.getInstance();
