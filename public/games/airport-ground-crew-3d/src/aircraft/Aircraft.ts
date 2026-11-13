import * as THREE from 'three';

export class Aircraft {
  public mesh: THREE.Group;
  public cargoDoorOpen: boolean = false;
  public wingFuelPort: THREE.Vector3 = new THREE.Vector3();
  public cargoDoorPos: THREE.Vector3 = new THREE.Vector3();
  public noseGearPos: THREE.Vector3 = new THREE.Vector3();

  // Taxiing state
  public isTaxiing: boolean = false;
  public taxiSpeed: number = 0;
  public targetStandPos: THREE.Vector3 = new THREE.Vector3();
  public stopLineZ: number = 0;
  public hasStoppedAtGate: boolean = false;

  // Visual parts
  private cargoDoorMesh: THREE.Mesh;
  private beaconTop: THREE.PointLight | null = null;
  private beaconBottom: THREE.PointLight | null = null;
  private fanBlades: THREE.Mesh[] = [];
  private timeElapsed: number = 0;

  constructor(scene: THREE.Scene, initialPos: THREE.Vector3 = new THREE.Vector3(-25, 0, -10)) {
    this.mesh = new THREE.Group();
    const { cargoDoor } = this.buildModel();
    this.cargoDoorMesh = cargoDoor;
    this.mesh.position.copy(initialPos);
    this.updatePorts();
    scene.add(this.mesh);
  }

  public setPosition(x: number, y: number, z: number, rotationY: number = 0) {
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.y = rotationY;
    this.updatePorts();
  }

  private buildModel() {
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0984e3, roughness: 0.3 }); // Airline livery
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x2d3436, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.1, metalness: 0.8 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 0.8, roughness: 0.2 });

    // 1. Fuselage (Airframe Body)
    const bodyGeo = new THREE.CylinderGeometry(2.1, 2.1, 32, 24);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, whiteMat);
    body.position.y = 3.6;
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // Nose Cone (Radome)
    const noseGeo = new THREE.SphereGeometry(2.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    noseGeo.rotateX(-Math.PI / 2);
    noseGeo.scale(1, 1, 1.8);
    const nose = new THREE.Mesh(noseGeo, whiteMat);
    nose.position.set(0, 3.6, 16);
    this.mesh.add(nose);

    // Cockpit Windows
    const cockpitGeo = new THREE.BoxGeometry(2.2, 0.6, 1.2);
    const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
    cockpit.position.set(0, 4.4, 14.8);
    this.mesh.add(cockpit);

    // Tail Cone
    const tailConeGeo = new THREE.ConeGeometry(2.1, 9, 24);
    tailConeGeo.rotateX(Math.PI / 2);
    const tailCone = new THREE.Mesh(tailConeGeo, whiteMat);
    tailCone.position.set(0, 3.6, -20.5);
    this.mesh.add(tailCone);

    // Vertical Stabilizer (Tail Fin) with Airline Livery
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0, 7.5);
    finShape.lineTo(-3.5, 7.2);
    finShape.lineTo(-5.5, 0);
    finShape.closePath();

    const finExtrudeSettings = { depth: 0.35, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
    finGeo.rotateY(Math.PI / 2);
    const fin = new THREE.Mesh(finGeo, blueMat);
    fin.position.set(-0.175, 4.5, -17.0);
    fin.castShadow = true;
    this.mesh.add(fin);

    // Horizontal Stabilizers (Tail wings)
    const horizGeo = new THREE.BoxGeometry(9.5, 0.25, 2.5);
    const horiz = new THREE.Mesh(horizGeo, whiteMat);
    horiz.position.set(0, 4.2, -22);
    this.mesh.add(horiz);

    // 2. Main Wings (Swept-back)
    const wingGeo = new THREE.BoxGeometry(29.0, 0.45, 4.6);
    const wing = new THREE.Mesh(wingGeo, whiteMat);
    wing.position.set(0, 3.2, 0);
    wing.castShadow = true;
    this.mesh.add(wing);

    // Winglets (upturned tips)
    [-14.5, 14.5].forEach((wx) => {
      const wingletGeo = new THREE.BoxGeometry(0.2, 1.8, 1.5);
      const winglet = new THREE.Mesh(wingletGeo, blueMat);
      winglet.position.set(wx, 4.1, 0);
      this.mesh.add(winglet);
    });

    // 3. Turbofan Jet Engines (Under wings)
    const engineGeo = new THREE.CylinderGeometry(1.05, 1.0, 4.0, 20);
    engineGeo.rotateX(Math.PI / 2);

    [-6.5, 6.5].forEach((ex) => {
      const enginePylon = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 1.6), darkMat);
      enginePylon.position.set(ex, 2.8, 0.5);
      this.mesh.add(enginePylon);

      const engine = new THREE.Mesh(engineGeo, whiteMat);
      engine.position.set(ex, 2.1, 0.8);
      engine.castShadow = true;
      this.mesh.add(engine);

      // Chrome intake ring
      const intakeRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.1, 8, 20), chromeMat);
      intakeRing.position.set(ex, 2.1, 2.8);
      this.mesh.add(intakeRing);

      // Spinning fan spinner
      const fanGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
      fanGeo.rotateX(Math.PI / 2);
      const fan = new THREE.Mesh(fanGeo, darkMat);
      fan.position.set(ex, 2.1, 2.6);
      this.mesh.add(fan);
      this.fanBlades.push(fan);
    });

    // 4. Landing Gears (Nose Gear & Main Gears)
    const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 8);
    const gearTireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.24, 16);
    gearTireGeo.rotateZ(Math.PI / 2);

    // Nose Gear (Forward)
    const noseStrut = new THREE.Mesh(strutGeo, darkMat);
    noseStrut.position.set(0, 1.3, 12.5);
    noseStrut.castShadow = true;
    this.mesh.add(noseStrut);

    [-0.2, 0.2].forEach((tx) => {
      const tire = new THREE.Mesh(gearTireGeo, darkMat);
      tire.position.set(tx, 0.42, 12.5);
      this.mesh.add(tire);
    });

    // Main Gears (Under wings)
    [-3.8, 3.8].forEach((gx) => {
      const mainStrut = new THREE.Mesh(strutGeo, darkMat);
      mainStrut.position.set(gx, 1.3, -0.5);
      mainStrut.castShadow = true;
      this.mesh.add(mainStrut);

      [-0.25, 0.25].forEach((tx) => {
        const tire = new THREE.Mesh(gearTireGeo, darkMat);
        tire.position.set(gx + tx, 0.42, -0.5);
        this.mesh.add(tire);
      });
    });

    // 5. Cargo Door (Starboard / Right Side Aft)
    const doorGeo = new THREE.BoxGeometry(0.1, 1.5, 1.8);
    const door = new THREE.Mesh(doorGeo, chromeMat);
    door.position.set(2.12, 2.6, -4.5);
    this.mesh.add(door);

    // 6. Anti-collision Beacons (Red flashing)
    const bTop = new THREE.PointLight(0xff0000, 1.5, 15);
    bTop.position.set(0, 5.8, -2.0);
    this.mesh.add(bTop);
    this.beaconTop = bTop;

    const bBottom = new THREE.PointLight(0xff0000, 1.5, 15);
    bBottom.position.set(0, 1.4, -2.0);
    this.mesh.add(bBottom);
    this.beaconBottom = bBottom;

    return { cargoDoor: door };
  }

  public openCargoDoor() {
    this.cargoDoorOpen = true;
    this.cargoDoorMesh.position.y = 3.6; // Slides upward open
    this.cargoDoorMesh.rotation.z = Math.PI / 3;
  }

  public closeCargoDoor() {
    this.cargoDoorOpen = false;
    this.cargoDoorMesh.position.y = 2.6;
    this.cargoDoorMesh.rotation.z = 0;
  }

  public updatePorts() {
    // World coordinates for interaction spots
    this.mesh.updateMatrixWorld(true);

    // Starboard wing refueling port
    this.wingFuelPort.set(10.5, 3.1, 0).applyMatrix4(this.mesh.matrixWorld);

    // Starboard aft cargo door
    this.cargoDoorPos.set(2.4, 2.6, -4.5).applyMatrix4(this.mesh.matrixWorld);

    // Nose gear (target for marshalling stop)
    this.noseGearPos.set(0, 0.42, 12.5).applyMatrix4(this.mesh.matrixWorld);
  }

  public startTaxiArrival(startPos: THREE.Vector3, targetStandPos: THREE.Vector3, stopLineZ: number) {
    this.mesh.position.copy(startPos);
    this.mesh.rotation.y = 0;
    this.targetStandPos.copy(targetStandPos);
    this.stopLineZ = stopLineZ;
    this.isTaxiing = true;
    this.taxiSpeed = 5.0; // m/s
    this.hasStoppedAtGate = false;
  }

  public stopAtGate() {
    this.taxiSpeed = 0;
    this.isTaxiing = false;
    this.hasStoppedAtGate = true;
  }

  public update(delta: number) {
    this.timeElapsed += delta;

    // Flash beacons
    if (this.beaconTop && this.beaconBottom) {
      const flash = (Math.sin(this.timeElapsed * 5) > 0.8) ? 2.5 : 0.1;
      this.beaconTop.intensity = flash;
      this.beaconBottom.intensity = flash;
    }

    // Spin fan blades if engines on or taxiing
    if (this.isTaxiing) {
      this.fanBlades.forEach((f) => {
        f.rotation.z += 25 * delta;
      });

      // Advance plane toward stop line
      this.mesh.position.z += this.taxiSpeed * delta;

      // Update world positions
      this.updatePorts();

      // Check if reached stop line
      if (this.noseGearPos.z >= this.stopLineZ) {
        this.stopAtGate();
      }
    }
  }
}
