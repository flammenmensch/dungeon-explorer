import Board from '../prefabs/Board';

interface IPlayerStats {
  health:number;
  attack:number;
  defense:number;
  gold:number;
  hasKey:boolean;
}

interface IGameData {
  currentLevel:number;
  playerStats:IPlayerStats;
}

const ROWS = 9;
const COLS = 7;

const TILE_SIZE = 48;

const defaultGameData:IGameData = {
  currentLevel: 1,
  playerStats: {
    health: 25,
    attack: 2,
    defense: 1,
    gold: 0,
    hasKey: false
  }
};

export default class GameState extends Phaser.State {

  protected __playerStats:IPlayerStats;

  protected __currentLevel:number = 1;

  protected __board:Board;

  protected __backgroundTiles:Phaser.Group;

  get backgroundTiles():Phaser.Group {
    return this.__backgroundTiles;
  }

  init(data:IGameData=defaultGameData) {
    this.__currentLevel = data.currentLevel;
    this.__playerStats = data.playerStats;
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
      playerStats: this.__playerStats
    });
  }
}
