import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class MPDesk {
  public static createModule(width = 1.8, isRulingSide = true): THREE.Group {
    const group = new THREE.Group();

    const woodMat = MaterialLibrary.get('woodTeak');
    const darkWoodMat = MaterialLibrary.get('woodDarkSpeaker');
    const brassMat = MaterialLibrary.get('brassGold');
    const chromeMat = MaterialLibrary.get('chrome');

    // 1. Desk Top
    const topGeo = new THREE.BoxGeometry(width, 0.08, 0.65);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.y = 0.85;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    // Front Privacy Screen / Modesty Panel
    const panelGeo = new THREE.BoxGeometry(width, 0.75, 0.06);
    const panel = new THREE.Mesh(panelGeo, woodMat);
    panel.position.set(0, 0.45, -0.3);
    panel.receiveShadow = true;
    group.add(panel);

    // Colored Accent Stripe on privacy panel (Crimson for ruling, Blue for opposition)
    const stripeGeo = new THREE.BoxGeometry(width * 0.95, 0.06, 0.02);
    const stripeMat = isRulingSide ? MaterialLibrary.get('fabricRuling') : MaterialLibrary.get('fabricOpposition');
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.72, -0.34);
    group.add(stripe);

    // Side Support Legs
    [-width / 2 + 0.06, width / 2 - 0.06].forEach((lx) => {
      const legGeo = new THREE.BoxGeometry(0.08, 0.85, 0.6);
      const leg = new THREE.Mesh(legGeo, darkWoodMat);
      leg.position.set(lx, 0.425, 0);
      group.add(leg);
    });

    // 2. Desk Props: Microphone
    const micBaseGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.02, 10);
    const micBase = new THREE.Mesh(micBaseGeo, darkWoodMat);
    micBase.position.set(0, 0.9, -0.15);

    const micStandGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.35, 6);
    const micStand = new THREE.Mesh(micStandGeo, chromeMat);
    micStand.position.set(0, 1.07, -0.15);
    micStand.rotation.x = -0.15;

    const micHeadGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8);
    const micHead = new THREE.Mesh(micHeadGeo, MaterialLibrary.get('darkMetal'));
    micHead.position.set(0, 1.24, -0.12);
    micHead.rotation.x = -0.25;

    group.add(micBase, micStand, micHead);

    // 3. Desk Props: Legislative Papers & Folders
    const paperGeo = new THREE.BoxGeometry(0.32, 0.02, 0.24);
    const paper = new THREE.Mesh(paperGeo, MaterialLibrary.get('paperWhite'));
    paper.position.set(-width * 0.25, 0.9, 0.05);
    paper.rotation.y = 0.08;
    group.add(paper);

    const folderGeo = new THREE.BoxGeometry(0.35, 0.015, 0.26);
    const folder = new THREE.Mesh(folderGeo, MaterialLibrary.get('paperFolderManila'));
    folder.position.set(-width * 0.25, 0.89, 0.05);
    folder.rotation.y = -0.05;
    group.add(folder);

    // 4. Desk Props: Clear Water Bottle
    const bottleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.22, 10);
    const bottle = new THREE.Mesh(bottleGeo, MaterialLibrary.get('waterBottlePlastic'));
    bottle.position.set(width * 0.32, 1.0, -0.12);

    const capGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.03, 8);
    const cap = new THREE.Mesh(capGeo, MaterialLibrary.get('waterCap'));
    cap.position.set(width * 0.32, 1.12, -0.12);
    group.add(bottle, cap);

    // 5. Desk Props: Nameplate
    const nameplateGeo = new THREE.BoxGeometry(0.28, 0.06, 0.04);
    const nameplate = new THREE.Mesh(nameplateGeo, brassMat);
    nameplate.position.set(0, 0.91, -0.25);
    nameplate.rotation.x = -0.25;
    group.add(nameplate);

    return group;
  }
}
