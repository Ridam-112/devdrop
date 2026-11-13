import * as THREE from 'three';

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface CylinderCollider {
  x: number;
  z: number;
  radius: number;
}

export class EnvironmentColliders {
  // Static obstacles
  private static readonly CHAMBER_RADIUS = 36.5;

  // 1. Table of the House in the Well
  private static readonly TABLE_OF_HOUSE: BoundingBox2D = {
    minX: -3.2,
    maxX: 3.2,
    minZ: -5.2,
    maxZ: -1.8,
  };

  // 2. Speaker's Dais Desk
  private static readonly SPEAKER_DESK: BoundingBox2D = {
    minX: -2.4,
    maxX: 2.4,
    minZ: -14.6,
    maxZ: -12.4,
  };

  // 3. Speaker's Dais Outer Bounds
  private static readonly SPEAKER_DAIS: BoundingBox2D = {
    minX: -5.5,
    maxX: 5.5,
    minZ: -18.0,
    maxZ: -9.8,
  };

  // 4. Columns (16 fluted pillars around perimeter)
  private static readonly COLUMNS: CylinderCollider[] = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 16;
    return {
      x: Math.cos(angle) * 33.0,
      z: Math.sin(angle) * 33.0,
      radius: 1.1,
    };
  });

  // 5. MP Desk arcs (4 curved concentric rows)
  // Desk radii: Row 1 ~10m, Row 2 ~15.5m, Row 3 ~21m, Row 4 ~26.5m
  private static readonly DESK_BANDS = [
    { minR: 9.3, maxR: 10.7, height: 0.5 },
    { minR: 14.8, maxR: 16.2, height: 1.0 },
    { minR: 20.3, maxR: 21.7, height: 1.5 },
    { minR: 25.8, maxR: 27.2, height: 2.0 },
  ];

  /**
   * Calculates the exact ground height at any horizontal coordinate (X, Z).
   * Supports smooth step-ups and stairs for the dais and concentric tiers.
   */
  public static getGroundHeight(x: number, z: number): number {
    // 1. Speaker Dais Elevation (+1.2m)
    if (
      x >= this.SPEAKER_DAIS.minX &&
      x <= this.SPEAKER_DAIS.maxX &&
      z >= this.SPEAKER_DAIS.minZ &&
      z <= this.SPEAKER_DAIS.maxZ
    ) {
      // Smooth front stairs transition from Z = -9.8 to -8.5
      if (z > -10.5) {
        const stairT = (z - (-9.8)) / (-10.5 - (-9.8));
        return THREE.MathUtils.lerp(0.0, 1.2, THREE.MathUtils.clamp(stairT, 0, 1));
      }
      return 1.2;
    }

    // 2. Concentric Tiers Elevation (0.5m, 1.0m, 1.5m, 2.0m)
    // Central Aisle (|X| <= 1.8m) remains level at floor height for walking between sections
    if (Math.abs(x) > 1.8 && z > -7.0) {
      const dist = Math.sqrt(x * x + z * z);
      if (dist >= 24.5 && dist <= 28.5) return 2.0;
      if (dist >= 19.0 && dist <= 23.5) return 1.5;
      if (dist >= 13.5 && dist <= 18.0) return 1.0;
      if (dist >= 8.5 && dist <= 12.5) return 0.5;
    }

    // 3. Chamber floor level (The Well and central aisle)
    return 0.0;
  }

  /**
   * Resolves horizontal movement collisions against all solid chamber objects.
   * Slides the player smoothly along collision edges without getting stuck.
   */
  public static resolveCollisions(
    oldPos: THREE.Vector3,
    newPos: THREE.Vector3,
    playerRadius = 0.38
  ): THREE.Vector3 {
    const resolved = newPos.clone();

    // 1. Outer Chamber Wall Cylinder Collision
    const distFromCenter = Math.sqrt(resolved.x * resolved.x + resolved.z * resolved.z);
    const maxRadius = this.CHAMBER_RADIUS - playerRadius;
    if (distFromCenter > maxRadius) {
      const angle = Math.atan2(resolved.x, resolved.z);
      resolved.x = Math.sin(angle) * maxRadius;
      resolved.z = Math.cos(angle) * maxRadius;
    }

    // 2. Table of the House (Central floor)
    this.collideWithBox(resolved, oldPos, this.TABLE_OF_HOUSE, playerRadius);

    // 3. Speaker's Desk (Only when on dais)
    if (resolved.y >= 0.8) {
      this.collideWithBox(resolved, oldPos, this.SPEAKER_DESK, playerRadius);
    }

    // 4. Columns (Pillars)
    for (const col of this.COLUMNS) {
      const dx = resolved.x - col.x;
      const dz = resolved.z - col.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = col.radius + playerRadius;
      if (dist < minDist && dist > 0.001) {
        const pushX = (dx / dist) * minDist;
        const pushZ = (dz / dist) * minDist;
        resolved.x = col.x + pushX;
        resolved.z = col.z + pushZ;
      }
    }

    // 5. MP Desks (Curved desk rows)
    // Desks are solid obstacles; central aisle (|X| <= 1.8m) is always clear for passage
    if (Math.abs(resolved.x) > 1.8 && resolved.z > -6.0) {
      const r = Math.sqrt(resolved.x * resolved.x + resolved.z * resolved.z);
      for (const band of this.DESK_BANDS) {
        if (r > band.minR - playerRadius && r < band.maxR + playerRadius) {
          // Push outward or inward to closest aisle edge
          const distToMin = Math.abs(r - (band.minR - playerRadius));
          const distToMax = Math.abs(r - (band.maxR + playerRadius));
          const targetR = distToMin < distToMax ? band.minR - playerRadius : band.maxR + playerRadius;
          const angle = Math.atan2(resolved.x, resolved.z);
          resolved.x = Math.sin(angle) * targetR;
          resolved.z = Math.cos(angle) * targetR;
        }
      }
    }

    return resolved;
  }

  private static collideWithBox(
    pos: THREE.Vector3,
    oldPos: THREE.Vector3,
    box: BoundingBox2D,
    radius: number
  ): void {
    const minX = box.minX - radius;
    const maxX = box.maxX + radius;
    const minZ = box.minZ - radius;
    const maxZ = box.maxZ + radius;

    // Inside expanded box?
    if (pos.x > minX && pos.x < maxX && pos.z > minZ && pos.z < maxZ) {
      // Find shortest penetration depth
      const leftDist = pos.x - minX;
      const rightDist = maxX - pos.x;
      const backDist = pos.z - minZ;
      const frontDist = maxZ - pos.z;

      const minDist = Math.min(leftDist, rightDist, backDist, frontDist);

      if (minDist === leftDist) pos.x = minX;
      else if (minDist === rightDist) pos.x = maxX;
      else if (minDist === backDist) pos.z = minZ;
      else if (minDist === frontDist) pos.z = maxZ;
    }
  }
}
