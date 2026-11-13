/**
 * No Brakes Desi Bus Driver 3D - Ultra-Realistic Highway Traffic Simulation
 * High-fidelity authentic 3D Indian vehicle models:
 * 1. Bajaj Compact RE Auto-Rickshaw (3-Wheeler with Khaki Driver & Passenger Cabin)
 * 2. Kolkata Yellow Ambassador Taxi (Hindustan Ambassador with TAXI Lightbox & Checkers)
 * 3. Maruti Suzuki Swift / Dzire (Modern Indian Hatchback with Projector Headlamps & Alloys)
 * 4. Tata 1613 National Highway Goods Truck (Wooden Floral Art Bed, "HORN OK PLEASE" Tailgate)
 * 5. Royal Enfield Bullet 350 (Teardrop Tank, Chrome Pea-Shooter Exhaust & Biker Figure)
 * 6. Mahindra Scorpio Police Highway Interceptor (Bullbar & Flashing Emergency Lightbar)
 */

class DesiTraffic {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];

    // 6 Spacious National Highway Lanes across the 24m Wide Roadway
    this.lanes = [-8.8, -5.3, -1.8, 1.8, 5.3, 8.8];
    this.poolSize = 24;

    // Cache canvas textures
    this._truckArtTex = null;
    this._taxiTex = null;

    // Police Highway Interceptor
    this.policeActive = false;
    this.policeMesh = this.createPoliceInterceptor();
    this.policeSpeed = 0;
    this.policeTimer = 0;
    this.policeBeaconL = null;
    this.policeBeaconR = null;
    this.scene.add(this.policeMesh);
    this.policeMesh.visible = false;

    this.initPool();
  }

  // Realistic Mahindra Scorpio Highway Patrol SUV
  createPoliceInterceptor() {
    const group = new THREE.Group();
    const matWhite = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    const matBlueDecal = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
    const matDark = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const matRubber = new THREE.MeshLambertMaterial({ color: 0x18181b });
    const matChrome = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const matGlass = new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });

    // Muscular Scorpio SUV Body
    const bodyGeo = new THREE.BoxGeometry(2.1, 1.1, 4.3);
    const body = new THREE.Mesh(bodyGeo, matWhite);
    body.position.y = 0.95;
    group.add(body);

    // Dark Blue Police High-Contrast Decal Band
    const stripeGeo = new THREE.BoxGeometry(2.14, 0.32, 4.32);
    const stripe = new THREE.Mesh(stripeGeo, matBlueDecal);
    stripe.position.y = 1.05;
    group.add(stripe);

    // Front Sloped Windshield & Cabin Glass
    const cabinGeo = new THREE.BoxGeometry(1.95, 0.85, 2.4);
    const cabin = new THREE.Mesh(cabinGeo, matWhite);
    cabin.position.set(0, 1.65, 0.2);
    group.add(cabin);

    const winGeo = new THREE.PlaneGeometry(1.7, 0.75);
    const win = new THREE.Mesh(winGeo, matGlass);
    win.position.set(0, 1.62, -1.02);
    win.rotation.y = Math.PI;
    group.add(win);

    // Roof Rails
    [-0.85, 0.85].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 2.2), matDark);
      rail.position.set(rx, 2.12, 0.2);
      group.add(rail);
    });

    // Heavy Steel Push Bumper (Crash Guard)
    const bullBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.25), matDark);
    bullBar.position.set(0, 0.65, -2.25);
    group.add(bullBar);

    // Red & Blue Emergency Strobe Lightbar on Roof
    const bGeo = new THREE.BoxGeometry(0.42, 0.18, 0.22);
    const matRedB = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const matBlueB = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    const bL = new THREE.Mesh(bGeo, matRedB);
    bL.position.set(-0.52, 2.18, 0.15);
    group.add(bL);
    this.policeBeaconL = bL;

    const bR = new THREE.Mesh(bGeo, matBlueB);
    bR.position.set(0.52, 2.18, 0.15);
    group.add(bR);
    this.policeBeaconR = bR;

    // Rear Mounted Spare Wheel
    const spareTire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.28, 14), matDark);
    spareTire.rotateX(Math.PI / 2);
    spareTire.position.set(0, 1.15, 2.25);
    group.add(spareTire);

    // 4 Heavy All-Terrain SUV Wheels
    const wGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.28, 14);
    wGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.3, 10);
    rimGeo.rotateZ(Math.PI / 2);

    [
      { x: -1.1, z: -1.35 },
      { x: 1.1, z: -1.35 },
      { x: -1.1, z: 1.4 },
      { x: 1.1, z: 1.4 }
    ].forEach(p => {
      const w = new THREE.Mesh(wGeo, matRubber);
      const r = new THREE.Mesh(rimGeo, matChrome);
      w.position.set(p.x, 0.44, p.z);
      r.position.set(p.x, 0.44, p.z);
      group.add(w);
      group.add(r);
    });

    return group;
  }

  // Generate Truck Art Tailgate Texture ("HORN OK PLEASE")
  getTruckTailgateTexture() {
    if (this._truckArtTex) return this._truckArtTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    // Rich Wooden Bed Background
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 512, 384);

    // Yellow Art Border
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#facc15';
    ctx.strokeRect(8, 8, 496, 368);

    // Red Inner Border
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#dc2626';
    ctx.strokeRect(20, 20, 472, 344);

    // Top: HORN OK PLEASE
    ctx.font = '900 48px "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center';

    // HORN
    ctx.fillStyle = '#16a34a';
    ctx.fillText('HORN', 120, 110);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeText('HORN', 120, 110);

    // OK in center circle
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(256, 100, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.font = '900 52px "Arial Black", Impact, sans-serif';
    ctx.fillText('OK', 256, 118);

    // PLEASE
    ctx.font = '900 48px "Arial Black", Impact, sans-serif';
    ctx.fillStyle = '#0284c7';
    ctx.fillText('PLEASE', 390, 110);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeText('PLEASE', 390, 110);

    // Traditional Symmetrical Lotus/Floral Motif
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(256, 165);
    ctx.lineTo(290, 220);
    ctx.lineTo(256, 205);
    ctx.lineTo(222, 220);
    ctx.closePath();
    ctx.fill();

    // Bottom Slogan: USE DIPPER AT NIGHT
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Arial Black", sans-serif';
    ctx.fillText('USE DIPPER AT NIGHT', 256, 275);

    // Red/White Chevron Hazard Stripes at the base
    for (let x = 20; x < 490; x += 40) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(x, 305);
      ctx.lineTo(x + 20, 305);
      ctx.lineTo(x, 360);
      ctx.lineTo(x - 20, 360);
      ctx.closePath();
      ctx.fill();
    }

    this._truckArtTex = new THREE.CanvasTexture(canvas);
    return this._truckArtTex;
  }

  // Generate Kolkata Taxi Door & Continuous Blue Stripe Texture (Exact match to User Reference Photo!)
  getTaxiSideTexture() {
    if (this._taxiTex) return this._taxiTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // Kolkata Taxi Golden-Yellow Body
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 512, 160);

    // Iconic Solid Royal Blue Horizontal Stripe (Exact match to Reference Photo)
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, 68, 512, 24);

    // Circular Red Taxi Department Emblem on Front Door (Exact match to Reference Photo)
    const emX = 180, emY = 112, emR = 26;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(emX, emY, emR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = '900 16px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TAXI', emX, emY);

    // Front door upper black text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('WB-02', 180, 52);

    // Rear quarter text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('CALCUTTA TAXI', 380, 84);

    this._taxiTex = new THREE.CanvasTexture(canvas);
    return this._taxiTex;
  }

  triggerPoliceChase(busPos) {
    if (this.policeActive) return;
    this.policeActive = true;
    this.policeMesh.visible = true;
    this.policeMesh.position.set(busPos.x, 0, busPos.z + 36.0);
    this.policeTimer = 0;
    if (window.busAudio) window.busAudio.startPoliceSiren();
  }

  stopPoliceChase() {
    this.policeActive = false;
    this.policeMesh.visible = false;
    if (window.busAudio) window.busAudio.stopPoliceSiren();
  }

  reset(busZ = 0) {
    this.stopPoliceChase();
    this.vehicles.forEach((v, idx) => {
      v.active = true;
      v.mesh.visible = true;
      // Stagger lanes so adjacent lanes never block simultaneously
      v.lane = (idx * 2 + Math.floor(idx / 3)) % this.lanes.length;
      v.mesh.position.x = this.lanes[v.lane];
      v.mesh.position.y = 0;
      v.mesh.position.z = busZ - 85.0 - (idx * 28.0);
      v.mesh.rotation.set(0, 0, 0);
      v.nearMissTriggered = false;
      v.swerveTimer = 0;
      v.swerveDir = 0;
    });
  }

  initPool() {
    const types = ['AUTO', 'TAXI', 'CAR', 'TRUCK', 'BIKE'];

    for (let i = 0; i < this.poolSize; i++) {
      const type = types[i % types.length];
      const mesh = this.createRealisticVehicle(type);
      mesh.visible = false;
      this.scene.add(mesh);

      const lane = (i * 2 + Math.floor(i / 3)) % this.lanes.length;
      this.vehicles.push({
        mesh: mesh,
        type: type,
        speed: 10.0 + Math.random() * 6.0,
        lane: lane,
        active: false,
        swerveTimer: 0,
        swerveDir: 0,
        nearMissTriggered: false,
        radius: (type === 'BIKE' ? 1.0 : type === 'AUTO' ? 1.4 : type === 'TRUCK' ? 2.3 : 1.8)
      });
    }
  }

  createRealisticVehicle(type) {
    const group = new THREE.Group();

    const matRubber = new THREE.MeshLambertMaterial({ color: 0x18181b });
    const matChrome = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const matDark = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const matGlass = new THREE.MeshLambertMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.65 });

    if (type === 'AUTO') {
      // 1. BAJAJ COMPACT RE AUTO-RICKSHAW (3-Wheeler with Khaki Driver & Passengers)
      const matGreen = new THREE.MeshLambertMaterial({ color: 0x15803d });
      const matYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const matLeather = new THREE.MeshLambertMaterial({ color: 0x27272a });
      const matSkin = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });
      const matKhaki = new THREE.MeshLambertMaterial({ color: 0xd97706 });

      // Lower Green Body Tub with Yellow Waistline
      const tubGeo = new THREE.BoxGeometry(1.48, 0.62, 2.45);
      const tub = new THREE.Mesh(tubGeo, matGreen);
      tub.position.y = 0.58;
      group.add(tub);

      const waistGeo = new THREE.BoxGeometry(1.52, 0.14, 2.47);
      const waist = new THREE.Mesh(waistGeo, matYellow);
      waist.position.y = 0.72;
      group.add(waist);

      // Angled Aerodynamic Front Nose with Front Wheel Arch
      const noseGeo = new THREE.CylinderGeometry(0.35, 0.68, 0.85, 8);
      noseGeo.rotateX(Math.PI / 2);
      const nose = new THREE.Mesh(noseGeo, matGreen);
      nose.position.set(0, 0.58, -1.35);
      group.add(nose);

      // Central Round Halogen Headlamp with Chrome Rim
      const lightGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 14);
      lightGeo.rotateX(Math.PI / 2);
      const light = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      light.position.set(0, 0.68, -1.8);
      group.add(light);

      // Amber Indicators on Nose
      [-0.42, 0.42].forEach(ix => {
        const ind = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.08), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
        ind.position.set(ix, 0.68, -1.65);
        group.add(ind);
      });

      // Curved Yellow Canvas Canopy Roof with Rear Window
      const canopyGeo = new THREE.BoxGeometry(1.42, 0.88, 1.95);
      const canopy = new THREE.Mesh(canopyGeo, matYellow);
      canopy.position.set(0, 1.34, 0.18);
      group.add(canopy);

      // Sloped Cabin Front Windshield with Single Wiper
      const winGeo = new THREE.PlaneGeometry(1.25, 0.58);
      const win = new THREE.Mesh(winGeo, matGlass);
      win.position.set(0, 1.18, -0.85);
      win.rotation.y = Math.PI;
      group.add(win);

      const wiper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.03), matDark);
      wiper.position.set(0.15, 1.18, -0.87);
      wiper.rotation.z = 0.35;
      group.add(wiper);

      // Handlebars with Grips & Dual Round Chrome Side Mirrors
      const hbar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.85, 8), matChrome);
      hbar.rotateZ(Math.PI / 2);
      hbar.position.set(0, 0.95, -0.75);
      group.add(hbar);

      [-0.45, 0.45].forEach(mx => {
        const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 10), matChrome);
        mirror.rotateX(Math.PI / 2);
        mirror.position.set(mx, 1.12, -0.75);
        group.add(mirror);
      });

      // Driver Figure in Khaki Uniform
      const dBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.55, 8), matKhaki);
      dBody.position.set(0, 1.1, -0.4);
      group.add(dBody);

      const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), matSkin);
      dHead.position.set(0, 1.48, -0.4);
      group.add(dHead);

      const dCap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8), matKhaki);
      dCap.position.set(0, 1.58, -0.4);
      group.add(dCap);

      // Passenger Rear Bench Seat
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.42, 0.65), matLeather);
      bench.position.set(0, 0.88, 0.68);
      group.add(bench);

      // Rear Engine Grille & Tail Lamps
      const rGrille = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.32, 0.05), matDark);
      rGrille.position.set(0, 0.58, 1.24);
      group.add(rGrille);

      [-0.55, 0.55].forEach(tx => {
        const tLamp = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.06), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        tLamp.position.set(tx, 0.65, 1.25);
        group.add(tLamp);
      });

      // 3 Wheels (1 Front Center, 2 Rear Dually Offset)
      const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 14);
      wheelGeo.rotateZ(Math.PI / 2);

      const frontWheel = new THREE.Mesh(wheelGeo, matRubber);
      frontWheel.position.set(0, 0.32, -1.35);
      group.add(frontWheel);

      [-0.74, 0.74].forEach(wx => {
        const rWheel = new THREE.Mesh(wheelGeo, matRubber);
        rWheel.position.set(wx, 0.32, 0.78);
        group.add(rWheel);
      });
    } else if (type === 'TAXI') {
      // 2. ICONIC KOLKATA AMBASSADOR TAXI (Hindustan Ambassador Mark II)
      const matTaxiYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
      const taxiTexture = this.getTaxiSideTexture();

      // Curved Vintage Lower Body
      const bodyGeo = new THREE.BoxGeometry(1.88, 0.78, 3.8);
      const body = new THREE.Mesh(bodyGeo, matTaxiYellow);
      body.position.y = 0.68;
      group.add(body);

      // Kolkata Taxi Checkered Side Decal Band
      const decalGeo = new THREE.PlaneGeometry(3.6, 0.48);
      const decalMat = new THREE.MeshBasicMaterial({ map: taxiTexture, side: THREE.DoubleSide });

      [-0.95, 0.95].forEach((dx, sIdx) => {
        const decal = new THREE.Mesh(decalGeo, decalMat);
        decal.position.set(dx, 0.72, 0);
        decal.rotation.y = (sIdx === 0 ? -Math.PI / 2 : Math.PI / 2);
        group.add(decal);
      });

      // Classic Rounded Bulbous Bonnet with Center Chrome Spear
      const bonnetGeo = new THREE.CylinderGeometry(0.88, 0.94, 1.45, 10);
      bonnetGeo.rotateX(Math.PI / 2);
      const bonnet = new THREE.Mesh(bonnetGeo, matTaxiYellow);
      bonnet.position.set(0, 0.72, -1.35);
      group.add(bonnet);

      const spear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.4), matChrome);
      spear.position.set(0, 0.98, -1.35);
      group.add(spear);

      // Wide Vintage Chrome Front Grille
      const grilleGeo = new THREE.BoxGeometry(1.35, 0.42, 0.12);
      const grille = new THREE.Mesh(grilleGeo, matChrome);
      grille.position.set(0, 0.68, -2.08);
      group.add(grille);

      // Twin Round Halogen Headlamps with Chrome Rings
      for (let side = -1; side <= 1; side += 2) {
        const headGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 14);
        headGeo.rotateX(Math.PI / 2);
        const head = new THREE.Mesh(headGeo, new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        head.position.set(side * 0.76, 0.75, -2.08);
        group.add(head);

        // Lower amber parking round light
        const parkGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 10);
        parkGeo.rotateX(Math.PI / 2);
        const park = new THREE.Mesh(parkGeo, new THREE.MeshBasicMaterial({ color: 0xf97316 }));
        park.position.set(side * 0.76, 0.52, -2.08);
        group.add(park);
      }

      // Rounded Passenger Roof Cabin
      const roofGeo = new THREE.BoxGeometry(1.72, 0.75, 2.25);
      const roof = new THREE.Mesh(roofGeo, matTaxiYellow);
      roof.position.set(0, 1.42, 0.18);
      group.add(roof);

      // Sloped Front Windshield with Red Sun-Strip (Exact match to Reference Photo)
      const frontWin = new THREE.PlaneGeometry(1.52, 0.65);
      const fWin = new THREE.Mesh(frontWin, matGlass);
      fWin.position.set(0, 1.38, -0.96);
      fWin.rotation.y = Math.PI;
      group.add(fWin);

      const sunStripGeo = new THREE.PlaneGeometry(1.52, 0.16);
      const sunStripMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
      const sunStrip = new THREE.Mesh(sunStripGeo, sunStripMat);
      sunStrip.position.set(0, 1.62, -0.97);
      sunStrip.rotation.y = Math.PI;
      group.add(sunStrip);

      // Rear Sloped Window
      const rWin = new THREE.Mesh(new THREE.PlaneGeometry(1.48, 0.6), matGlass);
      rWin.position.set(0, 1.38, 1.32);
      group.add(rWin);

      // Chrome Side Mirrors
      [-0.98, 0.98].forEach(mx => {
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.18), matChrome);
        mirror.position.set(mx, 1.25, -0.85);
        group.add(mirror);
      });

      // Illuminated "TAXI" Roof Lightbox
      const taxiLightGeo = new THREE.BoxGeometry(0.72, 0.22, 0.32);
      const taxiLight = new THREE.Mesh(taxiLightGeo, new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
      taxiLight.position.set(0, 1.9, 0.25);
      group.add(taxiLight);

      // Heavy Front & Rear Chrome Bumpers with Overrider Guards
      [-2.12, 2.05].forEach((bz, bIdx) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.22, 0.18), matChrome);
        b.position.set(0, 0.42, bz);
        group.add(b);

        [-0.55, 0.55].forEach(ox => {
          const overrider = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.34, 0.22), matDark);
          overrider.position.set(ox, 0.48, bz + (bIdx === 0 ? -0.04 : 0.04));
          group.add(overrider);
        });
      });

      // 4 Wheels: Steel Rims with Dark Center Hubs & Chrome Rim Edge (Exact match to Reference Photo)
      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.26, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.27, 12);
      rimGeo.rotateZ(Math.PI / 2);
      const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.29, 10);
      hubGeo.rotateZ(Math.PI / 2);

      [
        { x: -0.96, z: -1.3 },
        { x: 0.96, z: -1.3 },
        { x: -0.96, z: 1.3 },
        { x: 0.96, z: 1.3 }
      ].forEach(pos => {
        const w = new THREE.Mesh(wheelGeo, matRubber);
        const r = new THREE.Mesh(rimGeo, matChrome);
        const h = new THREE.Mesh(hubGeo, matDark);
        w.position.set(pos.x, 0.38, pos.z);
        r.position.set(pos.x, 0.38, pos.z);
        h.position.set(pos.x, 0.38, pos.z);
        group.add(w);
        group.add(r);
        group.add(h);
      });
    } else if (type === 'CAR') {
      // 3. MODERN INDIAN HATCHBACK (Maruti Suzuki Swift - Metallic Crimson)
      const carColors = [0xdc2626, 0x0284c7, 0xf8fafc];
      const carCol = carColors[Math.floor(Math.random() * carColors.length)];
      const matCar = new THREE.MeshLambertMaterial({ color: carCol });
      const matAlloy = new THREE.MeshLambertMaterial({ color: 0xcfd8dc });

      // Sculpted Modern Aerodynamic Lower Body
      const bodyGeo = new THREE.BoxGeometry(1.82, 0.68, 3.65);
      const body = new THREE.Mesh(bodyGeo, matCar);
      body.position.y = 0.62;
      group.add(body);

      // Signature Swift Floating Roofline with Blacked-Out Pillars
      const cabinGeo = new THREE.BoxGeometry(1.58, 0.68, 2.1);
      const cabin = new THREE.Mesh(cabinGeo, matCar);
      cabin.position.set(0, 1.25, 0.12);
      group.add(cabin);

      // Black Pillars & Window Glazing
      const winGeo = new THREE.PlaneGeometry(1.45, 0.62);
      const win = new THREE.Mesh(winGeo, matGlass);
      win.position.set(0, 1.22, -0.94);
      win.rotation.y = Math.PI;
      group.add(win);

      const rWin = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.58), matGlass);
      rWin.position.set(0, 1.22, 1.18);
      group.add(rWin);

      // Rear Roof Spoiler
      const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.08, 0.35), matDark);
      spoiler.position.set(0, 1.62, 1.15);
      group.add(spoiler);

      // Swept-back Large Clear Projector Headlamp Pods with DRLs
      for (let side = -1; side <= 1; side += 2) {
        const hlGeo = new THREE.BoxGeometry(0.36, 0.18, 0.18);
        const hl = new THREE.Mesh(hlGeo, new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        hl.position.set(side * 0.74, 0.72, -1.82);
        hl.rotation.y = side * 0.25;
        group.add(hl);

        // C-Shaped Modern Tail Lamp
        const tlGeo = new THREE.BoxGeometry(0.24, 0.28, 0.12);
        const tl = new THREE.Mesh(tlGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        tl.position.set(side * 0.78, 0.82, 1.84);
        group.add(tl);
      }

      // Front Honeycomb Hex Grille with Chrome Bar
      const gGeo = new THREE.BoxGeometry(0.92, 0.32, 0.12);
      const g = new THREE.Mesh(gGeo, matDark);
      g.position.set(0, 0.58, -1.84);
      group.add(g);

      const chromeBar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.13), matChrome);
      chromeBar.position.set(0, 0.62, -1.85);
      group.add(chromeBar);

      // 4 Modern Sporty 5-Spoke Alloy Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const alloyGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.27, 10);
      alloyGeo.rotateZ(Math.PI / 2);

      [
        { x: -0.92, z: -1.22 },
        { x: 0.92, z: -1.22 },
        { x: -0.92, z: 1.25 },
        { x: 0.92, z: 1.25 }
      ].forEach(pos => {
        const w = new THREE.Mesh(wheelGeo, matRubber);
        const a = new THREE.Mesh(alloyGeo, matAlloy);
        w.position.set(pos.x, 0.35, pos.z);
        a.position.set(pos.x, 0.35, pos.z);
        group.add(w);
        group.add(a);
      });
    } else if (type === 'TRUCK') {
      // 4. HEAVY INDIAN HIGHWAY GOODS TRUCK (Tata 1613 with "HORN OK PLEASE" Truck Art)
      const matCab = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }); // Royal Blue Driver Cab
      const matWoodBed = new THREE.MeshLambertMaterial({ color: 0x92400e }); // High Wooden Slats
      const matAwning = new THREE.MeshLambertMaterial({ color: 0xfacc15 }); // Sun-visor
      const tailgateTexture = this.getTruckTailgateTexture();

      // Heavy Driver Cab with Cowl & Split Windshield
      const cabGeo = new THREE.BoxGeometry(2.35, 1.95, 2.3);
      const cab = new THREE.Mesh(cabGeo, matCab);
      cab.position.set(0, 1.55, -2.1);
      group.add(cab);

      // Split Front Windshield
      for (let side = -1; side <= 1; side += 2) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 0.72), matGlass);
        win.position.set(side * 0.55, 1.95, -3.26);
        win.rotation.y = Math.PI;
        group.add(win);
      }

      // Windshield Sun-Visor Awning ("ALL INDIA PERMIT")
      const visorGeo = new THREE.BoxGeometry(2.42, 0.32, 0.45);
      const visor = new THREE.Mesh(visorGeo, matAwning);
      visor.position.set(0, 2.55, -2.25);
      group.add(visor);

      // Heavy Front Steel Bull Bar with Crash Steps
      const bbGeo = new THREE.BoxGeometry(2.48, 0.58, 0.32);
      const bb = new THREE.Mesh(bbGeo, matChrome);
      bb.position.set(0, 0.68, -3.32);
      group.add(bb);

      // Dual Fog Lamps on Bull Bar
      [-0.85, 0.85].forEach(fx => {
        const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
        fl.rotateX(Math.PI / 2);
        fl.position.set(fx, 0.72, -3.42);
        group.add(fl);
      });

      // High Slatted Wooden Cargo Body
      const bedGeo = new THREE.BoxGeometry(2.45, 1.85, 4.6);
      const bed = new THREE.Mesh(bedGeo, matWoodBed);
      bed.position.set(0, 1.55, 1.45);
      group.add(bed);

      // Authentic "HORN OK PLEASE" Hand-Painted Tailgate
      const tailGeo = new THREE.PlaneGeometry(2.42, 1.8);
      const tailMat = new THREE.MeshBasicMaterial({ map: tailgateTexture });
      const tailgate = new THREE.Mesh(tailGeo, tailMat);
      tailgate.position.set(0, 1.55, 3.76);
      group.add(tailgate);

      // Vertical Black Exhaust Stack Chimney behind Cab
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8), matDark);
      chimney.position.set(-1.18, 2.4, -0.85);
      group.add(chimney);

      // Under-Chassis Cylindrical Diesel Fuel Tank
      const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.4, 12), matChrome);
      fuelTank.rotateZ(Math.PI / 2);
      fuelTank.position.set(1.15, 0.65, 0.6);
      group.add(fuelTank);

      // 6 Heavy Wheels (2 Steer, 4 Dually Rear)
      const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.36, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.38, 10);
      rimGeo.rotateZ(Math.PI / 2);
      const matRimRed = new THREE.MeshLambertMaterial({ color: 0xb91c1c });

      [
        { x: -1.22, z: -2.1 },
        { x: 1.22, z: -2.1 },
        { x: -1.25, z: 1.4 },
        { x: 1.25, z: 1.4 },
        { x: -1.25, z: 2.7 },
        { x: 1.25, z: 2.7 }
      ].forEach(pos => {
        const w = new THREE.Mesh(wheelGeo, matRubber);
        const r = new THREE.Mesh(rimGeo, matRimRed);
        w.position.set(pos.x, 0.55, pos.z);
        r.position.set(pos.x, 0.55, pos.z);
        group.add(w);
        group.add(r);
      });
    } else {
      // 5. ROYAL ENFIELD CLASSIC 350 STEALTH BLACK (Exact match to Reference Photo 2!)
      const matStealthBlack = new THREE.MeshLambertMaterial({ color: 0x18181b });
      const matMatteEngine = new THREE.MeshLambertMaterial({ color: 0x09090b });
      const matDiscSilver = new THREE.MeshLambertMaterial({ color: 0xd4d4d8 });
      const matDarkJacket = new THREE.MeshLambertMaterial({ color: 0x09090b });

      // Teardrop Stealth Fuel Tank
      const tankGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.95, 10);
      tankGeo.rotateX(Math.PI / 2);
      const tank = new THREE.Mesh(tankGeo, matStealthBlack);
      tank.position.set(0, 0.88, -0.22);
      group.add(tank);

      // Subtle Royal Enfield Tank Decal Badge
      const tankBadge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.65), new THREE.MeshLambertMaterial({ color: 0x3f3f46 }));
      tankBadge.position.set(0, 0.96, -0.22);
      group.add(tankBadge);

      // Matte Black Single-Cylinder 350cc Engine Block with Cooling Fins
      const engineGeo = new THREE.BoxGeometry(0.38, 0.5, 0.6);
      const engine = new THREE.Mesh(engineGeo, matMatteEngine);
      engine.position.set(0, 0.55, -0.15);
      group.add(engine);

      // Straight Matte Black Silencer Exhaust Pipe (Exact match to Reference Photo)
      const silencer = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 1.6, 10), matStealthBlack);
      silencer.rotateX(Math.PI / 2);
      silencer.position.set(0.22, 0.35, 0.45);
      group.add(silencer);

      // Round Retro Headlamp with Black Peak Cowl
      const hlGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 14);
      hlGeo.rotateX(Math.PI / 2);
      const hl = new THREE.Mesh(hlGeo, new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      hl.position.set(0, 0.98, -0.92);
      group.add(hl);

      // Black Handlebars & Round Black Mirrors
      const hbar = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.82, 8), matStealthBlack);
      hbar.rotateZ(Math.PI / 2);
      hbar.position.set(0, 1.15, -0.65);
      group.add(hbar);

      [-0.42, 0.42].forEach(mx => {
        const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 8), matStealthBlack);
        mirror.rotateX(Math.PI / 2);
        mirror.position.set(mx, 1.3, -0.65);
        group.add(mirror);
      });

      // Single Low-Slung Bucket Rider Saddle (Bobber style matching Reference Photo)
      const seatGeo = new THREE.BoxGeometry(0.35, 0.1, 0.48);
      const seat = new THREE.Mesh(seatGeo, matStealthBlack);
      seat.position.set(0, 0.86, 0.25);
      group.add(seat);

      // Curved Rear Black Fender
      const fenderGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.18, 12, 1, false, 0, Math.PI);
      const fender = new THREE.Mesh(fenderGeo, matStealthBlack);
      fender.rotation.z = Math.PI / 2;
      fender.position.set(0, 0.44, 0.85);
      group.add(fender);

      // Matte Black Multi-Spoke Alloy Wheels with Silver Disc Brakes (Exact match to Reference Photo!)
      const bikeWheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 18);
      bikeWheelGeo.rotateZ(Math.PI / 2);
      const alloyGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.16, 12);
      alloyGeo.rotateZ(Math.PI / 2);
      const discGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 12);
      discGeo.rotateZ(Math.PI / 2);

      [
        { z: -0.92 },
        { z: 0.85 }
      ].forEach(pos => {
        const w = new THREE.Mesh(bikeWheelGeo, matRubber);
        const a = new THREE.Mesh(alloyGeo, matStealthBlack);
        const d = new THREE.Mesh(discGeo, matDiscSilver);
        w.position.set(0, 0.42, pos.z);
        a.position.set(0, 0.42, pos.z);
        d.position.set(0, 0.42, pos.z);
        group.add(w);
        group.add(a);
        group.add(d);
      });

      // 3D Rider Figure in Black Stealth Biker Jacket & Helmet
      const riderBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.68, 8), matDarkJacket);
      riderBody.position.set(0, 1.35, 0.12);
      riderBody.rotation.x = -0.3; // Sporty forward lean
      group.add(riderBody);

      const riderLegs = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.5), matStealthBlack);
      riderLegs.position.set(0, 0.95, 0.22);
      group.add(riderLegs);

      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), matStealthBlack);
      helmet.position.set(0, 1.82, -0.05);
      group.add(helmet);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.12), matDark);
      visor.position.set(0, 1.82, -0.22);
      group.add(visor);
    }

    return group;
  }

  // Air Horn Panics & Clears Highway Traffic (Vehicles quickly give side!)
  honkReaction(busPos) {
    let panickedCount = 0;
    this.vehicles.forEach(v => {
      if (!v.active) return;
      const dz = v.mesh.position.z - busPos.z;
      // If vehicle is ahead of bus within 75m
      if (dz < 0 && dz > -75.0) {
        v.swerveTimer = 2.5;
        v.swerveSpeed = 8.5;
        // Swerve quickly outwards to give clear passing lane
        v.swerveDir = (v.mesh.position.x >= busPos.x ? 1 : -1);
        if (Math.abs(v.mesh.position.x) > 9.2) {
          v.swerveDir = -Math.sign(v.mesh.position.x);
        }
        panickedCount++;
      }
    });
    return panickedCount;
  }

  // Full Newtonian Impact Physics for Crashed Vehicles
  launchVehiclePhysics(v, busPos, busSpeed) {
    if (!v || !v.mesh) return;
    const dirX = (v.mesh.position.x >= busPos.x ? 1 : -1);
    v.physVel = new THREE.Vector3(
      dirX * (12.0 + Math.random() * 9.0),
      9.0 + Math.random() * 7.0,
      -busSpeed * 0.85
    );
    v.physRot = new THREE.Vector3(
      (Math.random() - 0.5) * 14.0,
      (Math.random() - 0.5) * 18.0,
      dirX * (6.0 + Math.random() * 8.0)
    );
  }

  update(dt, busPos, busSpeed, onNearMiss, onCollision) {
    this.vehicles.forEach((v, idx) => {
      // Dynamic Airborne Impact Physics (When hit by bus!)
      if (v.physVel) {
        v.physVel.y -= 26.0 * dt; // Gravity
        v.mesh.position.addScaledVector(v.physVel, dt);
        v.mesh.rotation.x += v.physRot.x * dt;
        v.mesh.rotation.y += v.physRot.y * dt;
        v.mesh.rotation.z += v.physRot.z * dt;

        // Ground bounce on pavement
        if (v.mesh.position.y <= 0) {
          v.mesh.position.y = 0;
          v.physVel.y *= -0.38;
          v.physRot.multiplyScalar(0.65);
        }

        // Recycle if tumbled far off road or behind bus
        if (v.mesh.position.z > busPos.z + 65.0 || v.mesh.position.z < busPos.z - 170.0 || Math.abs(v.mesh.position.x) > 30.0) {
          v.physVel = null;
          v.physRot = null;
          v.mesh.rotation.set(0, 0, 0);
          v.mesh.position.y = 0;
          v.mesh.position.z = busPos.z - 130.0 - Math.random() * 80.0;
          v.lane = Math.floor(Math.random() * this.lanes.length);
          v.mesh.position.x = this.lanes[v.lane];
        }
        return;
      }

      if (!v.active) {
        v.active = true;
        v.mesh.visible = true;
        v.lane = (idx * 2 + Math.floor(idx / 3)) % this.lanes.length;
        v.mesh.position.x = this.lanes[v.lane];
        v.mesh.position.z = busPos.z - 85.0 - (idx * 28.0);
        v.nearMissTriggered = false;
        v.swerveTimer = 0;
      }

      // Traffic moves forward (-Z)
      v.mesh.position.z -= v.speed * dt;

      // PROACTIVE REAR-VIEW MIRROR AI: Vehicles give side when bus roars behind them!
      const distBehind = v.mesh.position.z - busPos.z;
      if (distBehind < -1.5 && distBehind > -45.0 && v.swerveTimer <= 0) {
        const dx = Math.abs(v.mesh.position.x - busPos.x);
        if (dx < 2.9) {
          // Driver sees runaway bus in rear mirror and yields lane!
          v.swerveTimer = 1.9;
          v.swerveSpeed = 6.8;
          v.swerveDir = (v.mesh.position.x >= busPos.x ? 1 : -1);
          if (Math.abs(v.mesh.position.x) > 9.0) {
            v.swerveDir = -Math.sign(v.mesh.position.x);
          }
        }
      }

      // Swerve reaction (from horn or approaching bus)
      if (v.swerveTimer > 0) {
        v.swerveTimer -= dt;
        const sSpeed = v.swerveSpeed || 7.0;
        v.mesh.position.x += v.swerveDir * dt * sSpeed;
        v.mesh.position.x = Math.max(-10.8, Math.min(10.8, v.mesh.position.x));
      }

      // Recycle vehicle when bus passes far ahead
      if (v.mesh.position.z > busPos.z + 50.0) {
        v.mesh.position.z = busPos.z - 130.0 - Math.random() * 90.0;
        v.lane = Math.floor(Math.random() * this.lanes.length);
        v.mesh.position.x = this.lanes[v.lane];
        v.nearMissTriggered = false;
        v.swerveTimer = 0;
      }

      // Near-Miss Overtake Detection
      const dx = Math.abs(v.mesh.position.x - busPos.x);
      const dz = Math.abs(v.mesh.position.z - busPos.z);

      if (!v.nearMissTriggered && dz < 3.5 && dx < 3.2 && dx > 1.3 && busSpeed > 16.0) {
        v.nearMissTriggered = true;
        if (onNearMiss) onNearMiss(v);
      }

      // Collision Check
      if (dz < 3.6 && dx < 1.75) {
        if (onCollision) onCollision(v);
      }
    });

    // Update Police Interceptor Chase
    if (this.policeActive) {
      this.policeTimer += dt;
      this.policeSpeed = busSpeed * 1.04 + 1.2;
      this.policeMesh.position.z -= this.policeSpeed * dt;
      this.policeMesh.position.x = THREE.MathUtils.lerp(this.policeMesh.position.x, busPos.x, dt * 2.8);

      if (this.policeBeaconL && this.policeBeaconR) {
        const strobe = Math.sin(performance.now() * 0.025) > 0;
        this.policeBeaconL.visible = strobe;
        this.policeBeaconR.visible = !strobe;
      }

      const pDz = Math.abs(this.policeMesh.position.z - busPos.z);
      const pDx = Math.abs(this.policeMesh.position.x - busPos.x);
      if (pDz < 4.4 && pDx < 2.1) {
        if (onCollision) onCollision({ type: 'POLICE', mesh: this.policeMesh });
      }

      if (this.policeTimer > 10.0 || this.policeMesh.position.z > busPos.z + 55.0) {
        this.stopPoliceChase();
        if (this.onPoliceEvadedCallback) this.onPoliceEvadedCallback();
      }
    }
  }
}

window.DesiTraffic = DesiTraffic;
