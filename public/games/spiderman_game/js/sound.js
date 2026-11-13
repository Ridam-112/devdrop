class SoundEngine {
      constructor() {
        this.ctx = null;
        this.windGain = null;
        this.windFilter = null;
      }

      init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.setupWindAmbience();
      }

      setupWindAmbience() {
        if (!this.ctx) return;
        try {
          const bufferSize = this.ctx.sampleRate * 2;
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          this.windFilter = this.ctx.createBiquadFilter();
          this.windFilter.type = 'lowpass';
          this.windFilter.frequency.setValueAtTime(260, this.ctx.currentTime);

          this.windGain = this.ctx.createGain();
          this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

          whiteNoise.connect(this.windFilter);
          this.windFilter.connect(this.windGain);
          this.windGain.connect(this.ctx.destination);
          whiteNoise.start();
        } catch(e) {}
      }

      updateWind(speedRatio, fallRatio) {
        if (!this.windFilter || !this.windGain || !this.ctx) return;
        const targetFreq = 160 + speedRatio * 450 + fallRatio * 400;
        const targetGain = 0.02 + speedRatio * 0.05 + fallRatio * 0.07;
        this.windFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
        this.windGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
      }

      playThwip(isLeft) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(isLeft ? 900 : 960, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }

      playWebHit() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      }

      playCoin() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      }

      playWallCrash() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.28);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }

      playRubberStretch(progress) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const startFreq = 120 + progress * 260;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.linearRampToValueAtTime(startFreq + 35, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      }

      playSlingshotLaunch() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Explosive twang snap
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(680, now);
        osc1.frequency.exponentialRampToValueAtTime(80, now + 0.22);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.linearRampToValueAtTime(0.01, now + 0.22);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.23);

        // Supersonic whoosh
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(240, now + 0.04);
        osc2.frequency.exponentialRampToValueAtTime(1500, now + 0.35);
        gain2.gain.setValueAtTime(0.32, now + 0.04);
        gain2.gain.linearRampToValueAtTime(0.01, now + 0.38);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.04);
        osc2.stop(now + 0.4);
      }

      playFlipWhoosh() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.16);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.36);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.32, now + 0.14);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }

      playWallVault() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Crisp tactile sneaker push-off on glass
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(320, now);
        osc1.frequency.exponentialRampToValueAtTime(70, now + 0.12);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.13);

        // Spring vault whoosh
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(260, now + 0.04);
        osc2.frequency.exponentialRampToValueAtTime(900, now + 0.28);
        gain2.gain.setValueAtTime(0.28, now + 0.04);
        gain2.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.04);
        osc2.stop(now + 0.32);
      }

      playPointLaunch() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Dual thwip zip
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(450, now);
        osc1.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.21);

        // Sonic explosive catapult launch
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(120, now + 0.16);
        osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.45);
        gain2.gain.setValueAtTime(0.4, now + 0.16);
        gain2.gain.linearRampToValueAtTime(0.01, now + 0.48);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.16);
        osc2.stop(now + 0.5);
      }

      playSpiralWhoosh() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      }

      playStuntChime() {
        if (!this.ctx) return;
        const notes = [659.25, 880, 1174.66, 1760]; // E5, A5, D6, A6
        notes.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime + idx * 0.04;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.18);
        });
      }

      playComboBonus() {
        if (!this.ctx) return;
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime + idx * 0.05;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
        });
      }

      playZipBoost() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.22);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      }

      // ==========================================
      // ICONIC SPIDER-MAN VOICE & MEME SOUNDTRACKS
      // ==========================================
      createAudio(file) {
        const audio = new Audio();
        const tryPaths = ['audio/' + file, 'spiderman_game/audio/' + file, file];
        let pIdx = 0;
        audio.src = tryPaths[pIdx];
        audio.onerror = () => {
          pIdx++;
          if (pIdx < tryPaths.length) {
            audio.src = tryPaths[pIdx];
          }
        };
        return audio;
      }

      initClips() {
        if (this.clipsLoaded) return;
        this.clipsLoaded = true;
        this.clipIAmSpiderman = this.createAudio('i_am_spiderman.mp3');
        this.clipMyBack = this.createAudio('my-back_mLIbOp0.mp3');
        this.clipDirtInEye = this.createAudio('im-gonna-put-some-dirt-in-your-eye.mp3');
        this.clipMissedThePart = this.createAudio('tobey-i-missed-the-part-where-thats-my-problem.mp3');
        this.clipMemeSong = this.createAudio('spiderman-meme-song.mp3');
      }

      playIAmSpiderman() {
        this.initClips();
        try {
          if (this.clipIAmSpiderman) {
            this.clipIAmSpiderman.currentTime = 0;
            this.clipIAmSpiderman.volume = 0.9;
            this.clipIAmSpiderman.play().catch(() => {});
          }
        } catch(e) {}
      }

      playMyBack() {
        this.initClips();
        try {
          if (this.clipMyBack) {
            this.clipMyBack.currentTime = 0;
            this.clipMyBack.volume = 0.95;
            this.clipMyBack.play().catch(() => {});
          }
        } catch(e) {}
      }

      playDirtInEye() {
        this.initClips();
        try {
          if (this.clipDirtInEye) {
            this.clipDirtInEye.currentTime = 0;
            this.clipDirtInEye.volume = 0.9;
            this.clipDirtInEye.play().catch(() => {});
          }
        } catch(e) {}
      }

      playMissedThePart() {
        this.initClips();
        try {
          if (this.clipMissedThePart) {
            this.clipMissedThePart.currentTime = 0;
            this.clipMissedThePart.volume = 0.9;
            this.clipMissedThePart.play().catch(() => {});
          }
        } catch(e) {}
      }

      playMemeSong(loop = true) {
        this.initClips();
        try {
          if (this.clipMemeSong) {
            this.clipMemeSong.loop = loop;
            this.clipMemeSong.volume = 0.55;
            this.clipMemeSong.play().catch(() => {});
            this.memeSongPlaying = true;
          }
        } catch(e) {}
      }

      stopMemeSong() {
        try {
          if (this.clipMemeSong) {
            this.clipMemeSong.pause();
            this.clipMemeSong.currentTime = 0;
            this.memeSongPlaying = false;
          }
        } catch(e) {}
      }

      toggleMemeBgm() {
        this.initClips();
        if (this.memeSongPlaying) {
          this.stopMemeSong();
          return false;
        } else {
          this.playMemeSong(true);
          return true;
        }
      }
    }

    const sound = new SoundEngine();
window.sound = sound;
