import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { useGameStore } from '../store/useGameStore';

export class GameEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private sceneManager: SceneManager;
  private animFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();
  private resizeObserver: ResizeObserver | null = null;

  // FPS calculation
  private frameCount = 0;
  private fpsAccumulator = 0;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Setup Three.js WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // 2. Setup Scene Manager
    this.sceneManager = new SceneManager();

    // 3. Bind Events & Resize
    this.setupResizeObserver();
    this.bindEvents();

    // 4. Initial Scene
    const initialView = useGameStore.getState().view;
    this.sceneManager.switchScene(initialView).then(() => {
      this.startLoop();
    });

    // 5. Subscribe to Zustand store changes
    useGameStore.subscribe((state, prevState) => {
      if (state.view !== prevState.view) {
        this.sceneManager.switchScene(state.view);
      }
    });
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.renderer.setSize(width, height);
          const activeScene = this.sceneManager.getCurrentScene();
          if (activeScene) {
            activeScene.onResize(width, height);
          }
        }
      }
    });
    this.resizeObserver.observe(this.container);
  }

  private bindEvents(): void {
    const el = this.renderer.domElement;

    el.addEventListener('pointerdown', (e) => {
      const activeScene = this.sceneManager.getCurrentScene();
      if (activeScene?.onPointerDown) activeScene.onPointerDown(e);
    });

    window.addEventListener('pointermove', (e) => {
      const activeScene = this.sceneManager.getCurrentScene();
      if (activeScene?.onPointerMove) activeScene.onPointerMove(e);
    });

    window.addEventListener('pointerup', (e) => {
      const activeScene = this.sceneManager.getCurrentScene();
      if (activeScene?.onPointerUp) activeScene.onPointerUp(e);
    });

    window.addEventListener('wheel', (e) => {
      const activeScene = this.sceneManager.getCurrentScene();
      if (activeScene?.onWheel) activeScene.onWheel(e.deltaY);
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      const activeScene = this.sceneManager.getCurrentScene();
      if (activeScene?.onKeyDown) activeScene.onKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
      const activeScene = this.sceneManager.getCurrentScene();
      if ('onKeyUp' in activeScene! && typeof (activeScene as { onKeyUp: (e: KeyboardEvent) => void }).onKeyUp === 'function') {
        (activeScene as { onKeyUp: (e: KeyboardEvent) => void }).onKeyUp(e);
      }
    });
  }

  private startLoop(): void {
    this.clock.start();

    const loop = () => {
      this.animFrameId = requestAnimationFrame(loop);

      const delta = Math.min(this.clock.getDelta(), 0.1);
      const elapsed = this.clock.getElapsedTime();

      // FPS Calculation
      this.frameCount++;
      this.fpsAccumulator += delta;
      if (this.fpsAccumulator >= 0.5) {
        const currentFps = Math.round(this.frameCount / this.fpsAccumulator);
        useGameStore.getState().setFps(currentFps);
        this.frameCount = 0;
        this.fpsAccumulator = 0;
      }

      // Update & Render Active Scene
      const activeScene = this.sceneManager.getCurrentScene();
      if (activeScene) {
        activeScene.update(delta, elapsed);
        this.renderer.render(activeScene.scene, activeScene.camera);
      }
    };

    loop();
  }

  public getSceneManager(): SceneManager {
    return this.sceneManager;
  }

  public destroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.sceneManager.destroy();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
