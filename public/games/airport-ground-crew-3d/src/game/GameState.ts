export interface GameSaveData {
  cash: number;
  xp: number;
  level: number;
  unlockedMissions: number;
  completedMissions: number[];
  unlockedVehicles: string[];
  selectedVehicle: string;
  settings: {
    masterVolume: number;
    soundVolume: number;
    graphicsQuality: 'low' | 'medium' | 'high';
  };
}

const SAVE_KEY = 'airport_ground_crew_3d_save_v1';

export class GameState {
  cash: number = 500;
  xp: number = 0;
  level: number = 1;
  unlockedMissions: number = 1;
  completedMissions: Set<number> = new Set();
  unlockedVehicles: Set<string> = new Set(['baggage_tug']);
  selectedVehicle: string = 'baggage_tug';
  settings = {
    masterVolume: 1.0,
    soundVolume: 1.0,
    graphicsQuality: 'high' as 'low' | 'medium' | 'high'
  };

  constructor() {
    this.load();
  }

  addReward(cashEarned: number, xpEarned: number) {
    this.cash += cashEarned;
    this.xp += xpEarned;
    this.level = Math.floor(this.xp / 400) + 1;
    this.save();
  }

  unlockNextMission(currentMissionId: number) {
    this.completedMissions.add(currentMissionId);
    if (currentMissionId >= this.unlockedMissions) {
      this.unlockedMissions = currentMissionId + 1;
    }
    this.save();
  }

  unlockVehicle(vehicleId: string, cost: number): boolean {
    if (this.cash >= cost && !this.unlockedVehicles.has(vehicleId)) {
      this.cash -= cost;
      this.unlockedVehicles.add(vehicleId);
      this.selectedVehicle = vehicleId;
      this.save();
      return true;
    }
    return false;
  }

  save() {
    try {
      const data: GameSaveData = {
        cash: this.cash,
        xp: this.xp,
        level: this.level,
        unlockedMissions: this.unlockedMissions,
        completedMissions: Array.from(this.completedMissions),
        unlockedVehicles: Array.from(this.unlockedVehicles),
        selectedVehicle: this.selectedVehicle,
        settings: this.settings
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save game state', e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data: GameSaveData = JSON.parse(raw);
        this.cash = typeof data.cash === 'number' ? data.cash : 500;
        this.xp = typeof data.xp === 'number' ? data.xp : 0;
        this.level = typeof data.level === 'number' ? data.level : 1;
        this.unlockedMissions = typeof data.unlockedMissions === 'number' ? data.unlockedMissions : 1;
        if (Array.isArray(data.completedMissions)) {
          this.completedMissions = new Set(data.completedMissions);
        }
        if (Array.isArray(data.unlockedVehicles)) {
          this.unlockedVehicles = new Set(data.unlockedVehicles);
        }
        if (data.selectedVehicle) {
          this.selectedVehicle = data.selectedVehicle;
        }
        if (data.settings) {
          this.settings = { ...this.settings, ...data.settings };
        }
      }
    } catch (e) {
      console.warn('Failed to load game state', e);
    }
  }

  resetProgress() {
    localStorage.removeItem(SAVE_KEY);
    this.cash = 500;
    this.xp = 0;
    this.level = 1;
    this.unlockedMissions = 1;
    this.completedMissions.clear();
    this.unlockedVehicles = new Set(['baggage_tug']);
    this.selectedVehicle = 'baggage_tug';
    this.save();
  }
}
