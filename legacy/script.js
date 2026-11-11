/**
 * OmniLock Simulator - Realistic Mobile Screen Lock Engine
 * Fully featured with Web Audio API sound synthesis, Canvas Pattern Drawer,
 * Dynamic Island, Face ID HUD, Optical Fingerprint Scanner, and Event Logging.
 */

class OmniLockApp {
  constructor() {
    // State
    this.isLocked = true;
    this.isScreenOn = true;
    this.currentLockType = 'pin'; // 'pin' | 'pattern' | 'fingerprint' | 'face' | 'password' | 'swipe'
    this.deviceModel = 'ios'; // 'ios' | 'android'
    
    // Credentials & Secrets
    this.activePin = '1234';
    this.activePattern = [0, 1, 2, 4, 6, 7, 8]; // Z-Shape by default
    this.activePassword = 'secret123';
    
    // User Input Buffers
    this.enteredPin = '';
    this.isRecordingCustomPattern = false;
    this.failedAttempts = 0;
    this.authStartTime = 0;
    this.lockoutTimer = null;
    this.lockoutSecondsLeft = 0;

    // Preferences
    this.soundEnabled = true;
    this.vibrationEnabled = true;
    this.notificationsEnabled = true;
    this.simulateBiometricFail = false;
    this.isTorchOn = false;

    // Pattern Lock Canvas state
    this.patternPoints = [];
    this.selectedPattern = [];
    this.isPatternDrawing = false;
    this.currentPatternPos = { x: 0, y: 0 };

    // Fingerprint timer
    this.fpHoldTimer = null;
    this.fpProgress = 0;

    // Initialize Web Audio Context
    this.initAudioContext();
    
    // Cache DOM Elements
    this.cacheElements();

    // Setup Canvas & Layout
    this.setupPatternCanvas();

    // Setup Virtual Keyboard
    this.buildVirtualKeyboard();

    // Attach Event Listeners
    this.bindEvents();

    // Start Live Clock
    this.startClock();

    // Render Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.logEvent('SYSTEM', 'OmniLock engine ready. Device secured.', 'info');
    this.updateSolutionHint();
  }

  /* ------------------------------------------------------------
     AUDIO SYNTHESIS (Zero external assets, 100% native Web Audio)
     ------------------------------------------------------------ */
  initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureAudioReady() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playHapticSound(type = 'click') {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioReady();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (type === 'click') {
      // Subtle tactile mechanical iOS keypad click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.038);
    } 
    else if (type === 'unlock') {
      // Modern harmonious two-tone chime (C5 -> G5)
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      playTone(523.25, now, 0.25); // C5
      playTone(783.99, now + 0.12, 0.4); // G5
    } 
    else if (type === 'error') {
      // Dual low frequency buzz for incorrect passcode
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.setValueAtTime(100, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.setValueAtTime(0.05, now + 0.09);
      gain.gain.setValueAtTime(0.3, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } 
    else if (type === 'lock') {
      // Screen lock click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    }
    else if (type === 'biometric') {
      // Futuristic optical pulse sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  }

  triggerHapticFeedback(pattern = [30]) {
    if (!this.vibrationEnabled) return;
    if (navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignored if user hasn't interacted or unsupported
      }
    }
  }

  /* ------------------------------------------------------------
     DOM ELEMENTS CACHING
     ------------------------------------------------------------ */
  cacheElements() {
    this.el = {
      // Main containers
      ambientGlow: document.getElementById('ambientGlow'),
      phoneBody: document.getElementById('phoneBody'),
      wallpaperLayer: document.getElementById('wallpaperLayer'),
      screenDimmer: document.getElementById('screenDimmer'),
      screenOffLayer: document.getElementById('screenOffLayer'),
      flashlightGlow: document.getElementById('flashlightGlow'),
      dynamicIsland: document.getElementById('dynamicIsland'),
      islandContent: document.getElementById('islandContent'),
      islandText: document.getElementById('islandText'),
      lockscreenView: document.getElementById('lockscreenView'),
      homescreenView: document.getElementById('homescreenView'),
      lockStatusCaption: document.getElementById('lockStatusCaption'),
      padlockBadge: document.getElementById('padlockBadge'),
      padlockIcon: document.getElementById('padlockIcon'),
      swipeHintPill: document.getElementById('swipeHintPill'),
      bottomSwipeText: document.getElementById('bottomSwipeText'),
      notificationsContainer: document.getElementById('notificationsContainer'),

      // Clocks
      statusClock: document.getElementById('statusClock'),
      liveClock: document.getElementById('liveClock'),
      liveDate: document.getElementById('liveDate'),
      homeClockTime: document.getElementById('homeClockTime'),
      homeClockDate: document.getElementById('homeClockDate'),

      // Overlays
      pinOverlay: document.getElementById('pinOverlay'),
      patternOverlay: document.getElementById('patternOverlay'),
      fingerprintOverlay: document.getElementById('fingerprintOverlay'),
      faceOverlay: document.getElementById('faceOverlay'),
      passwordOverlay: document.getElementById('passwordOverlay'),
      lockoutModal: document.getElementById('lockoutModal'),
      lockoutCountdown: document.getElementById('lockoutCountdown'),
      cameraQuickView: document.getElementById('cameraQuickView'),

      // PIN Elements
      pinDots: document.getElementById('pinDots'),
      pinErrorMsg: document.getElementById('pinErrorMsg'),
      numericKeypad: document.getElementById('numericKeypad'),
      backspaceBtn: document.getElementById('backspaceBtn'),

      // Pattern Elements
      patternCanvas: document.getElementById('patternCanvas'),
      patternContainer: document.getElementById('patternContainer'),
      patternErrorMsg: document.getElementById('patternErrorMsg'),
      patternPresetBadge: document.getElementById('patternPresetBadge'),

      // Fingerprint Elements
      fpScannerRing: document.getElementById('fpScannerRing'),
      fpProgressRing: document.getElementById('fpProgressRing'),
      fpStatusLabel: document.getElementById('fpStatusLabel'),
      fpErrorMsg: document.getElementById('fpErrorMsg'),

      // Face ID Elements
      faceCheckBadge: document.getElementById('faceCheckBadge'),
      faceTitle: document.getElementById('faceTitle'),
      faceSub: document.getElementById('faceSub'),
      faceErrorMsg: document.getElementById('faceErrorMsg'),
      retryFaceBtn: document.getElementById('retryFaceBtn'),

      // Password Elements
      screenPasswordInput: document.getElementById('screenPasswordInput'),
      passwordErrorMsg: document.getElementById('passwordErrorMsg'),
      virtualKeyboard: document.getElementById('virtualKeyboard'),
      toggleShowPasswordBtn: document.getElementById('toggleShowPasswordBtn'),

      // Hardware & Buttons
      hwPower: document.getElementById('hwPower'),
      hwVolUp: document.getElementById('hwVolUp'),
      hwVolDown: document.getElementById('hwVolDown'),
      hwMute: document.getElementById('hwMute'),
      lockPowerBtn: document.getElementById('lockPowerBtn'),
      lockAgainBtn: document.getElementById('lockAgainBtn'),
      torchBtn: document.getElementById('torchBtn'),
      cameraShortcutBtn: document.getElementById('cameraShortcutBtn'),
      closeCamBtn: document.getElementById('closeCamBtn'),
      shutterBtn: document.getElementById('shutterBtn'),
      dismissLockoutBtn: document.getElementById('dismissLockoutBtn'),

      // Sidebar Controls
      lockTypeSelector: document.getElementById('lockTypeSelector'),
      currentPinInput: document.getElementById('currentPinInput'),
      savePinBtn: document.getElementById('savePinBtn'),
      currentPasswordInput: document.getElementById('currentPasswordInput'),
      savePasswordBtn: document.getElementById('savePasswordBtn'),
      recordPatternBtn: document.getElementById('recordPatternBtn'),
      biometricFailToggle: document.getElementById('biometricFailToggle'),
      autoUnlockBtn: document.getElementById('autoUnlockBtn'),
      currentSolutionDesc: document.getElementById('currentSolutionDesc'),
      deviceModelControl: document.getElementById('deviceModelControl'),
      wallpaperList: document.getElementById('wallpaperList'),
      soundToggle: document.getElementById('soundToggle'),
      vibrationToggle: document.getElementById('vibrationToggle'),
      notificationsToggle: document.getElementById('notificationsToggle'),

      // Scenarios
      scenarioWrongAttempt: document.getElementById('scenarioWrongAttempt'),
      scenarioLockout: document.getElementById('scenarioLockout'),
      scenarioPushNotif: document.getElementById('scenarioPushNotif'),

      // Metrics & Log
      metricLockState: document.getElementById('metricLockState'),
      metricActiveMethod: document.getElementById('metricActiveMethod'),
      metricAttempts: document.getElementById('metricAttempts'),
      metricLatency: document.getElementById('metricLatency'),
      eventLogContainer: document.getElementById('eventLogContainer'),
      clearLogBtn: document.getElementById('clearLogBtn'),
    };
  }

  /* ------------------------------------------------------------
     CLOCK & DATE UPDATE
     ------------------------------------------------------------ */
  startClock() {
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString('en-US', options);

      const shortOptions = { weekday: 'short', month: 'short', day: 'numeric' };
      const shortDateStr = now.toLocaleDateString('en-US', shortOptions);

      if (this.el.statusClock) this.el.statusClock.textContent = timeStr;
      if (this.el.liveClock) this.el.liveClock.textContent = timeStr;
      if (this.el.liveDate) this.el.liveDate.textContent = dateStr;
      if (this.el.homeClockTime) this.el.homeClockTime.textContent = timeStr;
      if (this.el.homeClockDate) this.el.homeClockDate.textContent = shortDateStr;
    };

    update();
    setInterval(update, 1000);
  }

  /* ------------------------------------------------------------
     EVENT BINDINGS
     ------------------------------------------------------------ */
  bindEvents() {
    // 1. Lock Mechanism Switcher Cards
    this.el.lockTypeSelector.querySelectorAll('.type-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        this.setLockType(type);
      });
    });

    // 2. Physical & Top Power Buttons
    this.el.hwPower.addEventListener('click', () => this.toggleScreenPower());
    this.el.lockPowerBtn.addEventListener('click', () => this.lockDevice());
    this.el.lockAgainBtn.addEventListener('click', () => this.lockDevice());

    // Hardware volume clicks
    this.el.hwVolUp.addEventListener('click', () => this.playHapticSound('click'));
    this.el.hwVolDown.addEventListener('click', () => this.playHapticSound('click'));
    this.el.hwMute.addEventListener('click', () => this.playHapticSound('click'));

    // Global Keyboard Shortcuts (Space / Esc locks/wakes device; Numbers type PIN)
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in sidebar inputs
      if (e.target.tagName === 'INPUT') return;

      if (e.code === 'Space' || e.code === 'Escape') {
        e.preventDefault();
        if (this.isLocked) {
          if (this.currentLockType === 'face') {
            this.triggerFaceIdScan();
          } else {
            this.openUnlockOverlay();
          }
        } else {
          this.lockDevice();
        }
      } else if (this.isLocked && this.currentLockType === 'pin' && /^[0-9]$/.test(e.key)) {
        this.handlePinInput(e.key);
      } else if (this.isLocked && this.currentLockType === 'pin' && e.key === 'Backspace') {
        this.handlePinBackspace();
      }
    });

    // 3. Screen Unlock Trigger: Swipe up or click hint
    this.el.swipeHintPill.addEventListener('click', () => {
      this.openUnlockOverlay();
    });

    // 4. Numeric Keypad clicks
    this.el.numericKeypad.addEventListener('click', (e) => {
      const keyBtn = e.target.closest('.key-btn');
      if (!keyBtn) return;

      if (keyBtn.dataset.digit !== undefined) {
        this.handlePinInput(keyBtn.dataset.digit);
      } else if (keyBtn.id === 'backspaceBtn') {
        this.handlePinBackspace();
      } else if (keyBtn.id === 'emergencyBtn') {
        this.showEmergencyNotice();
      }
    });

    // Cancel buttons for each overlay
    const cancelButtons = [
      'cancelPinBtn',
      'cancelPatternBtn',
      'cancelFpBtn',
      'cancelFaceBtn',
      'cancelPasswordBtn'
    ];
    cancelButtons.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => this.closeAllOverlays());
      }
    });

    // 5. Pattern Drawer Handlers
    this.bindPatternEvents();

    // 6. Fingerprint Biometric Handlers (Press and hold)
    this.bindFingerprintEvents();

    // 7. Face ID Retry
    this.el.retryFaceBtn.addEventListener('click', () => {
      this.triggerFaceIdScan();
    });

    // Dynamic Island Tap triggers Face ID or expands
    this.el.dynamicIsland.addEventListener('click', () => {
      if (this.isLocked) {
        this.setLockType('face');
        this.triggerFaceIdScan();
      }
    });

    // 8. Password input & virtual keyboard
    this.el.toggleShowPasswordBtn.addEventListener('click', () => {
      const type = this.el.screenPasswordInput.type === 'password' ? 'text' : 'password';
      this.el.screenPasswordInput.type = type;
      this.playHapticSound('click');
    });

    this.el.screenPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.verifyPassword(this.el.screenPasswordInput.value);
      }
    });

    // 9. Quick Actions: Torch & Camera
    this.el.torchBtn.addEventListener('click', () => this.toggleTorch());
    this.el.cameraShortcutBtn.addEventListener('click', () => this.openCamera());
    this.el.closeCamBtn.addEventListener('click', () => this.closeCamera());
    this.el.shutterBtn.addEventListener('click', () => {
      this.playHapticSound('click');
      this.triggerHapticFeedback([40]);
      this.logEvent('CAMERA', 'Photo snapshot captured.', 'info');
    });

    // Notifications tap
    this.el.notificationsContainer.addEventListener('click', () => {
      this.openUnlockOverlay();
    });

    // 10. Sidebar Credential Setters
    this.el.savePinBtn.addEventListener('click', () => {
      const val = this.el.currentPinInput.value.trim();
      if (/^\d{4,6}$/.test(val)) {
        this.activePin = val;
        this.updatePinDotsDisplay();
        this.updateSolutionHint();
        this.logEvent('SECURITY', `Active PIN updated to: ${val}`, 'info');
      } else {
        alert('PIN must be 4 to 6 numeric digits.');
      }
    });

    // Quick PIN chips
    document.querySelectorAll('[data-set-pin]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activePin = btn.dataset.setPin;
        this.el.currentPinInput.value = this.activePin;
        this.updatePinDotsDisplay();
        this.updateSolutionHint();
        this.logEvent('SECURITY', `Preset PIN set: ${this.activePin}`, 'info');
      });
    });

    // Preset Pattern Chips
    document.querySelectorAll('[data-pattern]').forEach(btn => {
      btn.addEventListener('click', () => {
        const patternArr = btn.dataset.pattern.split(',').map(Number);
        this.activePattern = patternArr;
        this.el.patternPresetBadge.textContent = `${btn.textContent} (${patternArr.join('-')})`;
        this.updateSolutionHint();
        this.logEvent('SECURITY', `Pattern updated: ${btn.textContent}`, 'info');
      });
    });

    // Record Custom Pattern
    this.el.recordPatternBtn.addEventListener('click', () => {
      this.setLockType('pattern');
      this.openUnlockOverlay();
      this.isRecordingCustomPattern = true;
      document.getElementById('patternPrompt').textContent = 'Draw new pattern to record...';
      this.logEvent('SECURITY', 'Recording mode active: Draw your new pattern.', 'warn');
    });

    // Save Password
    this.el.savePasswordBtn.addEventListener('click', () => {
      const val = this.el.currentPasswordInput.value.trim();
      if (val.length > 0) {
        this.activePassword = val;
        this.updateSolutionHint();
        this.logEvent('SECURITY', `Password updated.`, 'info');
      }
    });

    // Biometric fail toggle
    this.el.biometricFailToggle.addEventListener('change', (e) => {
      this.simulateBiometricFail = e.target.checked;
    });

    // Auto Unlock Button (Showcases seamless unlock)
    this.el.autoUnlockBtn.addEventListener('click', () => {
      this.simulateAutoUnlock();
    });

    // Device Model Switcher
    this.el.deviceModelControl.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.el.deviceModelControl.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setDeviceModel(btn.dataset.model);
      });
    });

    // Wallpaper Selector
    this.el.wallpaperList.querySelectorAll('.thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        this.el.wallpaperList.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        this.setWallpaper(thumb.dataset.wp);
      });
    });

    // Toggles
    this.el.soundToggle.addEventListener('change', (e) => this.soundEnabled = e.target.checked);
    this.el.vibrationToggle.addEventListener('change', (e) => this.vibrationEnabled = e.target.checked);
    this.el.notificationsToggle.addEventListener('change', (e) => {
      this.notificationsEnabled = e.target.checked;
      this.el.notificationsContainer.classList.toggle('hidden', !this.notificationsEnabled);
    });

    // Scenario Triggers
    this.el.scenarioWrongAttempt.addEventListener('click', () => this.simulateWrongKey());
    this.el.scenarioLockout.addEventListener('click', () => this.triggerLockout(30));
    this.el.scenarioPushNotif.addEventListener('click', () => this.pushSampleNotification());
    this.el.dismissLockoutBtn.addEventListener('click', () => {
      this.showEmergencyNotice();
    });

    // Clear Log
    this.el.clearLogBtn.addEventListener('click', () => {
      this.el.eventLogContainer.innerHTML = '';
      this.logEvent('SYSTEM', 'Log cleared.', 'info');
    });
  }

  /* ------------------------------------------------------------
     LOCK MECHANISM SELECTION
     ------------------------------------------------------------ */
  setLockType(type) {
    this.currentLockType = type;
    this.closeAllOverlays();

    // Update Sidebar active state
    this.el.lockTypeSelector.querySelectorAll('.type-card').forEach(card => {
      card.classList.toggle('active', card.dataset.type === type);
    });

    // Update config sub-panels
    document.querySelectorAll('.config-content').forEach(p => p.classList.remove('active'));
    if (type === 'pin') document.getElementById('pinConfigContent')?.classList.add('active');
    else if (type === 'pattern') document.getElementById('patternConfigContent')?.classList.add('active');
    else if (type === 'password') document.getElementById('passwordConfigContent')?.classList.add('active');
    else if (type === 'fingerprint' || type === 'face') document.getElementById('biometricConfigContent')?.classList.add('active');

    // Update Metrics
    const titles = {
      pin: 'PIN Code',
      pattern: 'Pattern Grid',
      fingerprint: 'Touch ID / Fingerprint',
      face: 'Face ID 3D',
      password: 'Password',
      swipe: 'Swipe Only'
    };
    this.el.metricActiveMethod.textContent = titles[type] || type;

    // Update bottom swipe text
    const captions = {
      pin: 'Swipe up for PIN',
      pattern: 'Swipe up for Pattern',
      fingerprint: 'Touch sensor or swipe',
      face: 'Face ID active',
      password: 'Swipe for Password',
      swipe: 'Swipe up to unlock'
    };
    this.el.bottomSwipeText.textContent = captions[type];
    this.el.lockStatusCaption.textContent = captions[type];

    this.updateSolutionHint();
    this.logEvent('MECHANISM', `Active lock changed to: ${titles[type]}`, 'info');

    // If Face ID selected, automatically start face scanning
    if (type === 'face' && this.isLocked && this.isScreenOn) {
      setTimeout(() => this.triggerFaceIdScan(), 300);
    }
  }

  updateSolutionHint() {
    let hint = '';
    if (this.currentLockType === 'pin') hint = `PIN: ${this.activePin}`;
    else if (this.currentLockType === 'pattern') hint = `Dots: ${this.activePattern.join(' → ')}`;
    else if (this.currentLockType === 'password') hint = `Key: "${this.activePassword}"`;
    else if (this.currentLockType === 'fingerprint') hint = 'Hold sensor until filled';
    else if (this.currentLockType === 'face') hint = 'Glance at camera';
    else if (this.currentLockType === 'swipe') hint = 'Slide up or click';

    this.el.currentSolutionDesc.textContent = hint;
  }

  openUnlockOverlay() {
    if (!this.isLocked || this.lockoutSecondsLeft > 0) return;
    this.authStartTime = performance.now();

    this.closeAllOverlays();

    switch (this.currentLockType) {
      case 'pin':
        this.enteredPin = '';
        this.renderPinDots();
        this.el.pinOverlay.classList.add('visible');
        this.hideErrorMsg(this.el.pinErrorMsg);
        break;
      case 'pattern':
        this.el.patternOverlay.classList.add('visible');
        this.hideErrorMsg(this.el.patternErrorMsg);
        this.drawPattern();
        break;
      case 'fingerprint':
        this.el.fingerprintOverlay.classList.add('visible');
        this.hideErrorMsg(this.el.fpErrorMsg);
        this.resetFingerprintProgress();
        break;
      case 'face':
        this.el.faceOverlay.classList.add('visible');
        this.triggerFaceIdScan();
        break;
      case 'password':
        this.el.passwordOverlay.classList.add('visible');
        this.el.screenPasswordInput.value = '';
        this.hideErrorMsg(this.el.passwordErrorMsg);
        setTimeout(() => this.el.screenPasswordInput.focus(), 200);
        break;
      case 'swipe':
        // Swipe alone directly unlocks!
        this.unlockDevice();
        break;
    }
  }

  closeAllOverlays() {
    this.el.pinOverlay.classList.remove('visible');
    this.el.patternOverlay.classList.remove('visible');
    this.el.fingerprintOverlay.classList.remove('visible');
    this.el.faceOverlay.classList.remove('visible');
    this.el.passwordOverlay.classList.remove('visible');
    this.el.dynamicIsland.classList.remove('expanded-face');
    this.isRecordingCustomPattern = false;
  }

  /* ------------------------------------------------------------
     PIN LOCK HANDLING
     ------------------------------------------------------------ */
  updatePinDotsDisplay() {
    const total = this.activePin.length;
    this.el.pinDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'pin-dot';
      this.el.pinDots.appendChild(dot);
    }
  }

  renderPinDots() {
    const dots = this.el.pinDots.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < this.enteredPin.length);
    });
  }

  handlePinInput(digit) {
    if (!this.el.pinOverlay.classList.contains('visible')) {
      this.openUnlockOverlay();
    }
    if (this.enteredPin.length >= this.activePin.length) return;

    this.enteredPin += digit;
    this.playHapticSound('click');
    this.triggerHapticFeedback([25]);
    this.renderPinDots();

    if (this.enteredPin.length === this.activePin.length) {
      setTimeout(() => this.verifyPin(), 120);
    }
  }

  handlePinBackspace() {
    if (this.enteredPin.length > 0) {
      this.enteredPin = this.enteredPin.slice(0, -1);
      this.playHapticSound('click');
      this.renderPinDots();
    }
  }

  verifyPin() {
    const isCorrect = (this.enteredPin === this.activePin);
    if (isCorrect) {
      this.handleAuthSuccess('PIN Code');
    } else {
      this.handleAuthFailure('PIN Code', this.el.pinDots, this.el.pinErrorMsg);
      this.enteredPin = '';
      setTimeout(() => this.renderPinDots(), 400);
    }
  }

  /* ------------------------------------------------------------
     PATTERN LOCK (Canvas 3x3 Dot Matrix)
     ------------------------------------------------------------ */
  setupPatternCanvas() {
    const canvas = this.el.patternCanvas;
    if (!canvas) return;
    this.patternCtx = canvas.getContext('2d');

    // Generate 3x3 grid coordinates
    const size = 300;
    const padding = 45;
    const step = (size - padding * 2) / 2;

    this.patternPoints = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        this.patternPoints.push({
          id: r * 3 + c,
          x: padding + c * step,
          y: padding + r * step,
          radius: 12,
          hitRadius: 28
        });
      }
    }

    this.drawPattern();
  }

  drawPattern(status = 'normal') {
    const ctx = this.patternCtx;
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 300);

    const isError = (status === 'error');
    const isSuccess = (status === 'success');

    // 1. Draw Connecting Lines between selected dots
    if (this.selectedPattern.length > 0) {
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (isError) {
        ctx.strokeStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
      } else if (isSuccess) {
        ctx.strokeStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 14;
      } else {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.9)';
        ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
        ctx.shadowBlur = 10;
      }

      const firstPoint = this.patternPoints[this.selectedPattern[0]];
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < this.selectedPattern.length; i++) {
        const pt = this.patternPoints[this.selectedPattern[i]];
        ctx.lineTo(pt.x, pt.y);
      }

      // Draw active line to cursor if currently drawing
      if (this.isPatternDrawing && !isError && !isSuccess) {
        ctx.lineTo(this.currentPatternPos.x, this.currentPatternPos.y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 2. Draw 3x3 Dots
    this.patternPoints.forEach(pt => {
      const isSelected = this.selectedPattern.includes(pt.id);

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isSelected ? 14 : 7, 0, Math.PI * 2);

      if (isSelected) {
        if (isError) {
          ctx.fillStyle = '#ef4444';
        } else if (isSuccess) {
          ctx.fillStyle = '#10b981';
        } else {
          ctx.fillStyle = '#3b82f6';
        }
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      }
      ctx.fill();

      // Outer ring for selected dots
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = isError ? 'rgba(239, 68, 68, 0.4)' : isSuccess ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.35)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
  }

  bindPatternEvents() {
    const canvas = this.el.patternCanvas;
    if (!canvas) return;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const onStart = (e) => {
      e.preventDefault();
      this.isPatternDrawing = true;
      this.selectedPattern = [];
      const pos = getPos(e);
      this.currentPatternPos = pos;
      this.checkPatternCollision(pos);
      this.drawPattern('normal');
    };

    const onMove = (e) => {
      if (!this.isPatternDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      this.currentPatternPos = pos;
      this.checkPatternCollision(pos);
      this.drawPattern('normal');
    };

    const onEnd = (e) => {
      if (!this.isPatternDrawing) return;
      this.isPatternDrawing = false;
      this.finishPattern();
    };

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  }

  checkPatternCollision(pos) {
    for (const pt of this.patternPoints) {
      const dx = pos.x - pt.x;
      const dy = pos.y - pt.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < pt.hitRadius && !this.selectedPattern.includes(pt.id)) {
        this.selectedPattern.push(pt.id);
        this.playHapticSound('click');
        this.triggerHapticFeedback([18]);
        break;
      }
    }
  }

  finishPattern() {
    if (this.selectedPattern.length < 3) {
      this.drawPattern('normal');
      this.selectedPattern = [];
      return;
    }

    // Check if in recording mode
    if (this.isRecordingCustomPattern) {
      this.activePattern = [...this.selectedPattern];
      this.isRecordingCustomPattern = false;
      this.el.patternPresetBadge.textContent = `Custom (${this.activePattern.join('-')})`;
      this.updateSolutionHint();
      this.drawPattern('success');
      this.playHapticSound('unlock');
      this.logEvent('SECURITY', `New custom pattern saved: [${this.activePattern.join(',')}]`, 'success');
      setTimeout(() => {
        this.closeAllOverlays();
        this.selectedPattern = [];
      }, 700);
      return;
    }

    // Compare with activePattern
    const isMatch = (this.selectedPattern.length === this.activePattern.length) &&
      this.selectedPattern.every((val, idx) => val === this.activePattern[idx]);

    if (isMatch) {
      this.drawPattern('success');
      this.handleAuthSuccess('Pattern');
    } else {
      this.drawPattern('error');
      this.handleAuthFailure('Pattern', this.el.patternContainer, this.el.patternErrorMsg);
      setTimeout(() => {
        this.selectedPattern = [];
        this.drawPattern('normal');
      }, 600);
    }
  }

  /* ------------------------------------------------------------
     FINGERPRINT BIOMETRIC TOUCH
     ------------------------------------------------------------ */
  bindFingerprintEvents() {
    const zone = this.el.fpScannerRing;
    if (!zone) return;

    const startScan = (e) => {
      e.preventDefault();
      zone.classList.add('scanning');
      this.playHapticSound('biometric');
      this.triggerHapticFeedback([20, 50, 20]);
      this.el.fpStatusLabel.textContent = 'Scanning fingerprint...';

      let progress = 0;
      const totalCircumference = 276.46; // 2 * PI * 44

      clearInterval(this.fpHoldTimer);
      this.fpHoldTimer = setInterval(() => {
        progress += 4;
        const offset = totalCircumference - (progress / 100) * totalCircumference;
        this.el.fpProgressRing.style.strokeDashoffset = offset;

        if (progress >= 100) {
          clearInterval(this.fpHoldTimer);
          zone.classList.remove('scanning');

          // Verify fingerprint
          if (this.simulateBiometricFail) {
            this.handleAuthFailure('Fingerprint', this.el.fpScannerRing, this.el.fpErrorMsg);
            this.el.fpStatusLabel.textContent = 'Fingerprint not recognized';
            this.resetFingerprintProgress();
          } else {
            this.handleAuthSuccess('Fingerprint (Touch ID)');
          }
        }
      }, 35);
    };

    const cancelScan = () => {
      if (zone.classList.contains('scanning')) {
        zone.classList.remove('scanning');
        clearInterval(this.fpHoldTimer);
        this.el.fpStatusLabel.textContent = 'Keep finger on sensor';
        this.resetFingerprintProgress();
      }
    };

    zone.addEventListener('mousedown', startScan);
    window.addEventListener('mouseup', cancelScan);

    zone.addEventListener('touchstart', startScan, { passive: false });
    window.addEventListener('touchend', cancelScan);
  }

  resetFingerprintProgress() {
    this.el.fpProgressRing.style.strokeDashoffset = '276.46';
  }

  /* ------------------------------------------------------------
     FACE ID SCANNING (Dynamic Island & HUD)
     ------------------------------------------------------------ */
  triggerFaceIdScan() {
    if (!this.isLocked) return;
    this.authStartTime = performance.now();

    // Expand Dynamic Island
    this.el.dynamicIsland.classList.add('expanded-face');
    this.el.islandText.textContent = 'Verifying Face...';
    this.el.faceTitle.textContent = 'Scanning Face...';
    this.el.faceSub.textContent = 'Align face within HUD brackets';
    this.el.faceCheckBadge.classList.remove('active');
    this.hideErrorMsg(this.el.faceErrorMsg);

    this.playHapticSound('biometric');
    this.triggerHapticFeedback([20, 30]);

    setTimeout(() => {
      if (this.simulateBiometricFail) {
        this.el.dynamicIsland.classList.remove('expanded-face');
        this.handleAuthFailure('Face ID', this.el.faceOverlay.querySelector('.face-scanner-viewport'), this.el.faceErrorMsg);
        this.el.faceTitle.textContent = 'Face Not Recognized';
      } else {
        // Success
        this.el.faceCheckBadge.classList.add('active');
        this.el.dynamicIsland.classList.add('unlocked-pulse');
        this.el.islandText.textContent = 'Face ID Verified';
        this.handleAuthSuccess('Face ID');
      }
    }, 1200);
  }

  /* ------------------------------------------------------------
     PASSWORD & VIRTUAL KEYBOARD
     ------------------------------------------------------------ */
  buildVirtualKeyboard() {
    const kb = this.el.virtualKeyboard;
    if (!kb) return;

    const rows = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del'],
      ['123', 'space', 'enter']
    ];

    kb.innerHTML = '';
    rows.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'kb-row';

      row.forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'kb-key';

        if (key === 'shift') {
          btn.innerHTML = '⇧';
          btn.classList.add('wide');
          btn.addEventListener('click', () => this.toggleKeyboardShift());
        } else if (key === 'del') {
          btn.innerHTML = '⌫';
          btn.classList.add('wide');
          btn.addEventListener('click', () => {
            this.el.screenPasswordInput.value = this.el.screenPasswordInput.value.slice(0, -1);
            this.playHapticSound('click');
          });
        } else if (key === 'space') {
          btn.innerHTML = 'space';
          btn.classList.add('spacebar');
          btn.addEventListener('click', () => {
            this.el.screenPasswordInput.value += ' ';
            this.playHapticSound('click');
          });
        } else if (key === 'enter') {
          btn.innerHTML = 'Go';
          btn.classList.add('action-enter');
          btn.addEventListener('click', () => {
            this.verifyPassword(this.el.screenPasswordInput.value);
          });
        } else if (key === '123') {
          btn.innerHTML = '123';
          btn.classList.add('wide');
          btn.addEventListener('click', () => this.playHapticSound('click'));
        } else {
          btn.textContent = key;
          btn.addEventListener('click', () => {
            this.el.screenPasswordInput.value += key;
            this.playHapticSound('click');
          });
        }

        rowDiv.appendChild(btn);
      });

      kb.appendChild(rowDiv);
    });
  }

  toggleKeyboardShift() {
    this.isShift = !this.isShift;
    const keys = this.el.virtualKeyboard.querySelectorAll('.kb-key');
    keys.forEach(k => {
      if (k.textContent.length === 1 && /[a-zA-Z]/.test(k.textContent)) {
        k.textContent = this.isShift ? k.textContent.toUpperCase() : k.textContent.toLowerCase();
      }
    });
    this.playHapticSound('click');
  }

  verifyPassword(val) {
    if (val === this.activePassword) {
      this.handleAuthSuccess('Password');
    } else {
      this.handleAuthFailure('Password', this.el.passwordOverlay.querySelector('.password-input-box'), this.el.passwordErrorMsg);
    }
  }

  /* ------------------------------------------------------------
     AUTHENTICATION SUCCESS & FAILURE HANDLERS
     ------------------------------------------------------------ */
  handleAuthSuccess(methodName) {
    const latency = Math.round(performance.now() - (this.authStartTime || performance.now()));
    this.el.metricLatency.textContent = `${latency} ms`;
    this.failedAttempts = 0;
    this.el.metricAttempts.textContent = '0';

    this.playHapticSound('unlock');
    this.triggerHapticFeedback([40]);
    this.logEvent('AUTH', `${methodName} authenticated successfully (${latency}ms).`, 'success');

    // Unlock padlock icon
    this.el.padlockBadge.classList.add('unlocked');
    this.el.padlockIcon.setAttribute('data-lucide', 'unlock');
    if (window.lucide) window.lucide.createIcons();

    // Unlock transition
    setTimeout(() => {
      this.unlockDevice();
    }, 300);
  }

  handleAuthFailure(methodName, shakeElement, errorElement) {
    this.failedAttempts++;
    this.el.metricAttempts.textContent = this.failedAttempts;

    this.playHapticSound('error');
    this.triggerHapticFeedback([80, 50, 80]);

    if (shakeElement) {
      shakeElement.classList.add('shake');
      setTimeout(() => shakeElement.classList.remove('shake'), 450);
    }

    if (errorElement) {
      errorElement.classList.add('show');
    }

    this.logEvent('AUTH', `${methodName} authentication failed (Attempt ${this.failedAttempts}).`, 'fail');

    // Trigger lockout after 3 fails
    if (this.failedAttempts >= 3) {
      setTimeout(() => this.triggerLockout(30), 500);
    }
  }

  hideErrorMsg(el) {
    if (el) el.classList.remove('show');
  }

  /* ------------------------------------------------------------
     DEVICE LOCK / UNLOCK ENGINE
     ------------------------------------------------------------ */
  unlockDevice() {
    this.isLocked = false;
    this.closeAllOverlays();

    // Slide up lock screen, show home screen
    this.el.lockscreenView.classList.add('unlocked-slide-up');
    this.el.homescreenView.classList.add('active');

    // Metrics update
    this.el.metricLockState.textContent = 'UNLOCKED';
    this.el.metricLockState.className = 'badge badge-unlocked';

    this.logEvent('STATE', 'Device transitioned to Home Screen.', 'success');
  }

  lockDevice() {
    this.isLocked = true;
    this.closeAllOverlays();

    // Reset Lock Screen Position
    this.el.lockscreenView.classList.remove('unlocked-slide-up');
    this.el.homescreenView.classList.remove('active');

    // Reset padlock
    this.el.padlockBadge.classList.remove('unlocked');
    this.el.padlockIcon.setAttribute('data-lucide', 'lock');
    if (window.lucide) window.lucide.createIcons();

    // Reset dynamic island
    this.el.dynamicIsland.classList.remove('expanded-face', 'unlocked-pulse');

    // Metrics update
    this.el.metricLockState.textContent = 'LOCKED';
    this.el.metricLockState.className = 'badge badge-locked';

    this.playHapticSound('lock');
    this.triggerHapticFeedback([30]);
    this.logEvent('STATE', 'Device locked. Screen secured.', 'warn');
  }

  toggleScreenPower() {
    this.isScreenOn = !this.isScreenOn;
    this.el.screenOffLayer.classList.toggle('blackout', !this.isScreenOn);

    if (this.isScreenOn) {
      this.playHapticSound('click');
      this.logEvent('POWER', 'Screen turned ON (Display woke up).', 'info');
      // If locked and face ID is active, re-scan
      if (this.isLocked && this.currentLockType === 'face') {
        setTimeout(() => this.triggerFaceIdScan(), 400);
      }
    } else {
      this.playHapticSound('lock');
      this.closeAllOverlays();
      this.closeCamera();
      this.logEvent('POWER', 'Screen turned OFF (Standby sleep).', 'info');
    }
  }

  /* ------------------------------------------------------------
     LOCKOUT SCENARIO (30s Security Warning)
     ------------------------------------------------------------ */
  triggerLockout(seconds = 30) {
    this.lockoutSecondsLeft = seconds;
    this.el.lockoutModal.classList.add('show');
    this.closeAllOverlays();
    this.playHapticSound('error');

    this.logEvent('SECURITY', `Device locked out for ${seconds} seconds due to repeated failed attempts.`, 'fail');

    clearInterval(this.lockoutTimer);
    this.lockoutTimer = setInterval(() => {
      this.lockoutSecondsLeft--;
      this.el.lockoutCountdown.textContent = `Try again in ${this.lockoutSecondsLeft} seconds`;

      if (this.lockoutSecondsLeft <= 0) {
        clearInterval(this.lockoutTimer);
        this.el.lockoutModal.classList.remove('show');
        this.failedAttempts = 0;
        this.el.metricAttempts.textContent = '0';
        this.logEvent('SECURITY', 'Lockout cooldown expired. Device ready for retry.', 'info');
      }
    }, 1000);
  }

  /* ------------------------------------------------------------
     QUICK ACTIONS & SCENARIOS
     ------------------------------------------------------------ */
  toggleTorch() {
    this.isTorchOn = !this.isTorchOn;
    this.el.flashlightGlow.classList.toggle('active', this.isTorchOn);
    this.el.torchBtn.classList.toggle('torch-active', this.isTorchOn);
    this.playHapticSound('click');
    this.triggerHapticFeedback([40]);
    this.logEvent('FEATURE', `Flashlight turned ${this.isTorchOn ? 'ON' : 'OFF'}`, 'info');
  }

  openCamera() {
    this.el.cameraQuickView.classList.add('active');
    this.playHapticSound('click');
    this.logEvent('FEATURE', 'Quick Camera opened from lock screen.', 'info');
  }

  closeCamera() {
    this.el.cameraQuickView.classList.remove('active');
  }

  pushSampleNotification() {
    const titles = ['Uber Driver Nearby', 'Telegram Message', 'Calendar Alert', 'Spotify Music'];
    const bodies = [
      'Your ride is arriving in 3 mins. White Toyota Camry.',
      'Sarah: Let me know when you arrive!',
      'Standup meeting starts in 10 minutes.',
      'Now Playing: Daft Punk - Instant Crush'
    ];
    const idx = Math.floor(Math.random() * titles.length);

    const card = document.createElement('div');
    card.className = 'notif-card';
    card.innerHTML = `
      <div class="notif-header">
        <div class="notif-app">
          <span class="app-icon wa-icon"><i data-lucide="bell"></i></span>
          <span class="app-name">System Alert</span>
        </div>
        <span class="notif-time">Just now</span>
      </div>
      <div class="notif-title">${titles[idx]}</div>
      <div class="notif-body">${bodies[idx]}</div>
    `;

    this.el.notificationsContainer.prepend(card);
    if (window.lucide) window.lucide.createIcons();
    this.playHapticSound('click');
    this.triggerHapticFeedback([30, 20]);
    this.logEvent('NOTIFICATION', `New alert pushed: ${titles[idx]}`, 'info');
  }

  simulateWrongKey() {
    this.openUnlockOverlay();
    setTimeout(() => {
      this.handleAuthFailure(this.currentLockType, null, null);
    }, 400);
  }

  simulateAutoUnlock() {
    this.openUnlockOverlay();

    if (this.currentLockType === 'pin') {
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < this.activePin.length) {
          this.handlePinInput(this.activePin[idx]);
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 150);
    } else if (this.currentLockType === 'pattern') {
      this.selectedPattern = [...this.activePattern];
      this.drawPattern('success');
      setTimeout(() => this.handleAuthSuccess('Pattern'), 350);
    } else if (this.currentLockType === 'fingerprint') {
      this.resetFingerprintProgress();
      this.el.fpProgressRing.style.strokeDashoffset = '0';
      this.playHapticSound('biometric');
      setTimeout(() => this.handleAuthSuccess('Fingerprint (Auto)'), 400);
    } else if (this.currentLockType === 'face') {
      this.triggerFaceIdScan();
    } else if (this.currentLockType === 'password') {
      this.el.screenPasswordInput.value = this.activePassword;
      setTimeout(() => this.verifyPassword(this.activePassword), 300);
    } else if (this.currentLockType === 'swipe') {
      this.unlockDevice();
    }
  }

  showEmergencyNotice() {
    alert('Simulated Emergency SOS Dialer triggered.\nCall 911 / 112 / 999.');
    this.logEvent('EMERGENCY', 'Emergency SOS screen requested.', 'warn');
  }

  /* ------------------------------------------------------------
     CUSTOMIZATION & THEMING
     ------------------------------------------------------------ */
  setDeviceModel(model) {
    this.deviceModel = model;
    this.el.phoneBody.classList.remove('model-ios', 'model-android');
    this.el.phoneBody.classList.add(`model-${model}`);
    this.logEvent('CUSTOMIZE', `Device hardware changed to: ${model.toUpperCase()}`, 'info');
  }

  setWallpaper(wpClass) {
    // Remove existing wp classes
    this.el.wallpaperLayer.className = `wallpaper-layer wp-${wpClass}`;

    // Adjust ambient background glow color
    const glowColors = {
      'ios-aurora': 'rgba(59, 130, 246, 0.15)',
      'deep-space': 'rgba(239, 68, 68, 0.12)',
      'cyber-neon': 'rgba(168, 85, 247, 0.18)',
      'sunset-peaks': 'rgba(251, 146, 60, 0.18)',
      'emerald-mesh': 'rgba(16, 185, 129, 0.15)',
      'oled-minimal': 'rgba(255, 255, 255, 0.05)'
    };
    if (this.el.ambientGlow && glowColors[wpClass]) {
      this.el.ambientGlow.style.background = `radial-gradient(circle, ${glowColors[wpClass]} 0%, transparent 70%)`;
    }

    this.logEvent('CUSTOMIZE', `Applied wallpaper theme: ${wpClass}`, 'info');
  }

  /* ------------------------------------------------------------
     EVENT LOGGER
     ------------------------------------------------------------ */
  logEvent(tag, msg, type = 'info') {
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    entry.innerHTML = `
      <span class="log-time">${timeStr}</span>
      <span class="log-tag ${type}">${tag}</span>
      <span class="log-msg">${msg}</span>
    `;

    this.el.eventLogContainer.prepend(entry);

    // Limit log size to 40 items
    if (this.el.eventLogContainer.children.length > 40) {
      this.el.eventLogContainer.removeChild(this.el.eventLogContainer.lastChild);
    }
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.omniLock = new OmniLockApp();
});
