/**
 * No Brakes Desi Bus Driver 3D - High-Fidelity Tata/Ashok Leyland Kolkata Private Bus
 * Features:
 * - Authentic Kolkata Private Bus rear end matching real-life reference (WB 04 05711):
 *   - "SRMB TMT" advertising roof dome banner
 *   - Transparent rear window with 16 vertical metal safety grill bars ("Jali")
 *   - Dual red reflective warning triangles mounted on the grill
 *   - Yellow panel with hand-painted traditional Bengal truck art diamond/rangoli motif
 *   - Official yellow registration plate: "WB 04 05711" & red cursive "Stop"
 *   - Triple circular chrome tail lamp clusters (Amber, Red, Clear White)
 *   - Raised 3D bumper plate: "AWAZ DANGER KARO" with "~ Oley Oley Tare Tare ~"
 *   - Hanging heavy rubber mudflaps: "GOOD" (left) and "LUCK" (right)
 * - Crystal clear panoramic transparent glass windows revealing passenger interior
 * - Inside passengers sitting & swaying, driver Babu Bhai with steering wheel & conductor
 * - Garage customizable liveries & roof accessories
 * - Full 4-wheel independent suspension, throttle acceleration & weight transfer
 */

class DesiBus {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    // Physics & Kinematics
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.heading = 0;
    this.speed = 16.0; // m/s (~58 km/h initial runaway speed)
    this.baseSpeed = 16.0;
    this.maxSpeed = 46.0; // ~165 km/h throttle top speed
    this.throttleAccel = 13.0; // m/s^2 when holding GAS [W]

    this.turnSpeed = 1.75;
    this.steerAngle = 0;
    this.isDrifting = false;

    // Suspension & Dynamics
    this.rollAngle = 0;
    this.rollVelocity = 0;
    this.pitchAngle = 0;
    this.pitchVelocity = 0;
    this.suspensionY = 0;
    this.suspensionVelocity = 0;
    this.lateralSlip = 0;
    this.isAirborne = false;
    this.verticalVelocity = 0;
    this.nitroFuel = 100;
    this.isNitro = false;

    // Customization State
    this.currentLivery = 'KOLKATA'; // 'KOLKATA', 'TOOFAN', 'ROYAL', 'ROCKET'
    this.currentRoofItem = 'STANDARD'; // 'STANDARD', 'SOUNDBOX', 'GOAT', 'TWIN_NITRO'
    this.busName = '★ 206 BARASAT ⇄ HOWRAH • WB 04 05711 ★';

    // Particle pool
    this.smokePool = [];
    this.smokeIndex = 0;
    this._scratchVec = new THREE.Vector3();

    // Mesh references
    this.wheels = [];
    this.frontWheels = [];
    this.interiorPassengers = [];
    this.roofAddons = [];
    this.goatMesh = null;
    this.soundboxMesh = null;
    this.hangingPassenger = null;
    this.wiperLeft = null;
    this.wiperRight = null;
    this._cachedKolkataTextures = null;

    this.buildBus();
    this.initSmokeParticles();
    this.scene.add(this.group);
  }

  buildBus() {
    // Clear any existing children
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.wheels = [];
    this.frontWheels = [];
    this.interiorPassengers = [];
    this.roofAddons = [];

    const busBody = new THREE.Group();
    this.busBody = busBody;

    // Livery color palettes
    let colPrimary = 0x0284c7; // Classic Kolkata Sky Blue
    let colSecondary = 0xfacc15; // Bengal Golden Yellow
    let colAccent = 0xdc2626; // Crimson Red

    if (this.currentLivery === 'TOOFAN') {
      colPrimary = 0xb91c1c; // Deep Crimson Red
      colSecondary = 0xfacc15; // Golden Yellow
      colAccent = 0x1d4ed8; // Royal Blue
    } else if (this.currentLivery === 'ROYAL') {
      colPrimary = 0x581c87; // Royal Purple
      colSecondary = 0xf59e0b; // Gold
      colAccent = 0xe2e8f0; // White Silver
    } else if (this.currentLivery === 'ROCKET') {
      colPrimary = 0x15803d; // Cyber Emerald
      colSecondary = 0x38bdf8; // Neon Cyan
      colAccent = 0xfacc15; // Volt Yellow
    }

    const matPrimary = new THREE.MeshLambertMaterial({ color: colPrimary });
    const matSecondary = new THREE.MeshLambertMaterial({ color: colSecondary });
    const matAccent = new THREE.MeshLambertMaterial({ color: colAccent });
    const matDark = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const matChrome = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const matRubber = new THREE.MeshLambertMaterial({ color: 0x18181b });

    // CRYSTAL CLEAR TRANSPARENT WINDOW GLASS (Players see inside the bus)
    const matClearGlass = new THREE.MeshLambertMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    });

    // 1. Steel Chassis Frame (8.6m Length, 2.44m Width)
    const chassisGeo = new THREE.BoxGeometry(2.44, 0.45, 8.6);
    const chassis = new THREE.Mesh(chassisGeo, matDark);
    chassis.position.y = 0.72;
    busBody.add(chassis);

    // Interior Floor Matting
    const floorGeo = new THREE.PlaneGeometry(2.36, 8.3);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0.96;
    busBody.add(floor);

    // 2. DETAILED PASSENGER CABIN INTERIOR (Fully visible through transparent windows!)
    this.buildPassengerInterior(busBody);

    // 3. Lower Exterior Body Shell (Sky Blue)
    const lowerBodyGeo = new THREE.BoxGeometry(2.46, 1.25, 8.5);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, matPrimary);
    lowerBody.position.y = 1.45;
    busBody.add(lowerBody);

    // Accent Beltline Racing Stripe (Golden Yellow)
    const stripeGeo = new THREE.BoxGeometry(2.49, 0.24, 8.54);
    const stripe = new THREE.Mesh(stripeGeo, matSecondary);
    stripe.position.y = 1.95;
    busBody.add(stripe);

    // 4. Upper Cabin Window Frame Pillars
    const upperRoofFrameGeo = new THREE.BoxGeometry(2.44, 0.35, 8.2);
    const upperRoofFrame = new THREE.Mesh(upperRoofFrameGeo, matPrimary);
    upperRoofFrame.position.set(0, 3.25, 0.1);
    busBody.add(upperRoofFrame);

    // 5. TRANSPARENT PANORAMIC GLASS WINDOWS (Outside -> Inside fully visible!)
    // A) Front Split Windshield
    for (let side = -1; side <= 1; side += 2) {
      const windshieldGeo = new THREE.PlaneGeometry(1.08, 1.12);
      const windshield = new THREE.Mesh(windshieldGeo, matClearGlass);
      windshield.position.set(side * 0.58, 2.55, -4.18);
      windshield.rotation.y = Math.PI;
      busBody.add(windshield);
    }

    // B) Side Panoramic Transparent Glass Panes (Left & Right)
    for (let side = -1; side <= 1; side += 2) {
      const sideGlassGeo = new THREE.BoxGeometry(0.06, 0.95, 6.8);
      const sideGlass = new THREE.Mesh(sideGlassGeo, matClearGlass);
      sideGlass.position.set(side * 1.23, 2.62, 0.2);
      busBody.add(sideGlass);

      // Window Frame Pillars
      for (let z = -2.8; z <= 3.2; z += 1.2) {
        if (side === 1 && (z >= 0.2 && z <= 1.4)) continue; // door gap
        const pillarGeo = new THREE.BoxGeometry(0.12, 1.05, 0.12);
        const pillar = new THREE.Mesh(pillarGeo, matSecondary);
        pillar.position.set(side * 1.23, 2.62, z);
        busBody.add(pillar);
      }
    }

    // 6. EPIC GLOWING DESTINATION LIGHTBOX BOARD
    const destGeo = new THREE.BoxGeometry(1.85, 0.38, 0.28);
    const destMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const destBoard = new THREE.Mesh(destGeo, destMat);
    destBoard.position.set(0, 3.28, -4.05);
    busBody.add(destBoard);

    // Front Windshield Wipers
    const wiperGeo = new THREE.BoxGeometry(0.04, 0.55, 0.04);
    const wiperMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const wiperL = new THREE.Mesh(wiperGeo, wiperMat);
    wiperL.position.set(-0.55, 2.25, -4.2);
    wiperL.rotation.z = 0.35;
    busBody.add(wiperL);
    this.wiperLeft = wiperL;

    const wiperR = new THREE.Mesh(wiperGeo, wiperMat);
    wiperR.position.set(0.55, 2.25, -4.2);
    wiperR.rotation.z = 0.35;
    busBody.add(wiperR);
    this.wiperRight = wiperR;

    // 7. Front Chrome Bull Bar Crash Guard & Halogen Headlamps
    const bullBarGeo = new THREE.BoxGeometry(2.55, 0.42, 0.35);
    const bullBar = new THREE.Mesh(bullBarGeo, matChrome);
    bullBar.position.set(0, 0.65, -4.35);
    busBody.add(bullBar);

    // Chrome Grille
    const grilleGeo = new THREE.BoxGeometry(1.6, 0.7, 0.15);
    const grille = new THREE.Mesh(grilleGeo, matDark);
    grille.position.set(0, 1.2, -4.26);
    busBody.add(grille);

    // Headlamps
    for (let side = -1; side <= 1; side += 2) {
      const lampGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
      lampGeo.rotateX(Math.PI / 2);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(side * 0.98, 1.05, -4.26);
      busBody.add(lamp);

      // Amber Turn Signals
      const indGeo = new THREE.BoxGeometry(0.18, 0.12, 0.1);
      const indMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
      const ind = new THREE.Mesh(indGeo, indMat);
      ind.position.set(side * 1.18, 1.05, -4.25);
      busBody.add(ind);

      // Side Mirrors
      const mirrorGeo = new THREE.BoxGeometry(0.08, 0.35, 0.2);
      const mirror = new THREE.Mesh(mirrorGeo, matChrome);
      mirror.position.set(side * 1.5, 2.2, -3.9);
      busBody.add(mirror);
    }

    // 8. Open Door with Hanging Passenger
    const doorFrameGeo = new THREE.BoxGeometry(0.18, 1.95, 1.35);
    const doorFrame = new THREE.Mesh(doorFrameGeo, matDark);
    doorFrame.position.set(1.22, 1.7, 0.6);
    busBody.add(doorFrame);

    const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.85, 8);
    const pole = new THREE.Mesh(poleGeo, matChrome);
    pole.position.set(1.18, 1.68, 1.15);
    busBody.add(pole);

    const passengerGroup = new THREE.Group();
    const pBodyGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.72, 8);
    const pKurtaMat = new THREE.MeshLambertMaterial({ color: 0x059669 });
    const pBody = new THREE.Mesh(pBodyGeo, pKurtaMat);
    pBody.position.y = 0.4;
    passengerGroup.add(pBody);

    const pHeadGeo = new THREE.SphereGeometry(0.17, 12, 12);
    const pHeadMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });
    const pHead = new THREE.Mesh(pHeadGeo, pHeadMat);
    pHead.position.y = 0.88;
    passengerGroup.add(pHead);

    const turbanGeo = new THREE.TorusGeometry(0.16, 0.09, 8, 16);
    const turbanMat = new THREE.MeshLambertMaterial({ color: 0xe11d48 });
    const turban = new THREE.Mesh(turbanGeo, turbanMat);
    turban.rotation.x = Math.PI / 2;
    turban.position.y = 0.96;
    passengerGroup.add(turban);

    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.5, 8);
    const arm = new THREE.Mesh(armGeo, pKurtaMat);
    arm.rotation.z = Math.PI / 3;
    arm.position.set(0.22, 0.55, 0.22);
    passengerGroup.add(arm);

    passengerGroup.position.set(1.28, 1.12, 0.85);
    busBody.add(passengerGroup);
    this.hangingPassenger = passengerGroup;

    // 9. Roof Luggage Rack & Custom Accessories
    this.buildRoofAccessories(busBody, matChrome);

    // 10. AUTHENTIC ICONIC KOLKATA PRIVATE BUS REAR END (Matching Real Reference Photo!)
    this.buildAuthenticKolkataRear(busBody);

    this.group.add(busBody);

    // 11. Wheels (2 Front Steer Wheels, 4 Rear Dually Wheels)
    const wheelPositions = [
      { x: -1.22, y: 0.55, z: -2.8, isFront: true },
      { x: 1.22, y: 0.55, z: -2.8, isFront: true },
      { x: -1.28, y: 0.55, z: 2.2, isFront: false },
      { x: 1.28, y: 0.55, z: 2.2, isFront: false },
      { x: -1.28, y: 0.55, z: 3.3, isFront: false },
      { x: 1.28, y: 0.55, z: 3.3, isFront: false }
    ];

    const tireGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.36, 18);
    tireGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.38, 12);
    rimGeo.rotateZ(Math.PI / 2);

    wheelPositions.forEach(pos => {
      const wheelGroup = new THREE.Group();
      const tire = new THREE.Mesh(tireGeo, matRubber);
      const rim = new THREE.Mesh(rimGeo, matChrome);
      wheelGroup.add(tire);
      wheelGroup.add(rim);

      wheelGroup.position.set(pos.x, pos.y, pos.z);
      this.group.add(wheelGroup);
      this.wheels.push(wheelGroup);

      if (pos.isFront) {
        this.frontWheels.push(wheelGroup);
      }
    });
  }

  // Inside Passenger Cabin: Seats, Driver Babu Bhai & Passengers
  buildPassengerInterior(busBody) {
    const matSeat = new THREE.MeshLambertMaterial({ color: 0x1e3a8a }); // Navy Blue Cushions
    const matSkin = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });
    const kurtaColors = [0xef4444, 0x10b981, 0xf59e0b, 0x8b5cf6, 0x06b6d4];

    // Driver Seat & Babu Bhai with Steering Wheel (Front Right, Z = -3.2)
    const driverSeatGeo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
    const dSeat = new THREE.Mesh(driverSeatGeo, matSeat);
    dSeat.position.set(0.6, 1.4, -3.2);
    busBody.add(dSeat);

    // Babu Bhai Driver Figure
    const dBodyGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.65, 8);
    const dBodyMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
    const dBody = new THREE.Mesh(dBodyGeo, dBodyMat);
    dBody.position.set(0.6, 1.95, -3.2);
    busBody.add(dBody);

    const dHeadGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const dHead = new THREE.Mesh(dHeadGeo, matSkin);
    dHead.position.set(0.6, 2.45, -3.2);
    busBody.add(dHead);

    // Circular 3D Steering Wheel
    const wheelTorusGeo = new THREE.TorusGeometry(0.24, 0.04, 8, 16);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const steeringWheel = new THREE.Mesh(wheelTorusGeo, wheelMat);
    steeringWheel.position.set(0.6, 2.15, -3.65);
    steeringWheel.rotation.x = -0.55;
    busBody.add(steeringWheel);
    this.driverSteeringWheel = steeringWheel;

    // 5 Rows of Passenger Double-Seats (Left & Right of Center Aisle)
    for (let r = 0; r < 5; r++) {
      const rowZ = -2.0 + r * 1.15;

      for (let side = -1; side <= 1; side += 2) {
        // Double Bench Seat
        const benchGeo = new THREE.BoxGeometry(0.75, 0.55, 0.65);
        const bench = new THREE.Mesh(benchGeo, matSeat);
        bench.position.set(side * 0.72, 1.35, rowZ);
        busBody.add(bench);

        // Clay Passenger sitting on seat (holding head or waving!)
        const pGroup = new THREE.Group();
        const pCol = kurtaColors[(r + (side > 0 ? 1 : 0)) % kurtaColors.length];
        const bodyGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.55, 8);
        const body = new THREE.Mesh(bodyGeo, new THREE.MeshLambertMaterial({ color: pCol }));
        body.position.y = 0.35;
        pGroup.add(body);

        const headGeo = new THREE.SphereGeometry(0.15, 10, 10);
        const head = new THREE.Mesh(headGeo, matSkin);
        head.position.y = 0.75;
        pGroup.add(head);

        pGroup.position.set(side * 0.72, 1.55, rowZ);
        busBody.add(pGroup);
        this.interiorPassengers.push(pGroup);
      }
    }
  }

  // Roof Luggage & Custom Accessories
  buildRoofAccessories(busBody, matChrome) {
    const rackRailingGeo = new THREE.BoxGeometry(2.15, 0.25, 5.6);
    const rack = new THREE.Mesh(rackRailingGeo, matChrome);
    rack.position.set(0, 3.5, 0.3);
    busBody.add(rack);

    if (this.currentRoofItem === 'SOUNDBOX') {
      // GIANT DJ BASS SPEAKERS ON ROOF
      const spkGeo = new THREE.BoxGeometry(1.8, 0.9, 2.2);
      const spkMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
      const spk = new THREE.Mesh(spkGeo, spkMat);
      spk.position.set(0, 4.05, 0.2);
      busBody.add(spk);

      // 4 Speaker Cones
      for (let i = 0; i < 4; i++) {
        const coneGeo = new THREE.CylinderGeometry(0.32, 0.12, 0.15, 12);
        coneGeo.rotateX(Math.PI / 2);
        const cone = new THREE.Mesh(coneGeo, new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        cone.position.set((i % 2 === 0 ? -0.45 : 0.45), 4.15 + (i > 1 ? 0.3 : -0.2), -0.92);
        busBody.add(cone);
      }
      this.soundboxMesh = spk;
    } else if (this.currentRoofItem === 'GOAT') {
      // LIVE GOAT TIED ON ROOF (Bleats when you drift!)
      const goatGroup = new THREE.Group();
      const gBodyGeo = new THREE.BoxGeometry(0.65, 0.55, 1.1);
      const gMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      const gBody = new THREE.Mesh(gBodyGeo, gMat);
      gBody.position.y = 0.5;
      goatGroup.add(gBody);

      const gHeadGeo = new THREE.BoxGeometry(0.35, 0.35, 0.45);
      const gHead = new THREE.Mesh(gHeadGeo, gMat);
      gHead.position.set(0, 0.85, -0.6);
      goatGroup.add(gHead);

      goatGroup.position.set(0, 3.65, 0.4);
      busBody.add(goatGroup);
      this.goatMesh = goatGroup;
    } else {
      // STANDARD DESI LUGGAGE: Retro Suitcases, Spare Tire & Mango Crate
      const caseColors = [0x0284c7, 0x16a34a, 0x9333ea, 0xb45309];
      for (let i = 0; i < 4; i++) {
        const caseGeo = new THREE.BoxGeometry(0.75, 0.38, 0.95);
        const caseMat = new THREE.MeshLambertMaterial({ color: caseColors[i] });
        const c = new THREE.Mesh(caseGeo, caseMat);
        c.position.set((i % 2 === 0 ? -0.58 : 0.58), 3.75 + Math.floor(i / 2) * 0.35, -0.8 + i * 0.7);
        busBody.add(c);
        this.roofAddons.push(c);
      }

      const spareTireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 16);
      const spareTire = new THREE.Mesh(spareTireGeo, new THREE.MeshLambertMaterial({ color: 0x18181b }));
      spareTire.position.set(0, 3.75, 1.8);
      busBody.add(spareTire);
      this.roofAddons.push(spareTire);
    }
  }

  // Create High-Definition Hand-Painted Bengali Truck Art Canvas Textures (Matching User Reference Image)
  createKolkataRearTextures() {
    if (this._cachedKolkataTextures) return this._cachedKolkataTextures;

    // 1. SRMB TMT Roof Banner Canvas
    const roofCanvas = document.createElement('canvas');
    roofCanvas.width = 512;
    roofCanvas.height = 128;
    const ctxR = roofCanvas.getContext('2d');
    ctxR.fillStyle = '#facc15';
    ctxR.fillRect(0, 0, 512, 128);
    ctxR.fillStyle = '#1e3a8a';
    ctxR.font = 'bold 36px "Arial Black", Impact, sans-serif';
    ctxR.textAlign = 'center';
    ctxR.textBaseline = 'middle';
    ctxR.fillText('★ SRMB TMT ★   SRMB   ★ SRMB TMT ★', 256, 64);
    const roofTex = new THREE.CanvasTexture(roofCanvas);

    // 2. Middle Yellow Art Panel (Rangoli + Stop + Registration WB 04 05711)
    const midCanvas = document.createElement('canvas');
    midCanvas.width = 1024;
    midCanvas.height = 384;
    const ctxM = midCanvas.getContext('2d');
    ctxM.fillStyle = '#facc15';
    ctxM.fillRect(0, 0, 1024, 384);

    // "Stop" on upper left
    ctxM.fillStyle = '#dc2626';
    ctxM.font = 'bold 46px "Brush Script MT", cursive, sans-serif';
    ctxM.textAlign = 'left';
    ctxM.fillText('Stop', 55, 75);

    // Center Rangoli / Diamond Truck Art
    const cx = 512, cy = 192;
    ctxM.save();
    ctxM.translate(cx, cy);

    // Outer red diamond
    ctxM.fillStyle = '#dc2626';
    ctxM.beginPath();
    ctxM.moveTo(0, -90);
    ctxM.lineTo(90, 0);
    ctxM.lineTo(0, 90);
    ctxM.lineTo(-90, 0);
    ctxM.closePath();
    ctxM.fill();

    // Orange diamond
    ctxM.fillStyle = '#f97316';
    ctxM.beginPath();
    ctxM.moveTo(0, -65);
    ctxM.lineTo(65, 0);
    ctxM.lineTo(0, 65);
    ctxM.lineTo(-65, 0);
    ctxM.closePath();
    ctxM.fill();

    // Yellow diamond
    ctxM.fillStyle = '#fef08a';
    ctxM.beginPath();
    ctxM.moveTo(0, -40);
    ctxM.lineTo(40, 0);
    ctxM.lineTo(0, 40);
    ctxM.lineTo(-40, 0);
    ctxM.closePath();
    ctxM.fill();

    // Blue center diamond
    ctxM.fillStyle = '#0284c7';
    ctxM.beginPath();
    ctxM.moveTo(0, -20);
    ctxM.lineTo(20, 0);
    ctxM.lineTo(0, 20);
    ctxM.lineTo(-20, 0);
    ctxM.closePath();
    ctxM.fill();

    // Floral wing petals
    ctxM.strokeStyle = '#dc2626';
    ctxM.lineWidth = 10;
    ctxM.beginPath();
    ctxM.arc(-110, 0, 42, -0.6 * Math.PI, 0.6 * Math.PI);
    ctxM.stroke();
    ctxM.beginPath();
    ctxM.arc(110, 0, 42, 0.4 * Math.PI, 1.6 * Math.PI);
    ctxM.stroke();
    ctxM.restore();

    // Yellow Registration Plate on Upper Right: WB 04 05711
    const px = 760, py = 35, pw = 210, ph = 120;
    ctxM.fillStyle = '#fef08a';
    ctxM.fillRect(px, py, pw, ph);
    ctxM.strokeStyle = '#000000';
    ctxM.lineWidth = 5;
    ctxM.strokeRect(px, py, pw, ph);
    ctxM.fillStyle = '#000000';
    ctxM.font = '900 36px monospace, sans-serif';
    ctxM.textAlign = 'center';
    ctxM.fillText('WB 04', px + pw / 2, py + 48);
    ctxM.font = '900 44px monospace, sans-serif';
    ctxM.fillText('05711', px + pw / 2, py + 98);

    const midTex = new THREE.CanvasTexture(midCanvas);

    // 3. Iconic Bumper Board ("AWAZ DANGER KARO" + "Oley Oley Tare Tare")
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 1024;
    bCanvas.height = 256;
    const ctxB = bCanvas.getContext('2d');
    ctxB.fillStyle = '#ffffff';
    ctxB.fillRect(0, 0, 1024, 256);

    ctxB.lineWidth = 8;
    ctxB.strokeStyle = '#0284c7';
    ctxB.strokeRect(4, 4, 1016, 248);

    // Hazard Stripes on Left & Right
    const drawStripes = (startX, endX) => {
      for (let x = startX - 40; x < endX + 40; x += 32) {
        ctxB.fillStyle = '#ef4444';
        ctxB.beginPath();
        ctxB.moveTo(x, 0);
        ctxB.lineTo(x + 16, 0);
        ctxB.lineTo(x - 16, 256);
        ctxB.lineTo(x - 32, 256);
        ctxB.closePath();
        ctxB.fill();
      }
    };
    drawStripes(0, 110);
    drawStripes(914, 1024);

    ctxB.fillStyle = '#ffffff';
    ctxB.fillRect(115, 8, 794, 240);

    // Left: AWAZ (Green with red 3D shadow)
    ctxB.font = '900 68px Arial Black, Impact, sans-serif';
    ctxB.textAlign = 'center';
    ctxB.fillStyle = '#dc2626';
    ctxB.fillText('AWAZ', 244, 98);
    ctxB.fillStyle = '#16a34a';
    ctxB.fillText('AWAZ', 240, 94);

    // Center: DANGER (Big Red with Yellow inline)
    ctxB.font = '900 84px Arial Black, Impact, sans-serif';
    ctxB.fillStyle = '#000000';
    ctxB.fillText('DANGER', 514, 102);
    ctxB.fillStyle = '#dc2626';
    ctxB.fillText('DANGER', 512, 98);
    ctxB.strokeStyle = '#fef08a';
    ctxB.lineWidth = 3;
    ctxB.strokeText('DANGER', 512, 98);

    // Right: KARO (Sky Blue with Red 3D shadow)
    ctxB.font = '900 68px Arial Black, Impact, sans-serif';
    ctxB.fillStyle = '#dc2626';
    ctxB.fillText('KARO', 784, 98);
    ctxB.fillStyle = '#0284c7';
    ctxB.fillText('KARO', 780, 94);

    // Subtitle: "Oley Oley Tare Tare" in red cursive script
    ctxB.font = 'bold 38px "Brush Script MT", cursive, sans-serif';
    ctxB.fillStyle = '#dc2626';
    ctxB.fillText('~ Oley Oley Tare Tare ~', 512, 172);

    ctxB.strokeStyle = '#f97316';
    ctxB.lineWidth = 5;
    ctxB.beginPath();
    ctxB.moveTo(140, 202);
    ctxB.lineTo(884, 202);
    ctxB.stroke();

    const bumperTex = new THREE.CanvasTexture(bCanvas);

    // 4. Mudflap Left: "GOOD"
    const m1Canvas = document.createElement('canvas');
    m1Canvas.width = 256;
    m1Canvas.height = 256;
    const ctxM1 = m1Canvas.getContext('2d');
    ctxM1.fillStyle = '#f1f5f9';
    ctxM1.fillRect(0, 0, 256, 256);
    ctxM1.strokeStyle = '#0f172a';
    ctxM1.lineWidth = 10;
    ctxM1.strokeRect(5, 5, 246, 246);
    ctxM1.fillStyle = '#dc2626';
    ctxM1.font = '900 68px Arial Black, sans-serif';
    ctxM1.textAlign = 'center';
    ctxM1.textBaseline = 'middle';
    ctxM1.fillText('GOOD', 128, 128);
    ctxM1.strokeStyle = '#facc15';
    ctxM1.lineWidth = 3;
    ctxM1.strokeText('GOOD', 128, 128);
    const flapGoodTex = new THREE.CanvasTexture(m1Canvas);

    // 5. Mudflap Right: "LUCK"
    const m2Canvas = document.createElement('canvas');
    m2Canvas.width = 256;
    m2Canvas.height = 256;
    const ctxM2 = m2Canvas.getContext('2d');
    ctxM2.fillStyle = '#f1f5f9';
    ctxM2.fillRect(0, 0, 256, 256);
    ctxM2.strokeStyle = '#0f172a';
    ctxM2.lineWidth = 10;
    ctxM2.strokeRect(5, 5, 246, 246);
    ctxM2.fillStyle = '#dc2626';
    ctxM2.font = '900 68px Arial Black, sans-serif';
    ctxM2.textAlign = 'center';
    ctxM2.textBaseline = 'middle';
    ctxM2.fillText('LUCK', 128, 128);
    ctxM2.strokeStyle = '#facc15';
    ctxM2.lineWidth = 3;
    ctxM2.strokeText('LUCK', 128, 128);
    const flapLuckTex = new THREE.CanvasTexture(m2Canvas);

    this._cachedKolkataTextures = { roofTex, midTex, bumperTex, flapGoodTex, flapLuckTex };
    return this._cachedKolkataTextures;
  }

  // Build the iconic Kolkata bus rear matching the real reference photo
  buildAuthenticKolkataRear(busBody) {
    const textures = this.createKolkataRearTextures();

    // 1. Yellow SRMB TMT Roof Advertising Banner
    const roofBannerGeo = new THREE.PlaneGeometry(2.38, 0.42);
    const roofBannerMat = new THREE.MeshBasicMaterial({ map: textures.roofTex });
    const roofBanner = new THREE.Mesh(roofBannerGeo, roofBannerMat);
    roofBanner.position.set(0, 3.24, 4.34);
    busBody.add(roofBanner);

    // 2. Rear Window Glass (Crystal Clear Transparent revealing interior passengers)
    const rearGlassGeo = new THREE.PlaneGeometry(2.1, 0.95);
    const rearGlassMat = new THREE.MeshLambertMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });
    const rearGlass = new THREE.Mesh(rearGlassGeo, rearGlassMat);
    rearGlass.position.set(0, 2.54, 4.33);
    busBody.add(rearGlass);

    // 3. Authentic Vertical Safety Grill / Bars ("Jali")
    const grillMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const barHGeo = new THREE.BoxGeometry(2.12, 0.04, 0.04);
    const topHBar = new THREE.Mesh(barHGeo, grillMat);
    topHBar.position.set(0, 3.0, 4.36);
    busBody.add(topHBar);

    const botHBar = new THREE.Mesh(barHGeo, grillMat);
    botHBar.position.set(0, 2.08, 4.36);
    busBody.add(botHBar);

    const barVGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.92, 8);
    for (let i = 0; i < 16; i++) {
      const barX = -0.98 + (i * 0.13);
      const vBar = new THREE.Mesh(barVGeo, grillMat);
      vBar.position.set(barX, 2.54, 4.36);
      busBody.add(vBar);
    }

    // 4. Dual Red Reflective Warning Triangles mounted on Grill
    const createWarningTriangle = (x) => {
      const triGroup = new THREE.Group();
      const triMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
      const barGeo = new THREE.BoxGeometry(0.48, 0.05, 0.04);

      const bBar = new THREE.Mesh(barGeo, triMat);
      bBar.position.y = -0.18;
      triGroup.add(bBar);

      const lBar = new THREE.Mesh(barGeo, triMat);
      lBar.rotation.z = Math.PI / 3;
      lBar.position.set(-0.12, 0.04, 0);
      triGroup.add(lBar);

      const rBar = new THREE.Mesh(barGeo, triMat);
      rBar.rotation.z = -Math.PI / 3;
      rBar.position.set(0.12, 0.04, 0);
      triGroup.add(rBar);

      triGroup.position.set(x, 2.58, 4.38);
      return triGroup;
    };

    busBody.add(createWarningTriangle(-0.54)); // Left Triangle
    busBody.add(createWarningTriangle(0.54));  // Right Triangle

    // 5. Middle Yellow Belt Panel with Rangoli Art & WB 04 05711
    const midPanelGeo = new THREE.PlaneGeometry(2.38, 0.72);
    const midPanelMat = new THREE.MeshBasicMaterial({ map: textures.midTex });
    const midPanel = new THREE.Mesh(midPanelGeo, midPanelMat);
    midPanel.position.set(0, 1.7, 4.34);
    busBody.add(midPanel);

    // 6. Chrome Tail Lamp Housings with 3 Round Lights (Amber, Red, White)
    const matChrome = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const matAmber = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const matRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const matWhite = new THREE.MeshBasicMaterial({ color: 0xf8fafc });

    const lampBoxGeo = new THREE.BoxGeometry(0.56, 0.18, 0.06);
    const roundLampGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.07, 14);
    roundLampGeo.rotateX(Math.PI / 2);

    [-0.82, 0.82].forEach((boxX, bIdx) => {
      const box = new THREE.Mesh(lampBoxGeo, matChrome);
      box.position.set(boxX, 1.36, 4.35);
      busBody.add(box);

      const lAmber = new THREE.Mesh(roundLampGeo, matAmber);
      lAmber.position.set(boxX + (bIdx === 0 ? -0.18 : 0.18), 1.36, 4.38);
      busBody.add(lAmber);

      const lRed = new THREE.Mesh(roundLampGeo, matRed);
      lRed.position.set(boxX, 1.36, 4.38);
      busBody.add(lRed);

      const lWhite = new THREE.Mesh(roundLampGeo, matWhite);
      lWhite.position.set(boxX + (bIdx === 0 ? 0.18 : -0.18), 1.36, 4.38);
      busBody.add(lWhite);
    });

    // 7. Raised Bumper Box with "AWAZ DANGER KARO" Typography Plate
    const bumperGeo = new THREE.BoxGeometry(2.42, 0.42, 0.18);
    const bumperMat = new THREE.MeshBasicMaterial({ map: textures.bumperTex });
    const bumper = new THREE.Mesh(bumperGeo, bumperMat);
    bumper.position.set(0, 0.88, 4.39);
    busBody.add(bumper);

    // Black heavy chassis support hooks under bumper
    const hookMat = new THREE.MeshLambertMaterial({ color: 0x18181b });
    const hookGeo = new THREE.BoxGeometry(0.12, 0.35, 0.16);
    [-0.6, 0.6].forEach(hx => {
      const hook = new THREE.Mesh(hookGeo, hookMat);
      hook.position.set(hx, 0.55, 4.36);
      busBody.add(hook);
    });

    // 8. Hanging Heavy Rubber Mudflaps: Left = "GOOD", Right = "LUCK" (Top Hinge Pivot)
    const flapGeo = new THREE.PlaneGeometry(0.56, 0.48);
    flapGeo.translate(0, -0.24, 0); // Translate so rotation pivots at top edge!
    this.flapGood = new THREE.Mesh(flapGeo, new THREE.MeshBasicMaterial({ map: textures.flapGoodTex, side: THREE.DoubleSide }));
    this.flapGood.position.set(-0.84, 0.56, 4.45);
    busBody.add(this.flapGood);

    this.flapLuck = new THREE.Mesh(flapGeo, new THREE.MeshBasicMaterial({ map: textures.flapLuckTex, side: THREE.DoubleSide }));
    this.flapLuck.position.set(0.84, 0.56, 4.45);
    busBody.add(this.flapLuck);
  }

  setLivery(livery) {
    this.currentLivery = livery;
    this.buildBus();
  }

  setRoofItem(item) {
    this.currentRoofItem = item;
    this.buildBus();
  }

  initSmokeParticles() {
    const smokeGeo = new THREE.SphereGeometry(0.38, 6, 6);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < 32; i++) {
      const p = new THREE.Mesh(smokeGeo, smokeMat.clone());
      p.visible = false;
      this.scene.add(p);
      this.smokePool.push({
        mesh: p,
        life: 0,
        maxLife: 0.9,
        vel: new THREE.Vector3()
      });
    }
  }

  emitSmoke(pos, isDrift = false) {
    const p = this.smokePool[this.smokeIndex];
    this.smokeIndex = (this.smokeIndex + 1) % this.smokePool.length;

    p.mesh.position.set(
      pos.x + (Math.random() - 0.5) * 0.8,
      pos.y + Math.random() * 0.4,
      pos.z + (Math.random() - 0.5) * 0.8
    );
    p.mesh.scale.set(0.6, 0.6, 0.6);
    p.mesh.material.color.setHex(isDrift ? 0xe2e8f0 : 0x334155);
    p.mesh.material.opacity = isDrift ? 0.65 : 0.45;
    p.mesh.visible = true;
    p.life = 0;
    p.maxLife = isDrift ? 0.9 : 0.6;
    p.vel.set((Math.random() - 0.5) * 1.8, 1.2 + Math.random() * 0.8, (Math.random() - 0.5) * 1.8);
  }

  updatePhysics(dt, input) {
    // 1. THROTTLE ACCELERATION & WEIGHT TRANSFER SQUAT
    let targetPitch = 0;
    if (input.throttle) {
      this.speed = Math.min(this.speed + this.throttleAccel * dt, this.maxSpeed);
      targetPitch = 0.06; // Rear squats down under acceleration
      if (Math.random() < 0.45) {
        this._scratchVec.copy(this.position);
        this._scratchVec.x -= 1.26;
        this._scratchVec.y += 2.5;
        this._scratchVec.z += 4.0;
        this.emitSmoke(this._scratchVec, false);
      }
    } else {
      if (this.speed > this.baseSpeed) {
        this.speed = Math.max(this.baseSpeed, this.speed - dt * 2.8);
        targetPitch = -0.04; // Nose dives down on deceleration
      } else {
        this.speed = Math.min(this.speed + dt * 0.4, this.baseSpeed);
      }
    }

    // 2. NITRO BOOST WITH POWER SQUAT
    if (input.nitro && this.nitroFuel > 0) {
      this.isNitro = true;
      this.nitroFuel = Math.max(0, this.nitroFuel - dt * 32);
      this.speed = Math.min(this.speed + dt * 24.0, this.maxSpeed * 1.25);
      targetPitch = 0.12; // Massive rear squat under nitro thrust!
    } else {
      this.isNitro = false;
      this.nitroFuel = Math.min(100, this.nitroFuel + dt * 5.0);
    }

    // 3. STEERING & LATERAL MOMENTUM / SLIP ANGLE DYNAMICS
    const steerInput = (input.left ? 1 : 0) - (input.right ? 1 : 0);
    const speedRatio = Math.min(this.speed / 28.0, 1.8);
    const gripFactor = Math.max(0.62, 1.0 - (speedRatio - 1.0) * 0.38);

    this.steerAngle = THREE.MathUtils.lerp(this.steerAngle, steerInput * 0.44, dt * 9.5);

    // 4. HANDBRAKE DRIFT & OVERSTEER SLIP PHYSICS
    this.isDrifting = input.drift && this.speed > 8.0;

    let effectiveTurnRate = this.steerAngle * this.turnSpeed * gripFactor;
    if (this.isDrifting) {
      effectiveTurnRate *= 2.2;
      // Drift slides the tail out sideways!
      const targetSlip = -steerInput * this.speed * 0.55;
      this.lateralSlip = THREE.MathUtils.lerp(this.lateralSlip, targetSlip, dt * 10.0);

      // Emit continuous burning rubber smoke from rear tires
      this._scratchVec.copy(this.position);
      this._scratchVec.x -= 1.28;
      this._scratchVec.y += 0.4;
      this._scratchVec.z += 2.8;
      this.emitSmoke(this._scratchVec, true);

      this._scratchVec.x = this.position.x + 1.28;
      this.emitSmoke(this._scratchVec, true);

      if (this.currentRoofItem === 'GOAT' && Math.random() < 0.05 && window.busAudio) {
        window.busAudio.playGoatBleat();
      }
    } else {
      // Natural tire grip restores lateral velocity
      this.lateralSlip = THREE.MathUtils.lerp(this.lateralSlip, 0, dt * 7.5);
    }

    this.heading += effectiveTurnRate * dt;

    // 5. TRANSLATION WITH BOTH FORWARD AND LATERAL INERTIA
    const fwdX = -Math.sin(this.heading);
    const fwdZ = -Math.cos(this.heading);
    const rightX = -fwdZ;
    const rightZ = fwdX;

    this.position.x += (fwdX * this.speed + rightX * this.lateralSlip) * dt;
    this.position.z += (fwdZ * this.speed + rightZ * this.lateralSlip) * dt;

    // Chassis drift yaw: tail steps out visibly!
    const driftAngle = Math.atan2(this.lateralSlip, Math.max(1.0, this.speed));
    this.busBody.rotation.y = THREE.MathUtils.lerp(this.busBody.rotation.y, driftAngle * 0.65, dt * 12.0);

    // 6. SPRING-DAMPER PITCH (SQUAT & DIVE DYNAMICS)
    const pitchSpring = 22.0;
    const pitchDamp = 7.5;
    const pitchForce = (targetPitch - this.pitchAngle) * pitchSpring;
    this.pitchVelocity += (pitchForce - this.pitchVelocity * pitchDamp) * dt;
    this.pitchAngle += this.pitchVelocity * dt;

    // 7. 4-WHEEL SUSPENSION BODY ROLL & HIGH-G 2-WHEEL TILT PHYSICS
    const lateralG = (this.speed * effectiveTurnRate) / 9.81 + (this.lateralSlip / 11.0);
    let targetRoll = -lateralG * (this.isDrifting ? 0.38 : 0.26);

    // Extreme turn: Bus tilts on 2 wheels!
    if (Math.abs(lateralG) > 0.65 && !this.isDrifting) {
      targetRoll = -Math.sign(lateralG) * (0.34 + (Math.abs(lateralG) - 0.65) * 0.45);
    }

    const rollSpring = 16.0;
    const rollDamping = 6.8;
    const rollForce = (targetRoll - this.rollAngle) * rollSpring;
    this.rollVelocity += (rollForce - this.rollVelocity * rollDamping) * dt;
    this.rollAngle += this.rollVelocity * dt;

    // 8. VERTICAL HEAVE & ROAD BUMP DYNAMICS
    const roadBump = Math.sin(this.position.z * 0.35) * 0.02 * (this.speed / 16.0);
    const heaveSpring = 36.0;
    const heaveDamp = 9.0;
    const heaveForce = -this.suspensionY * heaveSpring;
    this.suspensionVelocity += (heaveForce - this.suspensionVelocity * heaveDamp) * dt;
    this.suspensionY += this.suspensionVelocity * dt;
    this.busBody.position.y = this.suspensionY + roadBump;

    // 9. RUBBER MUDFLAP PENDULUM DRAG DYNAMICS
    if (this.flapGood && this.flapLuck) {
      const flapDrag = (this.speed / 24.0) * 0.62 + Math.sin(performance.now() * 0.022) * 0.12;
      const flapAngle = -flapDrag + this.pitchAngle * 1.8;
      this.flapGood.rotation.x = flapAngle;
      this.flapLuck.rotation.x = flapAngle;
    }

    // 10. ROOF LUGGAGE & GOAT G-FORCE PHYSICS
    if (this.goatMesh) {
      this.goatMesh.rotation.z = -this.rollAngle * 0.85;
      this.goatMesh.rotation.x = -this.pitchAngle * 1.3 + Math.sin(performance.now() * 0.015) * 0.1;
    }
    this.roofAddons.forEach((c, idx) => {
      c.rotation.z = Math.sin(performance.now() * 0.02 + idx) * this.rollAngle * 0.45;
    });

    // 11. PASSENGER INERTIA
    this.interiorPassengers.forEach((p, idx) => {
      p.rotation.z = -this.rollAngle * 1.45;
      p.rotation.x = (this.pitchAngle * 1.6) + Math.sin(performance.now() * 0.015 + idx) * 0.08;
    });

    if (this.hangingPassenger) {
      this.hangingPassenger.rotation.z = -this.rollAngle * 2.4 - (this.lateralSlip / 8.0) * 0.6;
      this.hangingPassenger.rotation.x = Math.sin(performance.now() * 0.018) * 0.22 + this.pitchAngle * 1.2;
    }

    // Wiper sweep
    if (this.wiperLeft && this.wiperRight) {
      const wiperSweep = Math.sin(performance.now() * 0.005) * 0.45;
      this.wiperLeft.rotation.z = 0.35 + wiperSweep;
      this.wiperRight.rotation.z = 0.35 + wiperSweep;
    }

    // Steer wheel turns inside cabin
    if (this.driverSteeringWheel) {
      this.driverSteeringWheel.rotation.z = -this.steerAngle * 2.2;
    }

    // 12. AIRBORNE SUSPENSION JUMP & LANDING SLAM
    if (this.isAirborne) {
      this.verticalVelocity -= 22.0 * dt;
      this.position.y += this.verticalVelocity * dt;
      this.pitchAngle = THREE.MathUtils.lerp(this.pitchAngle, -0.25, dt * 5.0);

      if (this.position.y <= 0) {
        this.position.y = 0;
        this.isAirborne = false;
        // High impact suspension slam!
        this.suspensionY = -0.34;
        this.suspensionVelocity = this.verticalVelocity * 0.4;
        this.verticalVelocity = 0;
        this.pitchAngle = 0.08;
        if (window.busAudio) window.busAudio.playJumpWhoosh();

        // Radial landing dust blast
        for (let k = 0; k < 8; k++) {
          const ang = (k / 8) * Math.PI * 2;
          this._scratchVec.copy(this.position);
          this._scratchVec.x += Math.cos(ang) * 1.6;
          this._scratchVec.y = 0.2;
          this._scratchVec.z += Math.sin(ang) * 1.6;
          this.emitSmoke(this._scratchVec, true);
        }
      }
    }

    this.group.position.copy(this.position);
    this.group.rotation.y = this.heading;

    this.busBody.rotation.z = this.rollAngle;
    this.busBody.rotation.x = this.pitchAngle;

    // 13. ROTATE & STEER WHEELS
    const wheelRotDelta = (this.speed * dt) / 0.55;
    this.wheels.forEach(w => {
      w.children[0].rotation.x += wheelRotDelta;
      w.children[1].rotation.x += wheelRotDelta;
    });

    this.frontWheels.forEach(fw => {
      fw.rotation.y = this.steerAngle;
    });

    // 14. SMOKE PARTICLES
    this.smokePool.forEach(p => {
      if (!p.mesh.visible) return;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.mesh.visible = false;
      } else {
        p.mesh.position.addScaledVector(p.vel, dt);
        const progress = p.life / p.maxLife;
        p.mesh.scale.setScalar(0.6 + progress * 1.6);
        p.mesh.material.opacity = (1.0 - progress) * 0.55;
      }
    });
  }

  triggerRampJump(power = 15.5) {
    if (this.isAirborne) return;
    this.isAirborne = true;
    this.verticalVelocity = power;
    this.pitchAngle = -0.32;
    if (window.busAudio) window.busAudio.playJumpWhoosh();
  }

  explode() {
    this.speed = 0;
    if (this.busBody) {
      this.busBody.rotation.x = 0.55;
      this.busBody.rotation.z = 1.25;
      this.busBody.position.y = 0.45;
    }
  }

  reset(x = 0, y = 0, z = 0) {
    this.position.set(x, y, z);
    this.heading = 0;
    this.speed = this.baseSpeed;
    this.rollAngle = 0;
    this.rollVelocity = 0;
    this.pitchAngle = 0;
    this.pitchVelocity = 0;
    this.suspensionY = 0;
    this.suspensionVelocity = 0;
    this.lateralSlip = 0;
    this.steerAngle = 0;
    this.isDrifting = false;
    this.isAirborne = false;
    this.verticalVelocity = 0;
    this.nitroFuel = 100;
    this.isNitro = false;

    if (this.busBody) {
      this.busBody.rotation.set(0, 0, 0);
      this.busBody.position.set(0, 0, 0);
    }
    this.group.position.copy(this.position);
    this.group.rotation.set(0, 0, 0);

    // Hide all smoke particles
    this.smokePool.forEach(p => {
      p.mesh.visible = false;
      p.life = 0;
    });
  }
}

window.DesiBus = DesiBus;
