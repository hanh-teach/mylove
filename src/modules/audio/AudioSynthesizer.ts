class AmbientAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: any = null;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.isPlaying = true;
      this.playMelodyLoop();
    } catch (e) {
      console.warn('Web Audio API initialized with warning:', e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }

  private playNote(freq: number, duration: number = 1.6, type: OscillatorType = 'sine') {
    if (!this.ctx || !this.isPlaying) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio node play errors
    }
  }

  private playMelodyLoop() {
    if (!this.isPlaying) return;

    // Peaceful major pentatonic & canon frequencies
    const notes = [
      261.63, 329.63, 392.00, 523.25,
      196.00, 246.94, 293.66, 392.00,
      220.00, 261.63, 329.63, 440.00,
      174.61, 220.00, 261.63, 349.23,
    ];

    let step = 0;
    const tick = () => {
      if (!this.isPlaying) return;
      const freq = notes[step % notes.length];
      this.playNote(freq, 2.2, step % 2 === 0 ? 'sine' : 'triangle');
      step++;
      this.timer = setTimeout(tick, 700);
    };

    tick();
  }
}

export const ambientSynth = new AmbientAudioSynthesizer();
