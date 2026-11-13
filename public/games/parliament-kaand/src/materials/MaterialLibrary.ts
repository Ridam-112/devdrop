import * as THREE from 'three';

export class MaterialLibrary {
  private static materials: Map<string, THREE.Material> = new Map();

  public static get(name: string): THREE.Material {
    if (this.materials.has(name)) {
      return this.materials.get(name)!;
    }

    let mat: THREE.Material;

    switch (name) {
      // Wood finishes
      case 'woodTeak':
        mat = new THREE.MeshStandardMaterial({
          color: 0x78350f,
          roughness: 0.35,
          metalness: 0.15,
        });
        break;

      case 'woodMahogany':
        mat = new THREE.MeshStandardMaterial({
          color: 0x451a03,
          roughness: 0.28,
          metalness: 0.2,
        });
        break;

      case 'woodDarkSpeaker':
        mat = new THREE.MeshStandardMaterial({
          color: 0x271005,
          roughness: 0.25,
          metalness: 0.25,
        });
        break;

      // Carpets & Flooring
      case 'carpetGreen':
        mat = new THREE.MeshStandardMaterial({
          color: 0x064e3b,
          roughness: 0.92,
          metalness: 0.05,
        });
        break;

      case 'carpetWellCenter':
        mat = new THREE.MeshStandardMaterial({
          color: 0x065f46,
          roughness: 0.88,
          metalness: 0.08,
        });
        break;

      case 'carpetMaroon':
        mat = new THREE.MeshStandardMaterial({
          color: 0x881337,
          roughness: 0.85,
          metalness: 0.05,
        });
        break;

      case 'marbleTile':
        mat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.18,
          metalness: 0.3,
        });
        break;

      // Metals
      case 'brassGold':
        mat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          metalness: 0.88,
          roughness: 0.18,
        });
        break;

      case 'chrome':
        mat = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          metalness: 0.92,
          roughness: 0.12,
        });
        break;

      case 'darkMetal':
        mat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.75,
          roughness: 0.3,
        });
        break;

      // Fabrics & Seating
      case 'fabricRuling':
        mat = new THREE.MeshStandardMaterial({
          color: 0x991b1b, // Crimson velvet
          roughness: 0.8,
          metalness: 0.05,
        });
        break;

      case 'fabricOpposition':
        mat = new THREE.MeshStandardMaterial({
          color: 0x1e3a8a, // Navy velvet
          roughness: 0.8,
          metalness: 0.05,
        });
        break;

      case 'leatherSpeaker':
        mat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          roughness: 0.28,
          metalness: 0.15,
        });
        break;

      // Architecture & Walls
      case 'sandstonePillar':
        mat = new THREE.MeshStandardMaterial({
          color: 0xe2d5c4,
          roughness: 0.55,
          metalness: 0.05,
        });
        break;

      case 'wallPanelWood':
        mat = new THREE.MeshStandardMaterial({
          color: 0x5c3216,
          roughness: 0.48,
          metalness: 0.1,
        });
        break;

      case 'wallPlaster':
        mat = new THREE.MeshStandardMaterial({
          color: 0xf1f5f9,
          roughness: 0.75,
          metalness: 0.02,
        });
        break;

      case 'domeCeiling':
        mat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.65,
          metalness: 0.15,
        });
        break;

      // Props & Special
      case 'glassRail':
        mat = new THREE.MeshStandardMaterial({
          color: 0xa5f3fc,
          transparent: true,
          opacity: 0.45,
          roughness: 0.1,
          metalness: 0.1,
        });
        break;

      case 'paperWhite':
        mat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.95,
          metalness: 0.0,
        });
        break;

      case 'paperFolderManila':
        mat = new THREE.MeshStandardMaterial({
          color: 0xfde047,
          roughness: 0.9,
          metalness: 0.0,
        });
        break;

      case 'waterBottlePlastic':
        mat = new THREE.MeshStandardMaterial({
          color: 0xbae6fd,
          transparent: true,
          opacity: 0.65,
          roughness: 0.15,
          metalness: 0.1,
        });
        break;

      case 'waterCap':
        mat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.4,
        });
        break;

      case 'digitalDisplay':
        mat = new THREE.MeshStandardMaterial({
          color: 0x020617,
          emissive: 0x22c55e,
          emissiveIntensity: 0.7,
          roughness: 0.2,
        });
        break;

      case 'digitalClockRed':
        mat = new THREE.MeshStandardMaterial({
          color: 0x020617,
          emissive: 0xef4444,
          emissiveIntensity: 0.8,
          roughness: 0.2,
        });
        break;

      default:
        mat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    }

    this.materials.set(name, mat);
    return mat;
  }

  public static disposeAll(): void {
    this.materials.forEach((mat) => mat.dispose());
    this.materials.clear();
  }
}
