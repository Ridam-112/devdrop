export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const SCENE_KEYS = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  MAIN_MENU: 'MainMenuScene',
  GAME: 'GameScene',
  GARAGE: 'GarageScene',
  DAILY_CHALLENGE: 'DailyChallengeScene',
  GAME_OVER: 'GameOverScene'
} as const;

export const GAME_STATES = {
  BOOT: 'BOOT',
  LOADING: 'LOADING',
  MAIN_MENU: 'MAIN_MENU',
  GARAGE: 'GARAGE',
  COUNTDOWN: 'COUNTDOWN',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  CRASHING: 'CRASHING',
  REPLAY: 'REPLAY',
  GAME_OVER: 'GAME_OVER'
} as const;

export const DEPTH_LAYERS = {
  SKY: 0,
  HORIZON_BG: 10,
  ROAD_BASE: 20,
  ROAD_CURB: 25,
  WATER_SURFACE: 30,
  ROAD_OBJECTS: 40,
  TRAFFIC: 50,
  PLAYER: 60,
  WATER_SPLASH: 70,
  WEATHER_RAIN: 80,
  HUD: 90,
  POPUPS: 100,
  MODALS: 110
} as const;
