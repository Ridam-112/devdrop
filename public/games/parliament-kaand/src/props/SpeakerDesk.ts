import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class SpeakerDesk {
  public mesh: THREE.Group = new THREE.Group();
  public gavelMesh: THREE.Group = new THREE.Group();

  constructor() {
    this.build();
  }

  private build(): void {
    const woodMat = MaterialLibrary.get('woodMahogany');
    const darkWoodMat = MaterialLibrary.get('woodDarkSpeaker');
    const brassMat = MaterialLibrary.get('brassGold');
    const chromeMat = MaterialLibrary.get('chrome');

    // 1. Main Desk Top & Body
    const topGeo = new THREE.BoxGeometry(3.6, 0.12, 1.4);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.y = 1.0;
    top.castShadow = true;
    top.receiveShadow = true;
    this.mesh.add(top);

    // Darker Inset Blotter / Leather Writing Pad
    const blotterGeo = new THREE.BoxGeometry(2.4, 0.02, 0.9);
    const blotterMat = MaterialLibrary.get('leatherSpeaker');
    const blotter = new THREE.Mesh(blotterGeo, blotterMat);
    blotter.position.set(0, 1.07, 0.05);
    this.mesh.add(blotter);

    // Front Carved Curved Apron Panel
    const frontPanelGeo = new THREE.BoxGeometry(3.4, 0.9, 0.1);
    const frontPanel = new THREE.Mesh(frontPanelGeo, woodMat);
    frontPanel.position.set(0, 0.55, -0.6);
    this.mesh.add(frontPanel);

    // Decorative Molded Trim on Front Panel
    const trimGeo = new THREE.BoxGeometry(3.2, 0.7, 0.04);
    const trim = new THREE.Mesh(trimGeo, darkWoodMat);
    trim.position.set(0, 0.55, -0.66);
    this.mesh.add(trim);

    // Gold State Seal Medallion on Front Panel
    const sealGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 16);
    const seal = new THREE.Mesh(sealGeo, brassMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, 0.55, -0.69);
    this.mesh.add(seal);

    // Side Panels
    [-1.7, 1.7].forEach((sx) => {
      const sideGeo = new THREE.BoxGeometry(0.12, 0.9, 1.3);
      const side = new THREE.Mesh(sideGeo, woodMat);
      side.position.set(sx, 0.55, 0);
      this.mesh.add(side);
    });

    // 2. Microphones (Dual Brass Gooseneck Mics)
    [-0.55, 0.55].forEach((mx) => {
      const baseGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.04, 12);
      const base = new THREE.Mesh(baseGeo, brassMat);
      base.position.set(mx, 1.08, -0.2);

      const standGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8);
      const stand = new THREE.Mesh(standGeo, chromeMat);
      stand.position.set(mx, 1.3, -0.2);
      stand.rotation.x = -0.15;

      const micHeadGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 8);
      const micHead = new THREE.Mesh(micHeadGeo, MaterialLibrary.get('darkMetal'));
      micHead.position.set(mx, 1.52, -0.16);
      micHead.rotation.x = -0.3;

      this.mesh.add(base, stand, micHead);
    });

    // 3. Speaker's Brass Calling Bell
    const bellBaseGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.03, 16);
    const bellDomeGeo = new THREE.SphereGeometry(0.09, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.8);
    const bellPinGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.06, 8);

    const bellBase = new THREE.Mesh(bellBaseGeo, darkWoodMat);
    bellBase.position.set(-0.95, 1.08, 0.2);

    const bellDome = new THREE.Mesh(bellDomeGeo, brassMat);
    bellDome.position.set(-0.95, 1.14, 0.2);

    const bellPin = new THREE.Mesh(bellPinGeo, brassMat);
    bellPin.position.set(-0.95, 1.23, 0.2);

    this.mesh.add(bellBase, bellDome, bellPin);

    // 4. Nameplate ("HON'BLE SPEAKER")
    const plateGeo = new THREE.BoxGeometry(0.65, 0.12, 0.1);
    const plate = new THREE.Mesh(plateGeo, darkWoodMat);
    plate.position.set(0, 1.12, -0.5);
    plate.rotation.x = -0.25;

    const goldStripGeo = new THREE.BoxGeometry(0.58, 0.08, 0.01);
    const goldStrip = new THREE.Mesh(goldStripGeo, brassMat);
    goldStrip.position.set(0, 1.12, -0.45);
    goldStrip.rotation.x = -0.25;

    this.mesh.add(plate, goldStrip);

    // 5. Speaker's Gavel & Strike Block
    const blockGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.06, 16);
    const block = new THREE.Mesh(blockGeo, darkWoodMat);
    block.position.set(0.95, 1.09, 0.2);
    this.mesh.add(block);

    const gavelHandleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8);
    const gavelHeadGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.28, 12);

    const gavelHandle = new THREE.Mesh(gavelHandleGeo, darkWoodMat);
    gavelHandle.rotation.z = Math.PI / 3;

    const gavelHead = new THREE.Mesh(gavelHeadGeo, darkWoodMat);
    gavelHead.rotation.x = Math.PI / 2;
    gavelHead.position.set(-0.16, 0.16, 0);

    // Brass rings on gavel head
    [-0.1, 0.1].forEach((gx) => {
      const ringGeo = new THREE.TorusGeometry(0.076, 0.008, 6, 12);
      const ring = new THREE.Mesh(ringGeo, brassMat);
      ring.position.set(gx, 0, 0);
      ring.rotation.y = Math.PI / 2;
      gavelHead.add(ring);
    });

    this.gavelMesh.add(gavelHandle, gavelHead);
    this.gavelMesh.position.set(0.95, 1.13, 0.2);
    this.mesh.add(this.gavelMesh);
  }
}
