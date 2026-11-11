/**
 * OmniUnlock Pro - Professional Diagnostic & Recovery Simulation Engine
 * Handles user-entered phone models, realistic diagnostic stepper,
 * audio feedback, and the humorous reveal.
 */

class OmniUnlockPro {
  constructor() {
    this.audioEnabled = true;
    this.isProcessing = false;
    this.progress = 0;
    this.intervalId = null;

    this.initAudio();
    this.cacheDom();
    this.bindEvents();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  initAudio() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    } catch (e) {
      console.warn('Web Audio not available', e);
    }
  }

  ensureAudio() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTick(freq = 600, duration = 0.04) {
    if (!this.audioEnabled || !this.audioCtx) return;
    this.ensureAudio();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  playFanfare() {
    if (!this.audioEnabled || !this.audioCtx) return;
    this.ensureAudio();

    const ctx = this.audioCtx;
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.32);
      }, idx * 90);
    });
  }

  cacheDom() {
    this.el = {
      userPhoneInput: document.getElementById('userPhoneInput'),
      lockTypeSelect: document.getElementById('lockTypeSelect'),
      preserveDataToggle: document.getElementById('preserveDataToggle'),
      startRecoveryBtn: document.getElementById('startRecoveryBtn'),
      inputSection: document.getElementById('inputSection'),
      processingSection: document.getElementById('processingSection'),
      targetPhoneTitle: document.getElementById('targetPhoneTitle'),
      targetLockTypeBadge: document.getElementById('targetLockTypeBadge'),
      diagnosticPhaseText: document.getElementById('diagnosticPhaseText'),
      detailedStatusMsg: document.getElementById('detailedStatusMsg'),
      progressPercentage: document.getElementById('progressPercentage'),
      trackFill: document.getElementById('trackFill'),
      consoleOutput: document.getElementById('consoleOutput'),
      stepNode1: document.getElementById('stepNode1'),
      stepNode2: document.getElementById('stepNode2'),
      stepNode3: document.getElementById('stepNode3'),
      stepLine1: document.getElementById('stepLine1'),
      stepLine2: document.getElementById('stepLine2'),
      revealOverlay: document.getElementById('revealOverlay'),
      modalPhoneName: document.getElementById('modalPhoneName'),
      copyShareBtn: document.getElementById('copyShareBtn'),
      restartBtn: document.getElementById('restartBtn'),
    };
  }

  bindEvents() {
    // Quick click pills to populate phone input
    document.querySelectorAll('.phone-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.el.userPhoneInput.value = pill.dataset.name;
        this.playTick(750, 0.03);
      });
    });

    // Start Recovery
    this.el.startRecoveryBtn.addEventListener('click', () => {
      if (this.isProcessing) return;
      this.startRecoveryProcess();
    });

    // Copy Share Link
    this.el.copyShareBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('🎉 Prank Link copied! Send it to your friend and tell them to recover their phone lock! 🤣');
      }).catch(() => {
        alert('Share this link: ' + url);
      });
    });

    // Restart Button
    this.el.restartBtn.addEventListener('click', () => {
      this.el.revealOverlay.classList.remove('show');
      this.resetProcess();
    });
  }

  startRecoveryProcess() {
    let phoneName = this.el.userPhoneInput.value.trim();
    if (!phoneName) {
      phoneName = 'Smart Device';
    }

    const lockType = this.el.lockTypeSelect.options[this.el.lockTypeSelect.selectedIndex].text;

    // Update processing card with user's phone name
    this.el.targetPhoneTitle.textContent = phoneName;
    this.el.modalPhoneName.textContent = phoneName;
    this.el.targetLockTypeBadge.textContent = lockType;

    // Transition UI to Step 2
    this.isProcessing = true;
    this.el.startRecoveryBtn.disabled = true;
    this.el.processingSection.classList.add('visible');
    this.el.stepNode1.classList.add('completed');
    this.el.stepLine1.classList.add('filled');
    this.el.stepNode2.classList.add('active');

    // Smooth scroll down to processing card
    this.el.processingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Clear and initialize console log
    this.el.consoleOutput.innerHTML = '';
    this.addLog(`[INIT] Initializing OmniUnlock Cloud OTA Gateway...`, 'info');
    this.addLog(`[TARGET] Device model registered: "${phoneName}"`, 'step');
    this.addLog(`[LOCK] Target lockscreen cipher: ${lockType}`, 'warn');

    // Realistic diagnostic steps
    const steps = [
      {
        pct: 12,
        phase: 'USB / Bluetooth Handshake',
        msg: `Connecting secure virtual session to ${phoneName}...`,
        log: `[CONNECT] Establishing WebUSB & Cloud Relay bridge with ${phoneName}...`
      },
      {
        pct: 25,
        phase: 'Bootloader Verification',
        msg: `Inspecting partition tables and bootloader integrity...`,
        log: `[INSPECT] Reading storage partition headers. No user data wiping requested.`
      },
      {
        pct: 42,
        phase: 'Lockscreen Partition Scan',
        msg: `Detecting key derivation function and salt parameters...`,
        log: `[ANALYSIS] Located lockscreen credential vault (${lockType}). Verifying salt hashes.`
      },
      {
        pct: 58,
        phase: 'Algorithmic Bypass Simulation',
        msg: `Deploying secure cloud decryption payload...`,
        log: `[PAYLOAD] Executing non-destructive memory mapping sequence...`
      },
      {
        pct: 74,
        phase: 'Kernel Authorization',
        msg: `Synchronizing hardware keystore token...`,
        log: `[TOKEN] Handshaking with device TEE / Secure Enclave coprocessor...`
      },
      {
        pct: 88,
        phase: 'Finalizing Recovery Cache',
        msg: `Recompiling screen unlock manifest...`,
        log: `[SUCCESS] Screen lock state neutralized. Compiling recovery package.`
      },
      {
        pct: 98,
        phase: 'Final Verification',
        msg: `Generating definitive unlock passkey...`,
        log: `[FINAL] Finalizing solution for ${phoneName}... Ready!`
      },
      {
        pct: 100,
        phase: 'Recovery Complete',
        msg: `100% Verified. Generating report...`,
        log: `[DONE] Diagnostic and recovery protocol completed successfully.`
      }
    ];

    let currentStep = 0;
    this.progress = 0;

    this.intervalId = setInterval(() => {
      if (currentStep < steps.length) {
        const item = steps[currentStep];
        this.progress = item.pct;

        this.el.trackFill.style.width = `${item.pct}%`;
        this.el.progressPercentage.textContent = `${item.pct}%`;
        this.el.diagnosticPhaseText.textContent = item.phase;
        this.el.detailedStatusMsg.textContent = item.msg;

        this.addLog(item.log, item.pct === 100 ? 'success' : 'step');
        this.playTick(450 + item.pct * 5, 0.04);

        currentStep++;
      } else {
        clearInterval(this.intervalId);
        this.completeRecovery();
      }
    }, 1100);
  }

  addLog(msg, type = 'info') {
    const line = document.createElement('div');
    line.className = `c-line ${type}`;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    line.textContent = `[${timeStr}] ${msg}`;
    this.el.consoleOutput.appendChild(line);
    this.el.consoleOutput.scrollTop = this.el.consoleOutput.scrollHeight;
  }

  completeRecovery() {
    this.isProcessing = false;
    this.el.startRecoveryBtn.disabled = false;
    this.el.stepNode2.classList.add('completed');
    this.el.stepLine2.classList.add('filled');
    this.el.stepNode3.classList.add('active');

    // Fanfare sound
    this.playFanfare();

    // Trigger celebration confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        window.confetti({ particleCount: 70, angle: 60, spread: 50, origin: { x: 0 } });
        window.confetti({ particleCount: 70, angle: 120, spread: 50, origin: { x: 1 } });
      }, 350);
    }

    // Open Reveal Modal
    setTimeout(() => {
      this.el.revealOverlay.classList.add('show');
    }, 600);
  }

  resetProcess() {
    this.progress = 0;
    this.el.trackFill.style.width = '0%';
    this.el.progressPercentage.textContent = '0%';
    this.el.processingSection.classList.remove('visible');
    this.el.stepNode1.classList.remove('completed');
    this.el.stepLine1.classList.remove('filled');
    this.el.stepNode2.classList.remove('active', 'completed');
    this.el.stepLine2.classList.remove('filled');
    this.el.stepNode3.classList.remove('active');
    this.el.inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new OmniUnlockPro();
});
