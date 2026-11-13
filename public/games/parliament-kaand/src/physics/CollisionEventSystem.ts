import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PhysicsWorld } from './PhysicsWorld';
import { SoundManager } from '../audio/SoundManager';
import { useGameStore } from '../store/useGameStore';

export interface ImpactEvent {
  position: THREE.Vector3;
  strength: number;
  type: 'LIGHT' | 'MEDIUM' | 'HEAVY';
}

export class CollisionEventSystem {
  private physicsWorld: PhysicsWorld;
  private lastSoundTime = 0;
  private soundCooldown = 0.12; // Minimum interval between impact sounds

  // Camera shake state
  public cameraShakeIntensity = 0;

  constructor(physicsWorld: PhysicsWorld) {
    this.physicsWorld = physicsWorld;
  }

  public update(delta: number, onStrongImpact?: (event: ImpactEvent) => void): void {
    // Decay camera shake
    if (this.cameraShakeIntensity > 0) {
      this.cameraShakeIntensity = Math.max(0, this.cameraShakeIntensity - delta * 4.0);
    }

    const eventQueue = this.physicsWorld.eventQueue;
    const now = performance.now() / 1000;

    // Drain Rapier collision events
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (!started) return;

      const collider1 = this.physicsWorld.world.getCollider(handle1);
      const collider2 = this.physicsWorld.world.getCollider(handle2);
      if (!collider1 || !collider2) return;

      const body1 = collider1.parent();
      const body2 = collider2.parent();
      if (!body1 || !body2) return;

      // Approximate impact intensity from relative velocities
      const v1 = body1.linvel();
      const v2 = body2.linvel();
      const relSpeedSq = (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2 + (v1.z - v2.z) ** 2;

      if (relSpeedSq < 1.5) return; // Ignore micro-vibrations

      const speed = Math.sqrt(relSpeedSq);

      if (now - this.lastSoundTime > this.soundCooldown) {
        this.lastSoundTime = now;

        if (speed > 7.0) {
          // Heavy Impact
          SoundManager.playDeskThump();
          this.cameraShakeIntensity = Math.min(1.0, speed * 0.08);
          useGameStore.getState().addChaos(4);

          const t1 = body1.translation();
          if (onStrongImpact) {
            onStrongImpact({
              position: new THREE.Vector3(t1.x, t1.y, t1.z),
              strength: speed,
              type: 'HEAVY',
            });
          }
        } else if (speed > 3.0) {
          // Medium Impact
          SoundManager.playClick();
        }
      }
    });
  }

  public triggerDirectImpact(strength: number): void {
    SoundManager.playDeskThump();
    this.cameraShakeIntensity = Math.min(1.2, strength * 0.1);
  }
}
