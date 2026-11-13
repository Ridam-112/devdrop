import { GAME_STATES } from './GameConstants';

export interface PlayerRunStats {
  distance: number;
  score: number;
  coins: number;
  speed: number;
  engineHealth: number;
  engineTemp: number;
  waterDepth: number;
  potholesHit: number;
  busesAvoided: number;
  nearMisses: number;
  causeOfDeath: string;
}

export class GameStateManager {
  private static instance: GameStateManager;
  public currentState: keyof typeof GAME_STATES = 'BOOT';

  // Persistent Player Profile
  public highDistance: number = 0;
  public highScore: number = 0;
  public totalCoins: number = 150;
  public selectedVehicleId: string = 'old_chetak';
  public unlockedVehicles: string[] = ['old_chetak'];

  // Active Run Stats
  public runStats: PlayerRunStats = {
    distance: 0,
    score: 0,
    coins: 0,
    speed: 0,
    engineHealth: 100,
    engineTemp: 40,
    waterDepth: 1,
    potholesHit: 0,
    busesAvoided: 0,
    nearMisses: 0,
    causeOfDeath: ''
  };

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  public resetRun(): void {
    this.runStats = {
      distance: 0,
      score: 0,
      coins: 0,
      speed: 0,
      engineHealth: 100,
      engineTemp: 40,
      waterDepth: 1,
      potholesHit: 0,
      busesAvoided: 0,
      nearMisses: 0,
      causeOfDeath: ''
    };
  }

  public saveToStorage(): void {
    try {
      const data = {
        highDistance: this.highDistance,
        highScore: this.highScore,
        totalCoins: this.totalCoins,
        selectedVehicleId: this.selectedVehicleId,
        unlockedVehicles: this.unlockedVehicles
      };
      localStorage.setItem('monsoon_mayhem_save_v1', JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('monsoon_mayhem_save_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.highDistance = parsed.highDistance || 0;
        this.highScore = parsed.highScore || 0;
        this.totalCoins = parsed.totalCoins ?? 150;
        this.selectedVehicleId = parsed.selectedVehicleId || 'old_chetak';
        this.unlockedVehicles = parsed.unlockedVehicles || ['old_chetak'];
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }
}
