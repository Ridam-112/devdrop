import * as THREE from 'three';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class ParliamentLighting {
  public group: THREE.Group = new THREE.Group();
  public speakerSpot: THREE.SpotLight | null = null;
  public mainChandelierSpot: THREE.SpotLight | null = null;

  constructor() {
    this.setupLights();
    this.buildChandelierFixture();
  }

  private setupLights(): void {
    // 1. Ambient Warm Fill (ensures no pitch-black corners)
    const ambient = new THREE.AmbientLight(0xfff7ed, 0.85);
    this.group.add(ambient);

    // 2. Central Dome Chandelier Spotlight
    this.mainChandelierSpot = new THREE.SpotLight(0xfef08a, 2.8);
    this.mainChandelierSpot.position.set(0, 18, 0);
    this.mainChandelierSpot.angle = Math.PI / 2.6;
    this.mainChandelierSpot.penumbra = 0.5;
    this.mainChandelierSpot.castShadow = true;
    this.mainChandelierSpot.shadow.mapSize.width = 1024;
    this.mainChandelierSpot.shadow.mapSize.height = 1024;
    this.mainChandelierSpot.shadow.bias = -0.001;
    this.group.add(this.mainChandelierSpot);

    // 3. Speaker's Dais Spotlight (Highlighting the Chair & Podium)
    this.speakerSpot = new THREE.SpotLight(0xfacc15, 2.4);
    this.speakerSpot.position.set(0, 12, -7.5);
    this.speakerSpot.target.position.set(0, 2.0, -9.0);
    this.speakerSpot.angle = Math.PI / 3.5;
    this.speakerSpot.penumbra = 0.45;
    this.speakerSpot.castShadow = true;
    this.group.add(this.speakerSpot);
    this.group.add(this.speakerSpot.target);

    // 4. Treasury (Ruling Side) Warm Accent Fill
    const treasuryFill = new THREE.PointLight(0xf97316, 1.1, 30);
    treasuryFill.position.set(-8, 7, 1);
    this.group.add(treasuryFill);

    // 5. Opposition Side Cool Accent Fill
    const oppositionFill = new THREE.PointLight(0x38bdf8, 1.1, 30);
    oppositionFill.position.set(8, 7, 1);
    this.group.add(oppositionFill);

    // 6. Press & Visitor Gallery Ambient Fill
    const galleryFill = new THREE.PointLight(0xfef3c7, 1.0, 35);
    galleryFill.position.set(0, 10, 12);
    this.group.add(galleryFill);
  }

  private buildChandelierFixture(): void {
    const chandelier = new THREE.Group();
    chandelier.position.set(0, 16.5, 0);

    const brassMat = MaterialLibrary.get('brassGold');

    // Central suspension rod
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 8);
    const rod = new THREE.Mesh(rodGeo, brassMat);
    rod.position.y = 2;
    chandelier.add(rod);

    // Tier 1 (Outer Ring)
    const ring1Geo = new THREE.TorusGeometry(3.2, 0.12, 10, 32);
    const ring1 = new THREE.Mesh(ring1Geo, brassMat);
    ring1.rotation.x = Math.PI / 2;
    chandelier.add(ring1);

    // Tier 2 (Inner Ring)
    const ring2Geo = new THREE.TorusGeometry(1.8, 0.1, 10, 24);
    const ring2 = new THREE.Mesh(ring2Geo, brassMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.6;
    chandelier.add(ring2);

    // Glowing Bulbs on outer ring
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const bulbGeo = new THREE.SphereGeometry(0.14, 8, 8);

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(Math.cos(angle) * 3.2, -0.15, Math.sin(angle) * 3.2);
      chandelier.add(bulb);
    }

    this.group.add(chandelier);
  }
}
