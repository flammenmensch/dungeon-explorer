import 'pixi';
import 'p2';
import 'phaser';

import BootState from './states/BootState';
import PreloadState from './states/PreloadState';
import GameState from './states/GameState';

class RPG extends Phaser.Game {
  constructor(config:Phaser.IGameConfig) {
    super(config);

    this.state.add('Boot', BootState);
    this.state.add('Preload', PreloadState);
    this.state.add('Game', GameState);

    this.state.start('Boot');
  }
}

const config:Phaser.IGameConfig = {
  width: 336,
  height: 640,
  renderer: Phaser.AUTO,
  parent: 'game',
  resolution: 1
};

new RPG(config);
