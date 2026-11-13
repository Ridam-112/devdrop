import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../audio/SoundManager';

export const MainMenu: React.FC = () => {
  const { setView, openModal, fps } = useGameStore();

  const handlePlayWithAI = () => {
    SoundManager.init();
    SoundManager.playClick();
    SoundManager.playChamberBell();
    setView('PLAYING');
  };

  const handleOpenModal = (modal: 'SETTINGS' | 'CONTROLS' | 'CREDITS' | 'CUSTOMIZATION') => {
    SoundManager.init();
    SoundManager.playClick();
    openModal(modal);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '40px 24px',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        pointerEvents: 'auto',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          color: '#facc15',
          padding: '6px 20px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '14px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
        }}>
          <span>🏛️</span> Lok Bhavan • Monsoon Session 2026
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(40px, 6.5vw, 72px)',
          fontWeight: 900,
          letterSpacing: '3px',
          background: 'linear-gradient(180deg, #ffffff 0%, #fde68a 50%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 8px 32px rgba(0,0,0,0.85)',
          lineHeight: 1.1,
          marginBottom: '8px',
        }}>
          PARLIAMENT KAAND
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2.2vw, 20px)',
          color: '#facc15',
          fontStyle: 'italic',
          fontFamily: 'var(--font-serif)',
          letterSpacing: '1px',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          fontWeight: 700,
          marginBottom: '4px',
        }}>
          "Order! Order! ...Wait, What Is Happening?"
        </p>

        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          maxWidth: '560px',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          fontWeight: 500,
        }}>
          A 3D comedy chaos simulator inspired by the Indian Parliament. Experience the grandeur, the benches, and the glorious anarchy!
        </p>
      </div>

      {/* Main Menu Action Buttons (Phase 2 Specifications) */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* 1. Play with AI (Enters Parliament Environment Test Experience) */}
        <button
          className="btn-gold"
          style={{ width: '100%', fontSize: '16px', padding: '15px 20px' }}
          onClick={handlePlayWithAI}
        >
          <span style={{ fontSize: '20px' }}>🤖</span>
          <span>Play with AI (Enter Chamber)</span>
        </button>

        {/* 2. Character Customization (Coming Soon state) */}
        <button
          className="btn-secondary"
          style={{ width: '100%', fontSize: '14px', padding: '12px 18px', borderColor: 'rgba(56, 189, 248, 0.4)' }}
          onClick={() => handleOpenModal('CUSTOMIZATION')}
        >
          <span>👔</span>
          <span>Character Customization</span>
          <span style={{
            fontSize: '10px',
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            padding: '2px 6px',
            borderRadius: '4px',
            marginLeft: 'auto',
            fontWeight: 800,
          }}>
            SOON
          </span>
        </button>

        {/* 3 & 4. Settings & How to Play */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '10px 14px' }}
            onClick={() => handleOpenModal('SETTINGS')}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>

          <button
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '10px 14px' }}
            onClick={() => handleOpenModal('CONTROLS')}
          >
            <span>📜</span>
            <span>How to Play</span>
          </button>
        </div>

        <button
          className="btn-secondary"
          style={{ width: '100%', fontSize: '12px', padding: '8px 12px', opacity: 0.8 }}
          onClick={() => handleOpenModal('CREDITS')}
        >
          <span>⚖️ Satirical Disclaimer & Credits</span>
        </button>
      </div>

      {/* Bottom Telemetry Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        fontSize: '12px',
        color: '#94a3b8',
        pointerEvents: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: fps >= 50 ? '#22c55e' : '#eab308',
            boxShadow: `0 0 8px ${fps >= 50 ? '#22c55e' : '#eab308'}`,
          }} />
          <span>Three.js Engine: {fps} FPS</span>
        </div>

        <div>
          <span>Phase 2: 3D Environment Architecture • React + Vite</span>
        </div>
      </div>
    </div>
  );
};
