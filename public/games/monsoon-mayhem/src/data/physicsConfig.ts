/**
 * MONSOON MAYHEM — DRIVING PHYSICS CONFIGURATION
 * Central balance parameters for player movement, water resistance, and jump physics.
 */
export const PHYSICS_CONFIG = {
  // Speed & Acceleration (in KM/H)
  MIN_SPEED: 0,
  BASE_CRUISE_SPEED: 0, // Starts stationary at 0 km/h
  MAX_SPEED: 85,
  ACCELERATION_RATE: 38, // km/h per second under gas (0 to 60 km/h in ~1.6s)
  NATURAL_DECEL_RATE: 16, // Coasting deceleration towards 0 km/h
  BRAKING_RATE: 68, // Hard braking deceleration towards 0 km/h
  REVERSE_MAX_SPEED: 0,
  WORLD_SPEED_SCALE: 110, // Converts m/s speed to world Z track progression

  // Steering & Handling
  STEERING_SPEED: 2.2, // Lateral movement speed (normalized -1 to 1)
  STEERING_RETURN_RATE: 3.2, // Natural centering recovery speed
  MAX_LEAN_ANGLE: 14, // Max degrees scooter tilts when steering
  LEAN_INTERPOLATION: 8.0, // Smoothness of lean transition
  SPEED_STEER_FACTOR: 0.85, // High speed slightly stabilizes steering

  // Jump Physics
  JUMP_FORCE: 380, // Initial upward velocity in pixels/sec
  GRAVITY: 1100, // Downward pull in pixels/sec^2
  JUMP_COOLDOWN: 0.75, // Seconds between jumps
  LANDING_SQUASH_DURATION: 0.18, // Suspension bounce compression time

  // Water Depth Physics Modifiers
  WATER_EFFECTS: {
    0: { name: 'DRY', dragFactor: 1.0, accelFactor: 1.0, sprayIntensity: 0 },
    1: { name: 'SHALLOW', dragFactor: 0.95, accelFactor: 0.92, sprayIntensity: 1 },
    2: { name: 'MODERATE', dragFactor: 0.84, accelFactor: 0.78, sprayIntensity: 2 },
    3: { name: 'DEEP FLOOD', dragFactor: 0.68, accelFactor: 0.58, sprayIntensity: 4 },
    4: { name: 'EXTREME', dragFactor: 0.50, accelFactor: 0.38, sprayIntensity: 6 }
  }
} as const;
