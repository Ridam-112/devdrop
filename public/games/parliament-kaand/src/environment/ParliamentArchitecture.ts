import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class ParliamentArchitecture {
  public group: THREE.Group = new THREE.Group();

  constructor() {
    this.build();
  }

  private build(): void {
    const wallMat = MaterialLibrary.get('wallPanelWood');
    const plasterMat = MaterialLibrary.get('wallPlaster');
    const pillarMat = MaterialLibrary.get('sandstonePillar');
    const goldMat = MaterialLibrary.get('brassGold');
    const domeMat = MaterialLibrary.get('domeCeiling');
    const floorMat = MaterialLibrary.get('carpetGreen');
    const marbleMat = MaterialLibrary.get('marbleTile');

    const chamberRadius = 21.5;
    const wallHeight = 15.0;

    // 1. Semicircular Grand Floor Base
    const floorGeo = new THREE.CylinderGeometry(chamberRadius, chamberRadius + 0.5, 0.8, 48);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.4;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Outer Marble Perimeter Walkway
    const outerMarbleGeo = new THREE.RingGeometry(chamberRadius - 2.5, chamberRadius, 48);
    const outerMarble = new THREE.Mesh(outerMarbleGeo, marbleMat);
    outerMarble.rotation.x = -Math.PI / 2;
    outerMarble.position.y = 0.01;
    this.group.add(outerMarble);

    // 2. Curved Semicircular Perimeter Wall with Acoustic Panels
    const wallGeo = new THREE.CylinderGeometry(
      chamberRadius,
      chamberRadius,
      wallHeight,
      48,
      1,
      true,
      0,
      Math.PI * 2
    );
    const wall = new THREE.Mesh(wallGeo, plasterMat);
    wall.position.y = wallHeight / 2;
    wall.material.side = THREE.BackSide;
    this.group.add(wall);

    // Lower Acoustic Wooden Wainscoting (Height 4.5m)
    const wainscotGeo = new THREE.CylinderGeometry(
      chamberRadius - 0.08,
      chamberRadius - 0.08,
      4.5,
      48,
      1,
      true,
      0,
      Math.PI * 2
    );
    const wainscot = new THREE.Mesh(wainscotGeo, wallMat);
    wainscot.position.y = 2.25;
    wainscot.material.side = THREE.BackSide;
    this.group.add(wainscot);

    // Golden Dado Rail Trim on Wainscot
    const dadoGeo = new THREE.TorusGeometry(chamberRadius - 0.1, 0.08, 8, 48);
    const dado = new THREE.Mesh(dadoGeo, goldMat);
    dado.rotation.x = Math.PI / 2;
    dado.position.y = 4.5;
    this.group.add(dado);

    // 3. Classical Fluted Sandstone Columns (16 Columns along perimeter)
    const pillarCount = 16;
    const pillarRadius = chamberRadius - 1.2;
    const colGeo = new THREE.CylinderGeometry(0.55, 0.65, wallHeight - 1, 16);
    const baseGeo = new THREE.BoxGeometry(1.6, 0.6, 1.6);
    const capGeo = new THREE.BoxGeometry(1.8, 0.6, 1.8);

    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const x = Math.cos(angle) * pillarRadius;
      const z = Math.sin(angle) * pillarRadius;

      const col = new THREE.Mesh(colGeo, pillarMat);
      col.position.set(x, wallHeight / 2 - 0.2, z);
      col.castShadow = true;
      col.receiveShadow = true;

      const base = new THREE.Mesh(baseGeo, pillarMat);
      base.position.set(x, 0.3, z);

      const cap = new THREE.Mesh(capGeo, pillarMat);
      cap.position.set(x, wallHeight - 0.8, z);

      this.group.add(col, base, cap);
    }

    // 4. Grand Ceiling Dome with Radial Ribs
    const domeGeo = new THREE.SphereGeometry(chamberRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = wallHeight - 2.5;
    dome.material.side = THREE.BackSide;
    this.group.add(dome);

    // Central Oculus Skylight Ring
    const oculusRingGeo = new THREE.TorusGeometry(4.2, 0.25, 12, 32);
    const oculusRing = new THREE.Mesh(oculusRingGeo, goldMat);
    oculusRing.rotation.x = Math.PI / 2;
    oculusRing.position.y = wallHeight + 5.5;
    this.group.add(oculusRing);

    // 5. Digital Clocks & Session Displays on Side Walls
    [
      { angle: -Math.PI * 0.4, label: 'LOK BHAVAN TIME' },
      { angle: Math.PI * 0.4, label: 'SESSION QUORUM' },
    ].forEach((d) => {
      const dx = Math.cos(d.angle) * (chamberRadius - 0.4);
      const dz = Math.sin(d.angle) * (chamberRadius - 0.4);

      const frameGeo = new THREE.BoxGeometry(2.4, 0.9, 0.15);
      const frame = new THREE.Mesh(frameGeo, MaterialLibrary.get('woodDarkSpeaker'));
      frame.position.set(dx, 5.8, dz);
      frame.rotation.y = -d.angle - Math.PI / 2;

      const displayGeo = new THREE.BoxGeometry(2.1, 0.65, 0.05);
      const display = new THREE.Mesh(displayGeo, MaterialLibrary.get('digitalDisplay'));
      display.position.set(dx, 5.8, dz);
      display.rotation.y = -d.angle - Math.PI / 2;

      this.group.add(frame, display);
    });
  }
}
