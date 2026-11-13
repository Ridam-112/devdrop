import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class ChamberWell {
  public group: THREE.Group = new THREE.Group();

  constructor() {
    this.build();
  }

  private build(): void {
    const wellMat = MaterialLibrary.get('carpetWellCenter');
    const borderMat = MaterialLibrary.get('brassGold');
    const tableMat = MaterialLibrary.get('woodMahogany');
    const darkWoodMat = MaterialLibrary.get('woodDarkSpeaker');

    // 1. Semicircular Open Floor of the Well
    const floorGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.05, 32);
    const floor = new THREE.Mesh(floorGeo, wellMat);
    floor.position.set(0, 0.025, -2.2);
    floor.receiveShadow = true;
    this.group.add(floor);

    // Gold Trim Ring around the Well
    const ringGeo = new THREE.TorusGeometry(5.2, 0.05, 8, 36);
    const ring = new THREE.Mesh(ringGeo, borderMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.05, -2.2);
    this.group.add(ring);

    // 2. Table of the House (Secretariat Table)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, -4.5);

    const tableTopGeo = new THREE.BoxGeometry(4.2, 0.1, 1.6);
    const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
    tableTop.position.y = 0.85;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Green Felt Blotters for Secretariat officers
    [-1.2, 0, 1.2].forEach((bx) => {
      const blotterGeo = new THREE.BoxGeometry(0.85, 0.015, 0.7);
      const blotter = new THREE.Mesh(blotterGeo, wellMat);
      blotter.position.set(bx, 0.91, 0);
      tableGroup.add(blotter);
    });

    // Decorative Apron Panels
    const apronGeo = new THREE.BoxGeometry(4.0, 0.75, 0.08);
    const apron = new THREE.Mesh(apronGeo, tableMat);
    apron.position.set(0, 0.425, 0.76);
    tableGroup.add(apron);

    // Sturdy Carved Legs
    [-1.9, 1.9].forEach((lx) => {
      [-0.65, 0.65].forEach((lz) => {
        const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.85, 8);
        const leg = new THREE.Mesh(legGeo, darkWoodMat);
        leg.position.set(lx, 0.425, lz);
        tableGroup.add(leg);
      });
    });

    // 3. The Ceremonial Golden Mace on Table
    const maceGroup = new THREE.Group();
    maceGroup.position.set(0, 0.96, 0.45);

    // Dual Velvet/Brass Cradles
    [-0.8, 0.8].forEach((cx) => {
      const cradleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
      const cradle = new THREE.Mesh(cradleGeo, borderMat);
      cradle.position.set(cx, 0, 0);
      maceGroup.add(cradle);
    });

    // Mace Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 10);
    const shaft = new THREE.Mesh(shaftGeo, borderMat);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.y = 0.06;
    maceGroup.add(shaft);

    // Mace Fluted Ornamental Head
    const maceHeadGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const maceHead = new THREE.Mesh(maceHeadGeo, borderMat);
    maceHead.position.set(1.15, 0.06, 0);
    maceGroup.add(maceHead);

    const finialGeo = new THREE.ConeGeometry(0.06, 0.15, 8);
    const finial = new THREE.Mesh(finialGeo, borderMat);
    finial.rotation.z = -Math.PI / 2;
    finial.position.set(1.3, 0.06, 0);
    maceGroup.add(finial);

    tableGroup.add(maceGroup);

    // 4. Officers' Chairs (3 Chairs behind Secretariat Table)
    [-1.2, 0, 1.2].forEach((cx) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(cx, 0, -5.3);

      const seatGeo = new THREE.BoxGeometry(0.65, 0.1, 0.6);
      const seat = new THREE.Mesh(seatGeo, MaterialLibrary.get('leatherSpeaker'));
      seat.position.y = 0.45;
      chairGroup.add(seat);

      const backGeo = new THREE.BoxGeometry(0.6, 0.7, 0.08);
      const back = new THREE.Mesh(backGeo, darkWoodMat);
      back.position.set(0, 0.85, -0.28);
      chairGroup.add(back);

      const legGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.45, 6);
      [-0.25, 0.25].forEach((lx) => {
        [-0.22, 0.22].forEach((lz) => {
          const leg = new THREE.Mesh(legGeo, MaterialLibrary.get('chrome'));
          leg.position.set(lx, 0.225, lz);
          chairGroup.add(leg);
        });
      });

      this.group.add(chairGroup);
    });

    this.group.add(tableGroup);
  }
}
