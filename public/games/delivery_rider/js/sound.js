/* =========================================================
   FUNNY DELIVERY RIDER 3D - SOUND & MEME AUDIO ENGINE
   Web Audio API Synthesis + HTML5 Meme Voice Clips
   ========================================================= */

class DeliverySoundEngine {
  constructor() {
    this.ctx = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.isEngineRunning = false;
    this.audioClips = {};
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.setupEngineSound();
      this.loadMemeClips();
    } catch (e) {
      console.warn('AudioContext init failed:', e);
    }
  }

  setupEngineSound() {
    if (!this.ctx) return;
    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

      // Low pass filter for throaty bike muffler sound
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(260, this.ctx.currentTime);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Engine sound setup failed:', e);
    }
  }

  updateEngine(speed, maxSpeed, isAccelerating) {
    if (!this.ctx || !this.engineOsc || !this.engineGain) return;
    const ratio = Math.min(Math.max(Math.abs(speed) / maxSpeed, 0), 1);
    const targetFreq = 55 + ratio * 180 + (isAccelerating ? 35 : 0);
    const targetGain = 0.08 + (isAccelerating ? 0.08 : 0.02) + ratio * 0.06;

    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    this.engineFilter.frequency.setTargetAtTime(200 + ratio * 600, this.ctx.currentTime, 0.08);
    this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
  }

  stopEngine() {
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.1);
    }
  }

  // Funny 2-Tone Indian Bike Horn (Pee-Pee-Poo!)
  playHorn() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(420, now);
      osc2.frequency.setValueAtTime(540, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch (e) {}
  }

  // Nitro Boost Rush Whoosh
  playNitro() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.35);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch (e) {}
  }

  // Near-Miss Overtake Chime
  playNearMiss() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // Order Pickup Ding
  playPickup() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.1); // A5

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.48);
    } catch (e) {}
  }

  // Order Delivered Cash Tip Register Chime
  playDelivered() {
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.18, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.32);
      });
    } catch (e) {}
  }

  // Urgent Countdown Ticking Bomb Click
  playTick() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // Delivery App Overspeed Telematics Warning Beep!
  playOverspeedBeep() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [0, 0.12].forEach(delay => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now + delay); // B5
        gain.gain.setValueAtTime(0.12, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.09);
      });
    } catch (e) {}
  }

  // Traffic Police Whistle / Traffic Violation Siren
  playPoliceWhistle() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.linearRampToValueAtTime(2800, now + 0.08);
      osc.frequency.linearRampToValueAtTime(2300, now + 0.16);
      osc.frequency.linearRampToValueAtTime(2900, now + 0.24);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.34);
    } catch (e) {}
  }

  // Funny Street Dog Bark (Woof! Woof!)
  playDogBark() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [0, 0.15].forEach(delay => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360, now + delay);
        osc.frequency.exponentialRampToValueAtTime(110, now + delay + 0.12);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, now + delay);
        filter.Q.setValueAtTime(2.5, now + delay);

        gain.gain.setValueAtTime(0.24, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.13);
      });
    } catch (e) {}
  }

  // Speed Bump Airtime Jump Whoosh
  playJump() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  // Tapri Chai Power-up (+Time Boost Chime)
  playChaiPickup() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [587.33, 739.99, 880.00, 1174.66].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.26);
      });
    } catch (e) {}
  }

  // Dabang Shield Activation
  playShieldActivate() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(620, now + 0.35);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch (e) {}
  }

  // Dabang Shield Car Smash
  playShieldSmash() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  // Cash Coin Ding
  playCoin() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, now); // E6
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // Police Siren Wail
  playPoliceSiren() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(1050, now + 0.25);
      osc.frequency.linearRampToValueAtTime(700, now + 0.5);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.58);
    } catch (e) {}
  }

  // Funny Stray Cow Moo
  playCowMoo() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(145, now + 0.3);
      osc.frequency.linearRampToValueAtTime(105, now + 0.7);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {}
  }

  // Bomb Blast / Crash Explosion Boom!
  playBlast() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Low boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);

      // Noise blast
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Load Meme MP3 clips from audio/ directory
  loadMemeClips() {
    const files = {
      myBack: 'audio/my-back_mLIbOp0.mp3',
      missedPart: 'audio/tobey-i-missed-the-part-where-thats-my-problem.mp3',
      dirtInEye: 'audio/im-gonna-put-some-dirt-in-your-eye.mp3',
      memeSong: 'audio/spiderman-meme-song.mp3',
      iamSpiderman: 'audio/i_am_spiderman.mp3',

      // User requested meme sounds:
      blastLate: 'audio/ma-ka-bhosda-aag.mp3',
      orderReceived: 'audio/bhai-ne-bola-karnekka.mp3',
      gianAap: 'audio/gian-hain-aap.mp3',
      uthJaa: 'audio/uth-jaa.mp3',
      urgentPanic: 'audio/hindi-dhimdom_MhPSSy9.mp3',
      souravJoshi: 'audio/sourav-joshi-ki-amma-tmkb-(slowed)-made-with-Voicemod.mp3',
      jaldiWahaSe: 'audio/jaldi_waha_se_hato.mp3'
    };

    for (const [key, path] of Object.entries(files)) {
      try {
        const audio = new Audio();
        audio.src = path;
        audio.preload = 'auto';
        this.audioClips[key] = audio;
      } catch (e) {}
    }
  }

  playMemeClip(key, volume = 0.9) {
    try {
      const clip = this.audioClips[key];
      if (clip) {
        clip.currentTime = 0;
        clip.volume = volume;
        clip.play().catch(() => {});
      }
    } catch (e) {}
  }

  playMyBack() { this.playMemeClip('myBack', 0.95); }
  playMissedPart() { this.playMemeClip('missedPart', 0.95); }
  playDirtInEye() { this.playMemeClip('dirtInEye', 0.85); }
  playIamSpiderman() { this.playMemeClip('iamSpiderman', 0.95); }

  // User custom meme sound triggers
  playBlastLate() { this.playMemeClip('blastLate', 1.0); }
  playOrderReceived() { this.playMemeClip('orderReceived', 1.0); }
  playGianAap() { this.playMemeClip('gianAap', 1.0); }
  playUthJaa() { this.playMemeClip('uthJaa', 1.0); }

  playAccidentMeme() {
    if (Math.random() < 0.65) {
      this.playGianAap();
    } else {
      this.playUthJaa();
    }
  }

  // Low speed crash meme (<= 15 km/h)
  playSouravJoshi() {
    this.playMemeClip('souravJoshi', 1.0);
  }

  // Honk / Traffic clear meme
  playJaldiWahaSe() {
    this.playMemeClip('jaldiWahaSe', 1.0);
  }

  // Wet Puddle Mud Splash sound
  playSplash() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Wheelie Stunt Engine Whine
  playWheelieStunt() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  // Indian Wedding Barat Dhol Beat
  playDholBeat() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Dha (low resonant drum hit)
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(160, now);
      bassOsc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
      bassGain.gain.setValueAtTime(0.4, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.22);

      // Tin (high slap)
      const highOsc = this.ctx.createOscillator();
      const highGain = this.ctx.createGain();
      highOsc.type = 'triangle';
      highOsc.frequency.setValueAtTime(420, now + 0.12);
      highOsc.frequency.exponentialRampToValueAtTime(200, now + 0.24);
      highGain.gain.setValueAtTime(0.25, now + 0.12);
      highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      highOsc.connect(highGain);
      highGain.connect(this.ctx.destination);
      highOsc.start(now + 0.12);
      highOsc.stop(now + 0.28);
    } catch (e) {}
  }

  // 5★ Customer Rating Celebration Fanfare
  play5StarCheer() {
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {}
  }

  // 1★ Customer Disappointment Buzzer
  play1StarDisappoint() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(115, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  playUrgentPanic() {
    const clip = this.audioClips.urgentPanic;
    if (clip && (clip.paused || clip.ended)) {
      clip.currentTime = 0;
      clip.volume = 0.88;
      clip.play().catch(() => {});
    }
  }

  stopUrgentPanic() {
    const clip = this.audioClips.urgentPanic;
    if (clip && !clip.paused) {
      clip.pause();
      clip.currentTime = 0;
    }
  }

  // Camera Shutter Snap for Speed Trap Radar
  playCameraShutter() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Emergency Ambulance Siren (Wee-Woo two-tone)
  playAmbulanceSiren() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.25);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } catch (e) {}
  }

  // Lucky Diwali Tip Surprise Fanfare
  playLuckyBonus() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880, 1108.7].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.07);
        gain.gain.setValueAtTime(0.28, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.38);
      });
    } catch (e) {}
  }

  // In-Game Delivery Rider FM Radio System
  cycleRadioStation() {
    this.radioStations = ['OFF', 'DESI_MEME', 'DHOL_BASS', 'MONSOON_LOFI'];
    this.currentStationIdx = ((this.currentStationIdx || 0) + 1) % this.radioStations.length;
    const current = this.radioStations[this.currentStationIdx];

    // Stop existing radio tracks
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
    if (this.audioClips.memeSong) {
      this.audioClips.memeSong.pause();
    }

    if (current === 'DESI_MEME') {
      if (this.audioClips.memeSong) {
        this.audioClips.memeSong.loop = true;
        this.audioClips.memeSong.volume = 0.55;
        this.audioClips.memeSong.play().catch(() => {});
      }
      return '📻 DESI MEME FM';
    } else if (current === 'DHOL_BASS') {
      this.radioInterval = setInterval(() => {
        this.playDholBeat();
      }, 700);
      return '🥁 PUNJABI DHOL FM';
    } else if (current === 'MONSOON_LOFI') {
      this.radioInterval = setInterval(() => {
        if (!this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          [261.63, 329.63, 392.00, 493.88].forEach((f, i) => { // Cmaj7 lofi chord
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.05);
            gain.gain.setValueAtTime(0.08, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.05);
            osc.stop(now + 1.25);
          });
        } catch (e) {}
      }, 1600);
      return '🎧 MONSOON LOFI FM';
    } else {
      return '📻 RADIO OFF';
    }
  }

  toggleMemeSong() {
    const song = this.audioClips.memeSong;
    if (!song) return false;
    if (song.paused) {
      song.loop = true;
      song.volume = 0.55;
      song.play().catch(() => {});
      return true;
    } else {
      song.pause();
      return false;
    }
  }
}

window.soundEngine = new DeliverySoundEngine();
