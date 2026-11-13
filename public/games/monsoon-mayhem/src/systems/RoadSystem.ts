import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTH_LAYERS } from '../game/GameConstants';
import { PerspectiveSystem, ProjectedPoint } from './PerspectiveSystem';
import { PHYSICS_CONFIG } from '../data/physicsConfig';

export interface RoadProp {
  type: string;
  side: -1 | 1;
  offsetMultiplier: number;
  scaleFactor: number;
}

export interface RoadSegment {
  index: number;
  worldZ: number;
  curve: number;
  waterDepth: number;
  hasPuddle: boolean;
  props: RoadProp[];
}

export class RoadSystem {
  private scene: Phaser.Scene;
  private roadGraphics: Phaser.GameObjects.Graphics;
  private waterGraphics: Phaser.GameObjects.Graphics;
  private propsContainer: Phaser.GameObjects.Container;

  public segments: RoadSegment[] = [];
  public totalSegments = 2400;
  public trackLength = 0;

  public cameraPos = 0;
  public cameraX = 0;

  private activePropSprites: Phaser.GameObjects.Sprite[] = [];
  private propPool: Phaser.GameObjects.Sprite[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.roadGraphics = this.scene.add.graphics().setDepth(DEPTH_LAYERS.ROAD_BASE);
    this.waterGraphics = this.scene.add.graphics().setDepth(DEPTH_LAYERS.WATER_SURFACE);
    this.propsContainer = this.scene.add.container(0, 0).setDepth(DEPTH_LAYERS.ROAD_OBJECTS);

    this.buildTrack();
  }

  private buildTrack(): void {
    this.segments = [];
    let currentCurve = 0;
    let targetCurve = 0;
    let curveLength = 0;

    for (let i = 0; i < this.totalSegments; i++) {
      if (curveLength <= 0) {
        curveLength = Phaser.Math.Between(45, 95);
        const rand = Math.random();
        if (rand < 0.35) {
          targetCurve = Phaser.Math.FloatBetween(-2.6, -1.2); // Left turn
        } else if (rand < 0.70) {
          targetCurve = Phaser.Math.FloatBetween(1.2, 2.6);  // Right turn
        } else {
          targetCurve = 0; // Straight
        }
      }

      currentCurve = Phaser.Math.Linear(currentCurve, targetCurve, 0.08);
      curveLength--;

      // Water depth zones
      let waterDepth = 1;
      if (i > 250 && i < 650) waterDepth = 2; // Moderate flood
      else if (i >= 650 && i < 1150) waterDepth = 3; // Deep waterlogged
      else if (i >= 1150 && i < 1700) waterDepth = 2;
      else if (i >= 1700) waterDepth = 3;

      const hasPuddle = Math.random() < 0.3;

      // Roadside Props (Colonial buildings, shops, streetlights, poles, parked taxis, tea stalls, bus stops)
      const props: RoadProp[] = [];

      // 1. Regular Utilities (British Streetlights & Concrete Electric Poles alternating)
      if (i % 4 === 0) {
        const poleSide: -1 | 1 = (i % 8 === 0) ? -1 : 1;
        props.push({
          type: 'prop_electric_pole',
          side: poleSide,
          offsetMultiplier: 1.25,
          scaleFactor: 1.45
        });
      } else if (i % 4 === 2) {
        const lightSide: -1 | 1 = (i % 8 === 2) ? 1 : -1;
        props.push({
          type: 'prop_streetlight_british',
          side: lightSide,
          offsetMultiplier: 1.24,
          scaleFactor: 1.25
        });
      }

      // 2. Continuous City Backdrop (Colonial & Market Architecture)
      if (i % 3 === 0) {
        const leftBuilding = Math.random() < 0.55 ? 'prop_building_colonial' : 'prop_building_market';
        props.push({
          type: leftBuilding,
          side: -1,
          offsetMultiplier: Phaser.Math.FloatBetween(1.95, 2.25),
          scaleFactor: 1.75
        });

        const rightBuilding = Math.random() < 0.55 ? 'prop_building_market' : 'prop_building_colonial';
        props.push({
          type: rightBuilding,
          side: 1,
          offsetMultiplier: Phaser.Math.FloatBetween(1.95, 2.25),
          scaleFactor: 1.75
        });
      }

      // 3. Kolkata Street Life & Features (Tea Stalls, Taxis, Bus Stops, Signboards, Palms)
      if (i % 3 === 1) {
        const streetLifeTypes = [
          'prop_tea_stall',
          'prop_parked_taxi',
          'prop_bus_stop',
          'prop_shop_billboard',
          'prop_palm_tree',
          'prop_postbox_red',
          'prop_barricade_hazard'
        ];
        const selected = streetLifeTypes[Math.floor(Math.random() * streetLifeTypes.length)];
        const side: -1 | 1 = Math.random() > 0.5 ? 1 : -1;
        let scaleFactor = 1.1;
        let offsetMultiplier = 1.42;

        if (selected === 'prop_bus_stop') {
          scaleFactor = 1.25;
          offsetMultiplier = 1.46;
        } else if (selected === 'prop_parked_taxi') {
          scaleFactor = 1.15;
          offsetMultiplier = 1.38;
        } else if (selected === 'prop_palm_tree') {
          scaleFactor = 1.4;
          offsetMultiplier = 1.62;
        } else if (selected === 'prop_postbox_red' || selected === 'prop_barricade_hazard') {
          scaleFactor = 0.95;
          offsetMultiplier = 1.25;
        }

        props.push({
          type: selected,
          side,
          offsetMultiplier,
          scaleFactor
        });
      }

      this.segments.push({
        index: i,
        worldZ: i * PerspectiveSystem.SEGMENT_LENGTH,
        curve: currentCurve,
        waterDepth,
        hasPuddle,
        props
      });
    }

    this.trackLength = this.segments.length * PerspectiveSystem.SEGMENT_LENGTH;
  }

  public update(playerSpeedMps: number, playerXOffset: number, dt: number): void {
    // Dynamic frame-independent world progression
    const forwardMovement = playerSpeedMps * PHYSICS_CONFIG.WORLD_SPEED_SCALE * dt;
    this.cameraPos += forwardMovement;
    if (this.cameraPos >= this.trackLength) {
      this.cameraPos -= this.trackLength;
    }

    this.cameraX = playerXOffset;
  }

  /**
   * Seamless, gapless pseudo-3D road rendering.
   * Completely eliminates the black road rendering bug by using continuous vertex sharing and foreground clipping.
   */
  public render(waterFlowTime: number): void {
    this.roadGraphics.clear();
    this.waterGraphics.clear();
    this.recycleProps();

    // 1. Draw solid wet ground base below horizon (eliminates any black void background!)
    this.roadGraphics.fillStyle(0x14532d, 1);
    this.roadGraphics.fillRect(
      0,
      PerspectiveSystem.HORIZON_Y,
      GAME_WIDTH,
      GAME_HEIGHT - PerspectiveSystem.HORIZON_Y
    );

    const startSegIdx = Math.floor(this.cameraPos / PerspectiveSystem.SEGMENT_LENGTH);
    const subStep = (this.cameraPos % PerspectiveSystem.SEGMENT_LENGTH);

    // 2. Pre-calculate continuous chain of projected road points
    interface NodePoint {
      segment: RoadSegment;
      proj: ProjectedPoint;
    }

    const chain: NodePoint[] = [];
    let curveDX = 0;
    let curveAcc = 0;

    for (let n = 0; n < PerspectiveSystem.DRAW_DISTANCE; n++) {
      const seg = this.segments[(startSegIdx + n) % this.segments.length];
      curveAcc += seg.curve;
      curveDX += curveAcc * 0.42;

      // Ensure nearest point relZ is always positive and reaches screen bottom
      const relZ = Math.max(25, n * PerspectiveSystem.SEGMENT_LENGTH - subStep);
      const proj = PerspectiveSystem.project(curveDX, 0, relZ, this.cameraX);

      // Stop once we reach the horizon line
      if (n > 2 && proj.screenY <= PerspectiveSystem.HORIZON_Y) {
        break;
      }

      chain.push({ segment: seg, proj });
    }

    if (chain.length < 2) return;

    // Ensure the very first point extends flush to or beyond the bottom of the screen
    if (chain[0].proj.screenY < GAME_HEIGHT) {
      chain[0].proj.screenY = GAME_HEIGHT + 10;
      chain[0].proj.screenW = Math.max(chain[0].proj.screenW, GAME_WIDTH * 0.75);
    }

    // 3. Render segments from back (near horizon) to front (near camera)
    for (let i = chain.length - 2; i >= 0; i--) {
      const near = chain[i];
      const far = chain[i + 1];

      const p1 = near.proj; // Near point (bottom)
      const p2 = far.proj;  // Far point (top)

      if (p1.screenY <= p2.screenY) continue;

      const seg = near.segment;
      const isEven = seg.index % 2 === 0;

      // A. Roadside Embankment Strip
      const grassColor = isEven ? 0x0f4a24 : 0x14532d;
      this.roadGraphics.fillStyle(grassColor, 1);
      this.roadGraphics.fillRect(0, p2.screenY, GAME_WIDTH, Math.max(1, p1.screenY - p2.screenY));

      // B. Alternating Road Curbs (Yellow/Black Reflective)
      const curbColor = isEven ? 0xfacc15 : 0x1e293b;
      const curbW1 = Math.max(5, Math.round(p1.screenW * 0.08));
      const curbW2 = Math.max(3, Math.round(p2.screenW * 0.08));

      // Left curb
      this.roadGraphics.fillStyle(curbColor, 1);
      this.roadGraphics.fillPoints([
        { x: p1.screenX - p1.screenW - curbW1, y: p1.screenY },
        { x: p1.screenX - p1.screenW, y: p1.screenY },
        { x: p2.screenX - p2.screenW, y: p2.screenY },
        { x: p2.screenX - p2.screenW - curbW2, y: p2.screenY }
      ], true);

      // Right curb
      this.roadGraphics.fillPoints([
        { x: p1.screenX + p1.screenW, y: p1.screenY },
        { x: p1.screenX + p1.screenW + curbW1, y: p1.screenY },
        { x: p2.screenX + p2.screenW + curbW2, y: p2.screenY },
        { x: p2.screenX + p2.screenW, y: p2.screenY }
      ], true);

      // C. Wet Asphalt Road Surface (Vibrant dark wet slate & charcoal)
      const asphaltColor = isEven ? 0x273549 : 0x1a2332;
      this.roadGraphics.fillStyle(asphaltColor, 1);
      this.roadGraphics.fillPoints([
        { x: p1.screenX - p1.screenW, y: p1.screenY },
        { x: p1.screenX + p1.screenW, y: p1.screenY },
        { x: p2.screenX + p2.screenW, y: p2.screenY },
        { x: p2.screenX - p2.screenW, y: p2.screenY }
      ], true);

      // D. White Dashed Center Line Markings
      if (seg.index % 6 < 3) {
        const dashW1 = Math.max(2, Math.round(p1.screenW * 0.022));
        const dashW2 = Math.max(1, Math.round(p2.screenW * 0.022));
        this.roadGraphics.fillStyle(0xf8fafc, 0.9);
        this.roadGraphics.fillPoints([
          { x: p1.screenX - dashW1, y: p1.screenY },
          { x: p1.screenX + dashW1, y: p1.screenY },
          { x: p2.screenX + dashW2, y: p2.screenY },
          { x: p2.screenX - dashW2, y: p2.screenY }
        ], true);
      }

      // E. Flooded Water Sheen Layer & Ripples
      if (seg.waterDepth > 0) {
        const depthAlpha = seg.waterDepth === 1 ? 0.32 : seg.waterDepth === 2 ? 0.50 : 0.68;
        const waveOffset = Math.sin(waterFlowTime * 0.005 + seg.index * 0.35) * 8 * p1.scale;

        this.waterGraphics.fillStyle(0x0284c7, depthAlpha);
        this.waterGraphics.fillPoints([
          { x: p1.screenX - p1.screenW * 0.96 + waveOffset, y: p1.screenY },
          { x: p1.screenX + p1.screenW * 0.96 + waveOffset, y: p1.screenY },
          { x: p2.screenX + p2.screenW * 0.96, y: p2.screenY },
          { x: p2.screenX - p2.screenW * 0.96, y: p2.screenY }
        ], true);

        // Specular sky highlight on water ripples
        if (isEven && seg.waterDepth >= 2) {
          const specW = Math.max(12, Math.round(p1.screenW * 0.45));
          this.waterGraphics.fillStyle(0xbae6fd, 0.28);
          this.waterGraphics.fillEllipse(p1.screenX, p1.screenY, specW, Math.max(3, (p1.screenY - p2.screenY) * 1.6));
        }
      }

      // F. Roadside Props (Buildings, Lamps, Trees, Stalls)
      if (seg.props.length > 0 && i < 125) {
        for (const prop of seg.props) {
          const propX = p1.screenX + prop.side * p1.screenW * prop.offsetMultiplier;
          const propY = p1.screenY;
          this.drawProp(prop.type, propX, propY, p1.scale * prop.scaleFactor);
        }
      }
    }
  }

  private drawProp(textureKey: string, x: number, y: number, scale: number): void {
    if (scale <= 0.035) return;

    let sprite = this.propPool.pop();
    if (!sprite) {
      sprite = this.scene.add.sprite(x, y, textureKey);
      this.propsContainer.add(sprite);
    } else {
      sprite.setTexture(textureKey);
      sprite.setPosition(x, y);
      sprite.setVisible(true);
      this.propsContainer.bringToTop(sprite);
    }

    sprite.setScale(scale);
    sprite.setOrigin(0.5, 1.0);
    this.activePropSprites.push(sprite);
  }

  private recycleProps(): void {
    for (const sprite of this.activePropSprites) {
      sprite.setVisible(false);
      this.propPool.push(sprite);
    }
    this.activePropSprites.length = 0;
  }
}
