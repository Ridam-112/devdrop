import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export interface PhysicsSyncBinding {
  body: RAPIER.RigidBody;
  mesh: THREE.Object3D;
  offset?: THREE.Vector3;
}

export class PhysicsWorld {
  public static RAPIER: typeof RAPIER;
  public static isInitialized = false;

  public world!: RAPIER.World;
  public eventQueue!: RAPIER.EventQueue;

  private bindings: PhysicsSyncBinding[] = [];
  private accumulator = 0;
  private readonly fixedTimestep = 1 / 60;
  private readonly maxSubsteps = 3;

  // Collision Group bitmasks
  public static readonly GROUP_STATIC = 0x0001;
  public static readonly GROUP_PLAYER = 0x0002;
  public static readonly GROUP_RAGDOLL = 0x0004;
  public static readonly GROUP_PROP = 0x0008;
  public static readonly GROUP_SENSOR = 0x0010;

  public static async initRapier(): Promise<void> {
    if (this.isInitialized) return;
    await RAPIER.init();
    this.RAPIER = RAPIER;
    this.isInitialized = true;
  }

  constructor(gravity = { x: 0.0, y: -18.0, z: 0.0 }) {
    if (!PhysicsWorld.isInitialized) {
      throw new Error('PhysicsWorld.initRapier() must be called before instantiating PhysicsWorld.');
    }
    this.world = new RAPIER.World(gravity);
    this.eventQueue = new RAPIER.EventQueue(true);
  }

  public static createCollisionFilter(membership: number, filter: number): number {
    return (membership << 16) | filter;
  }

  public registerBinding(body: RAPIER.RigidBody, mesh: THREE.Object3D, offset?: THREE.Vector3): void {
    this.bindings.push({ body, mesh, offset });
  }

  public unregisterBinding(body: RAPIER.RigidBody): void {
    const idx = this.bindings.findIndex((b) => b.body === body);
    if (idx !== -1) {
      this.bindings.splice(idx, 1);
    }
  }

  public step(delta: number): void {
    this.accumulator += Math.min(delta, 0.1);
    let steps = 0;

    while (this.accumulator >= this.fixedTimestep && steps < this.maxSubsteps) {
      this.world.step(this.eventQueue);
      this.accumulator -= this.fixedTimestep;
      steps++;
    }

    // Synchronize physics rigid bodies with Three.js meshes
    this.syncMeshes();
  }

  private syncMeshes(): void {
    for (let i = 0; i < this.bindings.length; i++) {
      const { body, mesh, offset } = this.bindings[i];
      if (body.isSleeping()) continue;

      const t = body.translation();
      const r = body.rotation();

      if (offset) {
        const rotQuat = new THREE.Quaternion(r.x, r.y, r.z, r.w);
        const transformedOffset = offset.clone().applyQuaternion(rotQuat);
        mesh.position.set(t.x + transformedOffset.x, t.y + transformedOffset.y, t.z + transformedOffset.z);
      } else {
        mesh.position.set(t.x, t.y, t.z);
      }
      mesh.quaternion.set(r.x, r.y, r.z, r.w);
    }
  }

  public createStaticBox(
    position: THREE.Vector3,
    halfExtents: THREE.Vector3,
    rotation?: THREE.Quaternion,
    friction = 0.6,
    restitution = 0.1
  ): { body: RAPIER.RigidBody; collider: RAPIER.Collider } {
    const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z);
    if (rotation) {
      bodyDesc.setRotation({ x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w });
    }
    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z)
      .setFriction(friction)
      .setRestitution(restitution)
      .setCollisionGroups(
        PhysicsWorld.createCollisionFilter(
          PhysicsWorld.GROUP_STATIC,
          PhysicsWorld.GROUP_PLAYER | PhysicsWorld.GROUP_RAGDOLL | PhysicsWorld.GROUP_PROP
        )
      );

    const collider = this.world.createCollider(colliderDesc, body);
    return { body, collider };
  }

  public createStaticCylinder(
    position: THREE.Vector3,
    halfHeight: number,
    radius: number,
    friction = 0.6
  ): { body: RAPIER.RigidBody; collider: RAPIER.Collider } {
    const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z);
    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.cylinder(halfHeight, radius)
      .setFriction(friction)
      .setCollisionGroups(
        PhysicsWorld.createCollisionFilter(
          PhysicsWorld.GROUP_STATIC,
          PhysicsWorld.GROUP_PLAYER | PhysicsWorld.GROUP_RAGDOLL | PhysicsWorld.GROUP_PROP
        )
      );

    const collider = this.world.createCollider(colliderDesc, body);
    return { body, collider };
  }

  public getDebugBuffers(): { vertices: Float32Array; colors: Float32Array } {
    const buffers = this.world.debugRender();
    return {
      vertices: buffers.vertices,
      colors: buffers.colors,
    };
  }

  public getActiveBodyCount(): number {
    return this.world.bodies.len();
  }

  public destroy(): void {
    this.bindings = [];
    this.world.free();
  }
}
