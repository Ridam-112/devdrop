import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../audio/SoundManager';

export const CreditsModal: React.FC = () => {
  const { closeModal } = useGameStore();

  const handleClose = () => {
    SoundManager.playClick();
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="glass-panel modal-content"
        style={{ padding: '32px', maxWidth: '480px', width: '100%', textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>🏛️</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#facc15', marginBottom: '6px' }}>
          PARLIAMENT KAAND
        </h2>
        <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 800, letterSpacing: '1px' }}>
          3D COMEDY CHAOS SIMULATOR
        </span>

        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '12px',
          padding: '16px',
          margin: '20px 0',
          fontSize: '12px',
          lineHeight: 1.6,
          color: '#cbd5e1',
          textAlign: 'left',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <p style={{ marginBottom: '8px' }}>
            ⚖️ <strong>Satirical Disclaimer:</strong> All characters, political parties (*RPD*, *JKF*, *GSP*), bills, and dialogue in Parliament Kaand are 100% fictional works of parody and political satire.
          </p>
          <p>
            🚀 <strong>Technology Stack:</strong> Built using React 18, TypeScript, Three.js, Rapier 3D Physics (`@dimforge/rapier3d-compat`), Zustand, and Howler.js.
          </p>
        </div>

        <button className="btn-gold" style={{ padding: '10px 28px', fontSize: '13px' }} onClick={handleClose}>
          <span>Close</span>
        </button>
      </div>
    </div>
  );
};
