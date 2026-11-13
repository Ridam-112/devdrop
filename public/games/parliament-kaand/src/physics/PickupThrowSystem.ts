import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PhysicsWorld } from './PhysicsWorld';
import { PhysicsPropManager, InteractiveProp } from './PhysicsPropManager';
import { PlayerCharacter } from '../character/PlayerCharacter';
import { SoundManager } from '../audio/SoundManager';

export class PickupThrowSystem {
  private physicsWorld: PhysicsWorld;
  private propManager: PhysicsPropManager;
  private character: PlayerCharacter;

  public heldProp: InteractiveProp | null = null;
  public nearbyProp: InteractiveProp | null = null;

  private holdOffset = new THREE.Vector3(0.2, 1.1, 0.65); // In front of right chest
  private maxThrowImpulse = 28.0;

  constructor(physicsWorld: PhysicsWorld, propManager: PhysicsPropManager, character: PlayerCharacter) {
    this.physicsWorld = physicsWorld;
    this.propManager = propManager;
    this.character = character;
  }

  public update(delta: number, playerPos: THREE.Vector3, playerFacingAngle: number): void {
    // 1. If holding an object, update its kinematic position and rotation to follow player
    if (this.heldProp) {
      const rotQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), playerFacingAngle);
      const worldHoldPos = playerPos.clone().add(this.holdOffset.clone().applyQuaternion(rotQuat));

      this.heldProp.mesh.position.copy(worldHoldPos);
      this.heldProp.mesh.quaternion.copy(rotQuat);

      this.heldProp.body.setTranslation({ x: worldHoldPos.x, y: worldHoldPos.y, z: worldHoldPos.z }, true);
      this.heldProp.body.setRotation({ x: rotQuat.x, y: rotQuat.y, z: rotQuat.z, w: rotQuat.w }, true);
      this.heldProp.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      this.heldProp.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // 2. Query nearby pickable props
    const nearby = this.propManager.getNearbyProps(playerPos, 2.2);
    this.nearbyProp = nearby.length > 0 ? nearby[0] : null;
  }

  public togglePickup(playerPos: THREE.Vector3, playerFacingAngle: number): boolean {
    if (this.heldProp) {
      this.dropHeld(playerPos, playerFacingAngle);
      return false;
    }

    if (this.nearbyProp) {
      this.pickup(this.nearbyProp);
      return true;
    }

    return false;
  }

  public pickup(prop: InteractiveProp): void {
    this.heldProp = prop;
    prop.isHeld = true;

    // Convert rigid body to KinematicPositionBased so it does not collide with player
    prop.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    SoundManager.playClick();
  }

  public dropHeld(playerPos: THREE.Vector3, playerFacingAngle: number): void {
    if (!this.heldProp) return;

    const prop = this.heldProp;
    this.heldProp = null;
    prop.isHeld = false;

    // Revert to Dynamic rigid body with gentle forward release
    prop.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);

    const fwd = new THREE.Vector3(Math.sin(playerFacingAngle), 0.1, Math.cos(playerFacingAngle));
    prop.body.setLinvel({ x: fwd.x * 2.0, y: 1.0, z: fwd.z * 2.0 }, true);

    SoundManager.playClick();
  }

  public throwHeld(throwDir: THREE.Vector3, throwForce = 18.0): boolean {
    if (!this.heldProp) return false;

    const prop = this.heldProp;
    this.heldProp = null;
    prop.isHeld = false;

    prop.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);

    const force = Math.min(this.maxThrowImpulse, Math.max(8.0, throwForce));
    const impulse = throwDir.clone().normalize().add(new THREE.Vector3(0, 0.22, 0)).normalize().multiplyScalar(force);

    prop.body.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
    prop.body.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 4.0,
        y: (Math.random() - 0.5) * 4.0,
        z: (Math.random() - 0.5) * 4.0,
      },
      true
    );

    SoundManager.playWhoosh();
    return true;
  }
}
