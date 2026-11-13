import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { SoundManager } from '../audio/SoundManager';
import { ChamberScene } from '../engine/scenes/ChamberScene';
import { InspectionViewpoint } from '../types/game';
import { MobileControls } from './MobileControls';

interface HUDProps {
  chamberScene: ChamberScene | null;
}

export const HUD: React.FC<HUDProps> = ({ chamberScene }) => {
  const { session, envStats, fps, view, setView, setViewpoint, openModal } = useGameStore();

  // Player live telemetry state
  const [stamina, setStamina] = useState(100);
  const [isSprinting, setIsSprinting] = useState(false);
  const [isCrouching, setIsCrouching] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [animState, setAnimState] = useState<string>('IDLE');
  const [nearbyInteractable, setNearbyInteractable] = useState<{ id: string; name: string; actionText: string } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<'THIRD_PERSON' | 'INSPECTION'>('THIRD_PERSON');

  // Phase 4: Physics Telemetry State
  const [physicsBodiesCount, setPhysicsBodiesCount] = useState(0);
  const [ragdollState, setRagdollState] = useState<'INACTIVE' | 'FALLING' | 'STABILIZING' | 'RECOVERING'>('INACTIVE');
  const [nearbyProp, setNearbyProp] = useState<{ id: string; name: string } | null>(null);
  const [heldProp, setHeldProp] = useState<{ id: string; name: string } | null>(null);

  // Detect mobile device or viewport reactively
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? (window.innerWidth <= 768 || ('ontouchstart' in window)) : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || ('ontouchstart' in window));
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Poll player and physics telemetry from chamberScene
  useEffect(() => {
    const timer = setInterval(() => {
      setIsMobile(window.innerWidth <= 768 || ('ontouchstart' in window));

      if (chamberScene) {
        const ctrl = chamberScene.playerController;
        if (ctrl) {
          setStamina(ctrl.stamina);
          setIsSprinting(ctrl.isSprinting);
          setIsCrouching(ctrl.isCrouching);
          setIsGrounded(ctrl.isGrounded);
          setAnimState(ctrl.animStateMachine.getState());
        }

        const im = chamberScene.interactionManager;
        if (im) {
          setNearbyInteractable(
            im.currentNearby
              ? { id: im.currentNearby.id, name: im.currentNearby.name, actionText: im.currentNearby.actionText }
              : null
          );
          setFeedbackMessage(im.feedbackMessage);
        }

        // Phase 4: Sync Physics & Ragdoll
        if (chamberScene.physicsWorld) {
          setPhysicsBodiesCount(chamberScene.physicsWorld.getActiveBodyCount());
        }
        if (chamberScene.playerRagdoll) {
          setRagdollState(chamberScene.playerRagdoll.state);
        }
        if (chamberScene.pickupThrowSystem) {
          const np = chamberScene.pickupThrowSystem.nearbyProp;
          setNearbyProp(np ? { id: np.id, name: np.name } : null);
          const hp = chamberScene.pickupThrowSystem.heldProp;
          setHeldProp(hp ? { id: hp.id, name: hp.name } : null);
        }

        setCameraMode(chamberScene.cameraMode);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [chamberScene]);

  const handleThrowPaper = () => {
    SoundManager.init();
    if (chamberScene) {
      chamberScene.throwPaperProjectile();
    }
  };

  const handleBangGavel = () => {
    SoundManager.init();
    if (chamberScene) {
      chamberScene.bangSpeakerGavel();
    }
  };

  const handleThumpDesk = () => {
    SoundManager.init();
    if (chamberScene) {
      chamberScene.thumpDesk();
    }
  };

  const handleInteract = () => {
    SoundManager.init();
    if (chamberScene) {
      chamberScene.interact();
    }
  };

  const handleRagdoll = () => {
    SoundManager.init();
    if (chamberScene) {
      chamberScene.triggerRagdoll();
    }
  };

  const handlePickupOrDrop = () => {
    SoundManager.init();
    if (chamberScene) {
      chamberScene.pickupOrDrop();
    }
  };

  const handleTogglePhysicsDebug = () => {
    if (chamberScene) {
      chamberScene.togglePhysicsDebug();
    }
  };

  const handleToggleCamera = () => {
    SoundManager.playClick();
    if (chamberScene) {
      chamberScene.toggleCameraMode();
      setCameraMode(chamberScene.cameraMode);
    }
  };

  const handleSelectViewpoint = (vp: InspectionViewpoint) => {
    SoundManager.playClick();
    if (chamberScene) {
      chamberScene.setViewpoint(vp);
    } else {
      setViewpoint(vp);
    }
  };

  const handlePause = () => {
    SoundManager.playClick();
    setView(view === 'PAUSED' ? 'PLAYING' : 'PAUSED');
  };

  const handleExitToMenu = () => {
    SoundManager.playClick();
    setView('MENU');
  };

  const viewpoints: { id: InspectionViewpoint; label: string; icon: string; shortcut: string }[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: '🌐', shortcut: '1' },
    { id: 'SPEAKER', label: 'Speaker Dais', icon: '🏛️', shortcut: '2' },
    { id: 'TREASURY', label: 'Treasury Benches', icon: '🔴', shortcut: '3' },
    { id: 'OPPOSITION', label: 'Opposition', icon: '🔵', shortcut: '4' },
    { id: 'GALLERY', label: 'Press Gallery', icon: '📰', shortcut: '5' },
    { id: 'ENTRANCE', label: 'Main Entrance', icon: '🚪', shortcut: '6' },
  ];

  const decorumColor = session.decorumLevel > 60 ? '#22c55e' : (session.decorumLevel > 30 ? '#facc15' : '#ef4444');
  const chaosColor = session.chaosMeter > 60 ? '#ef4444' : (session.chaosMeter > 30 ? '#f59e0b' : '#38bdf8');

  // Format Movement State Badge
  let stateLabel = '🧍 IDLE';
  let stateColor = '#64748b';

  if (ragdollState !== 'INACTIVE') {
    stateLabel = `💥 RAGDOLL (${ragdollState})`;
    stateColor = '#ef4444';
  } else if (!isGrounded) {
    stateLabel = '🦘 IN AIR (JUMP)';
    stateColor = '#ec4899';
  } else if (isCrouching) {
    stateLabel = animState === 'CROUCH_WALK' ? '🧘 CROUCH SNEAK' : '🧘 CROUCH IDLE';
    stateColor = '#3b82f6';
  } else if (isSprinting && animState === 'SPRINT') {
    stateLabel = '⚡ SPRINTING';
    stateColor = '#f59e0b';
  } else if (animState === 'RUN') {
    stateLabel = '🏃 RUNNING';
    stateColor = '#22c55e';
  } else if (animState === 'WALK') {
    stateLabel = '🚶 WALKING';
    stateColor = '#0ea5e9';
  } else if (animState === 'INTERACT') {
    stateLabel = '✋ INTERACTING';
    stateColor = '#a855f7';
  }

  const staminaColor = stamina > 45 ? '#22c55e' : stamina > 20 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {/* Top Telemetry & Player Info Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        flexWrap: 'wrap',
      }}>
        {/* Left: Decorum / Chaos Panels & Player MP Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Decorum & Chaos Bars */}
          <div className="glass-panel" style={{
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            pointerEvents: 'auto',
          }}>
            {/* Decorum */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, marginBottom: '4px', color: '#94a3b8' }}>
                <span>⚖️ DECORUM</span>
                <strong style={{ color: decorumColor }}>{session.decorumLevel}%</strong>
              </div>
              <div style={{ width: '110px', height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${session.decorumLevel}%`,
                  height: '100%',
                  background: decorumColor,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>

            {/* Chaos Meter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, marginBottom: '4px', color: '#94a3b8' }}>
                <span>🔥 CHAOS METER</span>
                <strong style={{ color: chaosColor }}>{session.chaosMeter}%</strong>
              </div>
              <div style={{ width: '110px', height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${session.chaosMeter}%`,
                  height: '100%',
                  background: chaosColor,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          </div>

          {/* Phase 3 & 4: Player MP Profile & Stamina Bar */}
          <div className="glass-panel player-card" style={{
            padding: '8px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            pointerEvents: 'auto',
            minWidth: '220px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>👔</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#facc15' }}>
                    Hon'ble MP Rajesh Sharma
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                    Jan Kalyan Front (JKF)
                  </div>
                </div>
              </div>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${stateColor}`,
                color: stateColor,
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}>
                {stateLabel}
              </span>
            </div>

            {/* Stamina Meter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 800, color: '#cbd5e1', marginBottom: '2px' }}>
                <span>⚡ STAMINA</span>
                <span style={{ color: staminaColor }}>{Math.round(stamina)}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${stamina}%`,
                  height: '100%',
                  background: staminaColor,
                  transition: 'width 0.15s ease',
                  boxShadow: `0 0 6px ${staminaColor}`,
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Active Bill Banner */}
        <div className="glass-panel" style={{
          padding: '8px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'auto',
          maxWidth: '440px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#facc15', letterSpacing: '1px' }}>
            📜 ACTIVE LEGISLATION UNDER DEBATE
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
            {session.activeBillName}
          </span>
        </div>

        {/* Right: Camera Mode Switcher + Dev Stats + Pause */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'auto' }}>
          {/* Camera Mode Toggle */}
          <button
            className="btn-secondary camera-mode-btn"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              borderColor: cameraMode === 'THIRD_PERSON' ? '#38bdf8' : '#facc15',
              color: cameraMode === 'THIRD_PERSON' ? '#38bdf8' : '#facc15',
            }}
            onClick={handleToggleCamera}
            title="Press 'V' to toggle camera mode"
          >
            {cameraMode === 'THIRD_PERSON' ? '🎥 3rd-Person MP (V)' : '🌐 Free Orbit (V)'}
          </button>

          {/* Environment & Rapier 3D Stats Panel */}
          <div className="glass-panel" style={{
            padding: '6px 10px',
            fontSize: '10px',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
              <span>Render:</span>
              <strong style={{ color: '#38bdf8' }}>{envStats.triangles.toLocaleString()} Tris</strong>
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
              <span>Engine:</span>
              <strong style={{ color: fps >= 50 ? '#22c55e' : '#f59e0b' }}>{fps} FPS</strong>
            </div>
            {physicsBodiesCount > 0 && (
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                <span>Rapier:</span>
                <strong style={{ color: '#a855f7' }}>{physicsBodiesCount} Bodies</strong>
              </div>
            )}
          </div>

          <button
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12px' }}
            onClick={handlePause}
          >
            {view === 'PAUSED' ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        </div>
      </div>

      {/* Middle Center: Feedback Message, Interaction Prompt, or Pickup/Throw Prompt */}
      <div style={{
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none',
      }}>
        {/* Interaction Feedback Toast */}
        {feedbackMessage && (
          <div
            className="feedback-toast"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
              border: '2px solid #facc15',
              borderRadius: '24px',
              padding: '8px 22px',
              color: '#fef08a',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.5px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 16px rgba(250, 204, 21, 0.3)',
              textAlign: 'center',
              pointerEvents: 'auto',
            }}
          >
            {feedbackMessage}
          </div>
        )}

        {/* Phase 4: Held Object Action Prompt */}
        {heldProp && (
          <div
            className="held-prop-prompt"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92))',
              border: '2px solid #38bdf8',
              borderRadius: '24px',
              padding: '7px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
              pointerEvents: 'auto',
            }}
          >
            <span style={{ fontSize: '14px' }}>📦</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
              Holding: <span style={{ color: '#38bdf8' }}>{heldProp.name}</span>
            </span>
            <kbd style={{
              background: '#0284c7',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 800,
              marginLeft: '4px',
            }}>
              Click to Throw
            </kbd>
            <kbd style={{
              background: '#334155',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 800,
            }}>
              F to Drop
            </kbd>
          </div>
        )}

        {/* Phase 4: Proximity Pickup Prompt */}
        {!heldProp && nearbyProp && (
          <div
            className="pickup-prompt"
            onClick={handlePickupOrDrop}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92))',
              border: '2px solid #38bdf8',
              borderRadius: '24px',
              padding: '7px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            <kbd style={{
              background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
              color: '#0f172a',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 900,
            }}>
              F
            </kbd>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
              Pick Up {nearbyProp.name}
            </span>
          </div>
        )}

        {/* Proximity Interaction Prompt */}
        {nearbyInteractable && (
          <div
            className="interaction-prompt"
            onClick={handleInteract}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92))',
              border: '2px solid #f59e0b',
              borderRadius: '24px',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.7), 0 0 18px rgba(245, 158, 11, 0.4)',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            <kbd style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#0f172a',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 900,
            }}>
              E
            </kbd>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
                {nearbyInteractable.actionText}
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                {nearbyInteractable.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Viewpoints Inspector Toolbar + Action Hotbar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Environment Inspection Viewpoint Bar */}
        <div className="glass-panel" style={{
          padding: '6px 14px',
          display: 'flex',
          gap: '8px',
          pointerEvents: 'auto',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#facc15', marginRight: '4px' }}>
            📷 INSPECTION VIEW:
          </span>
          {viewpoints.map((vp) => {
            const isActive = session.activeViewpoint === vp.id && cameraMode === 'INSPECTION';
            return (
              <button
                key={vp.id}
                onClick={() => handleSelectViewpoint(vp.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#0f172a' : '#e2e8f0',
                  border: isActive ? '1px solid #fde68a' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '4px 9px',
                  fontSize: '11px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{vp.icon}</span>
                <span>{vp.label}</span>
                <kbd style={{
                  fontSize: '9px',
                  background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
                  padding: '1px 3px',
                  borderRadius: '3px',
                }}>
                  {vp.shortcut}
                </kbd>
              </button>
            );
          })}
        </div>

        {/* Action Buttons Hotbar */}
        <div className="glass-panel" style={{
          padding: '8px 14px',
          display: 'flex',
          gap: '8px',
          pointerEvents: 'auto',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {/* Phase 4: Ragdoll Activation Button */}
          <button
            className="btn-secondary ragdoll-btn"
            style={{ fontSize: '12px', padding: '8px 14px', borderColor: '#c084fc', color: '#c084fc' }}
            onClick={handleRagdoll}
            title="Press 'R' or 'K' to Ragdoll Fall"
          >
            <span>💥 Ragdoll Fall (R)</span>
          </button>

          {/* Phase 4: Pick Up / Drop Button */}
          <button
            className="btn-secondary pickup-btn"
            style={{ fontSize: '12px', padding: '8px 14px', borderColor: '#38bdf8', color: '#38bdf8' }}
            onClick={handlePickupOrDrop}
            title="Press 'F' to Pick Up or Drop"
          >
            <span>📦 {heldProp ? 'Drop Item (F)' : 'Pick Up (F)'}</span>
          </button>

          <button
            className="btn-gold"
            style={{ fontSize: '12px', padding: '8px 14px' }}
            onClick={handleThrowPaper}
            title="Press 'P' to Throw Paper"
          >
            <span>✈️ Throw Paper (P)</span>
          </button>

          <button
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 14px', borderColor: '#facc15' }}
            onClick={handleBangGavel}
            title="Press 'G' to Bang Gavel"
          >
            <span>🔨 Speaker's Gavel (G)</span>
          </button>

          <button
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 14px' }}
            onClick={handleThumpDesk}
            title="Press 'T' to Thump Desk"
          >
            <span>👊 Desk Thump (T)</span>
          </button>

          {/* Phase 4: Toggle Physics Debug View */}
          <button
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 14px', borderColor: '#a855f7', color: '#e9d5ff' }}
            onClick={handleTogglePhysicsDebug}
            title="Press 'F3' to toggle Rapier physics wireframe debug"
          >
            <span>🩺 Debug (F3)</span>
          </button>

          {nearbyInteractable && (
            <button
              className="btn-gold"
              style={{ fontSize: '12px', padding: '8px 14px', background: 'linear-gradient(135deg, #10b981, #059669)' }}
              onClick={handleInteract}
              title="Press 'E' to Interact"
            >
              <span>✋ Interact (E)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Controls Overlay (shown on mobile viewports) */}
      {isMobile && chamberScene && (
        <MobileControls
          onMove={(x, y) => chamberScene.playerController.setMobileMove(x, y)}
          onCameraRotate={(dx, dy) => chamberScene.thirdPersonCamera.rotate(dx, dy)}
          onJump={() => chamberScene.playerController.triggerJump()}
          onSprintToggle={(s) => chamberScene.playerController.setSprinting(s)}
          onCrouchToggle={() => chamberScene.playerController.toggleCrouch()}
          onInteract={handleInteract}
          onRagdoll={handleRagdoll}
          onPickup={handlePickupOrDrop}
          canInteract={!!nearbyInteractable}
          canPickup={!!nearbyProp || !!heldProp}
          isSprinting={isSprinting}
          isCrouching={isCrouching}
        />
      )}

      {/* Paused Overlay Modal */}
      {view === 'PAUSED' && (
        <div className="modal-backdrop" style={{ pointerEvents: 'auto' }}>
          <div className="glass-panel modal-content" style={{ padding: '30px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#facc15', marginBottom: '8px' }}>
              CHAMBER ADJOURNED (PAUSED)
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '24px' }}>
              The House stands temporarily adjourned.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-gold" onClick={handlePause}>
                <span>▶️ Resume Session</span>
              </button>
              <button className="btn-secondary" onClick={() => openModal('SETTINGS')}>
                <span>⚙️ Settings</span>
              </button>
              <button className="btn-secondary" onClick={() => openModal('CONTROLS')}>
                <span>📜 How to Play</span>
              </button>
              <button
                className="btn-secondary"
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                onClick={handleExitToMenu}
              >
                <span>🚪 Exit to Main Menu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
