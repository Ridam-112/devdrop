/**
 * MONSOON MAYHEM — AUDIO MANAGER
 * Web Audio procedural synthesis and event hooks for scooter driving, jumping, and water splashes.
 */
export class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;

  // Engine loop oscillators
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isEngineRunning = false;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public ensureContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Starts procedural 2-stroke scooter engine sound loop
   */
  public startEngine(): void {
    this.ensureContext();
    if (!this.ctx || this.isEngineRunning) return;

    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // 45 Hz low scooter idle

      this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      // Low pass filter to make it sound like a throaty scooter exhaust
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Engine audio start failed:', e);
    }
  }

  /**
   * Modulates engine pitch and volume based on speed and throttle
   */
  public updateEngine(speedKmh: number, isAccelerating: boolean): void {
    if (!this.ctx || !this.isEngineRunning || !this.engineOsc || !this.engineGain) return;

    const baseFreq = 42 + (speedKmh * 1.6);
    const targetFreq = isAccelerating ? baseFreq * 1.25 : baseFreq;
    const targetGain = isAccelerating ? 0.14 : 0.08;

    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
  }

  public stopEngine(): void {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch (e) {}
      this.engineOsc = null;
    }
    this.isEngineRunning = false;
  }

  /**
   * Water Splash sound when wheels hit water puddles or landing
   */
  public playWaterSplash(intensity: number = 1.0): void {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700 * intensity, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25 * Math.min(1.0, intensity), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  /**
   * Jump whoosh sound
   */
  public playJump(): void {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Landing suspension thud + splash
   */
  public playLanding(): void {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.14);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);

    this.playWaterSplash(1.2);
  }

  /**
   * Pothole crunch & muddy splash impact
   */
  public playImpactPothole(): void {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.16);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);

    this.playWaterSplash(1.5);
  }

  /**
   * Open Manhole metallic rim clang & deep abyss thud
   */
  public playImpactManhole(): void {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Deep heavy sub-bass thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.28);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);

    // High metal clang
    const metalOsc = this.ctx.createOscillator();
    const metalGain = this.ctx.createGain();
    metalOsc.type = 'square';
    metalOsc.frequency.setValueAtTime(680, now);
    metalOsc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
    metalGain.gain.setValueAtTime(0.25, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    metalOsc.connect(metalGain);
    metalGain.connect(this.ctx.destination);
    metalOsc.start(now);
    metalOsc.stop(now + 0.15);

    this.playWaterSplash(2.0);
  }

  /**
   * Police barricade or heavy obstacle impact
   */
  public playImpactBarricade(): void {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Warning alert chime when approaching hazardous open manhole
   */
  public playWarningChime(): void {
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1100, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Loud Kolkata Bus dual-tone pneumatic horn ("প্যাঁ... প্যাঁ...")
   */
  public playBusHorn(): void {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const freq of [310, 390]) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.setValueAtTime(0.2, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    }
  }

  /**
   * High-pitched Ambassador Taxi electric horn
   */
  public playTaxiHorn(): void {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.setValueAtTime(0.18, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  /**
   * Kolkata Bus Conductor Body Slap & Whistle ("ঠাস... ঠাস... হুইশল!")
   */
  public playConductorWhistle(): void {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Metallic Bus Body Slap
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(160, now);
    thud.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    thudGain.gain.setValueAtTime(0.5, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(now);
    thud.stop(now + 0.16);

    // Conductor Pea Whistle (Twin trill)
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(2600, now + 0.05);
    whistle.frequency.setValueAtTime(2900, now + 0.12);
    whistleGain.gain.setValueAtTime(0.25, now + 0.05);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    whistle.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);
    whistle.start(now + 0.05);
    whistle.stop(now + 0.3);
  }

  /**
   * Snapped Electric Wire Arc & Sparks in Flooded Water (BZZZZT!)
   */
  public playElectricSpark(): void {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // High electrical crackle buzz
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.setValueAtTime(850, now + 0.05);
    osc.frequency.setValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  /**
   * Sputtering Exhaust when water floods the silencer ("ভট... ভট... ফুসসস...")
   */
  public playEngineSputter(): void {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Choked low-frequency backfire
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.exponentialRampToValueAtTime(22, now + 0.14);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  /**
   * Massive Bus Water Bow Wave Crash
   */
  public playWaveCrash(): void {
    this.ensureContext();
    if (!this.ctx) return;
    this.playWaterSplash(2.5);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Kolkata Street Chai Sip & Energy Chime
   */
  public playChaiSlurp(): void {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Uplifting sweet chime
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc1.frequency.setValueAtTime(1046.5, now + 0.24); // C6

    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.42);
  }

  /**
   * Browser Speech Synthesis for Authentic Bengali Shouts!
   */
  public speakBengali(text: string): void {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.15;
      utterance.pitch = 1.25;

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('hi'));
      if (bnVoice) utterance.voice = bnVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech synthesis fallback handled silently
    }
  }
}
