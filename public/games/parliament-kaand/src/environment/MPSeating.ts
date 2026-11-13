import * as THREE from 'three';
import { MPDesk } from '../props/MPDesk';
import { MPChair } from '../props/MPChair';

export class MPSeating {
  public group: THREE.Group = new THREE.Group();

  constructor() {
    this.buildConcentricSemicircle();
  }

  private buildConcentricSemicircle(): void {
    // 4 Concentric Semicircular Tiered Rows
    const rowConfigs = [
      { radius: 7.2, benchCount: 8, elevation: 0.15 },
      { radius: 10.0, benchCount: 12, elevation: 0.50 },
      { radius: 12.8, benchCount: 16, elevation: 0.85 },
      { radius: 15.6, benchCount: 20, elevation: 1.20 },
    ];

    rowConfigs.forEach((row, rowIdx) => {
      // Build curved riser platform underneath this row
      const riserThickness = 0.35;
      const riserRadius = row.radius + 0.4;
      const riserGeo = new THREE.CylinderGeometry(riserRadius, riserRadius + 0.2, riserThickness, 32, 1, false, Math.PI * 0.1, Math.PI * 0.8);
      const riserMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 });
      const riser = new THREE.Mesh(riserGeo, riserMat);
      riser.position.set(0, row.elevation - riserThickness / 2, -1.0);
      riser.receiveShadow = true;
      this.group.add(riser);

      // Distribute benches along the semicircular arc
      const halfCount = row.benchCount / 2;

      // Arc spans from -155 degrees to -25 degrees (facing the Speaker at 0, 0, -8.5)
      for (let i = 0; i < row.benchCount; i++) {
        // Skip the central 2 slots in middle rows to leave a grand central aisle walkway!
        const isRulingSide = i < halfCount;

        // Angle distribution with central aisle gap
        let angleFraction = i / (row.benchCount - 1);
        if (isRulingSide) {
          angleFraction = (i / (halfCount - 0.2)) * 0.46; // Left half
        } else {
          angleFraction = 0.54 + ((i - halfCount) / (halfCount - 0.2)) * 0.46; // Right half
        }

        const angle = -Math.PI * 0.88 + angleFraction * (Math.PI * 0.76);
        const x = Math.cos(angle) * row.radius;
        const z = Math.sin(angle) * row.radius + 1.2;

        const benchModule = new THREE.Group();
        benchModule.position.set(x, row.elevation, z);
        benchModule.rotation.y = -angle - Math.PI / 2;

        // Place Desk
        const desk = MPDesk.createModule(1.65, isRulingSide);
        benchModule.add(desk);

        // Place Chair behind desk
        const chair = MPChair.create(isRulingSide);
        chair.position.set(0, 0, 0.75);
        benchModule.add(chair);

        this.group.add(benchModule);
      }
    });
  }
}
