import * as THREE from 'three';
import { VehicleController } from './VehicleController';
import { InputVector } from '../game/InputManager';

export class LuggageCart {
  public mesh: THREE.Group;
  public hasLuggage: boolean = false;
  private luggageItems: THREE.Mesh[] = [];

  constructor() {
    this.mesh = new THREE.Group();
    this.buildCart();
  }

  private buildCart() {
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.5 });
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.6 });
    const tireMat = new THREE.MeshLambertMaterial({ color: 0x2d3436 });

    // Chassis bed
    const bedGeo = new THREE.BoxGeometry(2.4, 0.25, 1.4);
    const bed = new THREE.Mesh(bedGeo, chassisMat);
    bed.position.y = 0.5;
    bed.castShadow = true;
    this.mesh.add(bed);

    // Caged walls (mesh rails)
    const wallLongGeo = new THREE.BoxGeometry(2.4, 0.6, 0.08);
    const wallL = new THREE.Mesh(wallLongGeo, cageMat);
    wallL.position.set(0, 0.85, 0.66);
    this.mesh.add(wallL);

    const wallR = new THREE.Mesh(wallLongGeo, cageMat);
    wallR.position.set(0, 0.85, -0.66);
    this.mesh.add(wallR);

    // 4 Small rubber wheels
    const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    [
      [-0.8, -0.68], [0.8, -0.68], [-0.8, 0.68], [0.8, 0.68]
    ].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, tireMat);
      wheel.position.set(wx, 0.24, wz);
      wheel.castShadow = true;
      this.mesh.add(wheel);
    });

    // Luggage bags inside cart
    const bagColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
    for (let i = 0; i < 6; i++) {
      const bagGeo = new THREE.BoxGeometry(0.65, 0.38, 0.45);
      const bagMat = new THREE.MeshStandardMaterial({ color: bagColors[i % bagColors.length], roughness: 0.6 });
      const bag = new THREE.Mesh(bagGeo, bagMat);
      bag.position.set(-0.6 + (i % 3) * 0.6, 0.75 + Math.floor(i / 3) * 0.35, (i % 2 === 0 ? 0.2 : -0.2));
      bag.visible = false;
      this.mesh.add(bag);
      this.luggageItems.push(bag);
    }
  }

  public setLuggageVisible(visible: boolean) {
    this.hasLuggage = visible;
    this.luggageItems.forEach((bag) => {
      bag.visible = visible;
    });
  }

  public follow(leadPos: THREE.Vector3, leadRot: number, followDist: number = 2.8) {
    const targetX = leadPos.x - Math.sin(leadRot) * followDist;
    const targetZ = leadPos.z - Math.cos(leadRot) * followDist;

    // Smooth position follow
    this.mesh.position.lerp(new THREE.Vector3(targetX, leadPos.y, targetZ), 0.25);

    // Rotate toward lead position
    const dx = leadPos.x - this.mesh.position.x;
    const dz = leadPos.z - this.mesh.position.z;
    this.mesh.rotation.y = Math.atan2(dx, dz);
  }
}

export class BaggageTug extends VehicleController {
  public attachedCart: LuggageCart | null = null;
  private beaconLight: THREE.PointLight | null = null;
  private timeElapsed: number = 0;

  constructor(scene: THREE.Scene) {
    super();
    this.maxSpeed = 9.5;
    this.acceleration = 7.5;
    this.buildModel();
    scene.add(this.mesh);

    // Initial cart
    this.attachedCart = new LuggageCart();
    this.attachedCart.mesh.position.set(0, 0, 39);
    scene.add(this.attachedCart.mesh);
  }

  private buildModel() {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.25, metalness: 0.1 });
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 }); // Safety yellow
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    const tireMat = new THREE.MeshLambertMaterial({ color: 0x1e272e });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x81ecec,
      transparent: true,
      opacity: 0.6,
      metalness: 0.5
    });

    // Tug Main Chassis
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.7, 3.0);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // Heavy Front Bumper
    const fBufGeo = new THREE.BoxGeometry(1.7, 0.5, 0.35);
    const fBuf = new THREE.Mesh(fBufGeo, bumperMat);
    fBuf.position.set(0, 0.5, 1.55);
    this.mesh.add(fBuf);

    // Rear Bumper & Hitch plate
    const rBufGeo = new THREE.BoxGeometry(1.7, 0.5, 0.35);
    const rBuf = new THREE.Mesh(rBufGeo, bumperMat);
    rBuf.position.set(0, 0.5, -1.55);
    this.mesh.add(rBuf);

    // Driver Cabin / Open Seat area
    const seatGeo = new THREE.BoxGeometry(0.7, 0.5, 0.6);
    const seat = new THREE.Mesh(seatGeo, darkMat);
    seat.position.set(0, 1.0, -0.2);
    this.mesh.add(seat);

    // Steering Wheel Column
    const columnGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    const column = new THREE.Mesh(columnGeo, darkMat);
    column.position.set(0, 1.25, 0.4);
    column.rotation.x = -Math.PI / 6;
    this.mesh.add(column);

    const wheelRimGeo = new THREE.TorusGeometry(0.18, 0.03, 8, 16);
    const wheelRim = new THREE.Mesh(wheelRimGeo, darkMat);
    wheelRim.position.set(0, 1.45, 0.3);
    wheelRim.rotation.x = Math.PI / 3;
    this.mesh.add(wheelRim);

    // Roll Cage Canopy Structure
    const roofPillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 8);
    [
      [-0.7, -0.6], [0.7, -0.6], [-0.7, 0.6], [0.7, 0.6]
    ].forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(roofPillarGeo, darkMat);
      pillar.position.set(px, 1.6, pz);
      this.mesh.add(pillar);
    });

    const roofGeo = new THREE.BoxGeometry(1.5, 0.08, 1.4);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(0, 2.25, 0);
    this.mesh.add(roof);

    // Amber Flashing Safety Beacon on roof
    const beaconGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffa502 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 2.35, 0);
    this.mesh.add(beacon);

    const beaconLight = new THREE.PointLight(0xffa502, 1.2, 10);
    beaconLight.position.set(0, 2.4, 0);
    this.mesh.add(beaconLight);
    this.beaconLight = beaconLight;

    // Headlights
    const lightGeo = new THREE.BoxGeometry(0.2, 0.14, 0.05);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.6, 0.6].forEach((lx) => {
      const headlight = new THREE.Mesh(lightGeo, lightMat);
      headlight.position.set(lx, 0.75, 1.73);
      this.mesh.add(headlight);
    });

    // Wheels
    const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.28, 16);
    tireGeo.rotateZ(Math.PI / 2);

    const makeWheel = (wx: number, wz: number, isFront: boolean) => {
      const wheelMesh = new THREE.Mesh(tireGeo, tireMat);
      wheelMesh.position.set(wx, 0.35, wz);
      wheelMesh.castShadow = true;
      this.mesh.add(wheelMesh);
      if (isFront) {
        this.frontWheels.push(wheelMesh);
      } else {
        this.rearWheels.push(wheelMesh);
      }
    };

    makeWheel(-0.85, 1.0, true);
    makeWheel(0.85, 1.0, true);
    makeWheel(-0.85, -1.0, false);
    makeWheel(0.85, -1.0, false);

    // Initial position
    this.mesh.position.set(0, 0, 42);
  }

  public override update(input: InputVector, brakePressed: boolean, delta: number) {
    super.update(input, brakePressed, delta);

    // Flash beacon
    this.timeElapsed += delta;
    if (this.beaconLight) {
      this.beaconLight.intensity = Math.sin(this.timeElapsed * 10) > 0 ? 1.5 : 0.2;
    }

    // Update trailing luggage cart
    if (this.attachedCart) {
      this.attachedCart.follow(this.mesh.position, this.mesh.rotation.y);
    }
  }
}
