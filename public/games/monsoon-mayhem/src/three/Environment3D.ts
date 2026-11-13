import * as THREE from 'three';
import { Road3D } from './Road3D';

export class Environment3D {
  public scene: THREE.Scene;
  public road: Road3D;
  public propsGroup: THREE.Group;
  private spawnedProps: { mesh: THREE.Group; baseZ: number; baseX: number; side: number }[] = [];

  constructor(scene: THREE.Scene, road: Road3D) {
    this.scene = scene;
    this.road = road;
    this.propsGroup = new THREE.Group();
    this.scene.add(this.propsGroup);

    this.populateInitialEnvironment();
  }

  private populateInitialEnvironment(): void {
    const totalDist = 480;
    for (let z = 0; z > -totalDist; z -= 14) {
      this.spawnRoadsidePropsAt(z);
    }
  }

  private spawnRoadsidePropsAt(z: number): void {
    // 1. Streetlights & Concrete Electric Poles (Poles on sidewalks at ±7.5m)
    if (Math.abs(z) % 28 === 0) {
      const pole = this.createElectricPole();
      pole.position.set(-7.5, 0, z);
      this.propsGroup.add(pole);
      this.spawnedProps.push({ mesh: pole, baseZ: z, baseX: -7.5, side: -1 });

      const light = this.createBritishStreetlight();
      light.position.set(7.5, 0, z);
      this.propsGroup.add(light);
      this.spawnedProps.push({ mesh: light, baseZ: z, baseX: 7.5, side: 1 });
    }

    // 2. 3D Colonial Heritage Mansion & Market Buildings (Facing the road directly!)
    if (Math.abs(z) % 24 === 0) {
      const isLeftColonial = Math.abs(z) % 48 === 0;

      // Left Building (at X = -15.5m, rotated to face +X towards road)
      const buildingL = isLeftColonial ? this.createColonialBuilding() : this.createMarketShop();
      buildingL.position.set(-15.5, 0, z);
      buildingL.rotation.y = Math.PI / 2; // Face the road!
      this.propsGroup.add(buildingL);
      this.spawnedProps.push({ mesh: buildingL, baseZ: z, baseX: -15.5, side: -1 });

      // Right Building (at X = +15.5m, rotated to face -X towards road)
      const buildingR = isLeftColonial ? this.createMarketShop() : this.createColonialBuilding();
      buildingR.position.set(15.5, 0, z);
      buildingR.rotation.y = -Math.PI / 2; // Face the road!
      this.propsGroup.add(buildingR);
      this.spawnedProps.push({ mesh: buildingR, baseZ: z, baseX: 15.5, side: 1 });
    }

    // 3. Authentic Kolkata Street Life: Tea Stalls, Taxis, Post Boxes, Bus Stops
    if (Math.abs(z) % 36 === 12) {
      const rand = Math.random();
      if (rand < 0.28) {
        const taxi = this.createYellowTaxi();
        taxi.position.set(-7.8, 0, z);
        taxi.rotation.y = Math.PI; // Parked along the curb
        this.propsGroup.add(taxi);
        this.spawnedProps.push({ mesh: taxi, baseZ: z, baseX: -7.8, side: -1 });
      } else if (rand < 0.55) {
        const teaStall = this.createTeaStall();
        teaStall.position.set(8.2, 0, z);
        teaStall.rotation.y = -Math.PI / 2;
        this.propsGroup.add(teaStall);
        this.spawnedProps.push({ mesh: teaStall, baseZ: z, baseX: 8.2, side: 1 });
      } else if (rand < 0.78) {
        const postBox = this.createBritishPostBox();
        postBox.position.set(-7.6, 0, z);
        this.propsGroup.add(postBox);
        this.spawnedProps.push({ mesh: postBox, baseZ: z, baseX: -7.6, side: -1 });
      } else {
        const busStop = this.createBusStop();
        busStop.position.set(8.5, 0, z);
        busStop.rotation.y = -Math.PI / 2;
        this.propsGroup.add(busStop);
        this.spawnedProps.push({ mesh: busStop, baseZ: z, baseX: 8.5, side: 1 });
      }
    }

    // 4. "KOLKATA" Municipality Signboard every 72m
    if (Math.abs(z) % 72 === 24) {
      const sign = this.createKolkataSignpost();
      sign.position.set(-7.6, 0, z);
      this.propsGroup.add(sign);
      this.spawnedProps.push({ mesh: sign, baseZ: z, baseX: -7.6, side: -1 });
    }
  }

  // === 3D ARCHITECTURAL GENERATORS ===

  private createColonialBuilding(): THREE.Group {
    const group = new THREE.Group();
    // 3-Story Ochre/Yellow Colonial Facade
    const bodyGeo = new THREE.BoxGeometry(14, 14, 9);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 7, -4.5);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Ground Floor Arched Veranda Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.25, 0.28, 4.2, 8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });
    for (let px = -5.5; px <= 5.5; px += 2.75) {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, 2.1, 0.2);
      pillar.castShadow = true;
      group.add(pillar);
    }

    // Veranda Arch Trim
    const archTrimGeo = new THREE.BoxGeometry(13.5, 0.6, 0.5);
    const archTrim = new THREE.Mesh(archTrimGeo, pillarMat);
    archTrim.position.set(0, 4.4, 0.2);
    group.add(archTrim);

    // Green French Shuttered Windows with Warm Glowing Glass
    const winFrameGeo = new THREE.BoxGeometry(1.2, 1.8, 0.15);
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const glassLitMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.75,
      roughness: 0.2
    });

    for (let floor = 6.2; floor <= 11; floor += 4.0) {
      for (let wx = -4.5; wx <= 4.5; wx += 2.25) {
        // Glowing Window Pane
        const glassGeo = new THREE.PlaneGeometry(0.9, 1.4);
        const glass = new THREE.Mesh(glassGeo, glassLitMat);
        glass.position.set(wx, floor, 0.08);
        group.add(glass);

        // Green Shutters on sides
        const shutterGeo = new THREE.BoxGeometry(0.35, 1.5, 0.08);
        const shutterL = new THREE.Mesh(shutterGeo, shutterMat);
        shutterL.position.set(wx - 0.55, floor, 0.1);
        group.add(shutterL);

        const shutterR = new THREE.Mesh(shutterGeo, shutterMat);
        shutterR.position.set(wx + 0.55, floor, 0.1);
        group.add(shutterR);
      }

      // 2nd/3rd Floor Ornate Black Wrought-Iron Balconies
      const balcGeo = new THREE.BoxGeometry(12.5, 0.8, 0.6);
      const ironMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.4 });
      const balcony = new THREE.Mesh(balcGeo, ironMat);
      balcony.position.set(0, floor - 1.1, 0.3);
      group.add(balcony);
    }

    // Top Roof Cornice Parapet
    const cornGeo = new THREE.BoxGeometry(14.6, 0.9, 1.2);
    const corn = new THREE.Mesh(cornGeo, pillarMat);
    corn.position.set(0, 14.3, 0.1);
    group.add(corn);

    return group;
  }

  private createMarketShop(): THREE.Group {
    const group = new THREE.Group();
    // 2-Story Market Building (Terracotta/Brick Red)
    const bodyGeo = new THREE.BoxGeometry(12, 9, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 4.5, -4.0);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Glowing Neon Signboard ("ঘোষ সুইটস & টি")
    const signBoxGeo = new THREE.BoxGeometry(6.5, 1.1, 0.25);
    const signMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xef4444,
      emissiveIntensity: 0.9
    });
    const sign = new THREE.Mesh(signBoxGeo, signMat);
    sign.position.set(0, 4.8, 0.2);
    group.add(sign);

    // Red & Yellow Striped Awning
    const awnGeo = new THREE.BoxGeometry(11, 0.15, 2.6);
    const awnMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const awning = new THREE.Mesh(awnGeo, awnMat);
    awning.position.set(0, 3.8, 1.2);
    awning.rotation.x = 0.25;
    awning.castShadow = true;
    group.add(awning);

    // Red Stripes on Awning
    const stripeGeo = new THREE.BoxGeometry(0.6, 0.18, 2.62);
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    for (let sx = -4.8; sx <= 4.8; sx += 1.4) {
      const stripe = new THREE.Mesh(stripeGeo, redMat);
      stripe.position.set(sx, 3.8, 1.2);
      stripe.rotation.x = 0.25;
      group.add(stripe);
    }

    // Warm Glowing Shop Interior Counter & Sweets Trays
    const countGeo = new THREE.BoxGeometry(8, 1.1, 1.4);
    const countMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const counter = new THREE.Mesh(countGeo, countMat);
    counter.position.set(0, 0.55, 0.4);
    group.add(counter);

    // Warm Interior Glow
    const shopLight = new THREE.PointLight(0xfef08a, 2.5, 10);
    shopLight.position.set(0, 2.5, 0.5);
    group.add(shopLight);

    return group;
  }

  private createBritishStreetlight(): THREE.Group {
    const group = new THREE.Group();
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.85 });

    // Cast-iron Fluted Base & Pole
    const baseGeo = new THREE.CylinderGeometry(0.24, 0.35, 0.8, 8);
    const base = new THREE.Mesh(baseGeo, ironMat);
    base.position.y = 0.4;
    group.add(base);

    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 5.2, 8);
    const pole = new THREE.Mesh(poleGeo, ironMat);
    pole.position.y = 3.0;
    pole.castShadow = true;
    group.add(pole);

    // Curved Arm & Hexagonal Lantern
    const armGeo = new THREE.BoxGeometry(0.08, 0.08, 0.9);
    const arm = new THREE.Mesh(armGeo, ironMat);
    arm.position.set(0, 5.4, -0.4);
    group.add(arm);

    const lanternGeo = new THREE.CylinderGeometry(0.24, 0.16, 0.5, 6);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 1.5
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 5.15, -0.75);
    group.add(lantern);

    // Warm Light Casting onto Road Surface
    const light = new THREE.PointLight(0xfde047, 2.2, 14, 1.6);
    light.position.set(0, 4.9, -0.75);
    group.add(light);

    return group;
  }

  private createElectricPole(): THREE.Group {
    const group = new THREE.Group();
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 });
    const insMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 }); // Red/Brown Ceramic Insulator

    // Concrete Tapered Utility Pole
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.22, 7.5, 8);
    const pole = new THREE.Mesh(poleGeo, concreteMat);
    pole.position.y = 3.75;
    pole.castShadow = true;
    group.add(pole);

    // Steel Crossarms
    const armGeo = new THREE.BoxGeometry(1.6, 0.1, 0.1);
    const arm1 = new THREE.Mesh(armGeo, ironMat);
    arm1.position.set(0, 6.8, 0);
    group.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, ironMat);
    arm2.position.set(0, 5.8, 0);
    group.add(arm2);

    // Ceramic Insulators
    const insGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.16, 6);
    for (const ix of [-0.65, 0, 0.65]) {
      const ins1 = new THREE.Mesh(insGeo, insMat);
      ins1.position.set(ix, 6.95, 0);
      group.add(ins1);

      const ins2 = new THREE.Mesh(insGeo, insMat);
      ins2.position.set(ix, 5.95, 0);
      group.add(ins2);
    }

    return group;
  }

  private createYellowTaxi(): THREE.Group {
    const group = new THREE.Group();
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.85 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 });

    const bodyGeo = new THREE.BoxGeometry(1.8, 0.72, 4.2);
    const body = new THREE.Mesh(bodyGeo, yellowMat);
    body.position.y = 0.55;
    body.castShadow = true;
    group.add(body);

    const cabinGeo = new THREE.BoxGeometry(1.65, 0.62, 2.3);
    const cabin = new THREE.Mesh(cabinGeo, yellowMat);
    cabin.position.set(0, 1.15, -0.15);
    cabin.castShadow = true;
    group.add(cabin);

    const winFGeo = new THREE.BoxGeometry(1.55, 0.48, 0.08);
    const winF = new THREE.Mesh(winFGeo, glassMat);
    winF.position.set(0, 1.15, -1.32);
    winF.rotation.x = -0.3;
    group.add(winF);

    const winR = new THREE.Mesh(winFGeo, glassMat);
    winR.position.set(0, 1.15, 1.02);
    winR.rotation.x = 0.3;
    group.add(winR);

    // "TAXI" Roof Box
    const taxiSignGeo = new THREE.BoxGeometry(0.45, 0.14, 0.22);
    const taxiSignMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfef08a, emissiveIntensity: 0.9 });
    const taxiSign = new THREE.Mesh(taxiSignGeo, taxiSignMat);
    taxiSign.position.set(0, 1.54, -0.15);
    group.add(taxiSign);

    const bumpGeo = new THREE.BoxGeometry(1.9, 0.15, 0.15);
    const bumpF = new THREE.Mesh(bumpGeo, chromeMat);
    bumpF.position.set(0, 0.32, -2.15);
    group.add(bumpF);

    const taxiWheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
    taxiWheelGeo.rotateZ(Math.PI / 2);
    for (const wz of [-1.2, 1.2]) {
      for (const wx of [-0.92, 0.92]) {
        const wheel = new THREE.Mesh(taxiWheelGeo, blackMat);
        wheel.position.set(wx, 0.32, wz);
        group.add(wheel);
      }
    }

    return group;
  }

  private createTeaStall(): THREE.Group {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 });

    // Wooden Counter Table
    const tableGeo = new THREE.BoxGeometry(2.4, 0.9, 1.2);
    const table = new THREE.Mesh(tableGeo, woodMat);
    table.position.y = 0.45;
    table.castShadow = true;
    group.add(table);

    // Tilted Beach/Market Umbrella (Blue & Yellow)
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8);
    const pole = new THREE.Mesh(poleGeo, metalMat);
    pole.position.set(0.6, 1.3, 0);
    pole.rotation.z = -0.15;
    group.add(pole);

    const umbGeo = new THREE.ConeGeometry(1.8, 0.65, 12, 1, true);
    const umbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5, side: THREE.DoubleSide });
    const umbrella = new THREE.Mesh(umbGeo, umbMat);
    umbrella.position.set(0.6, 2.6, 0);
    umbrella.rotation.z = -0.15;
    group.add(umbrella);

    // Boiling Aluminium Tea Kettle
    const kettleGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 12);
    const kettle = new THREE.Mesh(kettleGeo, metalMat);
    kettle.position.set(-0.5, 1.05, 0.1);
    group.add(kettle);

    // Terracotta Chai Cups (মাটির ভাঁড়)
    const cupGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.1, 8);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
    for (let c = 0; c < 3; c++) {
      const cup = new THREE.Mesh(cupGeo, cupMat);
      cup.position.set(0.1 + c * 0.15, 0.95, -0.2);
      group.add(cup);
    }

    return group;
  }

  private createBritishPostBox(): THREE.Group {
    const group = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });

    // Round Cast-Iron Post Box Body
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16);
    const body = new THREE.Mesh(bodyGeo, redMat);
    body.position.y = 0.7;
    body.castShadow = true;
    group.add(body);

    // Domed Top
    const domeGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, redMat);
    dome.position.y = 1.4;
    group.add(dome);

    // Black Base & Letter Slit
    const baseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 16);
    const base = new THREE.Mesh(baseGeo, blackMat);
    base.position.y = 0.06;
    group.add(base);

    const slitGeo = new THREE.BoxGeometry(0.25, 0.05, 0.08);
    const slit = new THREE.Mesh(slitGeo, blackMat);
    slit.position.set(0, 1.05, 0.32);
    group.add(slit);

    return group;
  }

  private createKolkataSignpost(): THREE.Group {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b });

    // Dual Iron Posts
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8);
    for (const px of [-0.6, 0.6]) {
      const p = new THREE.Mesh(postGeo, poleMat);
      p.position.set(px, 1.2, 0);
      group.add(p);
    }

    // Yellow Signboard ("KOLKATA • কলকাতা")
    const signGeo = new THREE.BoxGeometry(1.6, 0.65, 0.06);
    const sign = new THREE.Mesh(signGeo, yellowMat);
    sign.position.set(0, 1.8, 0);
    group.add(sign);

    // Black Lettering Plate
    const letterGeo = new THREE.BoxGeometry(1.4, 0.45, 0.07);
    const letters = new THREE.Mesh(letterGeo, blackMat);
    letters.position.set(0, 1.8, 0);
    group.add(letters);

    return group;
  }

  private createBusStop(): THREE.Group {
    const group = new THREE.Group();
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    const roofGeo = new THREE.BoxGeometry(2.4, 0.12, 4.5);
    const roof = new THREE.Mesh(roofGeo, blueMat);
    roof.position.set(0, 2.6, 0);
    roof.castShadow = true;
    group.add(roof);

    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.6, 8);
    for (const pz of [-1.8, 1.8]) {
      const p = new THREE.Mesh(postGeo, blueMat);
      p.position.set(-1.0, 1.3, pz);
      group.add(p);
    }

    return group;
  }

  public update(playerZ: number): void {
    const totalDist = 480;
    for (const item of this.spawnedProps) {
      if (item.mesh.position.z > playerZ + 25) {
        item.mesh.position.z -= totalDist;
        item.mesh.position.x = item.baseX;
      }
    }
  }
}
