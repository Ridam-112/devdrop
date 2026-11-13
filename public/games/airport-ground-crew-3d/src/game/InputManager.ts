// Complete Desktop Keyboard, Mouse Look & Mobile Touch Input Handler

export interface InputVector {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (backward to forward)
}

export class InputManager {
  // Movement input states
  public move: InputVector = { x: 0, y: 0 };
  public interactPressed: boolean = false;
  public brakePressed: boolean = false;
  public hornPressed: boolean = false;
  public cameraPressed: boolean = false;
  public pausePressed: boolean = false;

  // Camera Orbit / Look Deltas
  public lookDelta: { x: number; y: number } = { x: 0, y: 0 };
  public isLooking: boolean = false;

  // Key tracking
  private keys: Record<string, boolean> = {};

  // Mouse look tracking
  private isMouseDown: boolean = false;
  private lastMousePos = { x: 0, y: 0 };

  // Touch tracking
  private joystickActive: boolean = false;
  private joystickTouchId: number | null = null;
  private joystickCenter: { x: number; y: number } = { x: 0, y: 0 };
  private joystickRadius: number = 40;
  private joystickThumbEl: HTMLElement | null = null;
  private joystickBaseEl: HTMLElement | null = null;

  private cameraTouchId: number | null = null;
  private lastTouchPos = { x: 0, y: 0 };

  constructor() {
    this.setupKeyboard();
    this.setupMouse();
    this.setupTouch();
  }

  private setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'KeyE' || e.code === 'Enter') {
        this.interactPressed = true;
      }
      if (e.code === 'KeyH') {
        this.hornPressed = true;
      }
      if (e.code === 'KeyC') {
        this.cameraPressed = true;
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        this.pausePressed = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
      this.isMouseDown = false;
      this.cameraTouchId = null;
    });
  }

  private setupMouse() {
    window.addEventListener('mousedown', (e) => {
      // Don't trigger look if clicking on UI buttons or dialogs
      const target = e.target as HTMLElement;
      if (target.closest('.hud-icon-btn') || target.closest('.btn-primary') || target.closest('.btn-secondary') || target.closest('.screen-overlay')) {
        return;
      }

      this.isMouseDown = true;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;

      const dx = e.movementX !== undefined ? e.movementX : (e.clientX - this.lastMousePos.x);
      const dy = e.movementY !== undefined ? e.movementY : (e.clientY - this.lastMousePos.y);

      this.lookDelta.x += dx;
      this.lookDelta.y += dy;
      this.isLooking = true;

      this.lastMousePos = { x: e.clientX, y: e.clientY };
    });

    const endMouse = () => {
      this.isMouseDown = false;
    };

    window.addEventListener('mouseup', endMouse);
  }

  private setupTouch() {
    // Touch joystick elements
    const base = document.getElementById('joystick-base');
    const thumb = document.getElementById('joystick-thumb');

    if (base && thumb) {
      this.joystickBaseEl = base;
      this.joystickThumbEl = thumb;

      base.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        this.joystickTouchId = touch.identifier;
        const rect = base.getBoundingClientRect();
        this.joystickCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        this.joystickActive = true;
        this.handleJoystickMove(touch.clientX, touch.clientY);
      }, { passive: false });
    }

    // Window touch listeners for multi-touch (one finger for joystick, one for camera drag)
    window.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystickTouchId) continue;

        const target = touch.target as HTMLElement;
        if (target.closest('#mobile-controls') || target.closest('.hud-icon-btn') || target.closest('.screen-overlay')) {
          continue;
        }

        // Dedicated camera look touch
        if (this.cameraTouchId === null) {
          this.cameraTouchId = touch.identifier;
          this.lastTouchPos = { x: touch.clientX, y: touch.clientY };
        }
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];

        // Update joystick
        if (touch.identifier === this.joystickTouchId && this.joystickActive) {
          this.handleJoystickMove(touch.clientX, touch.clientY);
        }

        // Update camera look drag
        if (touch.identifier === this.cameraTouchId) {
          const dx = touch.clientX - this.lastTouchPos.x;
          const dy = touch.clientY - this.lastTouchPos.y;

          this.lookDelta.x += dx;
          this.lookDelta.y += dy;
          this.isLooking = true;

          this.lastTouchPos = { x: touch.clientX, y: touch.clientY };
        }
      }
    }, { passive: false });

    const endTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystickTouchId) {
          this.joystickActive = false;
          this.joystickTouchId = null;
          this.move.x = 0;
          this.move.y = 0;
          if (this.joystickThumbEl) {
            this.joystickThumbEl.style.transform = `translate(0px, 0px)`;
          }
        }
        if (touch.identifier === this.cameraTouchId) {
          this.cameraTouchId = null;
        }
      }
    };

    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);

    // Touch action buttons
    const bindBtn = (id: string, onPress: () => void, onRelease?: () => void) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        el.classList.add('pressed');
        onPress();
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        el.classList.remove('pressed');
        if (onRelease) onRelease();
      }, { passive: false });
    };

    bindBtn('btn-touch-interact', () => { this.interactPressed = true; });
    bindBtn('btn-touch-horn', () => { this.hornPressed = true; });
    bindBtn('btn-touch-cam', () => { this.cameraPressed = true; });
    bindBtn('btn-touch-gas', () => { this.move.y = 1; }, () => { this.move.y = 0; });
    bindBtn('btn-touch-brake', () => { this.brakePressed = true; }, () => { this.brakePressed = false; });
  }

  private handleJoystickMove(clientX: number, clientY: number) {
    const dx = clientX - this.joystickCenter.x;
    const dy = clientY - this.joystickCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxDist = this.joystickRadius;
    const clampedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);

    const moveX = (Math.cos(angle) * clampedDist) / maxDist;
    const moveY = -(Math.sin(angle) * clampedDist) / maxDist;

    this.move.x = moveX;
    this.move.y = moveY;

    if (this.joystickThumbEl) {
      const px = Math.cos(angle) * clampedDist;
      const py = Math.sin(angle) * clampedDist;
      this.joystickThumbEl.style.transform = `translate(${px}px, ${py}px)`;
    }
  }

  public update() {
    // If joystick is not actively being dragged, read keyboard WASD / Arrows
    if (!this.joystickActive) {
      let x = 0;
      let y = 0;

      if (this.keys['KeyW'] || this.keys['ArrowUp']) y += 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) y -= 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) x -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) x += 1;

      // Check pedal state if on touch
      const gasBtn = document.getElementById('btn-touch-gas');
      if (gasBtn && gasBtn.classList.contains('pressed')) {
        y = 1;
      }

      this.move.x = x;
      this.move.y = y;
    }

    if (this.keys['Space']) {
      this.brakePressed = true;
    } else {
      const brakeBtn = document.getElementById('btn-touch-brake');
      if (!brakeBtn || !brakeBtn.classList.contains('pressed')) {
        this.brakePressed = false;
      }
    }
  }

  // Consume camera look deltas
  public consumeLook(): { x: number; y: number } {
    const delta = { x: this.lookDelta.x, y: this.lookDelta.y };
    this.lookDelta.x = 0;
    this.lookDelta.y = 0;
    this.isLooking = false;
    return delta;
  }

  // Consume single-frame action triggers
  public consumeInteract(): boolean {
    const val = this.interactPressed;
    this.interactPressed = false;
    return val;
  }

  public consumeHorn(): boolean {
    const val = this.hornPressed;
    this.hornPressed = false;
    return val;
  }

  public consumeCamera(): boolean {
    const val = this.cameraPressed;
    this.cameraPressed = false;
    return val;
  }

  public consumePause(): boolean {
    const val = this.pausePressed;
    this.pausePressed = false;
    return val;
  }
}
