import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../audio/SoundManager';
import { GraphicsPreset } from '../types/game';

export const SettingsModal: React.FC = () => {
  const { settings, updateSettings, closeModal } = useGameStore();

  const handleClose = () => {
    SoundManager.playClick();
    closeModal();
  };

  const handleQualityChange = (q: GraphicsPreset) => {
    SoundManager.playClick();
    updateSettings({ graphicsQuality: q });
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="glass-panel modal-content"
        style={{ padding: '32px', maxWidth: '480px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#facc15' }}>
            ⚙️ CHAMBER SETTINGS
          </h2>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Master Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span>🔊 Master Volume</span>
              <strong style={{ color: '#facc15' }}>{Math.round(settings.masterVolume * 100)}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => {
                updateSettings({ masterVolume: parseFloat(e.target.value) });
                SoundManager.applyStoreSettings();
              }}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span>📢 Sound Effects Volume</span>
              <strong style={{ color: '#facc15' }}>{Math.round(settings.sfxVolume * 100)}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => {
                updateSettings({ sfxVolume: parseFloat(e.target.value) });
                SoundManager.applyStoreSettings();
              }}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          {/* Mute Audio */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px' }}>🔇 Mute All Audio</span>
            <input
              type="checkbox"
              checked={settings.muted}
              onChange={(e) => {
                updateSettings({ muted: e.target.checked });
                SoundManager.applyStoreSettings();
              }}
              style={{ width: '18px', height: '18px', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          {/* Graphics Preset */}
          <div>
            <span style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>🖥️ Graphics Quality</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['LOW', 'MEDIUM', 'HIGH'] as GraphicsPreset[]).map((q) => (
                <button
                  key={q}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    background: settings.graphicsQuality === q ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined,
                    color: settings.graphicsQuality === q ? '#0f172a' : undefined,
                    fontWeight: settings.graphicsQuality === q ? 800 : 600,
                  }}
                  onClick={() => handleQualityChange(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Sensitivity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span>🎥 Camera Sensitivity</span>
              <strong style={{ color: '#facc15' }}>{settings.cameraSensitivity.toFixed(1)}x</strong>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={settings.cameraSensitivity}
              onChange={(e) => updateSettings({ cameraSensitivity: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-gold" style={{ padding: '10px 24px', fontSize: '13px' }} onClick={handleClose}>
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
