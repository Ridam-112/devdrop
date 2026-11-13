import * as THREE from 'three';
import { VehicleController } from './VehicleController';
import { InputVector } from '../game/InputManager';

export class FuelTruck extends VehicleController {
  public isConnected: boolean = false;
  public fuelLevel: number = 0; // 0 to 100%
  private hoseLine: THREE.Line | null = null;
  private hoseGeo: THREE.BufferGeometry | null = null;
  private targetConnectPos: THREE.Vector3 = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    super();
    this.maxSpeed = 8.0;
    this.acceleration = 5.5;
    this.buildModel();
    this.setupHose(scene);
    scene.add(this.mesh);
  }

  private buildModel() {
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.3 });
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.2 });
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 });
    const tireMat = new THREE.MeshLambertMaterial({ color: 0x1e272e });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x2980b9, transparent: true, opacity: 0.7 });
    const hazardRedMat = new THREE.MeshBasicMaterial({ color: 0xe74c3c });

    // Driver Cab
    const cabGeo = new THREE.BoxGeometry(2.2, 1.8, 1.8);
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 1.4, 2.0);
    cab.castShadow = true;
    this.mesh.add(cab);

    // Windshield
    const windGeo = new THREE.PlaneGeometry(1.9, 0.9);
    const wind = new THREE.Mesh(windGeo, glassMat);
    wind.position.set(0, 1.6, 2.91);
    this.mesh.add(wind);

    // Front Bumper & Headlights
    const bufGeo = new THREE.BoxGeometry(2.3, 0.45, 0.3);
    const buf = new THREE.Mesh(bufGeo, bumperMat);
    buf.position.set(0, 0.6, 2.95);
    this.mesh.add(buf);

    // Big Cylindrical Aviation Fuel Tank
    const tankGeo = new THREE.CylinderGeometry(1.2, 1.2, 4.2, 16);
    tankGeo.rotateX(Math.PI / 2);
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(0, 1.7, -1.0);
    tank.castShadow = true;
    this.mesh.add(tank);

    // Jet A-1 Green Stripe
    const stripeGeo = new THREE.CylinderGeometry(1.21, 1.21, 0.8, 16);
    stripeGeo.rotateX(Math.PI / 2);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x27ae60 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 1.7, -1.0);
    this.mesh.add(stripe);

    // Flammable placard
    const placGeo = new THREE.PlaneGeometry(0.7, 0.7);
    const plac = new THREE.Mesh(placGeo, hazardRedMat);
    plac.position.set(0, 1.7, -3.12);
    plac.rotation.y = Math.PI;
    this.mesh.add(plac);

    // 6 Wheels (2 front, 4 rear dually)
    const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 16);
    tireGeo.rotateZ(Math.PI / 2);

    const makeWheel = (wx: number, wz: number, isFront: boolean) => {
      const wheel = new THREE.Mesh(tireGeo, tireMat);
      wheel.position.set(wx, 0.48, wz);
      wheel.castShadow = true;
      this.mesh.add(wheel);
      if (isFront) {
        this.frontWheels.push(wheel);
      } else {
        this.rearWheels.push(wheel);
      }
    };

    makeWheel(-1.15, 2.0, true);
    makeWheel(1.15, 2.0, true);
    makeWheel(-1.15, -0.6, false);
    makeWheel(1.15, -0.6, false);
    makeWheel(-1.15, -1.8, false);
    makeWheel(1.15, -1.8, false);

    this.mesh.position.set(45, 0, 32); // Spawn near fuel depot
  }

  private setupHose(scene: THREE.Scene) {
    const points = [new THREE.Vector3(), new THREE.Vector3()];
    this.hoseGeo = new THREE.BufferGeometry().setFromPoints(points);
    const hoseMat = new THREE.LineBasicMaterial({ color: 0x1e272e, linewidth: 4 });
    this.hoseLine = new THREE.Line(this.hoseGeo, hoseMat);
    this.hoseLine.visible = false;
    scene.add(this.hoseLine);
  }

  public connectHose(wingFuelPortPos: THREE.Vector3) {
    this.isConnected = true;
    this.targetConnectPos.copy(wingFuelPortPos);
    if (this.hoseLine) {
      this.hoseLine.visible = true;
    }
  }

  public disconnectHose() {
    this.isConnected = false;
    if (this.hoseLine) {
      this.hoseLine.visible = false;
    }
  }

  public override update(input: InputVector, brakePressed: boolean, delta: number) {
    super.update(input, brakePressed, delta);

    if (this.isConnected && this.hoseLine && this.hoseGeo) {
      // Connect rear of fuel truck to wing fuel port
      const truckPortPos = this.mesh.position.clone().add(new THREE.Vector3(0, 1.2, -3.0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.rotation.y));
      const mid = truckPortPos.clone().lerp(this.targetConnectPos, 0.5);
      mid.y = 0.4; // Droop slightly toward the ground

      const curve = new THREE.QuadraticBezierCurve3(truckPortPos, mid, this.targetConnectPos);
      const points = curve.getPoints(12);
      this.hoseGeo.setFromPoints(points);
    }
  }
}
