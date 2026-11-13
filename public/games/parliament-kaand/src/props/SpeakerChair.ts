import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class SpeakerChair {
  public mesh: THREE.Group = new THREE.Group();

  constructor() {
    this.build();
  }

  private build(): void {
    const woodMat = MaterialLibrary.get('woodDarkSpeaker');
    const goldMat = MaterialLibrary.get('brassGold');
    const leatherMat = MaterialLibrary.get('leatherSpeaker');
    const velvetMat = MaterialLibrary.get('carpetMaroon');

    // 1. Chair Base & Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.4, 16);
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.y = 0.2;
    this.mesh.add(base);

    // 2. Seat Cushion (Plush Crimson Velvet & Tufted Leather)
    const seatFrameGeo = new THREE.BoxGeometry(1.3, 0.18, 1.2);
    const seatFrame = new THREE.Mesh(seatFrameGeo, woodMat);
    seatFrame.position.y = 0.5;
    this.mesh.add(seatFrame);

    const cushionGeo = new THREE.BoxGeometry(1.2, 0.22, 1.1);
    const cushion = new THREE.Mesh(cushionGeo, velvetMat);
    cushion.position.set(0, 0.65, 0);
    cushion.castShadow = true;
    this.mesh.add(cushion);

    // 3. Tall Ornate Backrest (High Back)
    const backFrameGeo = new THREE.BoxGeometry(1.4, 2.6, 0.2);
    const backFrame = new THREE.Mesh(backFrameGeo, woodMat);
    backFrame.position.set(0, 1.85, -0.55);
    backFrame.castShadow = true;
    this.mesh.add(backFrame);

    // Inner Velvet Padded Back Panel
    const backCushionGeo = new THREE.BoxGeometry(1.15, 2.3, 0.12);
    const backCushion = new THREE.Mesh(backCushionGeo, leatherMat);
    backCushion.position.set(0, 1.8, -0.5);
    this.mesh.add(backCushion);

    // Carved Top Arch & Crown Finial
    const crownGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16, 1, false, 0, Math.PI);
    const crown = new THREE.Mesh(crownGeo, woodMat);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(0, 3.15, -0.55);
    this.mesh.add(crown);

    // Golden Lions Crest Emblem
    const crestGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const crest = new THREE.Mesh(crestGeo, goldMat);
    crest.position.set(0, 3.25, -0.45);
    this.mesh.add(crest);

    // Side Finials on Backrest
    [-0.65, 0.65].forEach((fx) => {
      const finialGeo = new THREE.ConeGeometry(0.1, 0.35, 8);
      const finial = new THREE.Mesh(finialGeo, goldMat);
      finial.position.set(fx, 3.25, -0.55);
      this.mesh.add(finial);
    });

    // 4. Carved Armrests
    [-0.62, 0.62].forEach((ax) => {
      const armRestGeo = new THREE.BoxGeometry(0.14, 0.1, 0.9);
      const armRest = new THREE.Mesh(armRestGeo, woodMat);
      armRest.position.set(ax, 1.1, -0.05);

      const armPillarGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.45, 8);
      const armPillar = new THREE.Mesh(armPillarGeo, goldMat);
      armPillar.position.set(ax, 0.85, 0.3);

      this.mesh.add(armRest, armPillar);
    });
  }
}
