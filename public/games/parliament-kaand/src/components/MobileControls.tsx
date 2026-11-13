import React, { useRef, useState } from 'react';

interface MobileControlsProps {
  onMove: (x: number, y: number) => void;
  onCameraRotate: (deltaX: number, deltaY: number) => void;
  onJump: () => void;
  onSprintToggle: (sprinting: boolean) => void;
  onCrouchToggle: () => void;
  onInteract: () => void;
  onPickup?: () => void;
  onRagdoll?: () => void;
  canInteract: boolean;
  canPickup?: boolean;
  isSprinting: boolean;
  isCrouching: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onCameraRotate,
  onJump,
  onSprintToggle,
  onCrouchToggle,
  onInteract,
  onPickup,
  onRagdoll,
  canInteract,
  canPickup,
  isSprinting,
  isCrouching,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });

  const rightTouchRef = useRef<{ id: number; lastX: number; lastY: number } | null>(null);

  // Handle Joystick Touch (Bottom Left)
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxDist = rect.width / 2;
    const dist = Math.min(maxDist, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const nx = (Math.cos(angle) * dist) / maxDist;
    const ny = (Math.sin(angle) * dist) / maxDist;

    setStickPos({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
    setJoystickActive(true);
    onMove(nx, ny);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!joystickActive || !joystickBaseRef.current) return;
    const touch = e.touches[0];
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxDist = rect.width / 2;
    const dist = Math.min(maxDist, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const nx = (Math.cos(angle) * dist) / maxDist;
    const ny = (Math.sin(angle) * dist) / maxDist;

    setStickPos({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
    onMove(nx, ny);
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setJoystickActive(false);
    setStickPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  // Handle Right Screen Swipe for Camera Rotation
  const handleCameraTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      rightTouchRef.current = {
        id: touch.identifier,
        lastX: touch.clientX,
        lastY: touch.clientY,
      };
    }
  };

  const handleCameraTouchMove = (e: React.TouchEvent) => {
    if (!rightTouchRef.current) return;
    const touch = Array.from(e.touches).find((t) => t.identifier === rightTouchRef.current!.id);
    if (!touch) return;

    const deltaX = touch.clientX - rightTouchRef.current.lastX;
    const deltaY = touch.clientY - rightTouchRef.current.lastY;

    rightTouchRef.current.lastX = touch.clientX;
    rightTouchRef.current.lastY = touch.clientY;

    onCameraRotate(deltaX, deltaY);
  };

  const handleCameraTouchEnd = () => {
    rightTouchRef.current = null;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 25,
        touchAction: 'none',
      }}
    >
      {/* Left: Virtual Joystick Zone */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '130px',
          height: '130px',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <div
          ref={joystickBaseRef}
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.45)',
            border: '2px solid rgba(250, 204, 21, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Inner Joystick Thumb */}
          <div
            style={{
              position: 'absolute',
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: joystickActive
                ? 'radial-gradient(circle, #fde68a, #f59e0b)'
                : 'radial-gradient(circle, #e2e8f0, #94a3b8)',
              border: '2px solid #ffffff',
              transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
              transition: joystickActive ? 'none' : 'transform 0.15s ease',
              boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </div>

      {/* Right Screen Half: Camera Swipe Touch Zone */}
      <div
        onTouchStart={handleCameraTouchStart}
        onTouchMove={handleCameraTouchMove}
        onTouchEnd={handleCameraTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '55%',
          height: '75%',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      />

      {/* Right Action Buttons Cluster */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
          pointerEvents: 'auto',
        }}
      >
        {/* Row 0: Ragdoll & Pickup */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onRagdoll && (
            <button
              onClick={onRagdoll}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: '2px solid #c4b5fd',
                color: '#ffffff',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Ragdoll Fall (R)"
            >
              💥
            </button>
          )}

          {canPickup && onPickup && (
            <button
              onClick={onPickup}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: '2px solid #fde68a',
                color: '#ffffff',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Pick Up / Drop (F)"
            >
              📦
            </button>
          )}
        </div>

        {/* Row 1: Interact & Sprint */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {canInteract && (
            <button
              onClick={onInteract}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: '2px solid #6ee7b7',
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)',
                cursor: 'pointer',
              }}
              title="Interact (E)"
            >
              ✋
            </button>
          )}

          <button
            onClick={() => onSprintToggle(!isSprinting)}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isSprinting
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : 'rgba(30, 41, 59, 0.8)',
              border: isSprinting ? '2px solid #fde68a' : '2px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              cursor: 'pointer',
            }}
            title="Sprint (Shift)"
          >
            ⚡
          </button>
        </div>

        {/* Row 2: Crouch & Jump */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCrouchToggle}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isCrouching
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(30, 41, 59, 0.8)',
              border: isCrouching ? '2px solid #93c5fd' : '2px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              cursor: 'pointer',
            }}
            title="Crouch (C)"
          >
            🧘
          </button>

          <button
            onClick={onJump}
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              border: '2px solid #fda4af',
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(225, 29, 72, 0.5)',
              cursor: 'pointer',
            }}
            title="Jump (Space)"
          >
            🦘
          </button>
        </div>
      </div>
    </div>
  );
};
