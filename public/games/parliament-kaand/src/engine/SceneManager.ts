import { BaseScene } from './scenes/BaseScene';
import { MenuScene } from './scenes/MenuScene';
import { ChamberScene } from './scenes/ChamberScene';
import { GameView } from '../types/game';

export class SceneManager {
  private currentScene: BaseScene | null = null;
  private currentSceneType: GameView | null = null;

  public async switchScene(type: GameView): Promise<BaseScene> {
    if (this.currentSceneType === type && this.currentScene) {
      return this.currentScene;
    }

    if (this.currentScene) {
      this.currentScene.destroy();
      this.currentScene = null;
    }

    let newScene: BaseScene;
    if (type === 'PLAYING' || type === 'PAUSED') {
      newScene = new ChamberScene();
    } else {
      newScene = new MenuScene();
    }

    await newScene.init();
    this.currentScene = newScene;
    this.currentSceneType = type;

    return newScene;
  }

  public getCurrentScene(): BaseScene | null {
    return this.currentScene;
  }

  public getChamberScene(): ChamberScene | null {
    if (this.currentScene instanceof ChamberScene) {
      return this.currentScene;
    }
    return null;
  }

  public destroy(): void {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.currentScene = null;
      this.currentSceneType = null;
    }
  }
}
