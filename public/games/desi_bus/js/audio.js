/**
 * No Brakes Desi Bus Driver 3D - Complete Audio & Radio Engine
 * Web Audio API Synthesizers: Engine, Turbo, Drift, Air Horn, Police Siren,
 * Passenger Screams, Vomit Gags, Goat Bleat, Chai Tapri Smash & Desi Cassette Radio
 */

class BusSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.engineGain = null;
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.turboOsc = null;
    this.turboGain = null;
    this.driftGain = null;
    this.driftSource = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.isSirenPlaying = false;

    // Desi Cassette Radio System
    this.radioStations = [
      { id: 'OFF', name: '🔇 RADIO OFF' },
      { id: 'DHABA', name: '🥁 DHABA DHOLAK BEATS' },
      { id: 'RETRO', name: '📻 90s HIGHWAY NOSTALGIA' },
      { id: 'LOFI', name: '🌧️ MONSOON TRUCK LOFI' }
    ];
    this.currentStationIdx = 0;
    this.radioInterval = null;

    // Meme Audio Clip Pool
    this.audioClips = {};
    this.initMemeClips();
  }

  initMemeClips() {
    const memeList = [
      { key: 'horn', src: 'audio/bus_horn_0001.mp3', alt: '../audio/bus_horn_0001.mp3' },
      { key: 'jaldi', src: 'audio/jaldi_waha_se_hato.mp3', alt: '../audio/jaldi_waha_se_hato.mp3' },
      { key: 'gian', src: 'audio/gian-hain-aap.mp3', alt: '../audio/gian-hain-aap.mp3' },
      { key: 'uthjaa', src: 'audio/uth-jaa.mp3', alt: '../audio/uth-jaa.mp3' },
      { key: 'blast', src: 'audio/ma-ka-bhosda-aag.mp3', alt: '../audio/ma-ka-bhosda-aag.mp3' },
      { key: 'bhai', src: 'audio/bhai-ne-bola-karnekka.mp3', alt: '../audio/bhai-ne-bola-karnekka.mp3' },
      { key: 'slowbump', src: 'audio/sourav-joshi-ki-amma-tmkb-(slowed)-made-with-Voicemod.mp3', alt: '../audio/sourav-joshi-ki-amma-tmkb-(slowed)-made-with-Voicemod.mp3' },
      { key: 'panic', src: 'audio/hindi-dhimdom_MhPSSy9.mp3', alt: '../audio/hindi-dhimdom_MhPSSy9.mp3' }
    ];

    memeList.forEach(m => {
      const a = new Audio();
      a.preload = 'auto';
      a.src = m.src;
      a.onerror = () => { a.src = m.alt; };
      this.audioClips[m.key] = a;
    });

    if (this.audioClips.panic) {
      this.audioClips.panic.loop = true;
      this.audioClips.panic.volume = 0.55;
    }
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.setupEngineSynth();
    this.setupDriftSynth();
  }

  setupEngineSynth() {
    if (!this.ctx) return;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc1.frequency.setValueAtTime(32, this.ctx.currentTime);

    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = 'triangle';
    this.engineOsc2.frequency.setValueAtTime(48, this.ctx.currentTime);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.turboOsc = this.ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.turboGain = this.ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.engineOsc1.connect(this.engineFilter);
    this.engineOsc2.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);

    this.turboOsc.connect(this.turboGain);
    this.turboGain.connect(this.engineGain);

    this.engineGain.connect(this.ctx.destination);

    this.engineOsc1.start();
    this.engineOsc2.start();
    this.turboOsc.start();
  }

  setupDriftSynth() {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.driftSource = this.ctx.createBufferSource();
    this.driftSource.buffer = noiseBuffer;
    this.driftSource.loop = true;

    this.driftFilter = this.ctx.createBiquadFilter();
    this.driftFilter.type = 'bandpass';
    this.driftFilter.frequency.setValueAtTime(950, this.ctx.currentTime);
    this.driftFilter.Q.setValueAtTime(3.2, this.ctx.currentTime);

    this.driftGain = this.ctx.createGain();
    this.driftGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.driftSource.connect(this.driftFilter);
    this.driftFilter.connect(this.driftGain);
    this.driftGain.connect(this.ctx.destination);

    this.driftSource.start();
  }

  updateEngine(speedKmh, isDrifting = false, isNitro = false, isThrottle = false) {
    if (!this.ctx || !this.engineGain) return;

    const t = this.ctx.currentTime;
    const clampedSpeed = Math.max(0, speedKmh);
    const speedRatio = Math.min(clampedSpeed / 140, 1.4);

    const gear = Math.min(Math.floor(clampedSpeed / 25) + 1, 5);
    const gearRatio = (clampedSpeed % 25) / 25;

    const throttleBonus = isThrottle ? 22 : 0;
    const baseFreq = 34 + (gear * 6) + (gearRatio * 44) + throttleBonus;
    this.engineOsc1.frequency.setTargetAtTime(baseFreq, t, 0.08);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 1.5, t, 0.08);
    this.engineFilter.frequency.setTargetAtTime(140 + speedRatio * 460 + (isThrottle ? 140 : 0), t, 0.08);

    const turboFreq = 1100 + speedRatio * 2200 + (isNitro ? 800 : (isThrottle ? 400 : 0));
    this.turboOsc.frequency.setTargetAtTime(turboFreq, t, 0.1);
    this.turboGain.gain.setTargetAtTime(Math.min(0.09, speedRatio * 0.07 + (isNitro ? 0.06 : 0) + (isThrottle ? 0.035 : 0)), t, 0.1);

    const vol = this.isMuted ? 0 : Math.min(0.28, 0.08 + speedRatio * 0.14 + (isThrottle ? 0.06 : 0));
    this.engineGain.gain.setTargetAtTime(vol, t, 0.05);

    if (this.driftGain) {
      const driftVol = (!this.isMuted && isDrifting && clampedSpeed > 15) ? 0.22 : 0.001;
      this.driftGain.gain.setTargetAtTime(driftVol, t, 0.04);
    }
  }

  stopEngine() {
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.1);
    }
    if (this.driftGain && this.ctx) {
      this.driftGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.1);
    }
    this.stopPoliceSiren();
  }

  // Authentic 5-Tone Musical Indian Pressure Air Horn
  playMusicalAirHorn() {
    if (this.isMuted) return;

    // 1. Play real bus air horn audio clip (bus_horn_0001.mp3)
    if (this.audioClips.horn) {
      this._playClip('horn', 1.0);
    } else if (this.ctx) {
      // Synthesizer fallback if clip isn't loaded
      const notes = [
        { f: 440, d: 0.14 },
        { f: 554, d: 0.14 },
        { f: 659, d: 0.18 },
        { f: 880, d: 0.22 },
        { f: 740, d: 0.38 }
      ];

      let start = this.ctx.currentTime;
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.28, start + 0.02);
        gain.gain.setValueAtTime(0.28, start + n.d - 0.02);
        gain.gain.linearRampToValueAtTime(0.001, start + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + n.d + 0.05);

        start += n.d * 0.88;
      });
    }

    if (Math.random() < 0.35) {
      this.playJaldiWahaSe();
    }
  }

  // Roadside Chai Tapri Smash (Steam hiss & shattering glass)
  playChaiTapriSmash() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Steam Hiss
    const bufSize = this.ctx.sampleRate * 0.5;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // Metal kettle clang
    const clang = this.ctx.createOscillator();
    const clangGain = this.ctx.createGain();
    clang.type = 'triangle';
    clang.frequency.setValueAtTime(740, t);
    clang.frequency.exponentialRampToValueAtTime(220, t + 0.3);

    clangGain.gain.setValueAtTime(0.3, t);
    clangGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    clang.connect(clangGain);
    clangGain.connect(this.ctx.destination);
    clang.start(t);
    clang.stop(t + 0.32);
  }

  // Fruit Stall Smash
  playFruitStallSmash() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.28);

    oscGain.gain.setValueAtTime(0.35, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Toll Barrier Snap
  playTollBarrierSmash() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.18);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Passenger Comic Gag / Motion Sickness Vomit
  playPassengerVomitGag() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.25);
    osc.frequency.linearRampToValueAtTime(240, t + 0.5);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.24, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.52);
  }

  // Goat Bleat (Maaa-eh-eh!)
  playGoatBleat() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    // Vowel vibrato modulation
    for (let i = 0; i < 6; i++) {
      osc.frequency.setValueAtTime(320 + (i % 2 === 0 ? 40 : -40), t + 0.08 * i);
    }

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.58);
  }

  // Highway Police Interceptor Siren (Wee-Woo-Wee-Woo)
  startPoliceSiren() {
    if (!this.ctx || this.isSirenPlaying || this.isMuted) return;
    this.isSirenPlaying = true;

    this.sirenOsc = this.ctx.createOscillator();
    this.sirenGain = this.ctx.createGain();
    this.sirenOsc.type = 'sawtooth';

    const t = this.ctx.currentTime;
    this.sirenOsc.frequency.setValueAtTime(650, t);
    this.sirenGain.gain.setValueAtTime(0.18, t);

    // LFO frequency modulation
    this.sirenLFO = this.ctx.createOscillator();
    this.sirenLFOGain = this.ctx.createGain();
    this.sirenLFO.frequency.setValueAtTime(2.2, t); // 2.2 Hz cycle
    this.sirenLFOGain.gain.setValueAtTime(260, t);

    this.sirenLFO.connect(this.sirenOsc.frequency);
    this.sirenOsc.connect(this.sirenGain);
    this.sirenGain.connect(this.ctx.destination);

    this.sirenLFO.start(t);
    this.sirenOsc.start(t);
  }

  stopPoliceSiren() {
    if (!this.isSirenPlaying) return;
    this.isSirenPlaying = false;
    try {
      if (this.sirenGain && this.ctx) {
        this.sirenGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.1);
      }
      setTimeout(() => {
        if (this.sirenOsc) { this.sirenOsc.stop(); this.sirenOsc.disconnect(); }
        if (this.sirenLFO) { this.sirenLFO.stop(); this.sirenLFO.disconnect(); }
      }, 150);
    } catch (e) {}
  }

  playPassengerScream() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420 + Math.random() * 200, t);
    osc.frequency.linearRampToValueAtTime(840 + Math.random() * 200, t + 0.16);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.45);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.48);
  }

  playJumpWhoosh() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.35);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  playChaosModeFanfare() {
    if (!this.ctx || this.isMuted) return;
    const chords = [523.25, 659.25, 783.99, 1046.5];
    const t = this.ctx.currentTime;

    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.001, t + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.65);
    });
  }

  playNitroRoar() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.3);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.7);
  }

  // Puddle Splash
  playPuddleSplash() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.22);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // DESI CASSETTE FM RADIO STATION CHANNELS
  cycleRadio() {
    this.currentStationIdx = (this.currentStationIdx + 1) % this.radioStations.length;
    const station = this.radioStations[this.currentStationIdx];

    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }

    if (station.id === 'OFF') return station;

    // Procedural Synth Radio Tracks
    let step = 0;
    this.radioInterval = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      step++;
      const t = this.ctx.currentTime;

      if (station.id === 'DHABA') {
        // High-energy Dholak Bass
        if (step % 2 === 0) {
          const bass = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bass.type = 'sine';
          bass.frequency.setValueAtTime(110, t);
          bass.frequency.exponentialRampToValueAtTime(45, t + 0.16);
          bGain.gain.setValueAtTime(0.18, t);
          bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          bass.connect(bGain);
          bGain.connect(this.ctx.destination);
          bass.start(t);
          bass.stop(t + 0.18);
        }
      } else if (station.id === 'RETRO') {
        // 90s Highway Melody
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00];
        const f = scale[step % scale.length];
        const mel = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        mel.type = 'triangle';
        mel.frequency.setValueAtTime(f, t);
        mGain.gain.setValueAtTime(0.12, t);
        mGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        mel.connect(mGain);
        mGain.connect(this.ctx.destination);
        mel.start(t);
        mel.stop(t + 0.28);
      } else if (station.id === 'LOFI') {
        // Relaxing Rainy Lofi Chords
        const chords = [329.63, 392.00, 493.88];
        chords.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.06, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.connect(g);
          g.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.5);
        });
      }
    }, 280);

    return station;
  }

  // Meme Audio Triggers
  playJaldiWahaSe() { this._playClip('jaldi', 0.85); }
  playGianCrash() { this._playClip('gian', 0.9); }
  playUthJaa() { this._playClip('uthjaa', 0.9); }
  playBlastLate() { this._playClip('blast', 1.0); }
  playBhaiNeBola() { this._playClip('bhai', 0.85); }
  playSlowBump() { this._playClip('slowbump', 0.85); }

  startPanicMusic() {
    const c = this.audioClips.panic;
    if (c && !this.isMuted) {
      c.currentTime = 0;
      c.play().catch(() => {});
    }
  }

  stopPanicMusic() {
    const c = this.audioClips.panic;
    if (c) {
      c.pause();
      c.currentTime = 0;
    }
  }

  _playClip(name, volume = 0.8) {
    if (this.isMuted) return;
    const clip = this.audioClips[name];
    if (clip) {
      clip.currentTime = 0;
      clip.volume = volume;
      clip.play().catch(() => {});
    }
  }
}

window.busAudio = new BusSoundEngine();
