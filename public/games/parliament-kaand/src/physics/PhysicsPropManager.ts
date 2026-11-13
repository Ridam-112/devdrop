import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PhysicsWorld } from './PhysicsWorld';

export type PropType = 'CHAIR' | 'BOTTLE' | 'FILE' | 'MIC' | 'PAPER';

export interface InteractiveProp {
  id: string;
  type: PropType;
  mesh: THREE.Object3D;
  body: RAPIER.RigidBody;
  collider: RAPIER.Collider;
  isHeld: boolean;
  name: string;
}

export class PhysicsPropManager {
  private physicsWorld: PhysicsWorld;
  private scene: THREE.Scene;
  public props: InteractiveProp[] = [];

  private nextId = 1;

  // Shared Materials for performance
  private chairMatOpposition!: THREE.MeshStandardMaterial;
  private chairMatTreasury!: THREE.MeshStandardMaterial;
  private woodMat!: THREE.MeshStandardMaterial;
  private bottleMat!: THREE.MeshStandardMaterial;
  private fileMat!: THREE.MeshStandardMaterial;
  private micMat!: THREE.MeshStandardMaterial;
  private paperMat!: THREE.MeshStandardMaterial;

  constructor(physicsWorld: PhysicsWorld, scene: THREE.Scene) {
    this.physicsWorld = physicsWorld;
    this.scene = scene;
    this.initMaterials();
  }

  private initMaterials(): void {
    this.chairMatOpposition = new THREE.MeshStandardMaterial({
      color: 0x1b365d, // Royal Navy Blue
      roughness: 0.6,
      metalness: 0.1,
    });
    this.chairMatTreasury = new THREE.MeshStandardMaterial({
      color: 0x800020, // Crimson Maroon
      roughness: 0.6,
      metalness: 0.1,
    });
    this.woodMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.5,
    });
    this.bottleMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    this.fileMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.8,
    });
    this.micMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3,
    });
    this.paperMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
    });
  }

  private getPropFilter(): number {
    return PhysicsWorld.createCollisionFilter(
      PhysicsWorld.GROUP_PROP,
      PhysicsWorld.GROUP_STATIC | PhysicsWorld.GROUP_PLAYER | PhysicsWorld.GROUP_RAGDOLL | PhysicsWorld.GROUP_PROP
    );
  }

  // 1. Spawns an Interactive Swivel MP Chair
  public spawnChair(pos: THREE.Vector3, rotY = 0, isTreasury = false): InteractiveProp {
    const group = new THREE.Group();

    // Seat cushion
    const seatGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.08, 12);
    const seatMesh = new THREE.Mesh(seatGeo, isTreasury ? this.chairMatTreasury : this.chairMatOpposition);
    seatMesh.castShadow = true;
    seatMesh.position.y = 0.45;
    group.add(seatMesh);

    // Backrest
    const backGeo = new THREE.BoxGeometry(0.40, 0.40, 0.06);
    const backMesh = new THREE.Mesh(backGeo, isTreasury ? this.chairMatTreasury : this.chairMatOpposition);
    backMesh.position.set(0, 0.70, -0.18);
    backMesh.castShadow = true;
    group.add(backMesh);

    // Stem & Base
    const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.40, 8);
    const stemMesh = new THREE.Mesh(stemGeo, this.micMat);
    stemMesh.position.y = 0.22;
    group.add(stemMesh);

    const baseGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 10);
    const baseMesh = new THREE.Mesh(baseGeo, this.micMat);
    baseMesh.position.y = 0.02;
    group.add(baseMesh);

    group.position.copy(pos);
    group.rotation.y = rotY;
    this.scene.add(group);

    // Rapier RigidBody
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(pos.x, pos.y + 0.45, pos.z)
      .setRotation(
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY)
      )
      .setLinearDamping(0.8)
      .setAngularDamping(1.5)
      .setCanSleep(true);

    const body = this.physicsWorld.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.24, 0.45, 0.24)
      .setMass(14.0)
      .setFriction(0.6)
      .setRestitution(0.15)
      .setCollisionGroups(this.getPropFilter());

    const collider = this.physicsWorld.world.createCollider(colliderDesc, body);
    this.physicsWorld.registerBinding(body, group, new THREE.Vector3(0, -0.45, 0));

    const prop: InteractiveProp = {
      id: `chair_${this.nextId++}`,
      type: 'CHAIR',
      mesh: group,
      body,
      collider,
      isHeld: false,
      name: isTreasury ? 'Treasury MP Swivel Chair' : 'Opposition MP Swivel Chair',
    };
    this.props.push(prop);
    return prop;
  }

  // 2. Spawns an Interactive Water Bottle
  public spawnWaterBottle(pos: THREE.Vector3): InteractiveProp {
    const geo = new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10);
    const mesh = new THREE.Mesh(geo, this.bottleMat);
    mesh.castShadow = true;
    mesh.position.copy(pos);
    this.scene.add(mesh);

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(pos.x, pos.y, pos.z)
      .setLinearDamping(0.4)
      .setAngularDamping(0.8)
      .setCanSleep(true);

    const body = this.physicsWorld.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cylinder(0.11, 0.045)
      .setMass(0.5)
      .setFriction(0.4)
      .setRestitution(0.35)
      .setCollisionGroups(this.getPropFilter());

    const collider = this.physicsWorld.world.createCollider(colliderDesc, body);
    this.physicsWorld.registerBinding(body, mesh);

    const prop: InteractiveProp = {
      id: `bottle_${this.nextId++}`,
      type: 'BOTTLE',
      mesh,
      body,
      collider,
      isHeld: false,
      name: 'Parliament Water Bottle',
    };
    this.props.push(prop);
    return prop;
  }

  // 3. Spawns an Interactive Official Bill Folder / File
  public spawnFileDossier(pos: THREE.Vector3, rotY = 0): InteractiveProp {
    const geo = new THREE.BoxGeometry(0.24, 0.03, 0.32);
    const mesh = new THREE.Mesh(geo, this.fileMat);
    mesh.castShadow = true;
    mesh.position.copy(pos);
    this.scene.add(mesh);

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(pos.x, pos.y, pos.z)
      .setLinearDamping(0.9)
      .setAngularDamping(1.4)
      .setCanSleep(true);

    const body = this.physicsWorld.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.12, 0.015, 0.16)
      .setMass(0.8)
      .setFriction(0.7)
      .setRestitution(0.05)
      .setCollisionGroups(this.getPropFilter());

    const collider = this.physicsWorld.world.createCollider(colliderDesc, body);
    this.physicsWorld.registerBinding(body, mesh);

    const prop: InteractiveProp = {
      id: `file_${this.nextId++}`,
      type: 'FILE',
      mesh,
      body,
      collider,
      isHeld: false,
      name: 'Official Bill Dossier',
    };
    this.props.push(prop);
    return prop;
  }

  // 4. Spawns a Gooseneck MP Microphone
  public spawnMicrophone(pos: THREE.Vector3): InteractiveProp {
    const group = new THREE.Group();

    const baseGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.03, 10);
    const baseMesh = new THREE.Mesh(baseGeo, this.micMat);
    group.add(baseMesh);

    const neckGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.28, 8);
    neckGeo.translate(0, 0.14, 0.04);
    neckGeo.rotateX(0.25);
    const neckMesh = new THREE.Mesh(neckGeo, this.micMat);
    group.add(neckMesh);

    group.position.copy(pos);
    this.scene.add(group);

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(pos.x, pos.y + 0.12, pos.z)
      .setLinearDamping(0.5)
      .setAngularDamping(1.0)
      .setCanSleep(true);

    const body = this.physicsWorld.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cylinder(0.14, 0.06)
      .setMass(1.2)
      .setFriction(0.5)
      .setRestitution(0.2)
      .setCollisionGroups(this.getPropFilter());

    const collider = this.physicsWorld.world.createCollider(colliderDesc, body);
    this.physicsWorld.registerBinding(body, group, new THREE.Vector3(0, -0.12, 0));

    const prop: InteractiveProp = {
      id: `mic_${this.nextId++}`,
      type: 'MIC',
      mesh: group,
      body,
      collider,
      isHeld: false,
      name: 'Push-To-Talk MP Microphone',
    };
    this.props.push(prop);
    return prop;
  }

  public getNearbyProps(pos: THREE.Vector3, radius = 2.5): InteractiveProp[] {
    return this.props.filter((p) => {
      if (p.isHeld) return false;
      const t = p.body.translation();
      const dist = Math.sqrt((pos.x - t.x) ** 2 + (pos.y - t.y) ** 2 + (pos.z - t.z) ** 2);
      return dist <= radius;
    });
  }

  public destroy(): void {
    for (const p of this.props) {
      this.physicsWorld.unregisterBinding(p.body);
      this.physicsWorld.world.removeRigidBody(p.body);
      this.scene.remove(p.mesh);
    }
    this.props = [];
  }
}
