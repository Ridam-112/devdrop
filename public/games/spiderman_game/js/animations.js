/* =========================================================
   AUTHENTIC SPIDER-MAN ANIMATIONS & ACROBATICS
   Marvel's Spider-Man (PS5) & Spider-Man 2 inspired mechanics
   ========================================================= */

const APEX_STUNTS = [
  'SKYWARD_SOAR',   // Eagle Soar Cloud Gaze / Chest Lift Height Gain!
  'SIDE_SPIN',      // Flying Helix / 360 Barrel Roll Spin!
  'FRONT_FLIP',     // Spider Roll / Front Somersault
  'BACK_FLIP',      // Moonsault / Shooting Star Backflip
  'WEBSTER',        // Webster Flip (one-leg kick somersault)
  'WINDMILL',       // Windmill Breakdance Flare
  'DRAGON_ROLL',    // Dragon Roll (helical corkscrew spin)
  'TURTLE_SPIN',    // Turtle Spin (compact horizontal shell spin)
  'CANNONBALL',     // Knee-Clutch Cannonball Tuck Roll
  'THE_THINKER',    // Rodin's Thinker Hand-to-Chin Stunt
  'INDY_GRAB',      // Extreme Skater Indy Foot Grab
  'ROLY_POLY',      // Roly Poly multi-tuck spin
  'TRUST_FALL',     // Hands-Behind-Head Chillin' Backfall
  'WEB_WINGS'       // Spider-Man 2 Web-Wings Aero Glide
];

function triggerAcrobaticStunt(stuntType) {
  GAME.stuntState = stuntType;
  GAME.stuntProgress = 0.0;

  if (stuntType === 'FRONT_FLIP') {
    showComboPopup("🤸 FRONT SOMERSAULT FLIP! +400 PTS");
    sound.playFlipWhoosh();
  } else if (stuntType === 'BACK_FLIP') {
    showComboPopup("🤸 MOONSAULT BACKFLIP! +450 PTS");
    sound.playFlipWhoosh();
  } else if (stuntType === 'SIDE_SPIN') {
    showComboPopup("🌪️ FLYING HELIX BARREL ROLL! +500 PTS");
    sound.playFlipWhoosh();
  } else if (stuntType === 'WEBSTER') {
    showComboPopup("🤸 WEBSTER SOMERSAULT FLIP! +480 PTS");
    sound.playFlipWhoosh();
  } else if (stuntType === 'WINDMILL') {
    showComboPopup("🌪️ WINDMILL BREAKDANCE FLARE! +520 PTS");
    sound.playStuntChime();
  } else if (stuntType === 'DRAGON_ROLL') {
    showComboPopup("🐉 DRAGON CORKSCREW ROLL! +550 PTS");
    sound.playFlipWhoosh();
    sound.playZipBoost();
  } else if (stuntType === 'TURTLE_SPIN') {
    showComboPopup("🐢 TURTLE HORIZONTAL SPIN! +480 PTS");
    sound.playStuntChime();
  } else if (stuntType === 'CANNONBALL') {
    showComboPopup("💣 CANNONBALL TUCK ROLL! +450 PTS");
    sound.playStuntChime();
  } else if (stuntType === 'THE_THINKER') {
    showComboPopup("🤔 THE THINKER DIVE! +500 PTS");
    sound.playStuntChime();
  } else if (stuntType === 'INDY_GRAB') {
    showComboPopup("🛹 INDY FOOT GRAB! +450 PTS");
    sound.playStuntChime();
  } else if (stuntType === 'ROLY_POLY') {
    showComboPopup("🌀 ROLY POLY DUAL-TUCK! +460 PTS");
    sound.playFlipWhoosh();
  } else if (stuntType === 'SKYWARD_SOAR') {
    showComboPopup("🚀 SKYWARD EAGLE SOAR! +500 PTS");
    sound.playZipBoost();
  } else if (stuntType === 'TRUST_FALL') {
    showComboPopup("😎 CHILLIN' TRUST FALL! +500 PTS");
    sound.playStuntChime();
  } else if (stuntType === 'WEB_WINGS') {
    showComboPopup("🦅 WEB-WINGS AERO GLIDE! +550 PTS");
    sound.playZipBoost();
  }
}

function triggerApexRelease() {
  const s = GAME.spidey;
  GAME.apexStyleCounter++;
  const stuntType = APEX_STUNTS[GAME.apexStyleCounter % APEX_STUNTS.length];

  s.vy = Math.min(Math.max(s.vy, 13.0) + 13.0, 32.0);
  s.vz = Math.min(s.vz + 12.0, 56.0);
  GAME.score += 500;
  updateHUD();

  triggerAcrobaticStunt(stuntType);
}

function triggerManualStunt() {
  if (GAME.state !== 'PLAYING') return;
  sound.init();

  if (GAME.swinging) {
    detachWeb(GAME.swingSide);
    triggerApexRelease();
    return;
  }

  // Air Trick Chaining in mid-air!
  GAME.trickStreak = (GAME.trickStreak || 0) + 1;
  GAME.stuntIndex = (GAME.stuntIndex + 1) % APEX_STUNTS.length;
  const stuntType = APEX_STUNTS[GAME.stuntIndex];
  const s = GAME.spidey;
  s.vy = Math.max(s.vy + 7.0, 14.0);
  s.vz = Math.min(s.vz + 6.0, 62.0);

  const streakBonus = GAME.trickStreak * 200;
  GAME.score += 350 + streakBonus;
  GAME.combo = Math.min(GAME.combo + 0.35, 5.0);
  updateHUD();
  drawSpeedLines(0.85);

  triggerAcrobaticStunt(stuntType);

  if (GAME.trickStreak >= 2) {
    setTimeout(() => {
      showComboPopup(`🔥 ${GAME.trickStreak}X TRICK CHAIN! +${streakBonus} PTS! ⚡`);
    }, 360);
  }
}

function triggerWallParkourVault(isLeftWall) {
  const s = GAME.spidey;
  GAME.isWallVaulting = true;
  GAME.wallVaultTimer = 0.35;
  GAME.wallVaultSide = isLeftWall ? 'LEFT' : 'RIGHT';

  const wallX = isLeftWall ? LEFT_WALL_X : RIGHT_WALL_X;
  triggerWallSparks(wallX, s.y, s.z, isLeftWall);

  // Explosive push-off spring away from the wall
  s.vx = isLeftWall ? 16.5 : -16.5;
  s.vy = Math.max(s.vy + 9.0, 15.0);
  s.vz = Math.min(s.vz + 10.0, 65.0);

  triggerAcrobaticStunt('SIDE_SPIN');
  sound.playWallVault();
  sound.playMissedThePart();
  showComboPopup("👟 PARKOUR WALL VAULT! 🤸 +BOOST!");
  GAME.score += 450;
  GAME.combo = Math.min(GAME.combo + 0.5, 5.0);
  updateHUD();
  drawSpeedLines(0.85);

  wallWarningBannerEl.style.display = 'none';
  leftSteerBtn.classList.remove('alert-pulse');
  rightSteerBtn.classList.remove('alert-pulse');
}

function triggerPointLaunch() {
  if (GAME.state !== 'PLAYING') return;
  sound.init();

  // Clear any existing web cords
  GAME.swinging = false;
  GAME.swingSide = null;
  GAME.isDiveSwinging = false;
  leftWebMesh.visible = false;
  rightWebMesh.visible = false;
  leftWebSplat.visible = false;
  rightWebSplat.visible = false;

  const s = GAME.spidey;
  const isLeft = s.x <= 0;
  const anchorX = isLeft ? (LEFT_WALL_X + 2.0) : (RIGHT_WALL_X - 2.0);
  const anchorY = Math.max(s.y + 14, 32);
  const anchorZ = s.z - 30;

  // Sparks at target perch
  triggerWebHitSparks(anchorX, anchorY, anchorZ, isLeft);

  // Instant catapult launch
  s.x = THREE.MathUtils.lerp(s.x, 0, 0.6);
  s.vx = 0;
  s.vy = Math.max(s.vy, 14.0) + 12.0;
  s.vz = Math.min(s.vz + 26.0, 78.0);

  triggerAcrobaticStunt('FRONT_FLIP');
  sound.playPointLaunch();
  sound.playDirtInEye();
  showComboPopup(`🎯 POINT LAUNCH VAULT! ${Math.floor(s.vz)} m/s! 💥`);
  GAME.score += 500;
  GAME.combo = Math.min(GAME.combo + 0.5, 5.0);
  updateHUD();
  drawSpeedLines(1.0);
}

/* =========================================================
   3D VISUAL TRANSFORMATIONS & CAMERA CHASE
   Frame-Rate Independent, Zero-Lag, GC-Free Loop
   ========================================================= */
function updateVisuals(dt) {
  const s = GAME.spidey;

  spideyRoot.position.set(s.x, s.y, s.z);

  // Smooth frame-rate independent damp factor (60Hz / 120Hz compatible)
  const damp = 1.0 - Math.exp(-12.0 * dt);

  // Web wings default hidden; deployed during WEB_WINGS stunt
  leftWebWing.visible = (GAME.stuntState === 'WEB_WINGS');
  rightWebWing.visible = (GAME.stuntState === 'WEB_WINGS');

  // Shoulder stretch default positions
  let targetLeftShoulderY = 0.7;
  let targetRightShoulderY = 0.7;

  // Real Anatomical 2-Segment Limb Articulation (Elbow & Knee Flexion)
  let targetLeftElbowX = -0.15;
  let targetRightElbowX = -0.15;
  let targetLeftKneeX = 0.15;
  let targetRightKneeX = 0.15;

  let targetRoll = -s.vx * 0.08;
  let targetPitch = 0.15;
  let targetYaw = s.vx * 0.04;

  if (GAME.stuntState !== 'NONE') {
    // 🤸 MID-AIR ACROBATIC STUNT SYSTEM (Authentic Spider-Man Moves)
    targetRoll = 0;
    targetPitch = 0;
    targetYaw = 0;

    if (GAME.stuntState === 'FRONT_FLIP') {
      const angle = GAME.stuntProgress * Math.PI * 2;
      spideyGroup.rotation.x = angle;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = -0.55;
      leftArmPivot.rotation.set(1.2, 0, -0.35);
      rightArmPivot.rotation.set(1.2, 0, 0.35);
      leftLegPivot.rotation.set(-1.3, 0, -0.2);
      rightLegPivot.rotation.set(-1.3, 0, 0.2);
      targetLeftElbowX = -1.4;
      targetRightElbowX = -1.4;
      targetLeftKneeX = 1.7;
      targetRightKneeX = 1.7;
    } else if (GAME.stuntState === 'BACK_FLIP') {
      const angle = -GAME.stuntProgress * Math.PI * 2;
      spideyGroup.rotation.x = angle;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = 0.5;
      leftArmPivot.rotation.set(-1.5, 0, -0.4);
      rightArmPivot.rotation.set(-1.5, 0, 0.4);
      leftLegPivot.rotation.set(0.65, 0, 0);
      rightLegPivot.rotation.set(0.65, 0, 0);
      targetLeftElbowX = -0.7;
      targetRightElbowX = -0.7;
      targetLeftKneeX = 1.35;
      targetRightKneeX = 1.35;
    } else if (GAME.stuntState === 'SIDE_SPIN') {
      const angle = GAME.stuntProgress * Math.PI * 2;
      spideyGroup.rotation.z = angle;
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.y = Math.PI;
      headMesh.rotation.x = 0;
      leftArmPivot.rotation.set(0.3, 0, -0.15);
      rightArmPivot.rotation.set(0.3, 0, 0.15);
      leftLegPivot.rotation.set(0, 0, -0.08);
      rightLegPivot.rotation.set(0, 0, 0.08);
      targetLeftElbowX = -0.4;
      targetRightElbowX = -0.4;
      targetLeftKneeX = 0.35;
      targetRightKneeX = 0.35;
    } else if (GAME.stuntState === 'WEBSTER') {
      const angle = GAME.stuntProgress * Math.PI * 2;
      spideyGroup.rotation.x = angle;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = -0.4;
      leftLegPivot.rotation.set(1.0, 0, -0.15);
      rightLegPivot.rotation.set(-1.4, 0, 0.15);
      leftArmPivot.rotation.set(-0.8, 0, -0.5);
      rightArmPivot.rotation.set(1.1, 0, 0.3);
      targetLeftKneeX = 0.15;
      targetRightKneeX = 1.6;
      targetLeftElbowX = -0.5;
      targetRightElbowX = -1.1;
    } else if (GAME.stuntState === 'WINDMILL') {
      spideyGroup.rotation.x = 0.4;
      spideyGroup.rotation.y = Math.PI + GAME.stuntProgress * Math.PI * 4;
      spideyGroup.rotation.z = 0;
      const legFlutter = Math.sin(GAME.stuntProgress * Math.PI * 6) * 0.4;
      leftLegPivot.rotation.set(-0.6 + legFlutter, 0, -0.85);
      rightLegPivot.rotation.set(-0.6 - legFlutter, 0, 0.85);
      leftArmPivot.rotation.set(0.2, 0, -1.35);
      rightArmPivot.rotation.set(0.2, 0, 1.35);
      targetLeftKneeX = 1.3;
      targetRightKneeX = 0.4;
      targetLeftElbowX = -0.85;
      targetRightElbowX = -0.85;
    } else if (GAME.stuntState === 'DRAGON_ROLL') {
      spideyGroup.rotation.x = GAME.stuntProgress * Math.PI * 2;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = GAME.stuntProgress * Math.PI * 4;
      headMesh.rotation.set(0, 0, 0);
      leftArmPivot.rotation.set(0.9, 0, 0.3);
      rightArmPivot.rotation.set(0.9, 0, -0.3);
      leftLegPivot.rotation.set(-0.4, 0, -0.05);
      rightLegPivot.rotation.set(-0.4, 0, 0.05);
      targetLeftElbowX = -0.9;
      targetRightElbowX = -0.9;
      targetLeftKneeX = 0.75;
      targetRightKneeX = 0.75;
    } else if (GAME.stuntState === 'TURTLE_SPIN') {
      spideyGroup.rotation.x = 0.75;
      spideyGroup.rotation.y = Math.PI + GAME.stuntProgress * Math.PI * 4;
      spideyGroup.rotation.z = 0;
      leftArmPivot.rotation.set(1.6, 0, 0.4);
      rightArmPivot.rotation.set(1.6, 0, -0.4);
      leftLegPivot.rotation.set(-1.7, 0, -0.2);
      rightLegPivot.rotation.set(-1.7, 0, 0.2);
      targetLeftElbowX = -1.6;
      targetRightElbowX = -1.6;
      targetLeftKneeX = 1.8;
      targetRightKneeX = 1.8;
    } else if (GAME.stuntState === 'CANNONBALL') {
      const angle = GAME.stuntProgress * Math.PI * 2.5;
      spideyGroup.rotation.x = angle;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = -0.7;
      leftArmPivot.rotation.set(1.5, 0, 0.25);
      rightArmPivot.rotation.set(1.5, 0, -0.25);
      leftLegPivot.rotation.set(-1.6, 0, -0.15);
      rightLegPivot.rotation.set(-1.6, 0, 0.15);
      targetLeftElbowX = -1.8;
      targetRightElbowX = -1.8;
      targetLeftKneeX = 1.9;
      targetRightKneeX = 1.9;
    } else if (GAME.stuntState === 'THE_THINKER') {
      targetPitch = -0.85;
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.set(-0.35, 0.25, 0.15);
      rightArmPivot.rotation.set(-1.65, 0, -0.55);
      leftArmPivot.rotation.set(0.6, 0, -0.45);
      rightLegPivot.rotation.set(-1.4, 0, 0.3);
      leftLegPivot.rotation.set(0.2, 0, -0.1);
      targetRightElbowX = -2.1;
      targetLeftElbowX = -0.3;
      targetRightKneeX = 1.7;
      targetLeftKneeX = 0.4;
    } else if (GAME.stuntState === 'INDY_GRAB') {
      targetRoll = -0.35;
      targetPitch = 0.2;
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.set(0.25, -0.2, 0);
      rightLegPivot.rotation.set(-1.5, 0, 0.4);
      leftLegPivot.rotation.set(0.35, 0, -0.35);
      rightArmPivot.rotation.set(-1.3, 0, -0.3);
      leftArmPivot.rotation.set(0.2, 0, -1.5);
      targetRightElbowX = -1.2;
      targetRightKneeX = 1.8;
      targetLeftElbowX = -0.3;
      targetLeftKneeX = 0.25;
    } else if (GAME.stuntState === 'ROLY_POLY') {
      spideyGroup.rotation.x = GAME.stuntProgress * Math.PI * 4;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = -0.7;
      leftArmPivot.rotation.set(1.4, 0, -0.2);
      rightArmPivot.rotation.set(1.4, 0, 0.2);
      leftLegPivot.rotation.set(-1.5, 0, -0.1);
      rightLegPivot.rotation.set(-1.5, 0, 0.1);
      targetLeftElbowX = -1.5;
      targetRightElbowX = -1.5;
      targetLeftKneeX = 1.8;
      targetRightKneeX = 1.8;
    } else if (GAME.stuntState === 'SKYWARD_SOAR') {
      targetPitch = 0.65;
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = 0.6;
      leftArmPivot.rotation.set(-0.7, 0, -1.4);
      rightArmPivot.rotation.set(-0.7, 0, 1.4);
      leftLegPivot.rotation.set(0.35, 0, 0);
      rightLegPivot.rotation.set(0.35, 0, 0);
      targetLeftElbowX = -0.3;
      targetRightElbowX = -0.3;
      targetLeftKneeX = 0.22;
      targetRightKneeX = 0.22;
    } else if (GAME.stuntState === 'TRUST_FALL') {
      targetPitch = 1.45;
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = 0.2;
      leftArmPivot.rotation.set(-1.8, 0, -0.75);
      rightArmPivot.rotation.set(-1.8, 0, 0.75);
      leftLegPivot.rotation.set(0.1, 0, 0.15);
      rightLegPivot.rotation.set(-0.35, 0, -0.15);
      targetLeftElbowX = -1.9;
      targetRightElbowX = -1.9;
      targetLeftKneeX = 1.1;
      targetRightKneeX = 0.35;
    } else if (GAME.stuntState === 'WEB_WINGS') {
      targetPitch = -0.08;
      targetRoll = -s.vx * 0.08;
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.y = Math.PI;
      spideyGroup.rotation.z = 0;
      headMesh.rotation.x = 0.25;
      leftArmPivot.rotation.set(0.05, 0, -1.55);
      rightArmPivot.rotation.set(0.05, 0, 1.55);
      leftLegPivot.rotation.set(-0.1, 0, -0.18);
      rightLegPivot.rotation.set(-0.1, 0, 0.18);
      targetLeftElbowX = -0.15;
      targetRightElbowX = -0.15;
      targetLeftKneeX = 0.2;
      targetRightKneeX = 0.2;
    }
  } else if (GAME.isWallRunning) {
    // 👟 WALL-RUNNING: Horizontal sprint on building glass!
    const isLeft = (GAME.wallRunSide === 'LEFT');
    targetRoll = isLeft ? -1.48 : 1.48; // Body tilted 85° to align feet with skyscraper
    targetPitch = 0.12;
    targetYaw = isLeft ? 0.15 : -0.15;
    headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, 0.1, damp);

    // Rapid running leg stride
    const stepAngle = GAME.wallRunTimer * 26.0;
    const stride = Math.sin(stepAngle);
    leftLegPivot.rotation.set(stride * 0.95, 0, 0);
    rightLegPivot.rotation.set(-stride * 0.95, 0, 0);
    targetLeftKneeX = Math.max(0, -stride * 1.4);
    targetRightKneeX = Math.max(0, stride * 1.4);

    // Athletic counter-pumping arms
    leftArmPivot.rotation.set(-stride * 0.85, 0, isLeft ? -0.35 : -0.15);
    rightArmPivot.rotation.set(stride * 0.85, 0, isLeft ? 0.15 : 0.35);
    targetLeftElbowX = -0.7;
    targetRightElbowX = -0.7;
  } else if (GAME.isZipping) {
    // 🎯 POINT ZIP: Aerodynamic forward slingshot bullet tuck
    targetRoll = 0;
    targetPitch = -0.28;
    targetYaw = 0;
    headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, -0.4, damp);
    leftArmPivot.rotation.set(1.45, 0, -0.35);
    rightArmPivot.rotation.set(1.45, 0, 0.35);
    leftLegPivot.rotation.set(0.35, 0, -0.08);
    rightLegPivot.rotation.set(0.35, 0, 0.08);
    targetLeftElbowX = -0.35;
    targetRightElbowX = -0.35;
    targetLeftKneeX = 0.65;
    targetRightKneeX = 0.65;
  } else if (GAME.isWallVaulting) {
    const isLeft = (GAME.wallVaultSide === 'LEFT');
    targetRoll = isLeft ? 0.75 : -0.75;
    targetPitch = 0.2;
    headMesh.rotation.x = -0.3;
    leftArmPivot.rotation.set(0.8, 0, -0.6);
    rightArmPivot.rotation.set(0.8, 0, 0.6);
    leftLegPivot.rotation.set(-1.1, 0, -0.4);
    rightLegPivot.rotation.set(-1.1, 0, 0.4);
    targetLeftElbowX = -0.85;
    targetRightElbowX = -0.85;
    targetLeftKneeX = 1.35;
    targetRightKneeX = 1.35;
  } else if (GAME.isSlingshotting) {
    spideyGroup.rotation.x = 0;
    spideyGroup.rotation.y = Math.PI;
    spideyGroup.rotation.z = 0;
    leftLegPivot.rotation.z = 0;
    rightLegPivot.rotation.z = 0;
    targetRoll = 0;
    targetPitch = -0.22;
    headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, -0.2, damp);
    targetLeftElbowX = -1.1;
    targetRightElbowX = -1.1;
    targetLeftKneeX = 0.95;
    targetRightKneeX = 0.95;
  } else if (GAME.swinging) {
    const isLeft = (GAME.swingSide === 'LEFT');
    spideyGroup.rotation.y = Math.PI;

    if (GAME.swingPose === 'LOOP_DE_LOOP') {
      const loopAngle = GAME.swingTime * 14.0;
      spideyGroup.rotation.x = loopAngle;
      spideyGroup.rotation.z = 0;
      targetRoll = 0;
      targetPitch = 0;
      targetYaw = 0;
      headMesh.rotation.x = -0.3;
      leftArmPivot.rotation.set(1.1, 0, -0.5);
      rightArmPivot.rotation.set(1.1, 0, 0.5);
      leftLegPivot.rotation.set(-1.2, 0, -0.1);
      rightLegPivot.rotation.set(-1.2, 0, 0.1);
      targetLeftElbowX = -0.9;
      targetRightElbowX = -0.9;
      targetLeftKneeX = 1.4;
      targetRightKneeX = 1.4;
    } else if (GAME.swingPose === 'BETWEEN_LEGS') {
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.z = 0;
      targetRoll = isLeft ? -0.42 : 0.42;
      targetPitch = 0.58;
      headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, -0.28, damp);

      leftLegPivot.rotation.set(-1.35, 0, -0.75);
      rightLegPivot.rotation.set(-1.35, 0, 0.75);
      targetLeftKneeX = 1.35;
      targetRightKneeX = 1.35;

      if (isLeft) {
        targetLeftShoulderY = 0.85;
        leftArmPivot.rotation.set(-1.55, 0, 0.15);
        rightArmPivot.rotation.set(1.1, 0, 0.85);
        targetLeftElbowX = -0.65;
        targetRightElbowX = -0.45;
      } else {
        targetRightShoulderY = 0.85;
        rightArmPivot.rotation.set(-1.55, 0, -0.15);
        leftArmPivot.rotation.set(1.1, 0, -0.85);
        targetRightElbowX = -0.65;
        targetLeftElbowX = -0.45;
      }
    } else if (GAME.swingPose === 'TWO_HANDED') {
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.z = 0;
      targetRoll = isLeft ? -0.35 : 0.35;
      targetPitch = 0.32;
      headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, 0.25, damp);

      targetLeftShoulderY = 0.82;
      targetRightShoulderY = 0.82;
      leftArmPivot.rotation.set(0.95, 0, -0.65);
      rightArmPivot.rotation.set(0.95, 0, 0.65);
      leftLegPivot.rotation.set(-1.15, 0, -0.12);
      rightLegPivot.rotation.set(-1.15, 0, 0.12);
      targetLeftElbowX = -0.95;
      targetRightElbowX = -0.95;
      targetLeftKneeX = 1.1;
      targetRightKneeX = 1.1;
    } else if (GAME.swingPose === 'UPSIDE_DOWN') {
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.z = 0;
      targetRoll = isLeft ? -0.35 : 0.35;
      targetPitch = 1.35;
      headMesh.rotation.x = -0.55;

      if (isLeft) {
        targetLeftShoulderY = 0.85;
        leftArmPivot.rotation.set(1.4, 0, -0.4);
        rightArmPivot.rotation.set(-0.5, 0, 0.6);
        targetLeftElbowX = -0.75;
        targetRightElbowX = -0.35;
      } else {
        targetRightShoulderY = 0.85;
        rightArmPivot.rotation.set(1.4, 0, 0.4);
        leftArmPivot.rotation.set(-0.5, 0, -0.6);
        targetRightElbowX = -0.75;
        targetLeftElbowX = -0.35;
      }
      leftLegPivot.rotation.set(-0.85, 0, -0.2);
      rightLegPivot.rotation.set(-0.85, 0, 0.2);
      targetLeftKneeX = 1.25;
      targetRightKneeX = 1.25;
    } else if (GAME.swingPose === 'SWING_KICK') {
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.z = 0;
      targetRoll = isLeft ? -0.38 : 0.38;
      targetPitch = -0.12;
      headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, 0.2, damp);

      if (isLeft) {
        targetLeftShoulderY = 0.85;
        leftArmPivot.rotation.set(0.9, 0, -1.3);
        rightArmPivot.rotation.set(-0.6, 0, 0.8);
        targetLeftElbowX = -0.65;
        targetRightElbowX = -0.85;
        leftLegPivot.rotation.set(-1.45, 0, -0.05);
        rightLegPivot.rotation.set(-0.35, 0, 0.15);
        targetLeftKneeX = 0.1;
        targetRightKneeX = 1.45;
      } else {
        targetRightShoulderY = 0.85;
        rightArmPivot.rotation.set(0.9, 0, 1.3);
        leftArmPivot.rotation.set(-0.6, 0, -0.8);
        targetRightElbowX = -0.65;
        targetLeftElbowX = -0.85;
        rightLegPivot.rotation.set(-1.45, 0, 0.05);
        leftLegPivot.rotation.set(-0.35, 0, -0.15);
        targetRightKneeX = 0.1;
        targetLeftKneeX = 1.45;
      }
    } else if (GAME.swingPose === 'FORWARD_DIVE_SWING') {
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.z = 0;
      targetRoll = isLeft ? -0.35 : 0.35;
      const dz = GAME.webAnchor.z - s.z;
      if (dz < -5) {
        targetPitch = -0.75;
        headMesh.rotation.x = -0.5;
        targetLeftKneeX = 1.1;
        targetRightKneeX = 1.1;
      } else {
        targetPitch = 0.55;
        headMesh.rotation.x = 0.4;
        targetLeftKneeX = 0.4;
        targetRightKneeX = 0.4;
      }
      if (isLeft) {
        targetLeftShoulderY = 0.85;
        leftArmPivot.rotation.set(1.1, 0, -1.35);
        rightArmPivot.rotation.set(-0.8, 0, 0.5);
        targetLeftElbowX = -0.75;
        targetRightElbowX = -0.45;
      } else {
        targetRightShoulderY = 0.85;
        rightArmPivot.rotation.set(1.1, 0, 1.35);
        leftArmPivot.rotation.set(-0.8, 0, -0.5);
        targetRightElbowX = -0.75;
        targetLeftElbowX = -0.45;
      }
      leftLegPivot.rotation.set(0.4, 0, -0.1);
      rightLegPivot.rotation.set(0.4, 0, 0.1);
    } else {
      // CLASSIC SWING
      spideyGroup.rotation.x = 0;
      spideyGroup.rotation.z = 0;
      targetRoll = isLeft ? -0.45 : 0.45;
      targetPitch = 0.18 + (s.vy * 0.02);
      headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, 0.22, damp);

      const kneeSway = Math.sin(GAME.swingTime * 6.5) * 0.35;

      if (isLeft) {
        targetLeftShoulderY = 0.86;
        leftArmPivot.rotation.set(0.85, 0, -1.45);
        rightArmPivot.rotation.set(-0.25, 0, 0.35);
        leftLegPivot.rotation.set(-0.6, 0, -0.15);
        rightLegPivot.rotation.set(0.45, 0, 0.1);
        targetLeftElbowX = -0.72;
        targetRightElbowX = -0.42;
        targetLeftKneeX = 0.85 + kneeSway;
        targetRightKneeX = 0.55 - kneeSway;
      } else {
        targetRightShoulderY = 0.86;
        rightArmPivot.rotation.set(0.85, 0, 1.45);
        leftArmPivot.rotation.set(-0.25, 0, -0.35);
        rightLegPivot.rotation.set(-0.6, 0, 0.15);
        leftLegPivot.rotation.set(0.45, 0, -0.1);
        targetRightElbowX = -0.72;
        targetLeftElbowX = -0.42;
        targetRightKneeX = 0.85 + kneeSway;
        targetLeftKneeX = 0.55 - kneeSway;
      }
    }
  } else {
    // FREE-FLIGHT / FREE-FALLING / DIVING
    spideyGroup.rotation.x = 0;
    spideyGroup.rotation.y = Math.PI;
    spideyGroup.rotation.z = 0;
    leftLegPivot.rotation.z = 0;
    rightLegPivot.rotation.z = 0;

    if (s.vy > 1.2) {
      // REALISTIC ASCENDING / CHEST-LIFT SOAR (Buk Uchu Height Gain)
      const climb = Math.min(s.vy / 22.0, 1.0);
      targetPitch = 0.44 + climb * 0.38; // Chest pushed out, arching towards sky
      headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, 0.58 * climb, damp); // Head looks up to clouds

      // Eagle soaring wingspan arms
      leftArmPivot.rotation.z = THREE.MathUtils.lerp(leftArmPivot.rotation.z, -1.45 * climb, damp);
      rightArmPivot.rotation.z = THREE.MathUtils.lerp(rightArmPivot.rotation.z, 1.45 * climb, damp);
      leftArmPivot.rotation.x = THREE.MathUtils.lerp(leftArmPivot.rotation.x, -0.75 * climb, damp);
      rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x, -0.75 * climb, damp);

      // Sleek trailing legs
      leftLegPivot.rotation.x = THREE.MathUtils.lerp(leftLegPivot.rotation.x, 0.35 * climb, damp);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, 0.35 * climb, damp);
      leftLegPivot.rotation.z = THREE.MathUtils.lerp(leftLegPivot.rotation.z, -0.12 * climb, damp);
      rightLegPivot.rotation.z = THREE.MathUtils.lerp(rightLegPivot.rotation.z, 0.12 * climb, damp);

      targetLeftElbowX = -0.32 * climb;
      targetRightElbowX = -0.32 * climb;
      targetLeftKneeX = 0.28 * climb;
      targetRightKneeX = 0.28 * climb;
    } else if (s.vy < -1.2 || GAME.isDiving) {
      // REALISTIC FREE-FALL & DIVE (Matha Nichu Kore Aerodynamic Fall)
      const dive = Math.min(Math.max((-s.vy - 1.2) / 22.0, 0), 1.0);
      targetPitch = -0.32 - (dive * 1.05); // Torso angles downwards towards ground
      headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, -0.68 * dive, damp); // Head looks straight down at street

      spideyGroup.rotation.z = GAME.spiralAngle;

      // Aerodynamic skydiver arms trailing wind currents
      const armWindFlutter = Math.sin(GAME.driftTimer * 14.0) * (0.04 * dive);
      leftArmPivot.rotation.set(1.55 * dive + armWindFlutter, 0, -0.32 * (1.0 - dive) - 0.22);
      rightArmPivot.rotation.set(1.55 * dive - armWindFlutter, 0, 0.32 * (1.0 - dive) + 0.22);

      // Bent knees cutting through air
      leftLegPivot.rotation.set(-0.62 * dive, 0, -0.16);
      rightLegPivot.rotation.set(-0.62 * dive, 0, 0.16);

      const kneeFlutter = Math.sin(GAME.driftTimer * 16.0) * 0.08;
      targetLeftKneeX = 0.85 * dive + kneeFlutter;
      targetRightKneeX = 0.85 * dive - kneeFlutter;
      targetLeftElbowX = -0.48 * dive;
      targetRightElbowX = -0.48 * dive;
    } else {
      // Neutral Apex Glide
      targetPitch = 0.08;
      headMesh.rotation.x = THREE.MathUtils.lerp(headMesh.rotation.x, 0, damp);
      leftArmPivot.rotation.set(0.1, 0, -0.15);
      rightArmPivot.rotation.set(0.1, 0, 0.15);
      leftLegPivot.rotation.set(0, 0, -0.05);
      rightLegPivot.rotation.set(0, 0, 0.05);
      targetLeftElbowX = -0.15;
      targetRightElbowX = -0.15;
      targetLeftKneeX = 0.2;
      targetRightKneeX = 0.2;
    }
  }

  // Smooth shoulder stretch
  leftArmPivot.position.y = THREE.MathUtils.lerp(leftArmPivot.position.y, targetLeftShoulderY, damp);
  rightArmPivot.position.y = THREE.MathUtils.lerp(rightArmPivot.position.y, targetRightShoulderY, damp);

  // Smoothly bend elbows (kunui) and knees (hatu)!
  if (window.leftElbowPivot) leftElbowPivot.rotation.x = THREE.MathUtils.lerp(leftElbowPivot.rotation.x, targetLeftElbowX, damp);
  if (window.rightElbowPivot) rightElbowPivot.rotation.x = THREE.MathUtils.lerp(rightElbowPivot.rotation.x, targetRightElbowX, damp);
  if (window.leftKneePivot) leftKneePivot.rotation.x = THREE.MathUtils.lerp(leftKneePivot.rotation.x, targetLeftKneeX, damp);
  if (window.rightKneePivot) rightKneePivot.rotation.x = THREE.MathUtils.lerp(rightKneePivot.rotation.x, targetRightKneeX, damp);

  // Root banking and pitch
  spideyRoot.rotation.z = THREE.MathUtils.lerp(spideyRoot.rotation.z, targetRoll, damp);
  spideyRoot.rotation.x = THREE.MathUtils.lerp(spideyRoot.rotation.x, targetPitch, damp);
  spideyRoot.rotation.y = THREE.MathUtils.lerp(spideyRoot.rotation.y, targetYaw, damp);

  // Drop shadow directly on road
  shadowMesh.position.set(s.x, ROAD_Y + 0.05, s.z);

  // 3D Glowing Web Strands (Zero Allocations)
  if (GAME.isSlingshotting) {
    _scratchWristL.set(-0.9, 0.5, 0).applyMatrix4(spideyRoot.matrixWorld);
    _scratchWristR.set(0.9, 0.5, 0).applyMatrix4(spideyRoot.matrixWorld);

    const distL = _scratchWristL.distanceTo(GAME.slingshotAnchorLeft);
    leftWebMesh.position.copy(_scratchWristL);
    leftWebMesh.lookAt(GAME.slingshotAnchorLeft);
    leftWebMesh.scale.set(1.4, 1.4, distL);
    leftWebMesh.visible = true;

    const distR = _scratchWristR.distanceTo(GAME.slingshotAnchorRight);
    rightWebMesh.position.copy(_scratchWristR);
    rightWebMesh.lookAt(GAME.slingshotAnchorRight);
    rightWebMesh.scale.set(1.4, 1.4, distR);
    rightWebMesh.visible = true;

    leftWebSplat.position.copy(GAME.slingshotAnchorLeft);
    leftWebSplat.rotation.y = Math.PI / 2;
    leftWebSplat.visible = true;

    rightWebSplat.position.copy(GAME.slingshotAnchorRight);
    rightWebSplat.rotation.y = -Math.PI / 2;
    rightWebSplat.visible = true;
  } else if (GAME.isZipping && GAME.zipTarget) {
    // 🎯 Dual web zip cords to target perch
    _scratchWristL.set(-0.6, 0.4, 0).applyMatrix4(spideyRoot.matrixWorld);
    _scratchWristR.set(0.6, 0.4, 0).applyMatrix4(spideyRoot.matrixWorld);

    const distL = _scratchWristL.distanceTo(GAME.zipTarget);
    leftWebMesh.position.copy(_scratchWristL);
    leftWebMesh.lookAt(GAME.zipTarget);
    leftWebMesh.scale.set(1.2, 1.2, distL);
    leftWebMesh.visible = true;

    const distR = _scratchWristR.distanceTo(GAME.zipTarget);
    rightWebMesh.position.copy(_scratchWristR);
    rightWebMesh.lookAt(GAME.zipTarget);
    rightWebMesh.scale.set(1.2, 1.2, distR);
    rightWebMesh.visible = true;

    leftWebSplat.position.copy(GAME.zipTarget);
    leftWebSplat.visible = true;
    rightWebSplat.visible = false;
  } else if (GAME.swinging) {
    const isLeft = (GAME.swingSide === 'LEFT');
    spideyRoot.updateMatrixWorld(true);
    const activeArmPivot = isLeft ? leftArmPivot : rightArmPivot;
    _scratchActiveWrist.set(0, -1.0, 0).applyMatrix4(activeArmPivot.matrixWorld);
    const anchorPos = GAME.webAnchor;
    const dist = _scratchActiveWrist.distanceTo(anchorPos);

    if (isLeft) {
      leftWebMesh.position.copy(_scratchActiveWrist);
      leftWebMesh.lookAt(anchorPos);
      leftWebMesh.scale.set(1, 1, dist);
      leftWebMesh.visible = true;
      rightWebMesh.visible = false;

      leftWebSplat.position.copy(anchorPos);
      leftWebSplat.rotation.y = Math.PI / 2;
      leftWebSplat.visible = true;
      rightWebSplat.visible = false;
    } else {
      rightWebMesh.position.copy(_scratchActiveWrist);
      rightWebMesh.lookAt(anchorPos);
      rightWebMesh.scale.set(1, 1, dist);
      rightWebMesh.visible = true;
      leftWebMesh.visible = false;

      rightWebSplat.position.copy(anchorPos);
      rightWebSplat.rotation.y = -Math.PI / 2;
      rightWebSplat.visible = true;
      leftWebSplat.visible = false;
    }
  } else {
    leftWebMesh.visible = false;
    rightWebMesh.visible = false;
    leftWebSplat.visible = false;
    rightWebSplat.visible = false;
  }

  // Spark Particles Simulation
  const sparkPosAttr = sparkGeo.attributes.position.array;
  for (let i = 0; i < SPARK_COUNT; i++) {
    if (sparkVelocities[i].life > 0) {
      sparkVelocities[i].life -= dt;
      sparkPosAttr[i * 3] += sparkVelocities[i].x * dt * 25;
      sparkPosAttr[i * 3 + 1] += sparkVelocities[i].y * dt * 25;
      sparkPosAttr[i * 3 + 2] += sparkVelocities[i].z * dt * 25;
    } else {
      sparkPosAttr[i * 3 + 1] = -100;
    }
  }
  sparkGeo.attributes.position.needsUpdate = true;

  // Dynamic Waldoes Flexing for Iron Spider Suit
  if (window.ironWaldoesGroup && window.ironWaldoesGroup.visible) {
    const waldoTime = performance.now() * 0.005;
    const flex = Math.sin(waldoTime) * 0.12;
    window.ironWaldoesGroup.children.forEach((arm) => {
      const { signX, isUpper } = arm.userData || { signX: 1, isUpper: true };
      arm.rotation.z = flex * signX * (isUpper ? 0.8 : -0.8);
      if (arm.userData && arm.userData.elbow) {
        arm.userData.elbow.rotation.x = (isUpper ? 0.2 : -0.2) + flex * 0.5;
      }
    });
  }

  // Spider-Sense Pulsing Halo
  if (window.spiderSenseGroup && window.spiderSenseGroup.visible) {
    spiderSenseGroup.rotation.y = performance.now() * 0.006;
    const pulse = 1.0 + Math.sin(performance.now() * 0.015) * 0.15;
    spiderSenseGroup.scale.set(pulse, pulse, pulse);
  }

  // Third-Person Chase Camera
  const camTargetX = s.x * 0.65;
  const camTargetY = Math.max(s.y + (s.vy < -5 ? 4.8 : 3.8), 6.0);
  const camTargetZ = s.z + 12.5;

  camera.position.x = THREE.MathUtils.lerp(camera.position.x, camTargetX, damp);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, camTargetY, damp);
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, camTargetZ, damp);

  const lookY = s.y + (s.vy > 1.0 ? 3.0 : -2.5 * Math.min(Math.max(-s.vy / 22, 0), 1.0));
  _scratchLookAhead.set(s.x * 0.35, Math.max(lookY, 2.0), s.z - 22);
  camera.lookAt(_scratchLookAhead);

  // Dynamic FOV Swoop: Expands at extreme speed or during steep dives
  const speedFovRatio = Math.min(Math.max((s.vz - 20) / 45, 0), 1.0);
  const targetFov = 65 + (speedFovRatio * 16) + (GAME.isDiving ? 8 : 0);
  camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, damp);
  camera.updateProjectionMatrix();

  sunLight.position.set(s.x - 30, s.y + 80, s.z + 40);
  sunLight.target.position.set(s.x, s.y, s.z - 10);
  sunLight.target.updateMatrixWorld();
}

// Window Globals
window.APEX_STUNTS = APEX_STUNTS;
window.triggerAcrobaticStunt = triggerAcrobaticStunt;
window.triggerApexRelease = triggerApexRelease;
window.triggerManualStunt = triggerManualStunt;
window.triggerWallParkourVault = triggerWallParkourVault;
window.triggerPointLaunch = triggerPointLaunch;
window.updateVisuals = updateVisuals;
