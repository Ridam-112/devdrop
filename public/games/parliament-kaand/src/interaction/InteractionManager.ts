import * as THREE from 'three';
import { SoundManager } from '../audio/SoundManager';
import { useGameStore } from '../store/useGameStore';

export interface InteractableObject {
  id: string;
  name: string;
  actionText: string;
  position: THREE.Vector3;
  radius: number;
  onInteract: () => string; // Returns feedback text
}

export class InteractionManager {
  private interactables: InteractableObject[] = [];
  public currentNearby: InteractableObject | null = null;
  public feedbackMessage: string | null = null;
  private feedbackTimer = 0;

  constructor() {
    this.initInteractables();
  }

  private initInteractables(): void {
    this.interactables = [
      {
        id: 'speaker_bell',
        name: "Speaker's Calling Bell",
        actionText: 'Ring Quorum Bell',
        position: new THREE.Vector3(0, 1.2, -12.5),
        radius: 2.8,
        onInteract: () => {
          SoundManager.playChamberBell();
          useGameStore.getState().adjustDecorum(10);
          return '🔔 You rang the Speaker\'s Quorum Bell! "Order! Order in the House!"';
        },
      },
      {
        id: 'speaker_gavel',
        name: "Speaker's Rosewood Gavel",
        actionText: 'Bang Gavel on Strike Block',
        position: new THREE.Vector3(0.7, 1.2, -12.5),
        radius: 2.8,
        onInteract: () => {
          SoundManager.playGavel();
          useGameStore.getState().adjustDecorum(15);
          return '🔨 *BANG!* "Members will resume their seats immediately!"';
        },
      },
      {
        id: 'golden_mace',
        name: 'The Golden Mace of Authority',
        actionText: 'Inspect Ceremonial Mace',
        position: new THREE.Vector3(0, 0.85, -3.5),
        radius: 2.5,
        onInteract: () => {
          SoundManager.playClick();
          return '✨ You reverently inspect the 24K gold-plated Mace representing the sovereignty of the House.';
        },
      },
      {
        id: 'table_of_house',
        name: 'Table of the House',
        actionText: 'Examine Legislative Bill',
        position: new THREE.Vector3(-1.8, 0.85, -3.5),
        radius: 2.6,
        onInteract: () => {
          SoundManager.playClick();
          return '📜 You examine the active bill: "National Samosa Subsidy & Chai Decorum Bill, 2026".';
        },
      },
      {
        id: 'treasury_desk',
        name: 'Treasury Front Bench',
        actionText: 'Thump Desk in Agreement',
        position: new THREE.Vector3(3.8, 0.5, 9.2),
        radius: 2.5,
        onInteract: () => {
          SoundManager.playDeskThump();
          useGameStore.getState().addChaos(5);
          return '👏 You thump the teak wood desk! *Hear, Hear! Shabaash!*';
        },
      },
      {
        id: 'opposition_desk',
        name: 'Opposition Front Bench',
        actionText: 'Raise Point of Order',
        position: new THREE.Vector3(-3.8, 0.5, 9.2),
        radius: 2.5,
        onInteract: () => {
          SoundManager.playWhoosh();
          useGameStore.getState().addChaos(8);
          return '📄 You wave official papers in the air! "Point of Order, Mr. Speaker!"';
        },
      },
      {
        id: 'entrance_scanner',
        name: 'Security Checkpoint Portal',
        actionText: 'Pass Metal Detector',
        position: new THREE.Vector3(0, 0.0, 33.5),
        radius: 3.0,
        onInteract: () => {
          SoundManager.playClick();
          return '🚨 *BEEP!* Security scanner cleared. No unauthorized pamphlets detected.';
        },
      },
    ];
  }

  public update(delta: number, playerPosition: THREE.Vector3): InteractableObject | null {
    // Decay feedback message
    if (this.feedbackMessage) {
      this.feedbackTimer -= delta;
      if (this.feedbackTimer <= 0) {
        this.feedbackMessage = null;
      }
    }

    let closest: InteractableObject | null = null;
    let minDistance = Infinity;

    for (const obj of this.interactables) {
      const dist = playerPosition.distanceTo(obj.position);
      if (dist <= obj.radius && dist < minDistance) {
        minDistance = dist;
        closest = obj;
      }
    }

    this.currentNearby = closest;
    return closest;
  }

  public triggerInteract(): boolean {
    if (!this.currentNearby) return false;

    const feedback = this.currentNearby.onInteract();
    this.feedbackMessage = feedback;
    this.feedbackTimer = 3.5;
    return true;
  }
}
