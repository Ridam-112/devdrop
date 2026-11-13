import * as THREE from 'three';
import { InputVector } from '../game/InputManager';

export abstract class VehicleController {
  public mesh: THREE.Group;
  public speed: number = 0; // Current velocity magnitude (m/s)
  public steeringAngle: number = 0; // Current front wheel steer angle
  public inReverse: boolean = false;

  // Handling characteristics
  public maxSpeed: number = 10.5; // m/s (~38 km/h)
  public maxReverseSpeed: number = -4.5;
  public acceleration: number = 9.0;
  public brakingDecel: number = 16.0;
  public naturalFriction: number = 3.2;
  public steerSpeed: number = 8.5;
  public maxSteerAngle: number = 0.60; // radians (~35 deg)

  // Wheel meshes for rotation animation
  protected frontWheels: THREE.Mesh[] = [];
  protected rearWheels: THREE.Mesh[] = [];

  constructor() {
    this.mesh = new THREE.Group();
    // Default heading facing the airport stands at -Z
    this.mesh.rotation.y = Math.PI;
  }

  public update(input: InputVector, brakePressed: boolean, delta: number) {
    // Steering target
    const targetSteer = -input.x * this.maxSteerAngle;
    this.steeringAngle += (targetSteer - this.steeringAngle) * Math.min(1, this.steerSpeed * delta);

    // Apply front wheel visual steering
    this.frontWheels.forEach((wheel) => {
      wheel.rotation.y = this.steeringAngle;
    });

    // Acceleration & Braking
    if (brakePressed) {
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.brakingDecel * delta);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.brakingDecel * delta);
      }
    } else if (input.y > 0.05) {
      // Forward gas
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * delta);
      this.inReverse = false;
    } else if (input.y < -0.05) {
      // Reverse
      this.speed = Math.max(this.maxReverseSpeed, this.speed - this.acceleration * 0.75 * delta);
      this.inReverse = true;
    } else {
      // Coasting friction
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.naturalFriction * delta);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.naturalFriction * delta);
      }
    }

    // Vehicle turning based on speed and steering angle
    if (Math.abs(this.speed) > 0.05) {
      const speedRatio = Math.max(0.5, Math.min(1.0, Math.abs(this.speed) / 5.0));
      const turnDir = this.speed >= 0 ? 1 : -1;
      const turnFactor = turnDir * speedRatio * this.steeringAngle * 2.8;
      this.mesh.rotation.y += turnFactor * delta;

      // Translate forward/backward along vehicle's facing heading
      const moveDist = this.speed * delta;
      this.mesh.position.x += Math.sin(this.mesh.rotation.y) * moveDist;
      this.mesh.position.z += Math.cos(this.mesh.rotation.y) * moveDist;

      // Animate wheel roll rotation
      const roll = moveDist / 0.45;
      this.frontWheels.forEach((w) => { w.rotation.x += roll; });
      this.rearWheels.forEach((w) => { w.rotation.x += roll; });
    }

    // Clamp inside apron boundary
    this.mesh.position.x = Math.max(-95, Math.min(95, this.mesh.position.x));
    this.mesh.position.z = Math.max(-65, Math.min(65, this.mesh.position.z));
    this.mesh.position.y = 0;
  }

  public getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  public setPosition(x: number, y: number, z: number, rotationY: number = Math.PI) {
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.y = rotationY;
    this.speed = 0;
  }

  public getKmh(): number {
    return Math.round(Math.abs(this.speed) * 3.6);
  }
}
