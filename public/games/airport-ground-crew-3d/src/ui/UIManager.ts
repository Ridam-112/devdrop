import { GameState } from '../game/GameState';
import { AudioManager } from '../game/AudioManager';
import { MissionManager, MissionDef } from '../missions/MissionManager';

export class UIManager {
  private state: GameState;
  private audio: AudioManager;
  private missions: MissionManager;

  // DOM elements cache
  private hudLayer: HTMLElement | null = null;
  private missionTitleEl: HTMLElement | null = null;
  private missionStepEl: HTMLElement | null = null;
  private speedValEl: HTMLElement | null = null;
  private gearValEl: HTMLElement | null = null;
  private cashValEl: HTMLElement | null = null;
  private levelValEl: HTMLElement | null = null;
  private promptEl: HTMLElement | null = null;
  private wpEl: HTMLElement | null = null;
  private wpArrowEl: HTMLElement | null = null;
  private wpTextEl: HTMLElement | null = null;
  private wpDistEl: HTMLElement | null = null;

  // Screens
  private screenMenu: HTMLElement | null = null;
  private screenMissions: HTMLElement | null = null;
  private screenBriefing: HTMLElement | null = null;
  private screenResults: HTMLElement | null = null;
  private screenGarage: HTMLElement | null = null;
  private screenSettings: HTMLElement | null = null;
  private screenPause: HTMLElement | null = null;

  // Callback hooks for game lifecycle
  public onStartMission: ((id: number) => void) | null = null;
  public onResumeGame: (() => void) | null = null;
  public onRestartMission: (() => void) | null = null;
  public onReturnToHub: (() => void) | null = null;
  public onSelectVehicle: ((id: string) => void) | null = null;

  constructor(state: GameState, audio: AudioManager, missions: MissionManager) {
    this.state = state;
    this.audio = audio;
    this.missions = missions;
    this.cacheElements();
    this.setupEvents();
    this.updateWalletHUD();
  }

  private cacheElements() {
    this.hudLayer = document.getElementById('hud-layer');
    this.missionTitleEl = document.getElementById('hud-mission-title');
    this.missionStepEl = document.getElementById('hud-mission-step');
    this.speedValEl = document.getElementById('hud-speed-val');
    this.gearValEl = document.getElementById('hud-gear-val');
    this.cashValEl = document.getElementById('hud-cash-val');
    this.levelValEl = document.getElementById('hud-level-val');
    this.promptEl = document.getElementById('interaction-prompt');

    this.screenMenu = document.getElementById('screen-menu');
    this.screenMissions = document.getElementById('screen-missions');
    this.screenBriefing = document.getElementById('screen-briefing');
    this.screenResults = document.getElementById('screen-results');
    this.screenGarage = document.getElementById('screen-garage');
    this.screenSettings = document.getElementById('screen-settings');
    this.screenPause = document.getElementById('screen-pause');
  }

  private setupEvents() {
    // Menu buttons
    document.getElementById('btn-menu-play')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showBriefing(this.state.unlockedMissions);
    });

    document.getElementById('btn-menu-missions')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showMissionSelect();
    });

    document.getElementById('btn-menu-garage')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showGarage();
    });

    document.getElementById('btn-menu-settings')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showSettings();
    });

    // Briefing Start
    document.getElementById('btn-briefing-start')?.addEventListener('click', () => {
      this.audio.playClick();
      const missionId = parseInt(this.screenBriefing?.dataset.missionId || '1', 10);
      this.hideAllScreens();
      if (this.onStartMission) this.onStartMission(missionId);
    });

    document.getElementById('btn-briefing-back')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showMainMenu();
    });

    // Results Next & Replay
    document.getElementById('btn-results-next')?.addEventListener('click', () => {
      this.audio.playClick();
      const nextId = Math.min(8, this.missions.currentMissionId + 1);
      this.showBriefing(nextId);
    });

    document.getElementById('btn-results-hub')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showMainMenu();
      if (this.onReturnToHub) this.onReturnToHub();
    });

    // Pause Screen buttons
    document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
      this.audio.playClick();
      this.hideAllScreens();
      if (this.onResumeGame) this.onResumeGame();
    });

    document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
      this.audio.playClick();
      this.hideAllScreens();
      if (this.onRestartMission) this.onRestartMission();
    });

    document.getElementById('btn-pause-hub')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showMainMenu();
      if (this.onReturnToHub) this.onReturnToHub();
    });

    // Garage back
    document.getElementById('btn-garage-back')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showMainMenu();
    });

    // Settings back & volume
    document.getElementById('btn-settings-back')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showMainMenu();
    });

    const volSlider = document.getElementById('setting-volume') as HTMLInputElement | null;
    if (volSlider) {
      volSlider.addEventListener('input', () => {
        const val = parseFloat(volSlider.value);
        this.audio.setMasterVolume(val);
      });
    }

    // Missions select back
    document.getElementById('btn-missions-back')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showMainMenu();
    });

    // HUD icons
    document.getElementById('btn-hud-sound')?.addEventListener('click', () => {
      const isMuted = this.audio.toggleMute();
      const el = document.getElementById('btn-hud-sound');
      if (el) el.innerText = isMuted ? '🔇' : '🔊';
    });

    document.getElementById('btn-hud-pause')?.addEventListener('click', () => {
      this.audio.playClick();
      this.showPause();
    });
  }

  public hideAllScreens() {
    [
      this.screenMenu,
      this.screenMissions,
      this.screenBriefing,
      this.screenResults,
      this.screenGarage,
      this.screenSettings,
      this.screenPause
    ].forEach((screen) => {
      screen?.classList.add('hidden');
    });
    if (this.hudLayer) this.hudLayer.style.display = 'flex';
  }

  public showMainMenu() {
    this.hideAllScreens();
    this.screenMenu?.classList.remove('hidden');
    if (this.hudLayer) this.hudLayer.style.display = 'none';
    this.hidePrompt();
  }

  public showPause() {
    this.screenPause?.classList.remove('hidden');
  }

  public showBriefing(missionId: number) {
    this.hideAllScreens();
    const def = this.missions.missionDefs[missionId];
    if (!def) return;

    if (this.screenBriefing) {
      this.screenBriefing.dataset.missionId = missionId.toString();
      const titleEl = document.getElementById('briefing-title');
      const descEl = document.getElementById('briefing-desc');
      const cashEl = document.getElementById('briefing-reward-cash');
      const xpEl = document.getElementById('briefing-reward-xp');

      if (titleEl) titleEl.innerText = `Mission ${def.id}: ${def.title}`;
      if (descEl) descEl.innerText = def.description;
      if (cashEl) cashEl.innerText = `+$${def.rewardCash}`;
      if (xpEl) xpEl.innerText = `+${def.rewardXp} XP`;

      this.screenBriefing.classList.remove('hidden');
    }
    if (this.hudLayer) this.hudLayer.style.display = 'none';
  }

  public showResults(missionId: number, success: boolean) {
    this.hideAllScreens();
    const def = this.missions.missionDefs[missionId];
    if (!def) return;

    const resTitle = document.getElementById('results-title');
    const resSubtitle = document.getElementById('results-subtitle');
    const resCash = document.getElementById('results-cash');
    const resXp = document.getElementById('results-xp');

    if (success) {
      if (resTitle) resTitle.innerText = 'MISSION COMPLETED!';
      if (resSubtitle) resSubtitle.innerText = `Outstanding turnaround service for ${def.title}`;
      if (resCash) resCash.innerText = `+$${def.rewardCash}`;
      if (resXp) resXp.innerText = `+${def.rewardXp} XP`;
      this.state.addReward(def.rewardCash, def.rewardXp);
      this.state.unlockNextMission(missionId);
    } else {
      if (resTitle) resTitle.innerText = 'MISSION FAILED';
      if (resSubtitle) resSubtitle.innerText = 'Turnaround time limit expired or objective incomplete.';
      if (resCash) resCash.innerText = '$0';
      if (resXp) resXp.innerText = '0 XP';
    }

    this.updateWalletHUD();
    this.screenResults?.classList.remove('hidden');
    if (this.hudLayer) this.hudLayer.style.display = 'none';
  }

  public showMissionSelect() {
    this.hideAllScreens();
    const listEl = document.getElementById('missions-grid');
    if (listEl) {
      listEl.innerHTML = '';
      Object.values(this.missions.missionDefs).forEach((m: MissionDef) => {
        const isUnlocked = m.id <= this.state.unlockedMissions;
        const card = document.createElement('div');
        card.className = `vehicle-card ${isUnlocked ? '' : 'locked'}`;
        card.innerHTML = `
          <div style="font-size: 11px; color: var(--safety-yellow); font-weight:800;">MISSION ${m.id}</div>
          <div style="font-size: 14px; font-weight: 900;">${m.title}</div>
          <div style="font-size: 11px; color: #a4b0be; margin-top: 4px;">Reward: $${m.rewardCash} • ${m.rewardXp} XP</div>
          <div style="margin-top: 6px; font-size: 11px; font-weight:800; color: ${isUnlocked ? 'var(--success-green)' : '#7f8c8d'};">
            ${isUnlocked ? 'AVAILABLE' : 'LOCKED'}
          </div>
        `;
        if (isUnlocked) {
          card.onclick = () => {
            this.audio.playClick();
            this.showBriefing(m.id);
          };
        }
        listEl.appendChild(card);
      });
    }
    this.screenMissions?.classList.remove('hidden');
    if (this.hudLayer) this.hudLayer.style.display = 'none';
  }

  public showGarage() {
    this.hideAllScreens();
    const gridEl = document.getElementById('garage-vehicles-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      const vehicles = [
        { id: 'baggage_tug', name: 'Baggage Tug', desc: 'Compact luggage towing tractor', cost: 0 },
        { id: 'fuel_truck', name: 'Jet-A1 Fuel Tanker', desc: 'High-capacity aviation fuel tanker', cost: 800 },
        { id: 'cargo_loader', name: 'Cargo High-Loader', desc: 'Scissor-lift deck container loader', cost: 1200 },
        { id: 'service_van', name: 'Follow-Me Marshaller Van', desc: 'Fast ramp marshalling service van', cost: 1600 }
      ];

      vehicles.forEach((v) => {
        const isUnlocked = this.state.unlockedVehicles.has(v.id);
        const isSelected = this.state.selectedVehicle === v.id;
        const card = document.createElement('div');
        card.className = `vehicle-card ${isSelected ? 'selected' : ''} ${isUnlocked ? '' : 'locked'}`;
        card.innerHTML = `
          <div style="font-size: 11px; color: var(--safety-yellow); font-weight:800;">RAMP VEHICLE</div>
          <div style="font-size: 15px; font-weight: 900;">${v.name}</div>
          <div style="font-size: 11px; color: #dfe6e9;">${v.desc}</div>
          <div style="margin-top: 6px;">
            ${isSelected ? '<span style="color:var(--success-green); font-weight:900;">SELECTED</span>' :
              isUnlocked ? '<button class="btn-secondary" style="padding:4px 12px; font-size:11px;">SELECT</button>' :
              `<button class="btn-primary" style="padding:4px 12px; font-size:11px;">UNLOCK $${v.cost}</button>`}
          </div>
        `;
        card.onclick = () => {
          if (isUnlocked) {
            this.state.selectedVehicle = v.id;
            this.state.save();
            this.audio.playClick();
            this.showGarage();
            if (this.onSelectVehicle) this.onSelectVehicle(v.id);
          } else if (this.state.cash >= v.cost) {
            this.state.unlockVehicle(v.id, v.cost);
            this.audio.playSuccess();
            this.updateWalletHUD();
            this.showGarage();
          } else {
            this.audio.playFail();
          }
        };
        gridEl.appendChild(card);
      });
    }
    this.screenGarage?.classList.remove('hidden');
    if (this.hudLayer) this.hudLayer.style.display = 'none';
  }

  public showSettings() {
    this.hideAllScreens();
    this.screenSettings?.classList.remove('hidden');
    if (this.hudLayer) this.hudLayer.style.display = 'none';
  }

  public updateHUD(missionTitle: string, stepText: string, speedKmh: number, isReverse: boolean, inVehicle: boolean) {
    if (this.missionTitleEl) this.missionTitleEl.innerText = missionTitle;
    if (this.missionStepEl) this.missionStepEl.innerText = stepText;
    if (this.speedValEl) this.speedValEl.innerText = `${speedKmh} KM/H`;
    if (this.gearValEl) {
      this.gearValEl.innerText = !inVehicle ? 'WALK' : isReverse ? 'R' : speedKmh > 0 ? 'D' : 'P';
    }
  }

  public updateWalletHUD() {
    if (this.cashValEl) this.cashValEl.innerText = `$${this.state.cash}`;
    if (this.levelValEl) this.levelValEl.innerText = `LVL ${this.state.level}`;
  }

  public showPrompt(text: string) {
    if (this.promptEl) {
      this.promptEl.innerText = text;
      this.promptEl.style.display = 'block';
    }
  }

  public hidePrompt() {
    if (this.promptEl) {
      this.promptEl.style.display = 'none';
    }
  }

  public updateWaypointHUD(
    visible: boolean,
    screenX: number,
    screenY: number,
    arrowText: string,
    labelText: string,
    distanceMeters: number
  ) {
    if (!this.wpEl) {
      this.wpEl = document.getElementById('hud-waypoint-indicator');
      this.wpArrowEl = document.getElementById('wp-arrow');
      this.wpTextEl = document.getElementById('wp-text');
      this.wpDistEl = document.getElementById('wp-dist');
    }

    if (!this.wpEl) return;

    if (!visible) {
      this.wpEl.style.display = 'none';
      return;
    }

    this.wpEl.style.display = 'block';
    this.wpEl.style.left = `${screenX}px`;
    this.wpEl.style.top = `${screenY}px`;

    if (this.wpArrowEl) this.wpArrowEl.innerText = arrowText;
    if (this.wpTextEl) this.wpTextEl.innerText = labelText;
    if (this.wpDistEl) this.wpDistEl.innerText = `${distanceMeters}m`;
  }
}
