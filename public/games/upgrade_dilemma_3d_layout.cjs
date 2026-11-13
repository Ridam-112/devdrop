const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '44_election_mayhem_voting_battle.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Three.js script to <head> if not present
if (!content.includes('three.min.js')) {
  const threeScript = `  <!-- Three.js 3D Engine -->
  <script src="spiderman_game/js/three.min.js"></script>
  <script>
    if (typeof THREE === 'undefined') {
      document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\\/script>');
    }
  </script>`;
  content = content.replace('<head>', `<head>\n${threeScript}`);
}

// 2. Replace CSS for Section 2 (Dilemma layout & 2x2 grid)
const oldCSSRegex = /\/\* --- SCREEN 2: 5 FUND DILEMMAS & STATE CRISIS --- \*\/[\s\S]*?\/\* Decoder Button \*\//;

const newCSS = `/* --- SCREEN 2: 3D CHARACTER + CRISIS STAGE & 2x2 CHOICES --- */
    .dilemma-stage-container {
      width: 100%;
      max-width: 1150px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 0 auto;
      max-height: calc(100vh - 110px);
    }

    /* Top Stage (Split: Left 3D Character, Right Crisis & Fund) */
    .dilemma-top-stage {
      display: flex;
      gap: 14px;
      width: 100%;
      align-items: stretch;
    }

    /* 3D Politician Box */
    .character-3d-box {
      width: 270px;
      flex-shrink: 0;
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
      border: 2px solid rgba(250, 204, 21, 0.45);
      border-radius: 18px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .char-stage-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 3px 12px;
      border-radius: 20px;
      font-size: 13px;
      color: #facc15;
      font-weight: 800;
      z-index: 2;
    }
    .canvas-3d-wrapper {
      width: 100%;
      height: 155px;
      position: relative;
      cursor: grab;
      border-radius: 10px;
    }
    .canvas-3d-wrapper canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
    .char-stage-speech {
      background: rgba(15, 23, 42, 0.92);
      border: 1.5px solid rgba(56, 189, 248, 0.5);
      border-radius: 10px;
      padding: 5px 10px;
      font-size: 12px;
      color: #e2e8f0;
      text-align: center;
      width: 100%;
      line-height: 1.3;
      z-index: 2;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Right Panel (Fund Strip + Crisis Box) */
    .crisis-right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    /* Fund Compact Strip */
    .fund-compact-strip {
      background: linear-gradient(135deg, #065f46 0%, #047857 100%);
      border: 2px solid #34d399;
      border-radius: 14px;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 6px 18px rgba(5, 150, 105, 0.3);
    }
    .fund-strip-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .fund-icon-pulse {
      font-size: 24px;
      animation: bounce 1.4s infinite;
    }
    .fund-compact-title {
      font-size: 15.5px;
      font-weight: 800;
      color: #fff;
    }
    .fund-compact-source {
      font-size: 11px;
      color: #a7f3d0;
    }
    .fund-compact-budget {
      font-size: 18px;
      font-weight: 900;
      color: #facc15;
      background: rgba(0, 0, 0, 0.35);
      padding: 3px 12px;
      border-radius: 10px;
      border: 1px solid rgba(250, 204, 21, 0.4);
      white-space: nowrap;
    }

    /* Crisis Compact Box */
    .crisis-compact-box {
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(12px);
      border: 2px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 10px 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--clay-shadow);
    }
    .crisis-compact-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
      flex-wrap: wrap;
    }
    .crisis-pill-badge {
      background: #dc2626;
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .crisis-compact-heading {
      font-size: 16.5px;
      font-weight: 800;
      color: #facc15;
    }
    .crisis-compact-text {
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.38;
      background: rgba(15, 23, 42, 0.6);
      padding: 8px 12px;
      border-radius: 10px;
      border-left: 3px solid #ef4444;
      margin-bottom: 6px;
    }
    .dilemma-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .toolbar-hint {
      font-size: 13px;
      font-weight: 700;
      color: #38bdf8;
    }
    .btn-decoder-compact {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid #38bdf8;
      color: #38bdf8;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
    }
    .btn-decoder-compact:hover {
      background: #38bdf8;
      color: #0f172a;
    }

    /* --- BOTTOM STAGE: 2x2 GRID (Left/Right, Top/Bottom) --- */
    .choices-2x2-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto auto;
      gap: 10px;
      width: 100%;
    }
    .choice-card-compact {
      background: rgba(15, 23, 42, 0.85);
      border: 1.5px solid rgba(255, 255, 255, 0.14);
      border-radius: 14px;
      padding: 9px 12px;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
      min-height: 80px;
    }
    .choice-card-compact:hover {
      transform: translateY(-2px);
      border-color: #facc15;
      background: rgba(30, 41, 59, 0.98);
      box-shadow: 0 6px 16px rgba(250, 204, 21, 0.2);
    }
    .choice-tag-compact {
      font-size: 22px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .choice-body-compact {
      flex: 1;
      min-width: 0;
    }
    .choice-clause-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(56, 189, 248, 0.18);
      color: #38bdf8;
      margin-bottom: 2px;
    }
    .choice-title-compact {
      font-size: 13px;
      font-weight: 800;
      color: #fff;
      line-height: 1.3;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .choice-detail-compact {
      font-size: 11.5px;
      color: #94a3b8;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .choice-secret-audit-compact {
      display: none;
      margin-top: 6px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px dashed #38bdf8;
      animation: fadeIn 0.2s ease-in;
    }
    .choice-card-compact.revealed .choice-secret-audit-compact {
      display: block;
    }

    /* Decoder Button */`;

content = content.replace(oldCSSRegex, newCSS);

// 3. Replace HTML of Section 2 (#viewDilemmas)
const oldHTMLRegex = /<section id="viewDilemmas" class="view-panel">[\s\S]*?<\/section>/;

const newHTML = `<section id="viewDilemmas" class="view-panel">
      <div class="dilemma-stage-container">
        <!-- Top Stage: 3D Politician on Left, Problem / Crisis & Fund on Right -->
        <div class="dilemma-top-stage">
          
          <!-- 3D Politician Podium & Live Avatar Box -->
          <div class="character-3d-box">
            <div class="char-stage-badge" id="charStageBadge">
              <span id="charPartySymbol">🌱</span>
              <strong id="charStageName">মমতা বন্দ্যোপাধ্যায়</strong>
            </div>
            <div id="character3DCanvasContainer" class="canvas-3d-wrapper"></div>
            <div class="char-stage-speech" id="charStageSpeech">
              "খেলা হবে! দেখা যাক ফান্ডের টাকায় কী কাজ হয়!"
            </div>
          </div>

          <!-- Problem & Government Fund Panel (Right) -->
          <div class="crisis-right-panel">
            <!-- Fund Release Strip -->
            <div class="fund-compact-strip">
              <div class="fund-strip-left">
                <span class="fund-icon-pulse">💰</span>
                <div>
                  <div class="fund-compact-title" id="fundTitle">১. ন্যাশনাল হাইওয়ে ও এক্সপ্রেসওয়ে ফান্ড</div>
                  <div class="fund-compact-source">কেন্দ্রীয় সরকারি অর্থ বরাদ্দ অনুমোদিত</div>
                </div>
              </div>
              <div class="fund-compact-budget" id="fundAmountText">বাজেট: ₹৮০০ কোটি</div>
            </div>

            <!-- Crisis Compact Box -->
            <div class="crisis-compact-box">
              <div class="crisis-compact-header">
                <span class="crisis-pill-badge">🚨 রাজ্যের জরুরি সংকট</span>
                <h2 class="crisis-compact-heading" id="crisisName">রাস্তায় চাঁদের মতো গর্ত! বাস উল্টে খাদ্দে!</h2>
              </div>
              <div class="crisis-compact-text" id="crisisDetails">
                রাজ্যের প্রধান হাইওয়েতে বড় বড় গর্তের কারণে প্রতিনিয়ত বাস উল্টে যাচ্ছে! অ্যাম্বুলেন্স পৌঁছানোর আগেই চাকা ফেটে খাদ্দে পড়ার উপক্রম! সাধারণ মানুষ ক্ষোভে ফুঁসছে!
              </div>
              <div class="dilemma-toolbar">
                <div class="toolbar-hint">🤔 প্যাঁচালো ভাষা সাবধানে বাছুন (Top-Left, Top-Right, Bottom-Left, Bottom-Right):</div>
                <button class="btn-decoder-compact" id="btnDecodeFinePrint" onclick="toggleFinePrintDecoder()">
                  <span>🔍 আমলাতান্ত্রিক ফাইল অডিটর (DECODE)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Stage: 4 Options in 2x2 Grid (Left/Right, Top/Bottom) -->
        <div class="choices-2x2-grid" id="choicesGrid">
          <!-- 4 compact dilemma choices injected per task -->
        </div>
      </div>
    </section>`;

content = content.replace(oldHTMLRegex, newHTML);

// 4. Inject 3D Politician Model Engine and Animation Manager
const engine3DCode = `
    /* ============================================================
       THREE.JS 3D POLITICIAN AVATAR ENGINE
       ============================================================ */
    let politician3D = {
      renderer: null,
      scene: null,
      camera: null,
      charObj: null,
      animId: null,
      time: 0,
      reactionType: null,
      reactionTimer: 0
    };

    function initPolitician3D(leader) {
      const container = document.getElementById('character3DCanvasContainer');
      if (!container) return;

      container.innerHTML = '';
      const w = container.clientWidth || 250;
      const h = container.clientHeight || 155;

      // Renderer
      politician3D.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      politician3D.renderer.setSize(w, h);
      politician3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      politician3D.renderer.shadowMap.enabled = true;
      container.appendChild(politician3D.renderer.domElement);

      // Scene & Camera
      politician3D.scene = new THREE.Scene();
      politician3D.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
      politician3D.camera.position.set(0, 0.2, 5.2);
      politician3D.camera.lookAt(0, -0.3, 0);

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
      politician3D.scene.add(ambLight);

      const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
      dirLight.position.set(3, 5, 4);
      politician3D.scene.add(dirLight);

      const rimLight = new THREE.PointLight(0x38bdf8, 0.9, 10);
      rimLight.position.set(-3, 2, -2);
      politician3D.scene.add(rimLight);

      // Build Character Mesh
      politician3D.charObj = build3DPoliticianMesh(leader.id);
      politician3D.scene.add(politician3D.charObj.group);

      // Update badge
      document.getElementById('charPartySymbol').innerText = leader.symbol;
      document.getElementById('charStageName').innerText = leader.name;

      if (!politician3D.animId) {
        animatePolitician3D();
      }
    }

    function build3DPoliticianMesh(leaderId) {
      const group = new THREE.Group();

      // Podium & Dais
      const podiumGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.35, 20);
      const podiumMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.3 });
      const podium = new THREE.Mesh(podiumGeo, podiumMat);
      podium.position.y = -2.1;
      group.add(podium);

      const podiumRimGeo = new THREE.TorusGeometry(1.55, 0.07, 10, 24);
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
      const podiumRim = new THREE.Mesh(podiumRimGeo, goldMat);
      podiumRim.rotation.x = Math.PI / 2;
      podiumRim.position.y = -1.92;
      group.add(podiumRim);

      // Dual Microphones
      const micStandGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 8);
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
      const micHeadGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const micHeadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

      [-0.26, 0.26].forEach(x => {
        const stand = new THREE.Mesh(micStandGeo, chromeMat);
        stand.position.set(x, -1.3, 0.55);
        stand.rotation.x = -0.22;
        group.add(stand);

        const mic = new THREE.Mesh(micHeadGeo, micHeadMat);
        mic.position.set(x, -0.72, 0.42);
        group.add(mic);
      });

      // Palette config
      let bodyColor = 0xffffff;
      let accentColor = 0x10b981;
      let skinColor = 0xfde047;
      let hairColor = 0x1e293b;
      let hasBeard = false;
      let hasGlasses = false;
      let hasScarf = false;
      let hasTilak = false;
      let hasSariDrape = false;
      let hasMonkRobe = false;

      if (leaderId === 'didi') {
        bodyColor = 0xffffff;
        accentColor = 0x16a34a;
        skinColor = 0xfed7aa;
        hairColor = 0x0f172a;
        hasSariDrape = true;
      } else if (leaderId === 'modi') {
        bodyColor = 0xf97316;
        accentColor = 0xffffff;
        skinColor = 0xfed7aa;
        hairColor = 0xf8fafc;
        hasBeard = true;
        hasGlasses = true;
      } else if (leaderId === 'rahul') {
        bodyColor = 0xffffff;
        accentColor = 0x0284c7;
        skinColor = 0xfde68a;
        hairColor = 0x1e293b;
      } else if (leaderId === 'yogi') {
        bodyColor = 0xea580c;
        accentColor = 0xf97316;
        skinColor = 0xfed7aa;
        hairColor = 0x000000;
        hasTilak = true;
        hasMonkRobe = true;
      } else if (leaderId === 'kejriwal') {
        bodyColor = 0x1e3a8a;
        accentColor = 0x92400e;
        skinColor = 0xfde68a;
        hairColor = 0x1e293b;
        hasScarf = true;
        hasGlasses = true;
      } else if (leaderId === 'lalu') {
        bodyColor = 0xffffff;
        accentColor = 0x15803d;
        skinColor = 0xfed7aa;
        hairColor = 0xcbd5e1;
      } else if (leaderId === 'nitish') {
        bodyColor = 0xffffff;
        accentColor = 0x047857;
        skinColor = 0xfed7aa;
        hairColor = 0x94a3b8;
        hasGlasses = true;
      } else if (leaderId === 'tharoor') {
        bodyColor = 0x312e81;
        accentColor = 0x7c3aed;
        skinColor = 0xfde68a;
        hairColor = 0x0f172a;
      }

      // Torso
      const bodyGeo = new THREE.CylinderGeometry(0.7, 0.88, 1.5, 14);
      const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.65 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = -1.0;
      group.add(body);

      // Jacket / Drape / Shawl
      if (leaderId === 'modi' || leaderId === 'rahul' || leaderId === 'tharoor') {
        const vestGeo = new THREE.CylinderGeometry(0.74, 0.92, 1.15, 14, 1, true, -Math.PI / 1.3, Math.PI * 1.5);
        const vestMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.5, side: THREE.DoubleSide });
        const vest = new THREE.Mesh(vestGeo, vestMat);
        vest.position.y = -0.9;
        group.add(vest);
      } else if (hasSariDrape) {
        const palluGeo = new THREE.CylinderGeometry(0.35, 0.6, 1.45, 8);
        const palluMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        const pallu = new THREE.Mesh(palluGeo, palluMat);
        pallu.rotation.z = -0.3;
        pallu.position.set(-0.35, -0.9, 0.1);
        group.add(pallu);

        const borderGeo = new THREE.TorusGeometry(0.82, 0.04, 8, 20);
        const borderMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
        const border = new THREE.Mesh(borderGeo, borderMat);
        border.rotation.x = Math.PI / 2;
        border.position.y = -1.65;
        group.add(border);
      } else if (hasMonkRobe) {
        const stoleGeo = new THREE.TorusGeometry(0.78, 0.11, 8, 18);
        const stoleMat = new THREE.MeshStandardMaterial({ color: 0xc2410c });
        const stole = new THREE.Mesh(stoleGeo, stoleMat);
        stole.rotation.x = Math.PI / 2.3;
        stole.position.set(0, -0.85, 0);
        group.add(stole);
      } else if (leaderId === 'lalu' || leaderId === 'nitish') {
        const shawlGeo = new THREE.CylinderGeometry(0.22, 0.32, 1.35, 8);
        const shawlMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.7 });
        const shawl = new THREE.Mesh(shawlGeo, shawlMat);
        shawl.rotation.z = 0.35;
        shawl.position.set(0.45, -0.9, 0.15);
        group.add(shawl);
      }

      // Neck & Scarf
      const neckGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.32, 10);
      const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 });
      const neck = new THREE.Mesh(neckGeo, skinMat);
      neck.position.y = -0.05;
      group.add(neck);

      if (hasScarf) {
        const scarfGeo = new THREE.TorusGeometry(0.44, 0.2, 10, 18);
        const scarfMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
        const scarf = new THREE.Mesh(scarfGeo, scarfMat);
        scarf.rotation.x = Math.PI / 2;
        scarf.position.y = 0.0;
        group.add(scarf);
      }

      // Head Group
      const headGroup = new THREE.Group();
      headGroup.position.y = 0.65;

      const headGeo = new THREE.SphereGeometry(0.62, 18, 18);
      const head = new THREE.Mesh(headGeo, skinMat);
      headGroup.add(head);

      // Hair & Facial Features
      const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
      if (leaderId === 'didi') {
        const hairGeo = new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7);
        const hairMesh = new THREE.Mesh(hairGeo, hairMat);
        hairMesh.position.set(0, 0.06, -0.05);
        headGroup.add(hairMesh);

        const bunGeo = new THREE.SphereGeometry(0.28, 10, 10);
        const bun = new THREE.Mesh(bunGeo, hairMat);
        bun.position.set(0, 0.08, -0.6);
        headGroup.add(bun);
      } else if (leaderId === 'yogi') {
        const tilakGeo = new THREE.BoxGeometry(0.09, 0.28, 0.02);
        const tilakMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
        const tilak = new THREE.Mesh(tilakGeo, tilakMat);
        tilak.position.set(0, 0.24, 0.6);
        headGroup.add(tilak);

        const earringGeo = new THREE.TorusGeometry(0.07, 0.022, 6, 14);
        [-0.62, 0.62].forEach(ex => {
          const ring = new THREE.Mesh(earringGeo, goldMat);
          ring.position.set(ex, -0.05, 0);
          ring.rotation.y = Math.PI / 2;
          headGroup.add(ring);
        });
      } else {
        const hairGeo = new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.1);
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 0.1;
        headGroup.add(hair);

        if (leaderId === 'lalu') {
          [-0.56, 0.56].forEach(sx => {
            const sideGeo = new THREE.SphereGeometry(0.22, 8, 8);
            const sideMesh = new THREE.Mesh(sideGeo, hairMat);
            sideMesh.position.set(sx, 0.04, -0.1);
            headGroup.add(sideMesh);
          });
        }
      }

      if (hasBeard) {
        const beardGeo = new THREE.SphereGeometry(0.44, 12, 12, 0, Math.PI * 2, Math.PI / 2.5, Math.PI / 2);
        const beardMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });
        const beard = new THREE.Mesh(beardGeo, beardMat);
        beard.position.set(0, -0.2, 0.3);
        headGroup.add(beard);
      }

      if (hasGlasses) {
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
        const lensGeo = new THREE.TorusGeometry(0.13, 0.022, 6, 14);
        [-0.2, 0.2].forEach(gx => {
          const lens = new THREE.Mesh(lensGeo, frameMat);
          lens.position.set(gx, 0.07, 0.59);
          headGroup.add(lens);
        });
        const bridgeGeo = new THREE.BoxGeometry(0.14, 0.025, 0.02);
        const bridge = new THREE.Mesh(bridgeGeo, frameMat);
        bridge.position.set(0, 0.07, 0.6);
        headGroup.add(bridge);
      }

      // Eyes
      const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      [-0.19, 0.19].forEach(ex => {
        const eyeWhiteGeo = new THREE.SphereGeometry(0.09, 8, 8);
        const eye = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
        eye.scale.z = 0.3;
        eye.position.set(ex, 0.07, 0.56);
        headGroup.add(eye);

        const pupilGeo = new THREE.SphereGeometry(0.045, 6, 6);
        const pupil = new THREE.Mesh(pupilGeo, pupilMat);
        pupil.position.set(ex, 0.07, 0.59);
        headGroup.add(pupil);
      });

      // Mouth
      const mouthGeo = new THREE.TorusGeometry(0.11, 0.028, 6, 10, Math.PI);
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.rotation.x = Math.PI;
      mouth.position.set(0, -0.2, 0.58);
      headGroup.add(mouth);

      group.add(headGroup);

      // Arms & Hands
      const armGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.85, 8);
      const leftArmGroup = new THREE.Group();
      leftArmGroup.position.set(-0.85, -0.4, 0);
      const leftArm = new THREE.Mesh(armGeo, bodyMat);
      leftArm.position.y = -0.38;
      leftArm.rotation.z = 0.22;
      leftArmGroup.add(leftArm);
      const handGeo = new THREE.SphereGeometry(0.16, 6, 6);
      const leftHand = new THREE.Mesh(handGeo, skinMat);
      leftHand.position.set(-0.12, -0.78, 0.12);
      leftArmGroup.add(leftHand);
      group.add(leftArmGroup);

      const rightArmGroup = new THREE.Group();
      rightArmGroup.position.set(0.85, -0.4, 0);
      const rightArm = new THREE.Mesh(armGeo, bodyMat);
      rightArm.position.y = -0.38;
      rightArm.rotation.z = -0.22;
      rightArmGroup.add(rightArm);
      const rightHand = new THREE.Mesh(handGeo, skinMat);
      rightHand.position.set(0.12, -0.78, 0.12);
      rightArmGroup.add(rightHand);
      group.add(rightArmGroup);

      return {
        group,
        headGroup,
        leftArmGroup,
        rightArmGroup,
        body
      };
    }

    function animatePolitician3D() {
      politician3D.animId = requestAnimationFrame(animatePolitician3D);
      politician3D.time += 0.035;

      const obj = politician3D.charObj;
      if (!obj) return;

      if (politician3D.reactionTimer > 0) {
        politician3D.reactionTimer -= 0.035;
        if (politician3D.reactionType === 'GENUINE_WORK') {
          // Happy jump & wave both arms
          obj.group.position.y = Math.sin(politician3D.time * 8) * 0.15;
          obj.headGroup.rotation.y = Math.sin(politician3D.time * 6) * 0.2;
          obj.leftArmGroup.rotation.z = 1.8 + Math.sin(politician3D.time * 10) * 0.4;
          obj.rightArmGroup.rotation.z = -1.8 - Math.sin(politician3D.time * 10) * 0.4;
        } else if (politician3D.reactionType === 'CORRUPT_STEAL') {
          // Sneaky lean forward & rub hands
          obj.group.position.y = -0.1;
          obj.group.rotation.x = 0.15;
          obj.headGroup.rotation.y = Math.sin(politician3D.time * 12) * 0.15;
          obj.leftArmGroup.rotation.z = 0.8 + Math.sin(politician3D.time * 12) * 0.2;
          obj.rightArmGroup.rotation.z = -0.8 - Math.sin(politician3D.time * 12) * 0.2;
        } else {
          // Confused shrug / head tilt
          obj.headGroup.rotation.z = Math.sin(politician3D.time * 4) * 0.2;
          obj.leftArmGroup.rotation.z = 0.6;
          obj.rightArmGroup.rotation.z = -0.6;
        }
      } else {
        // Natural Idle Animation (Breathing, head bobbing, slight swaying)
        obj.group.position.y = 0;
        obj.group.rotation.x = 0;
        obj.headGroup.position.y = 0.65 + Math.sin(politician3D.time * 2.2) * 0.025;
        obj.headGroup.rotation.y = Math.sin(politician3D.time * 1.2) * 0.1;
        obj.headGroup.rotation.z = Math.sin(politician3D.time * 0.8) * 0.03;
        obj.leftArmGroup.rotation.z = 0.2 + Math.sin(politician3D.time * 2) * 0.06;
        obj.rightArmGroup.rotation.z = -0.2 - Math.sin(politician3D.time * 2) * 0.06;
      }

      politician3D.renderer.render(politician3D.scene, politician3D.camera);
    }

    function trigger3DReaction(type, speechText) {
      politician3D.reactionType = type;
      politician3D.reactionTimer = 2.0;

      const speechEl = document.getElementById('charStageSpeech');
      if (speechEl && speechText) {
        speechEl.innerText = speechText;
        speechEl.style.borderColor = (type === 'GENUINE_WORK' ? '#4ade80' : (type === 'CORRUPT_STEAL' ? '#ef4444' : '#facc15'));
      }
    }
`;

// Replace loadDilemma and toggleFinePrintDecoder logic to support the new 2x2 grid and 3D character
const oldLoadDilemmaRegex = /let isFinePrintDecoded = false;[\s\S]*?function advanceToNextStep\(\) \{/;

const newLoadDilemma = `let isFinePrintDecoded = false;

    function toggleFinePrintDecoder() {
      sound.init();
      sound.playSlap();
      isFinePrintDecoded = !isFinePrintDecoded;

      const cards = document.querySelectorAll('.choice-card-compact');
      cards.forEach(card => {
        if (isFinePrintDecoded) card.classList.add('revealed');
        else card.classList.remove('revealed');
      });

      const btn = document.getElementById('btnDecodeFinePrint');
      if (isFinePrintDecoded) {
        btn.innerHTML = '<span>👁️ অডিট নোট লুকান (HIDE)</span>';
        btn.style.background = '#38bdf8';
        btn.style.color = '#0f172a';
        showMemePopup('🔍 আমলাতান্ত্রিক গোপন ফাইল ফাঁস! 🔍');
        trigger3DReaction('BUREAUCRATIC_TRAP', '"আমলাদের সব গোপন ফাইল ফাঁস হয়ে গেল!"');
      } else {
        btn.innerHTML = '<span>🔍 আমলাতান্ত্রিক ফাইল অডিটর (DECODE)</span>';
        btn.style.background = 'rgba(56, 189, 248, 0.15)';
        btn.style.color = '#38bdf8';
      }
    }

    function loadDilemma(index) {
      gameState.currentDilemmaIndex = index;
      const d = DILEMMAS[index];

      isFinePrintDecoded = false;
      const btn = document.getElementById('btnDecodeFinePrint');
      btn.innerHTML = '<span>🔍 আমলাতান্ত্রিক ফাইল অডিটর (DECODE)</span>';
      btn.style.background = 'rgba(56, 189, 248, 0.15)';
      btn.style.color = '#38bdf8';

      document.getElementById('hudFund').innerText = \`₹\${d.fundAmount} কোটি\`;
      document.getElementById('fundTitle').innerText = d.fundTitle;
      document.getElementById('fundAmountText').innerText = \`বাজেট: ₹\${d.fundAmount} কোটি\`;
      document.getElementById('crisisName').innerText = d.crisisName;
      document.getElementById('crisisDetails').innerText = d.crisisDesc;

      // Update 3D Character & Speech
      initPolitician3D(gameState.selectedLeader);
      const quotes = [
        \`"\${gameState.selectedLeader.speechQuote}"\`,
        '"ফান্ডের টাকা হাতে এলো! কী সিদ্ধান্ত নেব?"',
        '"প্যাঁচালো আমলাতান্ত্রিক ভাষা ভালো করে পড়ুন!"',
        \`"জনগণের উন্নয়ন নাকি নিজস্ব ব্যাংক তহবিল? সিদ্ধান্ত নিন!"\`
      ];
      document.getElementById('charStageSpeech').innerText = quotes[index % quotes.length];
      document.getElementById('charStageSpeech').style.borderColor = 'rgba(56, 189, 248, 0.5)';

      // Close modals
      document.getElementById('outcomeModalBackdrop').classList.remove('active');
      document.getElementById('edRaidModalBackdrop').classList.remove('active');

      // Render 4 choices in 2x2 Grid (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
      const choicesGrid = document.getElementById('choicesGrid');
      choicesGrid.innerHTML = '';

      d.choices.forEach((choice, cIdx) => {
        const cCard = document.createElement('div');
        cCard.className = 'choice-card-compact';
        cCard.id = \`choiceCard-\${cIdx}\`;
        cCard.innerHTML = \`
          <div class="choice-tag-compact">\${choice.tag}</div>
          <div class="choice-body-compact">
            <span class="choice-clause-tag">\${choice.clause}</span>
            <div class="choice-title-compact" title="\${choice.title}">\${choice.title}</div>
            <div class="choice-detail-compact">\${choice.detail}</div>
            <div class="choice-secret-audit-compact">\${choice.auditNote}</div>
          </div>
        \`;

        cCard.addEventListener('click', () => {
          makeDecision(choice);
        });

        choicesGrid.appendChild(cCard);
      });

      updateHUD();
    }

    function makeDecision(choice) {
      sound.init();
      // Apply impacts
      gameState.swissBankPocket += choice.pocketGain;
      gameState.approvalRating = Math.max(5, Math.min(100, gameState.approvalRating + choice.approvalChange));
      gameState.edRaidRisk = Math.max(0, Math.min(100, gameState.edRaidRisk + choice.edChange));
      
      let voteChange = 20000;
      if (choice.type === 'GENUINE_WORK') {
        voteChange = 120000;
        sound.playKaChing();
        trigger3DReaction('GENUINE_WORK', '"জনগণের মুখে হাসি ফুটল! দুর্দান্ত কাজ!"');
      } else if (choice.type === 'CORRUPT_STEAL') {
        voteChange = -40000;
        sound.playSiren();
        showMemePopup('🚨 ইডি ও সিবিআইয়ের নজর পড়ল! 🚨');
        trigger3DReaction('CORRUPT_STEAL', '"পকেটে মাল ঢুকেছে! খবরদার কাউকে বলবেন না!"');
      } else {
        sound.playSlap();
        trigger3DReaction('BUREAUCRATIC_TRAP', '"আমলাদের ফাইলে সব টাকা ধুলো খাচ্ছে!"');
      }
      gameState.totalVotes = Math.max(10000, gameState.totalVotes + voteChange);

      gameState.historyLog.push({
        dilemma: DILEMMAS[gameState.currentDilemmaIndex].fundTitle,
        choiceTitle: choice.title,
        type: choice.type
      });

      updateHUD();

      // Show Centered Outcome Modal Overlay
      const modal = document.getElementById('outcomeModalBackdrop');
      document.getElementById('outcomeVisualIcon').innerText = choice.visualIcon;

      const titleEl = document.getElementById('outcomeModalTitle');
      if (choice.type === 'GENUINE_WORK') {
        titleEl.innerText = '✅ জনসেবার সঠিক সিদ্ধান্ত!';
        titleEl.style.color = '#4ade80';
      } else if (choice.type === 'CORRUPT_STEAL') {
        titleEl.innerText = '💼 টাকা পকেটে ভরলেন মন্ত্রী মশাই!';
        titleEl.style.color = '#ef4444';
      } else {
        titleEl.innerText = '⚠️ প্যাঁচালো সিদ্ধান্তের ফাঁদ!';
        titleEl.style.color = '#facc15';
      }

      document.getElementById('outcomeModalDesc').innerText = choice.dialogue;
      document.getElementById('outcomeNewspaperHeadline').innerText = choice.newspaperHeadline || '📰 "ব্রেকিং নিউজ: মন্ত্রীর সিদ্ধান্তে সরগরম রাজ্য রাজনীতি!"';
      document.getElementById('outcomeStatVotes').innerText = (voteChange >= 0 ? \`+\${voteChange.toLocaleString()}\` : \`\${voteChange.toLocaleString()}\`);
      document.getElementById('outcomeStatVotes').style.color = voteChange >= 0 ? '#38bdf8' : '#ef4444';

      document.getElementById('outcomeStatApproval').innerText = (choice.approvalChange >= 0 ? \`+\${choice.approvalChange}%\` : \`\${choice.approvalChange}%\`);
      document.getElementById('outcomeStatApproval').style.color = choice.approvalChange >= 0 ? '#4ade80' : '#ef4444';

      document.getElementById('outcomeStatPocket').innerText = \`+₹\${choice.pocketGain} কোটি\`;
      document.getElementById('outcomeStatPocket').style.color = choice.pocketGain > 0 ? '#facc15' : '#94a3b8';

      document.getElementById('outcomeStatEd').innerText = (choice.edChange >= 0 ? \`+\${choice.edChange}%\` : \`\${choice.edChange}%\`);
      document.getElementById('outcomeStatEd').style.color = choice.edChange > 0 ? '#ef4444' : '#4ade80';

      modal.classList.add('active');

      document.getElementById('btnNextDilemmaModal').onclick = () => {
        modal.classList.remove('active');

        // Check for Sudden ED Raid Event if risk is high
        if (gameState.edRaidRisk >= 40 && !gameState.hasHadEdRaid && choice.pocketGain > 0) {
          gameState.hasHadEdRaid = true;
          sound.playSiren();
          setTimeout(() => {
            document.getElementById('edRaidModalBackdrop').classList.add('active');
          }, 400);
          return;
        }

        advanceToNextStep();
      };
    }

    function handleEdRaidAction(action) {
      sound.init();
      document.getElementById('edRaidModalBackdrop').classList.remove('active');

      if (action === 'tank') {
        sound.playVineBoom();
        const lost = Math.min(gameState.swissBankPocket, 100);
        gameState.swissBankPocket -= lost;
        gameState.edRaidRisk = Math.max(10, gameState.edRaidRisk - 25);
        showMemePopup(\`🚿 জলের ট্যাঙ্কে ₹\${lost} কোটি নোট ভিজে নষ্ট! কিন্তু ইডি খালি হাতে ফিরল!\`);
        trigger3DReaction('CORRUPT_STEAL', '"জলের ট্যাঙ্কে নোট ভিজে নষ্ট হলেও গ্রেপ্তার এড়ালাম!"');
      } else if (action === 'neighbour') {
        sound.playSlap();
        const lost = Math.min(gameState.swissBankPocket, 200);
        gameState.swissBankPocket -= lost;
        gameState.edRaidRisk = Math.max(10, gameState.edRaidRisk - 15);
        showMemePopup(\`🧱 পড়শির বাড়ি ব্যাগ ছুড়ে ₹\${lost} কোটি খোয়ালেন! কিন্তু এফআইআর এড়ালেন!\`);
        trigger3DReaction('BUREAUCRATIC_TRAP', '"পড়শির বাড়ি ব্যাগ ছুড়ে বেঁচে গেলাম!"');
      } else if (action === 'press') {
        sound.playAirhorn();
        gameState.approvalRating = Math.min(100, gameState.approvalRating + 12);
        gameState.edRaidRisk = Math.min(100, gameState.edRaidRisk + 15);
        showMemePopup('🎤 প্রেসের সামনে কান্নাকাটি! জনগণ সমবেদনা জানাল!');
        trigger3DReaction('GENUINE_WORK', '"আমাদের বিরুদ্ধে মিথ্যা চক্রান্ত চলছে!"');
      }

      updateHUD();
      setTimeout(advanceToNextStep, 1000);
    }

    function advanceToNextStep() {`;

// Insert 3D engine code before oldLoadDilemmaRegex
content = content.replace(oldLoadDilemmaRegex, `${engine3DCode}\n${newLoadDilemma}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully upgraded 44_election_mayhem_voting_battle.html with 3D politician avatar and 2x2 compact dilemma layout!');
