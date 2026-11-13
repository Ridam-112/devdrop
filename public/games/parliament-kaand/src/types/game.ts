export type GameView = 'MENU' | 'PLAYING' | 'PAUSED';

export type GraphicsPreset = 'LOW' | 'MEDIUM' | 'HIGH';

export type InspectionViewpoint = 'OVERVIEW' | 'SPEAKER' | 'TREASURY' | 'OPPOSITION' | 'GALLERY' | 'ENTRANCE';

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
  graphicsQuality: GraphicsPreset;
  shadows: boolean;
  particles: boolean;
  cameraSensitivity: number;
}

export interface ChamberSessionState {
  decorumLevel: number;
  chaosMeter: number;
  speakerPatience: number;
  activeBillName: string;
  sessionTimeSeconds: number;
  marshalsDeployed: boolean;
  flyingObjectsCount: number;
  activeViewpoint: InspectionViewpoint;
}

export interface EnvironmentStats {
  triangles: number;
  geometries: number;
  textures: number;
  drawCalls: number;
  fps: number;
}
