import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../audio/SoundManager';
import { AnimationState } from '../character/AnimationStateMachine';
import { InteractableObject } from '../interaction/InteractionManager';

interface PlayerHUDProps {
  playerName: string;
  partyName: string;
  stamina: number;
  maxStamina: number;
  animState: AnimationState;
  isCrouching: boolean;
  isSprinting: boolean;
  isGrounded: boolean;
  nearbyInteractable: InteractableObject | null;
  feedbackMessage: string | null;
  cameraMode: 'THIRD_PERSON' | 'INSPECTION';
  onToggleCameraMode: () => void;
  onInteract: () => void;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  playerName,
  partyName,
  stamina,
  maxStamina,
  animState,
  isCrouching,
  isSprinting,
  isGrounded,
  nearbyInteractable,
  feedbackMessage,
  cameraMode,
  onToggleCameraMode,
  onInteract,
}) => {
  const { view, setView } = useGameStore();

  const handlePause = () => {
    SoundManager.playClick();
    setView(view === 'PAUSED' ? 'PLAYING' : 'PAUSED');
  };

  const staminaPercent = Math.max(0, Math.min(100, (stamina / maxStamina) * 100));
  const staminaColor =
    staminaPercent > 45 ? '#22c55e' : staminaPercent > 20 ? '#f59e0b' : '#ef4444';

  // Format Movement State Badge
  let stateLabel = '🧍 IDLE';
  let stateBg = 'rgba(100, 116, 139, 0.25)';
  let stateBorder = '#64748b';

  if (!isGrounded) {
    stateLabel = '🦘 IN AIR (JUMP)';
    stateBg = 'rgba(236, 72, 153, 0.25)';
    stateBorder = '#ec4899';
  } else if (isCrouching) {
    stateLabel = animState === 'CROUCH_WALK' ? '🧘 CROUCH SNEAK' : '🧘 CROUCH IDLE';
    stateBg = 'rgba(59, 130, 246, 0.25)';
    stateBorder = '#3b82f6';
  } else if (isSprinting && animState === 'SPRINT') {
    stateLabel = '⚡ SPRINTING';
    stateBg = 'rgba(245, 158, 11, 0.35)';
    stateBorder = '#f59e0b';
  } else if (animState === 'RUN') {
    stateLabel = '🏃 RUNNING';
    stateBg = 'rgba(34, 197, 94, 0.25)';
    stateBorder = '#22c55e';
  } else if (animState === 'WALK') {
    stateLabel = '🚶 WALKING';
    stateBg = 'rgba(14, 165, 233, 0.25)';
    stateBorder = '#0ea5e9';
  } else if (animState === 'INTERACT') {
    stateLabel = '✋ INTERACTING';
    stateBg = 'rgba(168, 85, 247, 0.3)';
    stateBorder = '#a855f7';
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Top Header: Player Profile Card + Camera Switcher + Pause */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Left: Player Profile & Stamina Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '10px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'auto',
            minWidth: '240px',
          }}
        >
          {/* Identity & Party */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>👔</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#facc15' }}>
                {playerName}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                {partyName}
              </div>
            </div>
          </div>

          {/* Stamina Meter */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                fontWeight: 800,
                color: '#cbd5e1',
                marginBottom: '3px',
              }}
            >
              <span>⚡ STAMINA</span>
              <span style={{ color: staminaColor }}>{Math.round(staminaPercent)}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '7px',
                background: '#0f172a',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                style={{
                  width: `${staminaPercent}%`,
                  height: '100%',
                  background: staminaColor,
                  transition: 'width 0.15s ease',
                  boxShadow: `0 0 8px ${staminaColor}`,
                }}
              />
            </div>
          </div>

          {/* Movement State Pill */}
          <div
            style={{
              alignSelf: 'flex-start',
              background: stateBg,
              border: `1px solid ${stateBorder}`,
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            {stateLabel}
          </div>
        </div>

        {/* Center: Interaction Feedback Toast Notification */}
        {feedbackMessage && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
              border: '2px solid #facc15',
              borderRadius: '24px',
              padding: '10px 24px',
              color: '#fef08a',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.5px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 16px rgba(250, 204, 21, 0.3)',
              animation: 'bounce 0.4s ease',
              maxWidth: '520px',
              textAlign: 'center',
              pointerEvents: 'auto',
            }}
          >
            {feedbackMessage}
          </div>
        )}

        {/* Right: Camera Mode Switcher & Pause Button */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'auto' }}>
          <button
            onClick={onToggleCameraMode}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              borderColor: cameraMode === 'THIRD_PERSON' ? '#38bdf8' : '#facc15',
            }}
            title="Toggle between 3rd-Person MP Follow and Free Inspection Camera"
          >
            {cameraMode === 'THIRD_PERSON' ? '🎥 3rd-Person MP' : '🌐 Inspection Orbit'}
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '12px' }}
            onClick={handlePause}
          >
            {view === 'PAUSED' ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        </div>
      </div>

      {/* Center-Bottom: Active Proximity Interaction Prompt */}
      {nearbyInteractable && (
        <div
          style={{
            alignSelf: 'center',
            marginBottom: '36px',
            pointerEvents: 'auto',
          }}
        >
          <div
            onClick={onInteract}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92))',
              border: '2px solid #f59e0b',
              borderRadius: '30px',
              padding: '10px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.7), 0 0 18px rgba(245, 158, 11, 0.4)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <kbd
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#0f172a',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 900,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              E
            </kbd>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                {nearbyInteractable.actionText}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                {nearbyInteractable.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
