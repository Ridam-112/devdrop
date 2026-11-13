import { create } from 'zustand';
import { GameView, GameSettings, ChamberSessionState, InspectionViewpoint, EnvironmentStats } from '../types/game';

interface GameStore {
  view: GameView;
  activeModal: 'SETTINGS' | 'CONTROLS' | 'CREDITS' | 'CUSTOMIZATION' | null;
  settings: GameSettings;
  session: ChamberSessionState;
  envStats: EnvironmentStats;
  fps: number;
  
  // Actions
  setView: (view: GameView) => void;
  openModal: (modal: 'SETTINGS' | 'CONTROLS' | 'CREDITS' | 'CUSTOMIZATION' | null) => void;
  closeModal: () => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  setFps: (fps: number) => void;
  setEnvStats: (stats: Partial<EnvironmentStats>) => void;
  setViewpoint: (vp: InspectionViewpoint) => void;
  resetSession: () => void;
  adjustDecorum: (amount: number) => void;
  addChaos: (amount: number) => void;
  incrementFlyingObjects: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  view: 'MENU',
  activeModal: null,
  fps: 60,
  envStats: {
    triangles: 0,
    geometries: 0,
    textures: 0,
    drawCalls: 0,
    fps: 60,
  },
  settings: {
    masterVolume: 0.8,
    musicVolume: 0.7,
    sfxVolume: 0.9,
    muted: false,
    graphicsQuality: 'HIGH',
    shadows: true,
    particles: true,
    cameraSensitivity: 1.0,
  },
  session: {
    decorumLevel: 85,
    chaosMeter: 15,
    speakerPatience: 90,
    activeBillName: 'The National Samosa Subsidy & Chai Decorum Bill, 2026',
    sessionTimeSeconds: 0,
    marshalsDeployed: false,
    flyingObjectsCount: 0,
    activeViewpoint: 'OVERVIEW',
  },

  setView: (view) => set({ view, activeModal: null }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  
  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),

  setFps: (fps) => set((state) => ({ fps, envStats: { ...state.envStats, fps } })),
  setEnvStats: (stats) => set((state) => ({ envStats: { ...state.envStats, ...stats } })),

  setViewpoint: (vp) =>
    set((state) => ({
      session: { ...state.session, activeViewpoint: vp },
    })),

  resetSession: () =>
    set({
      session: {
        decorumLevel: 85,
        chaosMeter: 15,
        speakerPatience: 90,
        activeBillName: 'The National Samosa Subsidy & Chai Decorum Bill, 2026',
        sessionTimeSeconds: 0,
        marshalsDeployed: false,
        flyingObjectsCount: 0,
        activeViewpoint: 'OVERVIEW',
      },
    }),

  adjustDecorum: (amount) =>
    set((state) => {
      const nextDecorum = Math.max(0, Math.min(100, state.session.decorumLevel + amount));
      const nextChaos = 100 - nextDecorum;
      return {
        session: {
          ...state.session,
          decorumLevel: nextDecorum,
          chaosMeter: nextChaos,
          marshalsDeployed: nextChaos > 70,
        },
      };
    }),

  addChaos: (amount) =>
    set((state) => {
      const nextChaos = Math.max(0, Math.min(100, state.session.chaosMeter + amount));
      const nextDecorum = 100 - nextChaos;
      return {
        session: {
          ...state.session,
          chaosMeter: nextChaos,
          decorumLevel: nextDecorum,
          marshalsDeployed: nextChaos > 70,
        },
      };
    }),

  incrementFlyingObjects: () =>
    set((state) => ({
      session: {
        ...state.session,
        flyingObjectsCount: state.session.flyingObjectsCount + 1,
      },
    })),
}));
