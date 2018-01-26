import GameState from '../states/GameState';

interface IBoardConfig {
  rows:number;
  cols:number;
  tileSize:number;
}

interface ITileCoordinates {
  row:number;
  col:number;
}

export default class Board {
  protected __rows:number;

  protected __cols:number;

  protected __tileSize:number;

  protected __numCells:number = 0;

  protected __state:GameState;

  protected __game:Phaser.Game;

  protected __tileCoordinatesMap:Map<Phaser.TileSprite, ITileCoordinates>;

  constructor(state:GameState, config:IBoardConfig) {
    this.__rows = config.rows;
    this.__cols = config.cols;
    this.__tileSize = config.tileSize;
    this.__numCells = this.__rows * this.__cols;
    this.__state = state;
    this.__game = state.game;

    this.__tileCoordinatesMap = new Map();

    let tile:Phaser.TileSprite;
    for (let i = 0; i < this.__rows; i++) {
      for (let j = 0; j < this.__cols; j++) {
        tile = this.createTile(j, i);

        this.__state.backgroundTiles.add(tile);
        this.__tileCoordinatesMap.set(tile, { row: i, col: j });
      }
    }
  }

  protected getSurroundingTiles(coordinates:ITileCoordinates):Array<ITileCoordinates> {
    const adjacentTiles:Array<ITileCoordinates> = [];
    const relativePositions = [
      { row:  1, col: -1 },
      { row:  1, col:  0 },
      { row:  1, col:  1 },
      { row:  0, col: -1 },
      { row:  0, col:  1 },
      { row: -1, col: -1 },
      { row: -1, col:  0 },
      { row: -1, col: -1 },
    ];

    relativePositions.forEach((position) => {
      const relativeRow = coordinates.row + position.row;
      const relativeCol = coordinates.col + position.col;

      if (relativeRow >= 0 && relativeRow < this.__rows && relativeCol >= 0 && relativeCol < this.__cols) {
        adjacentTiles.push({ row: relativeRow, col: relativeCol });
      }
    });

    return adjacentTiles;
  }

  protected createTile(x:number, y:number):Phaser.TileSprite {
    const frame:number = this.__game.rnd.integerInRange(205, 208);
    const tile:Phaser.TileSprite = new Phaser.TileSprite(this.__game, x * this.__tileSize, y * this.__tileSize, this.__tileSize, this.__tileSize, 'terrain', frame);

    tile.inputEnabled = true;
    tile.events.onInputDown.add((t) => {
      const coordinates = this.__tileCoordinatesMap.get(t);
      console.log(this.getSurroundingTiles(coordinates));
      t.alpha = 0.5;
    });

    return tile;
  }
}
