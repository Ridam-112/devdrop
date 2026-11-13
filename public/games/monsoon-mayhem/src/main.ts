import { Game3DScene } from './three/Game3DScene';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container');
  if (container) {
    new Game3DScene(container);
  }
});
