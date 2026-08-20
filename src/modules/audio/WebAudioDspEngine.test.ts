import { describe, it, expect, beforeEach } from 'vitest';
import { WebAudioDspEngine, webAudioDsp } from './WebAudioDspEngine';

describe('WebAudioDspEngine', () => {
  it('should initialize as a singleton instance', () => {
    const instance1 = WebAudioDspEngine.getInstance();
    const instance2 = webAudioDsp;
    expect(instance1).toBe(instance2);
  });

  it('should get and set EQ presets properly', () => {
    webAudioDsp.setEqPreset('lofi-dream');
    expect(webAudioDsp.getEqPreset()).toBe('lofi-dream');

    webAudioDsp.setEqPreset('acoustic-warmth');
    expect(webAudioDsp.getEqPreset()).toBe('acoustic-warmth');
  });

  it('should return valid frequency and time domain data arrays safely', () => {
    const freqData = webAudioDsp.getFrequencyData();
    expect(freqData).toBeInstanceOf(Uint8Array);

    const timeData = webAudioDsp.getTimeDomainData();
    expect(timeData).toBeInstanceOf(Uint8Array);
  });

  it('should calculate audio energy metrics safely without throwing', () => {
    const energy = webAudioDsp.getAudioEnergy();
    expect(energy).toHaveProperty('bass');
    expect(energy).toHaveProperty('mid');
    expect(energy).toHaveProperty('treble');
    expect(energy).toHaveProperty('overall');
    expect(energy).toHaveProperty('isBeat');
    expect(typeof energy.bass).toBe('number');
    expect(typeof energy.isBeat).toBe('boolean');
  });

  it('should handle setVolume without crashing', () => {
    expect(() => webAudioDsp.setVolume(0.8, true)).not.toThrow();
    expect(() => webAudioDsp.setVolume(0.5, false)).not.toThrow();
  });
});
