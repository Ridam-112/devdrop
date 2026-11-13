import Phaser from 'phaser';
import { SCENE_KEYS } from '../game/GameConstants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  preload(): void {
    // Basic setup if any required before asset loading
  }

  create(): void {
    this.scene.start(SCENE_KEYS.PRELOAD);
  }
}
