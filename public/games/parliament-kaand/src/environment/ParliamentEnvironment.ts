import * as THREE from 'three';
import { ParliamentArchitecture } from './ParliamentArchitecture';
import { ParliamentLighting } from '../lighting/ParliamentLighting';
import { SpeakerPlatform } from './SpeakerPlatform';
import { ChamberWell } from './ChamberWell';
import { MPSeating } from './MPSeating';
import { Gallery } from './Gallery';
import { Entrance } from './Entrance';
import { MaterialLibrary } from '../materials/MaterialLibrary';

export class ParliamentEnvironment {
  public group: THREE.Group = new THREE.Group();
  public architecture: ParliamentArchitecture;
  public lighting: ParliamentLighting;
  public speakerPlatform: SpeakerPlatform;
  public chamberWell: ChamberWell;
  public mpSeating: MPSeating;
  public gallery: Gallery;
  public entrance: Entrance;

  constructor() {
    this.architecture = new ParliamentArchitecture();
    this.lighting = new ParliamentLighting();
    this.speakerPlatform = new SpeakerPlatform();
    this.chamberWell = new ChamberWell();
    this.mpSeating = new MPSeating();
    this.gallery = new Gallery();
    this.entrance = new Entrance();

    this.assemble();
  }

  private assemble(): void {
    this.group.add(
      this.architecture.group,
      this.lighting.group,
      this.speakerPlatform.group,
      this.chamberWell.group,
      this.mpSeating.group,
      this.gallery.group,
      this.entrance.group
    );
  }

  public getGeometryStats(): { triangles: number; geometries: number } {
    let triangles = 0;
    let geometries = 0;

    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.geometry) {
        geometries++;
        if (obj.geometry.index) {
          triangles += obj.geometry.index.count / 3;
        } else if (obj.geometry.attributes.position) {
          triangles += obj.geometry.attributes.position.count / 3;
        }
      }
    });

    return { triangles: Math.round(triangles), geometries };
  }

  public dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
      }
    });
    MaterialLibrary.disposeAll();
  }
}
