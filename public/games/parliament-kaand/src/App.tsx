import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { ChamberScene } from './engine/scenes/ChamberScene';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { SettingsModal } from './components/SettingsModal';
import { ControlsModal } from './components/ControlsModal';
import { CreditsModal } from './components/CreditsModal';
import { CustomizationModal } from './components/CustomizationModal';

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [chamberScene, setChamberScene] = useState<ChamberScene | null>(null);

  const { view, activeModal } = useGameStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Game Engine
    const engine = new GameEngine(containerRef.current);
    engineRef.current = engine;

    // Periodically sync active chamber scene reference for HUD
    const interval = setInterval(() => {
      if (engineRef.current) {
        const scene = engineRef.current.getSceneManager().getChamberScene();
        setChamberScene(scene);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: view === 'PLAYING' ? 'grab' : 'default' }}
      />

      {/* React UI Overlays */}
      {view === 'MENU' && <MainMenu />}
      {(view === 'PLAYING' || view === 'PAUSED') && <HUD chamberScene={chamberScene} />}

      {/* Modals */}
      {activeModal === 'SETTINGS' && <SettingsModal />}
      {activeModal === 'CONTROLS' && <ControlsModal />}
      {activeModal === 'CREDITS' && <CreditsModal />}
      {activeModal === 'CUSTOMIZATION' && <CustomizationModal />}
    </div>
  );
};
