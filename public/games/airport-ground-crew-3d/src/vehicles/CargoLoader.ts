import * as THREE from 'three';
import { VehicleController } from './VehicleController';
import { InputVector } from '../game/InputManager';

export class CargoLoader extends VehicleController {
  public platformHeight: number = 1.0; // 1.0m to 3.8m
  public targetHeight: number = 1.0;
  public hasContainer: boolean = true;

  private platformMesh: THREE.Group;
  private scissorArms: THREE.Mesh[] = [];
  private containerMesh: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    super();
    this.maxSpeed = 6.5;
    this.acceleration = 4.5;
    const { platform, container } = this.buildModel();
    this.platformMesh = platform;
    this.containerMesh = container;
    scene.add(this.mesh);
  }

  private buildModel() {
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.4 });
    const safetyYellow = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.3 });
    const tireMat = new THREE.MeshLambertMaterial({ color: 0x1e272e });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, metalness: 0.6, roughness: 0.3 });
    const uldMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, metalness: 0.8, roughness: 0.2 });

    // Base Chassis
    const baseGeo = new THREE.BoxGeometry(2.6, 0.6, 5.0);
    const base = new THREE.Mesh(baseGeo, chassisMat);
    base.position.y = 0.6;
    base.castShadow = true;
    this.mesh.add(base);

    // Side Driver Cab
    const cabGeo = new THREE.BoxGeometry(0.7, 1.4, 1.2);
    const cab = new THREE.Mesh(cabGeo, safetyYellow);
    cab.position.set(-1.0, 1.3, 1.8);
    this.mesh.add(cab);

    // Hazard Stripes on bumpers
    const bufGeo = new THREE.BoxGeometry(2.7, 0.4, 0.2);
    const fBuf = new THREE.Mesh(bufGeo, safetyYellow);
    fBuf.position.set(0, 0.5, 2.55);
    this.mesh.add(fBuf);

    // 4 Wheels
    const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16);
    tireGeo.rotateZ(Math.PI / 2);

    const makeWheel = (wx: number, wz: number, isFront: boolean) => {
      const wheel = new THREE.Mesh(tireGeo, tireMat);
      wheel.position.set(wx, 0.42, wz);
      wheel.castShadow = true;
      this.mesh.add(wheel);
      if (isFront) {
        this.frontWheels.push(wheel);
      } else {
        this.rearWheels.push(wheel);
      }
    };

    makeWheel(-1.3, 1.6, true);
    makeWheel(1.3, 1.6, true);
    makeWheel(-1.3, -1.6, false);
    makeWheel(1.3, -1.6, false);

    // Upper Elevating Platform
    const platform = new THREE.Group();
    platform.position.set(0, 1.0, -0.2);

    const deckGeo = new THREE.BoxGeometry(2.4, 0.2, 3.6);
    const deck = new THREE.Mesh(deckGeo, steelMat);
    deck.castShadow = true;
    platform.add(deck);

    // Roller conveyors
    const rollerGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8);
    rollerGeo.rotateZ(Math.PI / 2);
    for (let r = -1.5; r <= 1.5; r += 0.5) {
      const roller = new THREE.Mesh(rollerGeo, chassisMat);
      roller.position.set(0, 0.12, r);
      platform.add(roller);
    }

    // ULD Cargo Container (Standard LD3 Aviation Container)
    const containerGeo = new THREE.BoxGeometry(2.0, 1.6, 2.0);
    const container = new THREE.Mesh(containerGeo, uldMat);
    container.position.set(0, 1.0, 0);
    container.castShadow = true;
    platform.add(container);

    this.mesh.add(platform);

    this.mesh.position.set(-50, 0, -32); // Spawn near cargo depot

    return { platform, container };
  }

  public raisePlatform() {
    this.targetHeight = 3.6; // Reach aircraft cargo door
  }

  public lowerPlatform() {
    this.targetHeight = 1.0;
  }

  public unloadCargo() {
    this.hasContainer = false;
    this.containerMesh.visible = false;
  }

  public loadCargo() {
    this.hasContainer = true;
    this.containerMesh.visible = true;
  }

  public override update(input: InputVector, brakePressed: boolean, delta: number) {
    super.update(input, brakePressed, delta);

    // Animate platform height
    if (Math.abs(this.platformHeight - this.targetHeight) > 0.02) {
      this.platformHeight += (this.targetHeight - this.platformHeight) * Math.min(1, 2.0 * delta);
      this.platformMesh.position.y = this.platformHeight;
    }
  }
}
