import * as THREE from 'three';

export interface StandLocation {
  id: string;
  name: string;
  position: THREE.Vector3;
  stopLinePos: THREE.Vector3;
  jetBridgePos: THREE.Vector3;
}

export class AirportWorld {
  public scene: THREE.Scene;
  public stands: Record<string, StandLocation> = {};
  public baggageDepotPos = new THREE.Vector3(-45, 0, 20);
  public fuelDepotPos = new THREE.Vector3(45, 0, 30);
  public cargoDepotPos = new THREE.Vector3(-50, 0, -35);
  public garagePos = new THREE.Vector3(0, 0, 50);

  // Animated elements
  private beaconLight: THREE.PointLight | null = null;
  private beaconMesh: THREE.Mesh | null = null;
  private timeElapsed: number = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initStands();
    this.buildLighting();
    this.buildTerrainAndTarmac();
    this.buildRunway();
    this.buildMarkings();
    this.buildTerminal();
    this.buildControlTower();
    this.buildHangarsAndDepots();
    this.buildRampLightTowers();
    this.buildDetails();
  }

  private initStands() {
    this.stands['A1'] = {
      id: 'A1',
      name: 'Stand A1 (Main Gate)',
      position: new THREE.Vector3(-25, 0, -10),
      stopLinePos: new THREE.Vector3(-25, 0, -5),
      jetBridgePos: new THREE.Vector3(-32, 0, -10)
    };

    this.stands['A2'] = {
      id: 'A2',
      name: 'Stand A2 (Mid Gate)',
      position: new THREE.Vector3(15, 0, -10),
      stopLinePos: new THREE.Vector3(15, 0, -5),
      jetBridgePos: new THREE.Vector3(8, 0, -10)
    };

    this.stands['A3'] = {
      id: 'A3',
      name: 'Stand A3 (Cargo Stand)',
      position: new THREE.Vector3(45, 0, -25),
      stopLinePos: new THREE.Vector3(45, 0, -20),
      jetBridgePos: new THREE.Vector3(38, 0, -25)
    };
  }

  private buildLighting() {
    // Hemispheric sky / ground ambient light
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x334455, 0.65);
    this.scene.add(hemiLight);

    // Sun directional light with soft shadows
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    sunLight.position.set(70, 90, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 250;
    const d = 110;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Warm ambient fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);
  }

  private buildTerrainAndTarmac() {
    // Outer grass airfield ground
    const grassGeo = new THREE.PlaneGeometry(380, 380);
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.05;
    grass.receiveShadow = true;
    this.scene.add(grass);

    // Main Asphalt / Concrete Apron Ramp
    const apronGeo = new THREE.PlaneGeometry(190, 140);
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0x34495e,
      roughness: 0.85,
      metalness: 0.1
    });
    const apron = new THREE.Mesh(apronGeo, apronMat);
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(0, 0, 5);
    apron.receiveShadow = true;
    this.scene.add(apron);
  }

  private buildRunway() {
    // Runway asphalt strip
    const runwayGeo = new THREE.PlaneGeometry(280, 24);
    const runwayMat = new THREE.MeshStandardMaterial({
      color: 0x1e272e,
      roughness: 0.9,
      metalness: 0.05
    });
    const runway = new THREE.Mesh(runwayGeo, runwayMat);
    runway.rotation.x = -Math.PI / 2;
    runway.position.set(0, 0.01, -75);
    runway.receiveShadow = true;
    this.scene.add(runway);

    // Runway threshold stripes (piano keys)
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -8; i <= 8; i += 2) {
      const stripeGeo = new THREE.PlaneGeometry(8, 0.9);
      const stripeL = new THREE.Mesh(stripeGeo, whiteMat);
      stripeL.rotation.x = -Math.PI / 2;
      stripeL.position.set(-130, 0.02, -75 + i);
      this.scene.add(stripeL);

      const stripeR = new THREE.Mesh(stripeGeo, whiteMat);
      stripeR.rotation.x = -Math.PI / 2;
      stripeR.position.set(130, 0.02, -75 + i);
      this.scene.add(stripeR);
    }

    // Runway center dashes
    for (let x = -115; x <= 115; x += 18) {
      const dashGeo = new THREE.PlaneGeometry(10, 0.8);
      const dash = new THREE.Mesh(dashGeo, whiteMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.02, -75);
      this.scene.add(dash);
    }

    // Runway edge lights (Green threshold, white edges, red end)
    const lightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 6);
    const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const whiteLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let x = -135; x <= 135; x += 15) {
      const isThreshold = Math.abs(x) > 120;
      const mat = isThreshold ? greenMat : whiteLightMat;

      const lightN = new THREE.Mesh(lightGeo, mat);
      lightN.position.set(x, 0.2, -87.5);
      this.scene.add(lightN);

      const lightS = new THREE.Mesh(lightGeo, mat);
      lightS.position.set(x, 0.2, -62.5);
      this.scene.add(lightS);
    }
  }

  private buildMarkings() {
    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
    const redMat = new THREE.MeshBasicMaterial({ color: 0xe74c3c });

    // Main taxiway centerline connecting runway to apron
    const taxiCenterGeo = new THREE.PlaneGeometry(160, 0.4);
    const taxiCenter = new THREE.Mesh(taxiCenterGeo, yellowMat);
    taxiCenter.rotation.x = -Math.PI / 2;
    taxiCenter.position.set(0, 0.02, -35);
    this.scene.add(taxiCenter);

    // Cross taxiway
    const crossTaxiGeo = new THREE.PlaneGeometry(0.4, 60);
    const crossTaxi = new THREE.Mesh(crossTaxiGeo, yellowMat);
    crossTaxi.rotation.x = -Math.PI / 2;
    crossTaxi.position.set(0, 0.02, -5);
    this.scene.add(crossTaxi);

    // Lead-in lines & parking boxes for stands A1, A2, A3
    Object.values(this.stands).forEach((stand) => {
      // Lead-in line
      const leadGeo = new THREE.PlaneGeometry(0.35, 18);
      const lead = new THREE.Mesh(leadGeo, yellowMat);
      lead.rotation.x = -Math.PI / 2;
      lead.position.set(stand.position.x, 0.02, stand.position.z + 5);
      this.scene.add(lead);

      // Yellow & Red STOP bar box
      const stopBarGeo = new THREE.PlaneGeometry(5, 0.6);
      const stopBar = new THREE.Mesh(stopBarGeo, redMat);
      stopBar.rotation.x = -Math.PI / 2;
      stopBar.position.set(stand.stopLinePos.x, 0.02, stand.stopLinePos.z);
      this.scene.add(stopBar);

      // Stand ID circle pad
      const ringGeo = new THREE.RingGeometry(2.5, 2.8, 16);
      const ring = new THREE.Mesh(ringGeo, yellowMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(stand.position.x, 0.02, stand.position.z);
      this.scene.add(ring);

      // Large painted tarmac text label for Stand
      const standCanvas = document.createElement('canvas');
      standCanvas.width = 256;
      standCanvas.height = 128;
      const sCtx = standCanvas.getContext('2d')!;
      sCtx.fillStyle = '#f1c40f';
      sCtx.font = 'bold 54px sans-serif';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText(stand.id, 128, 64);

      const standTex = new THREE.CanvasTexture(standCanvas);
      const standPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 3),
        new THREE.MeshBasicMaterial({ map: standTex, transparent: true })
      );
      standPlane.rotation.x = -Math.PI / 2;
      standPlane.position.set(stand.position.x, 0.03, stand.position.z + 8.5);
      this.scene.add(standPlane);
    });

    // Painted Ground Guidance Route leading from Garage to Stand A1
    const chevronCanvas = document.createElement('canvas');
    chevronCanvas.width = 128;
    chevronCanvas.height = 128;
    const cCtx = chevronCanvas.getContext('2d')!;
    cCtx.fillStyle = '#f1c40f';
    cCtx.beginPath();
    cCtx.moveTo(64, 15);
    cCtx.lineTo(110, 110);
    cCtx.lineTo(64, 85);
    cCtx.lineTo(18, 110);
    cCtx.closePath();
    cCtx.fill();

    const chevronTex = new THREE.CanvasTexture(chevronCanvas);
    const chevronMat = new THREE.MeshBasicMaterial({ map: chevronTex, transparent: true });

    // Path points from garage (0, 35) to Stand A1 (-25, -10)
    const routePoints = [
      new THREE.Vector3(0, 0.03, 34),
      new THREE.Vector3(-3, 0.03, 26),
      new THREE.Vector3(-8, 0.03, 18),
      new THREE.Vector3(-14, 0.03, 10),
      new THREE.Vector3(-20, 0.03, 2),
      new THREE.Vector3(-25, 0.03, -4)
    ];

    routePoints.forEach((pt, idx) => {
      const arrMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), chevronMat);
      arrMesh.rotation.x = -Math.PI / 2;
      arrMesh.position.copy(pt);
      // Angle towards next point
      const next = idx < routePoints.length - 1 ? routePoints[idx + 1] : new THREE.Vector3(-25, 0.03, -10);
      const angle = Math.atan2(next.x - pt.x, next.z - pt.z);
      arrMesh.rotation.z = -angle;
      this.scene.add(arrMesh);
    });

    // Safety service vehicle road lanes (Double dashed white lines)
    const roadMat = new THREE.MeshBasicMaterial({ color: 0xbdc3c7 });
    for (let x = -80; x <= 80; x += 6) {
      const roadDash = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.25), roadMat);
      roadDash.rotation.x = -Math.PI / 2;
      roadDash.position.set(x, 0.02, 16);
      this.scene.add(roadDash);
    }
  }

  private buildTerminal() {
    const terminalGroup = new THREE.Group();

    // Main terminal glass & concrete block
    const mainBuildingGeo = new THREE.BoxGeometry(110, 16, 26);
    const mainBuildingMat = new THREE.MeshStandardMaterial({
      color: 0xecf0f1,
      roughness: 0.3,
      metalness: 0.1
    });
    const mainBuilding = new THREE.Mesh(mainBuildingGeo, mainBuildingMat);
    mainBuilding.position.set(0, 8, -48);
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    terminalGroup.add(mainBuilding);

    // Curved architectural roof
    const roofGeo = new THREE.CylinderGeometry(56, 56, 114, 24, 1, false, 0, Math.PI);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x2980b9,
      roughness: 0.2,
      metalness: 0.5
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.z = Math.PI / 2;
    roof.position.set(0, 15, -48);
    roof.scale.set(0.12, 1, 0.25);
    terminalGroup.add(roof);

    // Front terminal glass facade
    const glassGeo = new THREE.PlaneGeometry(104, 11);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.8
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 7.5, -34.9);
    terminalGroup.add(glass);

    // Jet bridges (Passenger boarding bridges)
    const buildJetBridge = (posX: number) => {
      const bridge = new THREE.Group();
      // Arm tube
      const armGeo = new THREE.BoxGeometry(3.5, 3.8, 16);
      const armMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, roughness: 0.4 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(0, 4.5, 8);
      arm.castShadow = true;
      bridge.add(arm);

      // Support pillar
      const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 4.5, 8);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(0, 2.25, 12);
      pillar.castShadow = true;
      bridge.add(pillar);

      // Accordion cabin head
      const cabinGeo = new THREE.BoxGeometry(4.2, 4.2, 4);
      const cabinMat = new THREE.MeshStandardMaterial({ color: 0x34495e });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 4.5, 17);
      bridge.add(cabin);

      bridge.position.set(posX, 0, -35);
      return bridge;
    };

    terminalGroup.add(buildJetBridge(-25));
    terminalGroup.add(buildJetBridge(15));

    this.scene.add(terminalGroup);
  }

  private buildControlTower() {
    const towerGroup = new THREE.Group();

    // Base building
    const baseGeo = new THREE.BoxGeometry(14, 5, 14);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 2.5, 0);
    towerGroup.add(base);

    // Tall shaft
    const shaftGeo = new THREE.CylinderGeometry(3.2, 4.2, 34, 12);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(0, 22, 0);
    shaft.castShadow = true;
    towerGroup.add(shaft);

    // Cab (Observation deck)
    const cabGeo = new THREE.CylinderGeometry(6, 4.2, 6, 12);
    const cabMat = new THREE.MeshStandardMaterial({
      color: 0x1e3799,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 40, 0);
    towerGroup.add(cab);

    // Roof & Antenna
    const roofGeo = new THREE.ConeGeometry(5.5, 2.5, 12);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 44, 0);
    towerGroup.add(roof);

    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.2, 8, 6);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xd63031 });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(0, 48.5, 0);
    towerGroup.add(antenna);

    // Rotating Red Aviation Beacon
    const beaconLight = new THREE.PointLight(0xff0000, 2, 80);
    beaconLight.position.set(0, 52.5, 0);
    towerGroup.add(beaconLight);
    this.beaconLight = beaconLight;

    const beaconMeshGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const beaconMeshMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const beaconMesh = new THREE.Mesh(beaconMeshGeo, beaconMeshMat);
    beaconMesh.position.set(0, 52.5, 0);
    towerGroup.add(beaconMesh);
    this.beaconMesh = beaconMesh;

    towerGroup.position.set(-68, 0, -20);
    this.scene.add(towerGroup);
  }

  private buildHangarsAndDepots() {
    // Service Garage & Vehicle Bay (Where vehicles spawn)
    const garageGroup = new THREE.Group();
    const garageBuildingGeo = new THREE.BoxGeometry(32, 8, 18);
    const garageBuildingMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d });
    const garageBuilding = new THREE.Mesh(garageBuildingGeo, garageBuildingMat);
    garageBuilding.position.set(0, 4, 0);
    garageGroup.add(garageBuilding);

    // Roll-up bay doors (3 doors)
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    for (let i = -1; i <= 1; i++) {
      const doorGeo = new THREE.PlaneGeometry(7.5, 5.5);
      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(i * 9, 2.75, -9.05);
      door.rotation.y = Math.PI;
      garageGroup.add(door);
    }

    garageGroup.position.copy(this.garagePos);
    this.scene.add(garageGroup);

    // Baggage Sort Depot (Staging Area)
    const baggageGroup = new THREE.Group();
    // Canopy shelter
    const canopyRoofGeo = new THREE.BoxGeometry(20, 0.6, 14);
    const canopyRoofMat = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
    const canopyRoof = new THREE.Mesh(canopyRoofGeo, canopyRoofMat);
    canopyRoof.position.set(0, 5.5, 0);
    baggageGroup.add(canopyRoof);

    // 4 Support poles
    const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 5.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x34495e });
    [
      [-9, -6], [9, -6], [-9, 6], [9, 6]
    ].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(px, 2.75, pz);
      baggageGroup.add(pole);
    });

    // Conveyor belt model
    const conveyorGeo = new THREE.BoxGeometry(14, 1.2, 2.5);
    const conveyorMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const conveyor = new THREE.Mesh(conveyorGeo, conveyorMat);
    conveyor.position.set(0, 0.6, 0);
    baggageGroup.add(conveyor);

    // Stacked luggage containers & bags
    const bagColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0x9b59b6, 0xf39c12];
    for (let i = 0; i < 8; i++) {
      const bagGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
      const bagMat = new THREE.MeshStandardMaterial({ color: bagColors[i % bagColors.length] });
      const bag = new THREE.Mesh(bagGeo, bagMat);
      bag.position.set(-5 + i * 1.4, 1.4, (i % 2 === 0 ? 0.3 : -0.3));
      baggageGroup.add(bag);
    }

    baggageGroup.position.copy(this.baggageDepotPos);
    this.scene.add(baggageGroup);

    // Fuel Depot (White Cylindrical Fuel Tanks + Piping)
    const fuelGroup = new THREE.Group();
    const tankGeo = new THREE.CylinderGeometry(4.5, 4.5, 8, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    const tank1 = new THREE.Mesh(tankGeo, tankMat);
    tank1.position.set(-6, 4, 0);
    tank1.castShadow = true;
    fuelGroup.add(tank1);

    const tank2 = new THREE.Mesh(tankGeo, tankMat);
    tank2.position.set(6, 4, 0);
    tank2.castShadow = true;
    fuelGroup.add(tank2);

    // Flammable warning sign
    const signGeo = new THREE.BoxGeometry(4, 1.6, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 3, 5);
    fuelGroup.add(sign);

    fuelGroup.position.copy(this.fuelDepotPos);
    this.scene.add(fuelGroup);

    // Cargo Depot (High shipping containers / ULDs)
    const cargoGroup = new THREE.Group();
    const containerColors = [0x2980b9, 0xc0392b, 0x27ae60, 0xf39c12];
    for (let c = 0; c < 5; c++) {
      const cGeo = new THREE.BoxGeometry(5.5, 3.2, 3.0);
      const cMat = new THREE.MeshStandardMaterial({ color: containerColors[c % containerColors.length] });
      const container = new THREE.Mesh(cGeo, cMat);
      container.position.set((c - 2) * 6.5, 1.6, (c % 2) * 3);
      container.castShadow = true;
      cargoGroup.add(container);
    }
    cargoGroup.position.copy(this.cargoDepotPos);
    this.scene.add(cargoGroup);
  }

  private buildRampLightTowers() {
    const positions = [
      new THREE.Vector3(-45, 0, -2),
      new THREE.Vector3(-5, 0, -2),
      new THREE.Vector3(35, 0, -2),
      new THREE.Vector3(-45, 0, 35),
      new THREE.Vector3(35, 0, 35)
    ];

    positions.forEach((pos) => {
      const tower = new THREE.Group();
      // Mast
      const mastGeo = new THREE.CylinderGeometry(0.3, 0.5, 18, 8);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 9;
      mast.castShadow = true;
      tower.add(mast);

      // Crossbar head
      const barGeo = new THREE.BoxGeometry(4.5, 0.4, 0.6);
      const bar = new THREE.Mesh(barGeo, mastMat);
      bar.position.y = 18;
      tower.add(bar);

      // Light fixtures
      const lampGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let i = -1.5; i <= 1.5; i += 1.5) {
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(i, 17.6, 0.4);
        tower.add(lamp);
      }

      tower.position.copy(pos);
      this.scene.add(tower);
    });
  }

  private buildDetails() {
    // Safety Cones scattered along apron roads
    const coneGeo = new THREE.ConeGeometry(0.25, 0.75, 8);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xff6b00, roughness: 0.3 });
    for (let i = 0; i < 16; i++) {
      const cone = new THREE.Mesh(coneGeo, coneMat);
      const x = -60 + i * 8;
      const z = 12 + (i % 2 === 0 ? 1 : -1) * 1.5;
      cone.position.set(x, 0.38, z);
      this.scene.add(cone);
    }

    // Distant 3D Low-poly clouds in the sky
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });
    for (let c = 0; c < 12; c++) {
      const cloudGroup = new THREE.Group();
      const numPuffs = 4 + Math.floor(Math.random() * 3);
      for (let p = 0; p < numPuffs; p++) {
        const puffSize = 8 + Math.random() * 8;
        const puff = new THREE.Mesh(new THREE.SphereGeometry(puffSize, 8, 8), cloudMat);
        puff.position.set(p * 7, Math.random() * 2, Math.random() * 4);
        cloudGroup.add(puff);
      }
      cloudGroup.position.set(
        -180 + Math.random() * 360,
        65 + Math.random() * 25,
        -180 + Math.random() * 360
      );
      this.scene.add(cloudGroup);
    }
  }

  public update(delta: number) {
    this.timeElapsed += delta;
    // Animate beacon on top of ATC tower
    if (this.beaconLight && this.beaconMesh) {
      const pulse = (Math.sin(this.timeElapsed * 4) + 1) * 0.5;
      this.beaconLight.intensity = 0.5 + pulse * 2.5;
      (this.beaconMesh.material as THREE.MeshBasicMaterial).color.setRGB(1, pulse * 0.4, pulse * 0.4);
    }
  }
}
