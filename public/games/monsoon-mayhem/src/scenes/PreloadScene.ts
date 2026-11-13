import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../game/GameConstants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  preload(): void {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    this.add.text(centerX, centerY - 60, '🌧️ MONSOON MAYHEM', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '44px',
      color: '#facc15'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 15, 'Loading Authentic Kolkata Monsoon Visuals...', {
      fontFamily: 'Fredoka, sans-serif',
      fontSize: '17px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x1e293b, 0.85);
    progressBox.fillRoundedRect(centerX - 160, centerY + 30, 320, 24, 12);

    const progressBar = this.add.graphics();
    const percentText = this.add.text(centerX, centerY + 70, 'Generating High-Def Sprites...', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '14px',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.load.on('progress', (val: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x38bdf8, 1);
      progressBar.fillRoundedRect(centerX - 158, centerY + 32, 316 * val, 20, 10);
      percentText.setText(`Loading ${Math.round(val * 100)}%`);
    });

    // Generate Visual Asset Bible textures
    this.generateVisualBibleAssets();
  }

  private generateVisualBibleAssets(): void {
    // 1. Raindrop particle
    const rainGfx = this.make.graphics({ x: 0, y: 0 });
    rainGfx.lineStyle(2.5, 0x93c5fd, 0.85);
    rainGfx.lineBetween(0, 0, 4, 24);
    rainGfx.generateTexture('rain_drop', 8, 26);
    rainGfx.destroy();

    // 2. MAIN CHARACTER & STARTING VEHICLE: High-Definition Yellow Raincoat Rider on Vintage Blue Chetak Scooter (Rear View)
    // Canvas: 240 x 300 px
    const riderCanvas = document.createElement('canvas');
    riderCanvas.width = 240;
    riderCanvas.height = 300;
    const ctx = riderCanvas.getContext('2d')!;

    // === CHETAK SCOOTER BASE ===
    // Wide rear wet tire
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(102, 220, 36, 68, 10);
    ctx.fill();
    // Wet tire center tread pattern
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, 224);
    ctx.lineTo(120, 282);
    ctx.stroke();

    // Black curved rear mudguard
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(96, 205, 48, 38, 14);
    ctx.fill();

    // Vintage Sky-Blue Chetak Curved Monocoque Body
    ctx.fillStyle = '#0284c7'; // Classic Chetak Aqua Blue
    ctx.beginPath();
    ctx.roundRect(46, 145, 148, 92, 32);
    ctx.fill();
    // Left & Right Bulbous Engine Side Cowls
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.roundRect(44, 150, 48, 80, 24);
    ctx.roundRect(148, 150, 48, 80, 24);
    ctx.fill();

    // Chrome Trim Spear across cowls
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(48, 185);
    ctx.lineTo(88, 185);
    ctx.moveTo(152, 185);
    ctx.lineTo(192, 185);
    ctx.stroke();

    // 3 Horizontal Engine Cooling Louvers on Right Cowl
    ctx.strokeStyle = '#082f49';
    ctx.lineWidth = 3.5;
    for (let ly = 196; ly <= 216; ly += 10) {
      ctx.beginPath();
      ctx.moveTo(156, ly);
      ctx.lineTo(184, ly);
      ctx.stroke();
    }

    // Centered Mounted Spare Wheel
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(120, 185, 30, 0, Math.PI * 2);
    ctx.fill();
    // Silver 4-spoke hub rim
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(120, 185, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(120, 185, 7, 0, Math.PI * 2);
    ctx.fill();

    // Chrome Tubular Rear Carrier Wrapping Around Spare Wheel
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(68, 155, 104, 45, 12);
    ctx.stroke();

    // Round Ruby Red Jewel Tail Lamp with Chrome Bezel
    ctx.fillStyle = '#94a3b8'; // Chrome bezel
    ctx.beginPath();
    ctx.arc(120, 142, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626'; // Deep ruby red lens
    ctx.beginPath();
    ctx.arc(120, 142, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f87171'; // Specular lens reflection
    ctx.beginPath();
    ctx.arc(117, 139, 4, 0, Math.PI * 2);
    ctx.fill();

    // Yellow West Bengal License Plate
    ctx.fillStyle = '#facc15';
    ctx.fillRect(94, 228, 52, 16);
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('WB 02 E 4421', 120, 240);

    // Chrome Exhaust Pipe on Lower Left with Smoke Port
    ctx.fillStyle = '#64748b';
    ctx.fillRect(58, 235, 12, 38);
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(64, 273, 6, 0, Math.PI * 2);
    ctx.fill();

    // Chrome Handlebars & Dual Round Rearview Mirrors
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    // Left mirror stem & round mirror
    ctx.beginPath();
    ctx.moveTo(70, 95);
    ctx.lineTo(40, 65);
    ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(38, 62, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8'; // Mirror glass sky reflection
    ctx.beginPath();
    ctx.arc(38, 62, 9, 0, Math.PI * 2);
    ctx.fill();

    // Right mirror stem & round mirror
    ctx.beginPath();
    ctx.moveTo(170, 95);
    ctx.lineTo(200, 65);
    ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(202, 62, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(202, 62, 9, 0, Math.PI * 2);
    ctx.fill();

    // === RIDER CHARACTER ===
    // Black Cushioned Split Saddle
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.roundRect(75, 134, 90, 22, 8);
    ctx.fill();

    // Denim Blue Jeans (Thighs & Knees resting on footboard)
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(72, 138, 38, 38, 10);
    ctx.roundRect(130, 138, 38, 38, 10);
    ctx.fill();

    // Brown Shoes on Footboard Runners
    ctx.fillStyle = '#713f12';
    ctx.beginPath();
    ctx.roundRect(50, 172, 24, 16, 6);
    ctx.roundRect(166, 172, 24, 16, 6);
    ctx.fill();

    // Bright Canary Yellow Raincoat Body (with hood & folds)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.roundRect(64, 62, 112, 85, 24);
    ctx.fill();

    // Raincoat Storm Flap Zipper Seam
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, 68);
    ctx.lineTo(120, 144);
    ctx.stroke();

    // Raincoat Lower Flap Pockets
    ctx.fillStyle = '#eab308';
    ctx.fillRect(72, 118, 28, 16);
    ctx.fillRect(140, 118, 28, 16);

    // Arms in Yellow Sleeves Gripping Handlebars
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    // Left arm reaching to left grip
    ctx.moveTo(70, 78);
    ctx.lineTo(44, 98);
    ctx.lineTo(54, 110);
    ctx.lineTo(84, 88);
    ctx.closePath();
    ctx.fill();
    // Right arm reaching to right grip
    ctx.beginPath();
    ctx.moveTo(170, 78);
    ctx.lineTo(196, 98);
    ctx.lineTo(186, 110);
    ctx.lineTo(156, 88);
    ctx.closePath();
    ctx.fill();

    // Black Gripping Gloves on Handlebars
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(44, 98, 9, 0, Math.PI * 2);
    ctx.arc(196, 98, 9, 0, Math.PI * 2);
    ctx.fill();

    // Black Tactical Backpack
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(86, 70, 68, 64, 14);
    ctx.fill();
    // Backpack Padded Straps & Zipper Accent
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.strokeRect(96, 82, 48, 38);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(115, 74, 10, 4);

    // Raincoat Hood Draped Behind Neck
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(82, 48, 76, 24, 10);
    ctx.fill();

    // Glossy Black Retro Motorcycle Helmet (Rear View)
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(120, 36, 32, 0, Math.PI * 2);
    ctx.fill();
    // Specular Highlight Glint on Helmet
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(110, 26, 9, 0, Math.PI * 2);
    ctx.fill();
    // Black Helmet Base Trim & Neck Collar
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(98, 56, 44, 12, 6);
    ctx.fill();

    this.textures.addCanvas('vehicle_old_chetak', riderCanvas);

    // 3. OBSTACLE TEXTURES

    // A. Small Pothole (Fractured asphalt depression)
    const potSmall = this.make.graphics({ x: 0, y: 0 });
    potSmall.fillStyle(0x0f172a, 0.95);
    potSmall.fillEllipse(50, 25, 46, 20);
    potSmall.lineStyle(2.5, 0x334155, 1);
    potSmall.strokeEllipse(50, 25, 46, 20);
    potSmall.fillStyle(0x0284c7, 0.45);
    potSmall.fillEllipse(50, 25, 34, 13);
    potSmall.generateTexture('obstacle_pothole_small', 100, 50);
    potSmall.generateTexture('obstacle_pothole', 100, 50); // Alias for backwards compat
    potSmall.destroy();

    // B. Large Pothole (Deep crater with asphalt cracks & muddy puddle)
    const potLarge = this.make.graphics({ x: 0, y: 0 });
    potLarge.fillStyle(0x020617, 1);
    potLarge.fillEllipse(75, 38, 70, 32);
    potLarge.lineStyle(3.5, 0x1e293b, 1);
    potLarge.strokeEllipse(75, 38, 70, 32);
    // Muddy water center
    potLarge.fillStyle(0x451a03, 0.7);
    potLarge.fillEllipse(75, 38, 54, 22);
    // Water ripples
    potLarge.lineStyle(1.5, 0x38bdf8, 0.6);
    potLarge.strokeEllipse(75, 38, 40, 15);
    potLarge.generateTexture('obstacle_pothole_large', 150, 76);
    potLarge.destroy();

    // C. Water-Filled Submerged Pothole with Bubbles
    const potWater = this.make.graphics({ x: 0, y: 0 });
    potWater.fillStyle(0x0369a1, 0.85);
    potWater.fillEllipse(65, 32, 60, 28);
    potWater.lineStyle(2, 0xbae6fd, 0.75);
    potWater.strokeEllipse(65, 32, 50, 22);
    potWater.fillStyle(0xffffff, 0.8);
    potWater.fillCircle(55, 28, 3);
    potWater.fillCircle(75, 35, 4);
    potWater.fillCircle(62, 36, 2.5);
    potWater.generateTexture('obstacle_pothole_water', 130, 65);
    potWater.destroy();

    // D. Open Manhole (Pitch-black abyss, displaced heavy iron lid, water swirl)
    const manholeCanvas = document.createElement('canvas');
    manholeCanvas.width = 110;
    manholeCanvas.height = 110;
    const mnhCtx = manholeCanvas.getContext('2d')!;
    // Pitch-black vortex hole
    mnhCtx.fillStyle = '#050505';
    mnhCtx.beginPath();
    mnhCtx.arc(55, 55, 42, 0, Math.PI * 2);
    mnhCtx.fill();
    // Heavy cast iron rim
    mnhCtx.strokeStyle = '#57534e';
    mnhCtx.lineWidth = 6;
    mnhCtx.stroke();
    // Red/White danger perimeter dashes
    mnhCtx.strokeStyle = '#ef4444';
    mnhCtx.lineWidth = 3;
    mnhCtx.setLineDash([8, 6]);
    mnhCtx.stroke();
    mnhCtx.setLineDash([]);
    // Swirling water spiral
    mnhCtx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    mnhCtx.lineWidth = 2.5;
    mnhCtx.beginPath();
    mnhCtx.arc(55, 55, 24, 0, Math.PI * 1.5);
    mnhCtx.stroke();
    // Displaced iron lid slab on side
    mnhCtx.fillStyle = '#292524';
    mnhCtx.beginPath();
    mnhCtx.roundRect(68, 62, 38, 20, 6);
    mnhCtx.fill();
    mnhCtx.strokeStyle = '#78716c';
    mnhCtx.lineWidth = 2;
    mnhCtx.stroke();
    this.textures.addCanvas('obstacle_open_manhole', manholeCanvas);
    this.textures.addCanvas('obstacle_manhole', manholeCanvas); // Alias

    // E. Heavy Yellow-Black Police Barricade
    const barCanvas = document.createElement('canvas');
    barCanvas.width = 130;
    barCanvas.height = 90;
    const bBarCtx = barCanvas.getContext('2d')!;
    // Steel tube legs
    bBarCtx.fillStyle = '#334155';
    bBarCtx.fillRect(15, 35, 10, 50);
    bBarCtx.fillRect(105, 35, 10, 50);
    bBarCtx.fillRect(8, 80, 24, 8);
    bBarCtx.fillRect(98, 80, 24, 8);
    // Yellow hazard board
    bBarCtx.fillStyle = '#facc15';
    bBarCtx.fillRect(6, 12, 118, 38);
    // Diagonal black stripes
    bBarCtx.fillStyle = '#09090b';
    for (let bx = 10; bx < 120; bx += 22) {
      bBarCtx.beginPath();
      bBarCtx.moveTo(bx, 12);
      bBarCtx.lineTo(bx + 12, 12);
      bBarCtx.lineTo(bx, 50);
      bBarCtx.lineTo(bx - 12, 50);
      bBarCtx.closePath();
      bBarCtx.fill();
    }
    // "KOLKATA POLICE" text
    bBarCtx.fillStyle = '#ffffff';
    bBarCtx.font = 'bold 9px sans-serif';
    bBarCtx.textAlign = 'center';
    bBarCtx.fillText('KOLKATA POLICE', 65, 34);
    this.textures.addCanvas('obstacle_barricade', barCanvas);

    // F. Fluorescent Traffic Cone
    const coneCanvas = document.createElement('canvas');
    coneCanvas.width = 60;
    coneCanvas.height = 70;
    const cCtx = coneCanvas.getContext('2d')!;
    // Black heavy base
    cCtx.fillStyle = '#18181b';
    cCtx.fillRect(8, 58, 44, 10);
    // Orange cone body
    cCtx.fillStyle = '#ea580c';
    cCtx.beginPath();
    cCtx.moveTo(30, 4);
    cCtx.lineTo(48, 58);
    cCtx.lineTo(12, 58);
    cCtx.closePath();
    cCtx.fill();
    // Reflective white band
    cCtx.fillStyle = '#f8fafc';
    cCtx.beginPath();
    cCtx.moveTo(23, 26);
    cCtx.lineTo(37, 26);
    cCtx.lineTo(42, 40);
    cCtx.lineTo(18, 40);
    cCtx.closePath();
    cCtx.fill();
    this.textures.addCanvas('obstacle_traffic_cone', coneCanvas);

    // G. Fallen Monsoon Tree Branch
    const branchCanvas = document.createElement('canvas');
    branchCanvas.width = 130;
    branchCanvas.height = 50;
    const brCtx = branchCanvas.getContext('2d')!;
    // Brown log/branch
    brCtx.strokeStyle = '#451a03';
    brCtx.lineWidth = 12;
    brCtx.lineCap = 'round';
    brCtx.beginPath();
    brCtx.moveTo(10, 35);
    brCtx.quadraticCurveTo(60, 20, 120, 32);
    brCtx.stroke();
    // Green wet leaves
    brCtx.fillStyle = '#15803d';
    brCtx.beginPath();
    brCtx.arc(35, 20, 14, 0, Math.PI * 2);
    brCtx.arc(60, 14, 16, 0, Math.PI * 2);
    brCtx.arc(85, 18, 14, 0, Math.PI * 2);
    brCtx.fill();
    this.textures.addCanvas('obstacle_fallen_branch', branchCanvas);

    // H. Floating Urban Flood Debris
    const debCanvas = document.createElement('canvas');
    debCanvas.width = 90;
    debCanvas.height = 50;
    const dCtx = debCanvas.getContext('2d')!;
    // Plastic blue crate
    dCtx.fillStyle = '#0284c7';
    dCtx.fillRect(10, 15, 42, 28);
    dCtx.fillStyle = '#0369a1';
    dCtx.fillRect(14, 19, 34, 20);
    // Floating black trash bag
    dCtx.fillStyle = '#18181b';
    dCtx.beginPath();
    dCtx.arc(65, 30, 16, 0, Math.PI * 2);
    dCtx.fill();
    this.textures.addCanvas('obstacle_floating_debris', debCanvas);

    // I. Impact Spark Particle
    const sparkGfx = this.make.graphics({ x: 0, y: 0 });
    sparkGfx.fillStyle(0xfef08a, 1);
    sparkGfx.fillCircle(4, 4, 3);
    sparkGfx.generateTexture('particle_impact_spark', 8, 8);
    sparkGfx.destroy();

    // 5. Grand North Kolkata Colonial Heritage Building (3-Story Mansion)
    const bldgCanvas = document.createElement('canvas');
    bldgCanvas.width = 180;
    bldgCanvas.height = 320;
    const bCtx = bldgCanvas.getContext('2d')!;

    // Yellow/Ochre Wall Facade
    bCtx.fillStyle = '#d97706';
    bCtx.fillRect(0, 0, 180, 320);
    // Roof Cornice & Dentils
    bCtx.fillStyle = '#9a3412';
    bCtx.fillRect(0, 0, 180, 24);
    // Slatted Green Wooden Venetian Shutter Windows
    for (let floor = 0; floor < 3; floor++) {
      for (let col = 0; col < 2; col++) {
        const wx = 24 + col * 75;
        const wy = 42 + floor * 88;
        // Brick arch eaves
        bCtx.fillStyle = '#78350f';
        bCtx.fillRect(wx - 4, wy - 8, 56, 10);
        // Green Wooden Shutters
        bCtx.fillStyle = '#166534';
        bCtx.fillRect(wx, wy, 48, 62);
        // Slats
        bCtx.strokeStyle = '#14532d';
        bCtx.lineWidth = 2;
        for (let sy = wy + 8; sy < wy + 58; sy += 8) {
          bCtx.beginPath();
          bCtx.moveTo(wx + 2, sy);
          bCtx.lineTo(wx + 46, sy);
          bCtx.stroke();
        }
      }
      // Wrought-iron Balcony Railing
      bCtx.fillStyle = '#1e293b';
      bCtx.fillRect(10, 110 + floor * 88, 160, 12);
    }
    this.textures.addCanvas('prop_building_colonial', bldgCanvas);

    // 6. Kolkata Street Market Building with Striped Canvas Awning
    const mktCanvas = document.createElement('canvas');
    mktCanvas.width = 180;
    mktCanvas.height = 280;
    const mCtx = mktCanvas.getContext('2d')!;

    mCtx.fillStyle = '#0f172a';
    mCtx.fillRect(0, 0, 180, 280);
    // Upper Windows & Bengali Signboard
    mCtx.fillStyle = '#0284c7';
    mCtx.fillRect(10, 60, 160, 38);
    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 15px sans-serif';
    mCtx.textAlign = 'center';
    mCtx.fillText('ঘোষ সুইটস & টি', 90, 84);

    // Red & Yellow Striped Awning
    for (let s = 0; s < 6; s++) {
      mCtx.fillStyle = s % 2 === 0 ? '#dc2626' : '#facc15';
      mCtx.fillRect(s * 30, 110, 30, 48);
    }
    // Warm Glowing Shop Interior Below Awning
    mCtx.fillStyle = '#fef08a';
    mCtx.fillRect(15, 165, 150, 105);
    mCtx.fillStyle = '#78350f';
    mCtx.fillRect(25, 210, 130, 60); // Counter
    this.textures.addCanvas('prop_building_market', mktCanvas);

    // 7. Kolkata Blue Bus Stop Shelter ("BUS STOP • বাস স্টপ")
    const busStopCanvas = document.createElement('canvas');
    busStopCanvas.width = 160;
    busStopCanvas.height = 150;
    const bsCtx = busStopCanvas.getContext('2d')!;

    // Steel Pillars
    bsCtx.fillStyle = '#0284c7';
    bsCtx.fillRect(16, 35, 10, 115);
    bsCtx.fillRect(134, 35, 10, 115);
    // Curved Blue Roof
    bsCtx.beginPath();
    bsCtx.roundRect(0, 10, 160, 28, 12);
    bsCtx.fill();
    // Yellow Header Sign
    bsCtx.fillStyle = '#facc15';
    bsCtx.fillRect(18, 42, 124, 26);
    bsCtx.fillStyle = '#020617';
    bsCtx.font = 'bold 12px sans-serif';
    bsCtx.textAlign = 'center';
    bsCtx.fillText('BUS STOP • বাস স্টপ', 80, 60);
    // Waiting Bench
    bsCtx.fillStyle = '#475569';
    bsCtx.fillRect(26, 110, 108, 12);
    this.textures.addCanvas('prop_bus_stop', busStopCanvas);

    // 8. Parked Kolkata Yellow Ambassador Taxi
    const taxiCanvas = document.createElement('canvas');
    taxiCanvas.width = 150;
    taxiCanvas.height = 110;
    const tCtx = taxiCanvas.getContext('2d')!;

    // Black Tires
    tCtx.fillStyle = '#09090b';
    tCtx.beginPath();
    tCtx.roundRect(14, 76, 24, 34, 6);
    tCtx.roundRect(112, 76, 24, 34, 6);
    tCtx.fill();

    // Classic Yellow Curved Ambassador Rear
    tCtx.fillStyle = '#facc15';
    tCtx.beginPath();
    tCtx.roundRect(10, 35, 130, 58, 20);
    tCtx.fill();

    // Blue Horizontal Mid-Stripe
    tCtx.fillStyle = '#0284c7';
    tCtx.fillRect(10, 60, 130, 12);

    // Rear Windshield Glass
    tCtx.fillStyle = '#1e3a8a';
    tCtx.beginPath();
    tCtx.roundRect(24, 18, 102, 28, 10);
    tCtx.fill();

    // Rooftop "TAXI" Light Box
    tCtx.fillStyle = '#fde047';
    tCtx.fillRect(58, 8, 34, 12);
    tCtx.fillStyle = '#000000';
    tCtx.font = 'bold 8px sans-serif';
    tCtx.textAlign = 'center';
    tCtx.fillText('TAXI', 75, 17);

    // Chrome Bumper & Round Red Taillights
    tCtx.fillStyle = '#e2e8f0';
    tCtx.fillRect(10, 84, 130, 10);
    tCtx.fillStyle = '#dc2626';
    tCtx.beginPath();
    tCtx.arc(22, 52, 6, 0, Math.PI * 2);
    tCtx.arc(128, 52, 6, 0, Math.PI * 2);
    tCtx.fill();
    this.textures.addCanvas('prop_parked_taxi', taxiCanvas);

    // 9. Roadside Bengali Tea Stall Cart ("Cha-er Dokan")
    const teaCanvas = document.createElement('canvas');
    teaCanvas.width = 140;
    teaCanvas.height = 150;
    const teCtx = teaCanvas.getContext('2d')!;

    // Red & White Tilted Umbrella
    teCtx.fillStyle = '#dc2626';
    teCtx.beginPath();
    teCtx.arc(70, 40, 52, Math.PI, 0);
    teCtx.fill();
    teCtx.fillStyle = '#f8fafc';
    for (let a = 0; a < 4; a++) {
      teCtx.beginPath();
      teCtx.moveTo(70, 40);
      teCtx.arc(70, 40, 52, Math.PI + a * 0.8, Math.PI + (a + 0.4) * 0.8);
      teCtx.closePath();
      teCtx.fill();
    }
    // Wooden Thela Cart Counter
    teCtx.fillStyle = '#78350f';
    teCtx.fillRect(20, 72, 100, 50);
    // Aluminum Boiling Tea Kettle
    teCtx.fillStyle = '#cbd5e1';
    teCtx.fillRect(40, 56, 24, 18);
    teCtx.beginPath();
    teCtx.arc(52, 54, 8, 0, Math.PI);
    teCtx.fill();
    // Spoked Wheels
    teCtx.fillStyle = '#18181b';
    teCtx.beginPath();
    teCtx.arc(36, 130, 16, 0, Math.PI * 2);
    teCtx.arc(104, 130, 16, 0, Math.PI * 2);
    teCtx.fill();
    this.textures.addCanvas('prop_tea_stall', teaCanvas);

    // 10. Kolkata Street Food Signboard ("Bhaat Gorom • গরম ভাত")
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 140;
    signCanvas.height = 140;
    const sCtx = signCanvas.getContext('2d')!;

    // Wooden Stand Legs
    sCtx.fillStyle = '#451a03';
    sCtx.fillRect(18, 30, 8, 110);
    sCtx.fillRect(114, 30, 8, 110);
    // Orange/Yellow Signboard Board
    sCtx.fillStyle = '#ea580c';
    sCtx.fillRect(8, 10, 124, 85);
    sCtx.fillStyle = '#fef08a';
    sCtx.font = 'bold 15px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('Bhaat Gorom', 70, 36);
    sCtx.font = '12px sans-serif';
    sCtx.fillText('গরম ভাত ও ডিম', 70, 56);
    // Hot Rice Bowl Graphic
    sCtx.fillStyle = '#ffffff';
    sCtx.beginPath();
    sCtx.arc(70, 75, 14, 0, Math.PI);
    sCtx.fill();
    this.textures.addCanvas('prop_shop_billboard', signCanvas);

    // 11. Concrete Utility Electric Pole with Insulators
    const poleCanvas = document.createElement('canvas');
    poleCanvas.width = 60;
    poleCanvas.height = 300;
    const pCtx = poleCanvas.getContext('2d')!;

    pCtx.fillStyle = '#64748b'; // Concrete pole
    pCtx.fillRect(24, 20, 12, 280);
    // Cross arm
    pCtx.fillStyle = '#334155';
    pCtx.fillRect(4, 35, 52, 10);
    // Red Porcelain Insulators
    pCtx.fillStyle = '#b91c1c';
    pCtx.fillRect(8, 24, 8, 12);
    pCtx.fillRect(44, 24, 8, 12);
    this.textures.addCanvas('prop_electric_pole', poleCanvas);

    // 12. British-era Cast Iron Streetlight with Glowing Amber Lantern
    const lightGfx = this.make.graphics({ x: 0, y: 0 });
    lightGfx.fillStyle(0x18181b, 1);
    lightGfx.fillRect(20, 28, 8, 180);
    lightGfx.fillRoundedRect(12, 190, 24, 20, 4);
    lightGfx.fillCircle(24, 24, 14);
    lightGfx.fillStyle(0xfde047, 1);
    lightGfx.fillCircle(24, 24, 8);
    lightGfx.generateTexture('prop_streetlight_british', 48, 210);
    lightGfx.destroy();

    // 13. Bengal Coconut Palm Tree
    const treeGfx = this.make.graphics({ x: 0, y: 0 });
    treeGfx.fillStyle(0x451a03, 1);
    treeGfx.fillRect(44, 60, 14, 180);
    treeGfx.fillStyle(0x15803d, 1);
    treeGfx.fillCircle(50, 50, 46);
    treeGfx.fillCircle(30, 36, 32);
    treeGfx.fillCircle(70, 36, 32);
    treeGfx.generateTexture('prop_palm_tree', 100, 240);
    treeGfx.destroy();

    // 14. Kolkata Red Postal Pillar Box
    const postGfx = this.make.graphics({ x: 0, y: 0 });
    postGfx.fillStyle(0xdc2626, 1);
    postGfx.fillRoundedRect(12, 16, 28, 64, 12);
    postGfx.fillStyle(0x18181b, 1);
    postGfx.fillRect(18, 30, 16, 4);
    postGfx.fillRect(8, 76, 36, 10);
    postGfx.generateTexture('prop_postbox_red', 52, 90);
    postGfx.destroy();

    // 15. Police Traffic Barricade
    const barGfx = this.make.graphics({ x: 0, y: 0 });
    barGfx.fillStyle(0x1e293b, 1);
    barGfx.fillRect(6, 48, 8, 40);
    barGfx.fillRect(76, 48, 8, 40);
    barGfx.fillStyle(0xfacc15, 1);
    barGfx.fillRect(0, 16, 90, 32);
    barGfx.fillStyle(0x09090b, 1);
    for (let bx = 0; bx < 90; bx += 24) {
      barGfx.fillPoints([
        { x: bx, y: 16 },
        { x: bx + 12, y: 16 },
        { x: bx, y: 48 },
        { x: bx - 12, y: 48 }
      ], true);
    }
    barGfx.generateTexture('prop_barricade_hazard', 90, 90);
    barGfx.destroy();

    // 16. Water Wheel Spray Particle
    const sprayGfx = this.make.graphics({ x: 0, y: 0 });
    sprayGfx.fillStyle(0xbae6fd, 0.85);
    sprayGfx.fillCircle(6, 6, 5);
    sprayGfx.generateTexture('effect_water_spray', 12, 12);
    sprayGfx.destroy();
  }

  create(): void {
    this.time.delayedCall(200, () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });
  }
}
