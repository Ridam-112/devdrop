import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../audio/SoundManager';

export const CustomizationModal: React.FC = () => {
  const { closeModal } = useGameStore();

  const handleClose = () => {
    SoundManager.playClick();
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="glass-panel modal-content"
        style={{ padding: '34px', maxWidth: '480px', width: '100%', textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>👔</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#facc15', marginBottom: '6px' }}>
          CHARACTER CUSTOMIZATION
        </h2>
        <span style={{
          display: 'inline-block',
          background: 'rgba(56, 189, 248, 0.15)',
          color: '#38bdf8',
          border: '1px solid #38bdf8',
          padding: '3px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '1px',
          marginBottom: '16px',
        }}>
          COMING SOON IN PHASE 3
        </span>

        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Customize your Member of Parliament! Choose signature Khadi kurtas, colorful Nehru jackets, traditional stoles, oversized spectacles, and party badges in the upcoming Character Architecture phase.
        </p>

        <button className="btn-gold" style={{ padding: '10px 28px', fontSize: '13px' }} onClick={handleClose}>
          <span>Understood</span>
        </button>
      </div>
    </div>
  );
};
