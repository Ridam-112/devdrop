import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTH_LAYERS } from '../game/GameConstants';
import { PerspectiveSystem } from './PerspectiveSystem';
import { RoadSystem } from './RoadSystem';

export type ObstacleType =
  | 'POTHOLE_SMALL'
  | 'POTHOLE_LARGE'
  | 'POTHOLE_WATER'
  | 'OPEN_MANHOLE'
  | 'BARRICADE'
  | 'TRAFFIC_CONE'
  | 'FALLEN_BRANCH'
  | 'FLOATING_DEBRIS';

export interface ObstacleData {
  id: number;
  type: ObstacleType;
  textureKey: string;
  worldZ: number;
  normalizedX: number;
  baseScale: number;
  collisionRadius: number;
  damage: number;
  speedPenalty: number;
  requiredJumpHeight: number;
  hasCollided: boolean;
  isPassed: boolean;
}

export class ObstacleSystem {
  private scene: Phaser.Scene;
  private roadSystem: RoadSystem;
  private container: Phaser.GameObjects.Container;

  public activeObstacles: ObstacleData[] = [];
  private spriteMap: Map<number, Phaser.GameObjects.Sprite> = new Map();
  private spritePool: Phaser.GameObjects.Sprite[] = [];

  private nextObstacleId = 1;
  private lastSpawnZ = 800; // Start spawning after initial tutorial stretch

  constructor(scene: Phaser.Scene, roadSystem: RoadSystem) {
    this.scene = scene;
    this.roadSystem = roadSystem;
    this.container = this.scene.add.container(0, 0).setDepth(DEPTH_LAYERS.ROAD_OBJECTS + 1);
  }

  /**
   * Main update: Spawns new obstacles ahead, projects active ones to screen, and recycles passed ones
   */
  public update(playerSpeedMps: number, distanceTraveledMeters: number): void {
    const cameraZ = this.roadSystem.cameraPos;
    const maxLookaheadZ = cameraZ + (PerspectiveSystem.DRAW_DISTANCE * PerspectiveSystem.SEGMENT_LENGTH);

    // 1. Procedural Obstacle Spawning Ahead
    this.checkSpawnAhead(cameraZ, maxLookaheadZ, distanceTraveledMeters);

    // 2. Render & Position Active Obstacles using Pseudo-3D Perspective Projection
    this.renderObstacles(cameraZ);

    // 3. Clean up and recycle passed obstacles
    this.recyclePassedObstacles(cameraZ);
  }

  /**
   * Spawns obstacles ahead with guaranteed safe paths and distance-based difficulty scaling
   */
  private checkSpawnAhead(cameraZ: number, maxLookaheadZ: number, distanceMeters: number): void {
    // Spacing between obstacle spawns shrinks as difficulty increases
    let spawnInterval = 380; // World units (~2.4 road segments)
    if (distanceMeters > 200) spawnInterval = 320;
    if (distanceMeters > 500) spawnInterval = 260;
    if (distanceMeters > 1000) spawnInterval = 210;

    while (this.lastSpawnZ < maxLookaheadZ - 200) {
      this.lastSpawnZ += spawnInterval + Phaser.Math.Between(-40, 60);

      // Lanes: Left (-0.55), Center (0.0), Right (0.55)
      const lanes = [-0.55, 0.0, 0.55];
      // Randomly choose 1 or at most 2 lanes (Guaranteed at least 1 safe clear lane!)
      Phaser.Utils.Array.Shuffle(lanes);
      const chosenLane = lanes[0];

      // Select Obstacle Type based on distance / difficulty
      const type = this.chooseObstacleType(distanceMeters);
      this.spawnObstacle(type, this.lastSpawnZ, chosenLane);

      // At higher distances (> 400m), occasionally spawn an additional obstacle on the second lane (never all 3!)
      if (distanceMeters > 400 && Math.random() < 0.35) {
        const secondLane = lanes[1];
        const secondaryType = Math.random() < 0.5 ? 'TRAFFIC_CONE' : 'POTHOLE_SMALL';
        this.spawnObstacle(secondaryType, this.lastSpawnZ + Phaser.Math.Between(60, 110), secondLane);
      }
    }
  }

  private chooseObstacleType(distanceMeters: number): ObstacleType {
    const rand = Math.random();

    if (distanceMeters < 120) {
      // Gentle early game: Small and Water Potholes
      return rand < 0.55 ? 'POTHOLE_SMALL' : 'POTHOLE_WATER';
    } else if (distanceMeters < 350) {
      // Moderate: Potholes, Traffic Cones, Floating Debris, Barricades
      if (rand < 0.30) return 'POTHOLE_WATER';
      if (rand < 0.55) return 'POTHOLE_LARGE';
      if (rand < 0.75) return 'TRAFFIC_CONE';
      if (rand < 0.90) return 'BARRICADE';
      return 'FLOATING_DEBRIS';
    } else {
      // High Mayhem: Open Manholes appear, Large Potholes, Fallen Branches, Barricades
      if (rand < 0.28) return 'OPEN_MANHOLE'; // Signature Kolkata Hazard!
      if (rand < 0.50) return 'POTHOLE_WATER';
      if (rand < 0.68) return 'POTHOLE_LARGE';
      if (rand < 0.82) return 'BARRICADE';
      if (rand < 0.92) return 'FALLEN_BRANCH';
      return 'FLOATING_DEBRIS';
    }
  }

  private spawnObstacle(type: ObstacleType, worldZ: number, normalizedX: number): void {
    let textureKey = 'obstacle_pothole_small';
    let baseScale = 1.0;
    let collisionRadius = 0.26;
    let damage = 12;
    let speedPenalty = 14;
    let requiredJumpHeight = 22; // Low jump clears pothole

    switch (type) {
      case 'POTHOLE_SMALL':
        textureKey = 'obstacle_pothole_small';
        baseScale = 1.0;
        collisionRadius = 0.24;
        damage = 10;
        speedPenalty = 12;
        requiredJumpHeight = 20;
        break;
      case 'POTHOLE_LARGE':
        textureKey = 'obstacle_pothole_large';
        baseScale = 1.15;
        collisionRadius = 0.35;
        damage = 18;
        speedPenalty = 22;
        requiredJumpHeight = 35;
        break;
      case 'POTHOLE_WATER':
        textureKey = 'obstacle_pothole_water';
        baseScale = 1.1;
        collisionRadius = 0.30;
        damage = 15;
        speedPenalty = 18;
        requiredJumpHeight = 25;
        break;
      case 'OPEN_MANHOLE':
        textureKey = 'obstacle_open_manhole';
        baseScale = 1.25;
        collisionRadius = 0.32;
        damage = 35; // Severe impact!
        speedPenalty = 36;
        requiredJumpHeight = 45;
        break;
      case 'BARRICADE':
        textureKey = 'obstacle_barricade';
        baseScale = 1.2;
        collisionRadius = 0.36;
        damage = 25;
        speedPenalty = 32;
        requiredJumpHeight = 65; // High jump required
        break;
      case 'TRAFFIC_CONE':
        textureKey = 'obstacle_traffic_cone';
        baseScale = 1.0;
        collisionRadius = 0.20;
        damage = 6;
        speedPenalty = 8;
        requiredJumpHeight = 30;
        break;
      case 'FALLEN_BRANCH':
        textureKey = 'obstacle_fallen_branch';
        baseScale = 1.15;
        collisionRadius = 0.34;
        damage = 16;
        speedPenalty = 18;
        requiredJumpHeight = 35;
        break;
      case 'FLOATING_DEBRIS':
        textureKey = 'obstacle_floating_debris';
        baseScale = 1.0;
        collisionRadius = 0.24;
        damage = 8;
        speedPenalty = 10;
        requiredJumpHeight = 25;
        break;
    }

    const obstacle: ObstacleData = {
      id: this.nextObstacleId++,
      type,
      textureKey,
      worldZ,
      normalizedX,
      baseScale,
      collisionRadius,
      damage,
      speedPenalty,
      requiredJumpHeight,
      hasCollided: false,
      isPassed: false
    };

    this.activeObstacles.push(obstacle);
  }

  /**
   * Projects active obstacles into screen coordinates using the pseudo-3D perspective math
   */
  private renderObstacles(cameraZ: number): void {
    const totalSegments = this.roadSystem.segments.length;

    // Sort back-to-front so closer obstacles render on top of farther ones
    this.activeObstacles.sort((a, b) => b.worldZ - a.worldZ);

    for (const obs of this.activeObstacles) {
      let relZ = obs.worldZ - cameraZ;

      // Handle track wrapping if applicable
      if (relZ < -200) {
        obs.isPassed = true;
        this.hideSprite(obs.id);
        continue;
      }

      if (relZ <= 10 || relZ > PerspectiveSystem.DRAW_DISTANCE * PerspectiveSystem.SEGMENT_LENGTH) {
        this.hideSprite(obs.id);
        continue;
      }

      // Calculate Road Curve displacement at obstacle worldZ
      const segIndex = Math.floor(obs.worldZ / PerspectiveSystem.SEGMENT_LENGTH) % totalSegments;
      const startSeg = Math.floor(cameraZ / PerspectiveSystem.SEGMENT_LENGTH) % totalSegments;
      const segOffset = (segIndex - startSeg + totalSegments) % totalSegments;

      // Accumulate curve offset up to obstacle segment
      let curveDX = 0;
      let curveAcc = 0;
      for (let n = 0; n < Math.min(segOffset, PerspectiveSystem.DRAW_DISTANCE); n++) {
        const seg = this.roadSystem.segments[(startSeg + n) % totalSegments];
        curveAcc += seg.curve;
        curveDX += curveAcc * 0.42;
      }

      // Project 3D position to 2D screen
      const roadHalfWidth = PerspectiveSystem.ROAD_WIDTH * 0.45;
      const worldX = curveDX + obs.normalizedX * roadHalfWidth;
      const proj = PerspectiveSystem.project(worldX, 0, relZ, this.roadSystem.cameraX);

      // Check screen bounds
      if (proj.screenY <= PerspectiveSystem.HORIZON_Y || proj.screenY > GAME_HEIGHT + 140) {
        this.hideSprite(obs.id);
        continue;
      }

      // Fetch or create pooled sprite
      let sprite = this.spriteMap.get(obs.id);
      if (!sprite) {
        sprite = this.spritePool.pop();
        if (!sprite) {
          sprite = this.scene.add.sprite(proj.screenX, proj.screenY, obs.textureKey);
          this.container.add(sprite);
        } else {
          sprite.setTexture(obs.textureKey);
          sprite.setPosition(proj.screenX, proj.screenY);
          sprite.setVisible(true);
        }
        this.spriteMap.set(obs.id, sprite);
      }

      // Update position, scale, and origin
      sprite.setPosition(proj.screenX, proj.screenY);
      sprite.setScale(proj.scale * obs.baseScale * 1.35);
      // Potholes and manholes lie flat (origin at center/bottom), upright obstacles rest on bottom
      sprite.setOrigin(0.5, 0.95);
      sprite.setVisible(true);
      this.container.bringToTop(sprite);
    }
  }

  private hideSprite(id: number): void {
    const sprite = this.spriteMap.get(id);
    if (sprite) {
      sprite.setVisible(false);
      this.spritePool.push(sprite);
      this.spriteMap.delete(id);
    }
  }

  private recyclePassedObstacles(cameraZ: number): void {
    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obs = this.activeObstacles[i];
      if (obs.isPassed || obs.worldZ < cameraZ - 220) {
        this.hideSprite(obs.id);
        this.activeObstacles.splice(i, 1);
      }
    }
  }

  /**
   * Returns approaching high-danger obstacles (e.g. open manholes) within 150m for HUD danger alert
   */
  public getImminentDanger(cameraZ: number): ObstacleData | null {
    for (const obs of this.activeObstacles) {
      const relZ = obs.worldZ - cameraZ;
      if (relZ > 60 && relZ < 550) {
        if (obs.type === 'OPEN_MANHOLE' || obs.type === 'BARRICADE' || obs.type === 'POTHOLE_LARGE') {
          return obs;
        }
      }
    }
    return null;
  }
}
