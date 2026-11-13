import { Howl, Howler } from 'howler';
import { useGameStore } from '../store/useGameStore';

class SoundManagerService {
  private audioCtx: AudioContext | null = null;
  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.isInitialized = true;
      this.applyStoreSettings();
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  public applyStoreSettings(): void {
    const { settings } = useGameStore.getState();
    Howler.mute(settings.muted);
    Howler.volume(settings.masterVolume);
  }

  private ensureContext(): AudioContext | null {
    if (!this.audioCtx) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Comedic Gavel Slam (Speaker's Authority)
  public playGavel(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const { settings } = useGameStore.getState();
    if (settings.muted) return;

    const now = ctx.currentTime;
    [0, 0.16].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now + delay);
      osc.frequency.exponentialRampToValueAtTime(32, now + delay + 0.14);

      gain.gain.setValueAtTime(0.7 * settings.sfxVolume * settings.masterVolume, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.16);
    });
  }

  // Desk Thumping (Ayes & Noes Support)
  public playDeskThump(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const { settings } = useGameStore.getState();
    if (settings.muted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.18);

    gain.gain.setValueAtTime(0.65 * settings.sfxVolume * settings.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Paper Aeroplane / Flying File Whoosh
  public playWhoosh(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const { settings } = useGameStore.getState();
    if (settings.muted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.24);

    gain.gain.setValueAtTime(0.25 * settings.sfxVolume * settings.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Chamber Chime / Quorum Bell
  public playChamberBell(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const { settings } = useGameStore.getState();
    if (settings.muted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1174.66, now); // D6

    gain.gain.setValueAtTime(0.4 * settings.sfxVolume * settings.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  }

  // UI Button Click
  public playClick(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const { settings } = useGameStore.getState();
    if (settings.muted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.3 * settings.sfxVolume * settings.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const SoundManager = new SoundManagerService();
