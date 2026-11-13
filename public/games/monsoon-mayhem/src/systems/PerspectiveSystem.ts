import { GAME_WIDTH, GAME_HEIGHT } from '../game/GameConstants';

export interface ProjectedPoint {
  screenX: number;
  screenY: number;
  screenW: number;
  scale: number;
  depth: number;
}

export class PerspectiveSystem {
  public static readonly HORIZON_Y = 270; // Vanishing point horizon
  public static readonly FOCAL_LENGTH = 320; // Perspective focal depth
  public static readonly CAMERA_HEIGHT = 160; // Camera elevation above road
  public static readonly DRAW_DISTANCE = 140; // Segments rendered ahead
  public static readonly SEGMENT_LENGTH = 160; // World units per segment
  public static readonly ROAD_WIDTH = 1450; // Total world road width
  public static readonly DEPTH_MULTIPLIER = 3.2; // Extends road cleanly to screen bottom

  /**
   * Projects 3D world coordinates (x, y, z) to 2D screen coordinates.
   */
  public static project(
    worldX: number,
    worldY: number,
    worldZ: number,
    cameraX: number = 0,
    cameraY: number = PerspectiveSystem.CAMERA_HEIGHT
  ): ProjectedPoint {
    const depth = Math.max(20, worldZ);
    const scale = PerspectiveSystem.FOCAL_LENGTH / (depth + PerspectiveSystem.FOCAL_LENGTH);

    const centerX = GAME_WIDTH / 2;
    const screenX = Math.round(centerX + (worldX - cameraX) * scale);
    const screenY = Math.round(PerspectiveSystem.HORIZON_Y + (cameraY - worldY) * scale * PerspectiveSystem.DEPTH_MULTIPLIER);
    const screenW = Math.round(PerspectiveSystem.ROAD_WIDTH * scale);

    return {
      screenX,
      screenY,
      screenW,
      scale,
      depth
    };
  }
}
