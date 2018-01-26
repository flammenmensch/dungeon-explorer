import GameState from '../states/GameState';

interface IBoardConfig {
  rows:number;
  cols:number;
  tileSize:number;
}

export default class Board {
  protected __rows:number;

  protected __cols:number;

  protected __tileSize:number;

  protected __numCells:number = 0;

  protected __state:GameState;

  protected __game:Phaser.Game;

  constructor(state:GameState, config:IBoardConfig) {
    this.__rows = config.rows;
    this.__cols = config.cols;
    this.__tileSize = config.tileSize;
    this.__numCells = this.__rows * this.__cols;
    this.__state = state;
    this.__game = state.game;

    console.log(this.__rows, this.__cols);

    for (let i = 0; i < this.__rows; i++) {
      for (let j = 0; j < this.__cols; j++) {
        this.__state.backgroundTiles.add(this.getTile(j, i));
      }
    }
  }

  protected getTile(x:number, y:number):Phaser.TileSprite {
    const frame:number = this.__game.rnd.integerInRange(205, 208);
    return new Phaser.TileSprite(this.__game, x * this.__tileSize, y * this.__tileSize, this.__tileSize, this.__tileSize, 'terrain', frame);
  }
}
