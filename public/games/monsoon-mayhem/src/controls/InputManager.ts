export interface ControlState {
  steerLeft: boolean;
  steerRight: boolean;
  accelerate: boolean;
  brake: boolean;
  jump: boolean;
  turbo: boolean;
}

export class InputManager {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;

  // Active combined state (Keyboard + Touch)
  public state: ControlState = {
    steerLeft: false,
    steerRight: false,
    accelerate: false,
    brake: false,
    jump: false,
    turbo: false
  };

  // Dedicated touch button inputs
  public touchState: ControlState = {
    steerLeft: false,
    steerRight: false,
    accelerate: false,
    brake: false,
    jump: false,
    turbo: false
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupKeyboard();
  }

  private setupKeyboard(): void {
    if (!this.scene.input.keyboard) return;

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Prevent browser scrolling on Arrow keys and Space
    this.scene.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ]);
  }

  public update(): void {
    const kb = this.scene.input.keyboard;
    const kbLeft = kb ? (this.cursors.left.isDown || this.keyA.isDown) : false;
    const kbRight = kb ? (this.cursors.right.isDown || this.keyD.isDown) : false;
    const kbUp = kb ? (this.cursors.up.isDown || this.keyW.isDown) : false;
    const kbDown = kb ? (this.cursors.down.isDown || this.keyS.isDown) : false;
    const kbJump = kb ? (Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keySpace)) : false;
    const kbShift = kb ? (this.cursors.shift.isDown || this.keyShift.isDown) : false;

    // Combine Keyboard + Mobile Touch seamlessly
    this.state.steerLeft = kbLeft || this.touchState.steerLeft;
    this.state.steerRight = kbRight || this.touchState.steerRight;
    this.state.accelerate = kbUp || this.touchState.accelerate;
    this.state.brake = kbDown || this.touchState.brake;
    this.state.jump = kbJump || this.touchState.jump;
    this.state.turbo = kbShift || this.touchState.turbo;
  }
}
