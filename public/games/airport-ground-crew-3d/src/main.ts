import './styles/main.css';
import { Game } from './game/Game';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  const loadingOverlay = document.getElementById('loading-overlay');
  const progressBar = document.getElementById('loading-bar-fill');
  const loadingStatus = document.getElementById('loading-status');

  if (!container) return;

  // Simulate asset initialization progress
  let progress = 10;
  const interval = setInterval(() => {
    progress += 25;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (loadingStatus) {
      if (progress < 50) loadingStatus.innerText = 'Initializing Airport Ground Systems...';
      else if (progress < 85) loadingStatus.innerText = 'Spawning Service Vehicles & Airframes...';
      else loadingStatus.innerText = 'Ready for Turnaround Operation!';
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (loadingOverlay) {
          loadingOverlay.classList.add('hidden');
        }
        // Initialize game
        new Game(container);
      }, 400);
    }
  }, 120);
});
