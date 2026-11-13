import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';
import { SpeakerDesk } from '../props/SpeakerDesk';
import { SpeakerChair } from '../props/SpeakerChair';

export class SpeakerPlatform {
  public group: THREE.Group = new THREE.Group();
  public speakerDesk: SpeakerDesk;
  public speakerChair: SpeakerChair;

  constructor() {
    this.speakerDesk = new SpeakerDesk();
    this.speakerChair = new SpeakerChair();
    this.build();
  }

  private build(): void {
    const platformWoodMat = MaterialLibrary.get('woodMahogany');
    const carpetMat = MaterialLibrary.get('carpetMaroon');
    const goldMat = MaterialLibrary.get('brassGold');
    const darkWoodMat = MaterialLibrary.get('woodDarkSpeaker');

    // Podium Base Center Position
    this.group.position.set(0, 0, -8.5);

    // 1. Tiered Elevated Platform Steps (3 Grand Tiers)
    const tiers = [
      { width: 5.8, depth: 3.6, height: 0.35, y: 0.175 },
      { width: 5.0, depth: 3.0, height: 0.35, y: 0.525 },
      { width: 4.2, depth: 2.5, height: 0.35, y: 0.875 },
    ];

    tiers.forEach((t) => {
      const stepGeo = new THREE.BoxGeometry(t.width, t.height, t.depth);
      const step = new THREE.Mesh(stepGeo, platformWoodMat);
      step.position.set(0, t.y, 0);
      step.receiveShadow = true;
      this.group.add(step);

      // Crimson Carpet Runner on Step
      const runnerGeo = new THREE.BoxGeometry(t.width * 0.94, 0.02, t.depth * 0.94);
      const runner = new THREE.Mesh(runnerGeo, carpetMat);
      runner.position.set(0, t.y + t.height / 2 + 0.01, 0);
      runner.receiveShadow = true;
      this.group.add(runner);

      // Gold Nosing Trim on Step Edges
      const nosingGeo = new THREE.BoxGeometry(t.width, 0.03, 0.03);
      const nosing = new THREE.Mesh(nosingGeo, goldMat);
      nosing.position.set(0, t.y + t.height / 2, t.depth / 2);
      this.group.add(nosing);
    });

    // 2. Speaker's Grand Canopy & Archival Wall Backing
    const backdropGroup = new THREE.Group();
    backdropGroup.position.set(0, 1.05, -1.0);

    // Dark Mahogany Arched Panel
    const backPanelGeo = new THREE.BoxGeometry(3.6, 5.0, 0.2);
    const backPanel = new THREE.Mesh(backPanelGeo, darkWoodMat);
    backPanel.position.y = 2.5;
    backPanel.castShadow = true;
    backdropGroup.add(backPanel);

    // Fluted Pilasters on Backdrop
    [-1.7, 1.7].forEach((px) => {
      const pilasterGeo = new THREE.BoxGeometry(0.3, 5.2, 0.28);
      const pilaster = new THREE.Mesh(pilasterGeo, platformWoodMat);
      pilaster.position.set(px, 2.6, 0.05);
      backdropGroup.add(pilaster);

      const capGeo = new THREE.BoxGeometry(0.4, 0.25, 0.35);
      const cap = new THREE.Mesh(capGeo, goldMat);
      cap.position.set(px, 5.2, 0.05);
      backdropGroup.add(cap);
    });

    // Grand Arched Top Pediment
    const pedimentGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.25, 24, 1, false, 0, Math.PI);
    const pediment = new THREE.Mesh(pedimentGeo, platformWoodMat);
    pediment.rotation.z = Math.PI / 2;
    pediment.position.set(0, 5.0, 0);
    backdropGroup.add(pediment);

    // Golden State Lions Emblem Crest on Canopy
    const crestPlaqueGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 20);
    const crestPlaque = new THREE.Mesh(crestPlaqueGeo, goldMat);
    crestPlaque.rotation.x = Math.PI / 2;
    crestPlaque.position.set(0, 4.4, 0.15);
    backdropGroup.add(crestPlaque);

    this.group.add(backdropGroup);

    // 3. Place Speaker's Chair & Desk
    this.speakerChair.mesh.position.set(0, 1.05, -0.2);
    this.group.add(this.speakerChair.mesh);

    this.speakerDesk.mesh.position.set(0, 1.05, 0.85);
    this.group.add(this.speakerDesk.mesh);
  }
}
