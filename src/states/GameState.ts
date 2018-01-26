import Board from '../prefabs/Board';

const ROWS = 9;
const COLS = 7;

const TILE_SIZE = 48;

interface IPlayerStats {
  health:number;
  attack:number;
  defense:number;
  gold:number;
  hasKey:boolean;
}

interface IGameData {

}

export default class GameState extends Phaser.State {

  protected __data:IGameData = {};

  protected __currentLevel:number = 1;

  protected __playerStats:IPlayerStats = {
    health: 25,
    attack: 2,
    defense: 1,
    gold: 0,
    hasKey: false
  };

  protected __board:Board;

  protected __backgroundTiles:Phaser.Group;

  get backgroundTiles():Phaser.Group {
    return this.__backgroundTiles;
  }

  create() {
    this.__backgroundTiles = this.add.group();

    this.__board = new Board(this, {
      rows: ROWS,
      cols: COLS,
      tileSize: TILE_SIZE
    });
  }

  protected gameOver():void {
    this.game.state.start('Game');
  }

  protected nextLevel():void {
    this.game.state.start('Game', true, false, {
      currentLevel: this.__currentLevel + 1,
      playerStats: { ...this.__playerStats }
    });
  }

}
