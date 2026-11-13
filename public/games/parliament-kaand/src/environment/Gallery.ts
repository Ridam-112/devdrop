import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class Gallery {
  public group: THREE.Group = new THREE.Group();

  constructor() {
    this.build();
  }

  private build(): void {
    const floorMat = MaterialLibrary.get('marbleTile');
    const carpetMat = MaterialLibrary.get('carpetMaroon');
    const railMat = MaterialLibrary.get('brassGold');
    const glassMat = MaterialLibrary.get('glassRail');
    const woodMat = MaterialLibrary.get('woodTeak');

    const galleryElevation = 6.2;
    const innerRadius = 16.5;
    const outerRadius = 21.0;

    // 1. Semicircular Balcony Slab
    const balconyGeo = new THREE.CylinderGeometry(
      outerRadius,
      outerRadius,
      0.6,
      36,
      1,
      false,
      Math.PI * 0.08,
      Math.PI * 0.84
    );
    const balcony = new THREE.Mesh(balconyGeo, floorMat);
    balcony.position.set(0, galleryElevation - 0.3, 0);
    balcony.receiveShadow = true;
    this.group.add(balcony);

    // Carpet runner along gallery walkway
    const carpetGeo = new THREE.CylinderGeometry(
      outerRadius - 0.4,
      outerRadius - 0.4,
      0.62,
      36,
      1,
      false,
      Math.PI * 0.1,
      Math.PI * 0.8
    );
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.position.set(0, galleryElevation - 0.3, 0);
    this.group.add(carpet);

    // 2. Brass & Glass Balustrade Railing
    const railRingGeo = new THREE.TorusGeometry(innerRadius, 0.06, 8, 36, Math.PI * 0.84);
    const topRail = new THREE.Mesh(railRingGeo, railMat);
    topRail.rotation.x = Math.PI / 2;
    topRail.position.set(0, galleryElevation + 0.95, 0);
    this.group.add(topRail);

    // Glass safety panels around the rim
    const panelCount = 14;
    for (let i = 0; i < panelCount; i++) {
      const angle = Math.PI * 0.1 + (i / panelCount) * (Math.PI * 0.8);
      const x = Math.cos(angle) * innerRadius;
      const z = Math.sin(angle) * innerRadius;

      // Baluster stanchion
      const stanchionGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8);
      const stanchion = new THREE.Mesh(stanchionGeo, railMat);
      stanchion.position.set(x, galleryElevation + 0.475, z);
      this.group.add(stanchion);

      // Glass sheet
      const glassGeo = new THREE.BoxGeometry(1.8, 0.75, 0.04);
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(x, galleryElevation + 0.45, z);
      glass.rotation.y = -angle - Math.PI / 2;
      this.group.add(glass);
    }

    // 3. Press & Spectator Tiered Seating Benches
    const seatingRows = 2;
    for (let r = 0; r < seatingRows; r++) {
      const rowRadius = innerRadius + 1.8 + r * 1.6;
      const count = 10 + r * 2;

      for (let s = 0; s < count; s++) {
        const angle = Math.PI * 0.14 + (s / count) * (Math.PI * 0.72);
        const x = Math.cos(angle) * rowRadius;
        const z = Math.sin(angle) * rowRadius;

        const benchGroup = new THREE.Group();
        benchGroup.position.set(x, galleryElevation + r * 0.35, z);
        benchGroup.rotation.y = -angle - Math.PI / 2;

        const benchSeatGeo = new THREE.BoxGeometry(1.3, 0.4, 0.35);
        const benchSeat = new THREE.Mesh(benchSeatGeo, woodMat);
        benchSeat.position.y = 0.2;
        benchGroup.add(benchSeat);

        const benchBackGeo = new THREE.BoxGeometry(1.3, 0.45, 0.06);
        const benchBack = new THREE.Mesh(benchBackGeo, woodMat);
        benchBack.position.set(0, 0.55, 0.18);
        benchGroup.add(benchBack);

        this.group.add(benchGroup);
      }
    }
  }
}
