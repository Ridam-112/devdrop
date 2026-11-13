import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class MPChair {
  public static create(isRulingSide = true): THREE.Group {
    const chair = new THREE.Group();

    const woodMat = MaterialLibrary.get('woodTeak');
    const darkWoodMat = MaterialLibrary.get('woodDarkSpeaker');
    const chromeMat = MaterialLibrary.get('chrome');
    const fabricMat = isRulingSide ? MaterialLibrary.get('fabricRuling') : MaterialLibrary.get('fabricOpposition');

    // 1. Swivel 5-star / circular base
    const baseGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.08, 12);
    const base = new THREE.Mesh(baseGeo, darkWoodMat);
    base.position.y = 0.04;
    chair.add(base);

    const stemGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.35, 8);
    const stem = new THREE.Mesh(stemGeo, chromeMat);
    stem.position.y = 0.22;
    chair.add(stem);

    // 2. Seat Cushion
    const seatFrameGeo = new THREE.BoxGeometry(0.56, 0.06, 0.52);
    const seatFrame = new THREE.Mesh(seatFrameGeo, woodMat);
    seatFrame.position.y = 0.42;
    chair.add(seatFrame);

    const cushionGeo = new THREE.BoxGeometry(0.52, 0.1, 0.48);
    const cushion = new THREE.Mesh(cushionGeo, fabricMat);
    cushion.position.set(0, 0.48, 0);
    cushion.castShadow = true;
    chair.add(cushion);

    // 3. Ergonomic Backrest
    const backFrameGeo = new THREE.BoxGeometry(0.52, 0.65, 0.06);
    const backFrame = new THREE.Mesh(backFrameGeo, woodMat);
    backFrame.position.set(0, 0.85, 0.23);
    backFrame.rotation.x = 0.08;
    chair.add(backFrame);

    const backCushionGeo = new THREE.BoxGeometry(0.46, 0.58, 0.05);
    const backCushion = new THREE.Mesh(backCushionGeo, fabricMat);
    backCushion.position.set(0, 0.85, 0.2);
    backCushion.rotation.x = 0.08;
    chair.add(backCushion);

    // 4. Armrests
    [-0.27, 0.27].forEach((ax) => {
      const armGeo = new THREE.BoxGeometry(0.05, 0.04, 0.36);
      const arm = new THREE.Mesh(armGeo, darkWoodMat);
      arm.position.set(ax, 0.68, 0.04);

      const supportGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6);
      const support = new THREE.Mesh(supportGeo, chromeMat);
      support.position.set(ax, 0.56, 0.12);

      chair.add(arm, support);
    });

    return chair;
  }
}
