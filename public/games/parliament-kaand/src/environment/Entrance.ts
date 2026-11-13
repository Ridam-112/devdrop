import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class Entrance {
  public group: THREE.Group = new THREE.Group();

  constructor() {
    this.build();
  }

  private build(): void {
    const doorWoodMat = MaterialLibrary.get('woodMahogany');
    const darkWoodMat = MaterialLibrary.get('woodDarkSpeaker');
    const brassMat = MaterialLibrary.get('brassGold');
    const velvetMat = MaterialLibrary.get('carpetMaroon');

    // Position entrance at the far rear center of the chamber
    this.group.position.set(0, 0, 18.5);

    // 1. Grand Double Mahogany Doors
    [-1.15, 1.15].forEach((dx, idx) => {
      const doorGeo = new THREE.BoxGeometry(2.1, 4.6, 0.14);
      const door = new THREE.Mesh(doorGeo, doorWoodMat);
      door.position.set(dx, 2.3, 0);
      door.castShadow = true;

      // Inset decorative raised panels on door
      [-1.1, 0, 1.1].forEach((py) => {
        const panelGeo = new THREE.BoxGeometry(1.6, 0.85, 0.04);
        const panel = new THREE.Mesh(panelGeo, darkWoodMat);
        panel.position.set(0, py, -0.07);
        door.add(panel);
      });

      // Long Vertical Brass Push-Pull Handles
      const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8);
      const handle = new THREE.Mesh(handleGeo, brassMat);
      handle.position.set(idx === 0 ? 0.85 : -0.85, 0, -0.14);
      door.add(handle);

      this.group.add(door);
    });

    // 2. Ornate Door Frame & Architrave
    const frameTopGeo = new THREE.BoxGeometry(5.2, 0.45, 0.35);
    const frameTop = new THREE.Mesh(frameTopGeo, darkWoodMat);
    frameTop.position.set(0, 4.8, 0);
    this.group.add(frameTop);

    [-2.35, 2.35].forEach((fx) => {
      const postGeo = new THREE.BoxGeometry(0.4, 4.8, 0.3);
      const post = new THREE.Mesh(postGeo, darkWoodMat);
      post.position.set(fx, 2.4, 0);
      this.group.add(post);
    });

    // 3. Entrance Portal Signage ("LOK BHAVAN • JANATA SABHA")
    const signGeo = new THREE.BoxGeometry(3.6, 0.5, 0.12);
    const sign = new THREE.Mesh(signGeo, darkWoodMat);
    sign.position.set(0, 5.3, -0.05);

    const goldPlaqueGeo = new THREE.BoxGeometry(3.4, 0.38, 0.02);
    const goldPlaque = new THREE.Mesh(goldPlaqueGeo, brassMat);
    goldPlaque.position.set(0, 5.3, -0.12);

    this.group.add(sign, goldPlaque);

    // 4. Security Checkpoint: Stanchions & Velvet Ropes
    const stanchionPositions = [-2.2, -0.75, 0.75, 2.2];
    stanchionPositions.forEach((sx) => {
      // Brass base
      const sBaseGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.06, 12);
      const sBase = new THREE.Mesh(sBaseGeo, brassMat);
      sBase.position.set(sx, 0.03, -1.8);

      // Brass pole
      const sPoleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.05, 8);
      const sPole = new THREE.Mesh(sPoleGeo, brassMat);
      sPole.position.set(sx, 0.55, -1.8);

      // Crown ball
      const sBallGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const sBall = new THREE.Mesh(sBallGeo, brassMat);
      sBall.position.set(sx, 1.1, -1.8);

      this.group.add(sBase, sPole, sBall);
    });

    // Velvet Ropes connecting outer stanchions
    [
      { x1: -2.2, x2: -0.75 },
      { x1: 0.75, x2: 2.2 },
    ].forEach((pair) => {
      const midX = (pair.x1 + pair.x2) / 2;
      const ropeGeo = new THREE.CylinderGeometry(0.035, 0.035, Math.abs(pair.x2 - pair.x1), 8);
      const rope = new THREE.Mesh(ropeGeo, velvetMat);
      rope.rotation.z = Math.PI / 2;
      rope.position.set(midX, 0.95, -1.8);
      this.group.add(rope);
    });

    // 5. Security Archway / Metal Detector Scanner Frame
    const scannerGroup = new THREE.Group();
    scannerGroup.position.set(0, 0, -1.8);

    const postGeo = new THREE.BoxGeometry(0.18, 2.4, 0.45);
    const scannerMat = MaterialLibrary.get('marbleTile');
    const postLeft = new THREE.Mesh(postGeo, scannerMat);
    postLeft.position.set(-0.65, 1.2, 0);

    const postRight = new THREE.Mesh(postGeo, scannerMat);
    postRight.position.set(0.65, 1.2, 0);

    const headerGeo = new THREE.BoxGeometry(1.48, 0.25, 0.45);
    const header = new THREE.Mesh(headerGeo, scannerMat);
    header.position.set(0, 2.45, 0);

    const indicatorGeo = new THREE.BoxGeometry(0.3, 0.08, 0.02);
    const indicator = new THREE.Mesh(indicatorGeo, MaterialLibrary.get('digitalDisplay'));
    indicator.position.set(0, 2.45, -0.23);

    scannerGroup.add(postLeft, postRight, header, indicator);
    this.group.add(scannerGroup);
  }
}
