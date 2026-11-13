// Procedural Web Audio API sound generator for Airport Ground Crew 3D

export class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Persistent engine oscillator nodes
  private vehicleOsc: OscillatorNode | null = null;
  private vehicleGain: GainNode | null = null;
  private jetOsc: OscillatorNode | null = null;
  private jetNoise: AudioBufferSourceNode | null = null;
  private jetGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // UI & Gameplay SFX
  public playClick() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
    g.gain.setValueAtTime(0.15, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playInteract() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playSuccess() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    notes.forEach((freq, idx) => {
      const start = this.ctx!.currentTime + idx * 0.1;
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.25, start);
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.25);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  public playFail() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const notes = [350, 310, 260];
    notes.forEach((freq, idx) => {
      const start = this.ctx!.currentTime + idx * 0.12;
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.2, start);
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.18);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  }

  public playHorn() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(392, this.ctx.currentTime); // G4
    osc2.frequency.setValueAtTime(493.88, this.ctx.currentTime); // B4
    g.gain.setValueAtTime(0.3, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.2);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc1.connect(g);
    osc2.connect(g);
    g.connect(this.masterGain);
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.4);
    osc2.stop(this.ctx.currentTime + 0.4);
  }

  public playReverseBeep() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    g.gain.setValueAtTime(0.12, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playHydraulic() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(260, this.ctx.currentTime + 0.4);
    g.gain.setValueAtTime(0.15, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public playFuelPump() {
    this.initCtx();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.12, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Continuous vehicle motor sound
  public updateVehicleSound(speed: number, inVehicle: boolean) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (!inVehicle || this.isMuted) {
      if (this.vehicleGain) {
        this.vehicleGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return;
    }

    if (!this.vehicleOsc) {
      this.vehicleOsc = this.ctx.createOscillator();
      this.vehicleGain = this.ctx.createGain();
      this.vehicleOsc.type = 'sawtooth';
      this.vehicleOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
      this.vehicleGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      this.vehicleOsc.connect(this.vehicleGain);
      this.vehicleGain.connect(this.masterGain);
      this.vehicleOsc.start();
    }

    const normSpeed = Math.min(1, Math.abs(speed) / 12);
    const targetFreq = 55 + normSpeed * 110;
    const targetVol = 0.05 + normSpeed * 0.12;

    this.vehicleOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    this.vehicleGain!.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.1);
  }

  // Continuous jet ambient sound
  public startJetAmbient(volume: number = 0.08) {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.jetOsc) return;

    this.jetOsc = this.ctx.createOscillator();
    this.jetGain = this.ctx.createGain();
    this.jetOsc.type = 'sine';
    this.jetOsc.frequency.setValueAtTime(160, this.ctx.currentTime);
    this.jetGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    this.jetOsc.connect(this.jetGain);
    this.jetGain.connect(this.masterGain);
    this.jetOsc.start();
  }
}
