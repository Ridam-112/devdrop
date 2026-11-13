import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../audio/SoundManager';

export const ControlsModal: React.FC = () => {
  const { closeModal } = useGameStore();

  const handleClose = () => {
    SoundManager.playClick();
    closeModal();
  };

  const controlsList = [
    { key: 'WASD / Arrows', desc: 'Move your MP around the chamber' },
    { key: 'Shift (Hold)', desc: 'Sprint across the aisle (uses Stamina)' },
    { key: 'Spacebar', desc: 'Jump over obstacles / steps' },
    { key: 'F Key', desc: 'Pick up / drop interactive props (bottles, files, chairs)' },
    { key: 'Left Click', desc: 'Throw held object with physics impulse' },
    { key: 'E Key', desc: 'Interact (Bell, Gavel, Golden Mace, Desks)' },
    { key: 'R / K Key', desc: 'Trigger comedic ragdoll fall (recovers automatically)' },
    { key: 'C Key', desc: 'Crouch & sneak behind benches' },
    { key: 'V Key', desc: 'Toggle 3rd-Person Follow / Free Orbit Camera' },
    { key: 'F3', desc: 'Toggle Rapier 3D physics wireframe debug viewer' },
    { key: 'Mouse Drag', desc: 'Rotate camera around character / chamber' },
    { key: 'Mouse Wheel', desc: 'Zoom camera distance in / out' },
    { key: 'Esc', desc: 'Pause or resume parliamentary proceedings' },
  ];

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="glass-panel modal-content"
        style={{ padding: '32px', maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#facc15' }}>
            🎮 PARLIAMENTARY RULES & CONTROLS
          </h2>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>
          Experience the physical chaos of democracy! Knock over water bottles, throw legislative dossiers across the aisle, or take a hilarious tumble into ragdoll physics!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {controlsList.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <kbd style={{
                background: '#1e293b',
                color: '#facc15',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: 800,
                border: '1px solid rgba(245, 158, 11, 0.4)',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
              }}>
                {c.key}
              </kbd>
              <span style={{ fontSize: '12px', color: '#e2e8f0', textAlign: 'right', marginLeft: '12px' }}>
                {c.desc}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-gold" style={{ padding: '10px 24px', fontSize: '13px' }} onClick={handleClose}>
            <span>Understood</span>
          </button>
        </div>
      </div>
    </div>
  );
};
