/*
import GameState from '../states/GameState';

interface IBoardConfig {
  rows:number;
  cols:number;
  tileSize:number;
  levelData:any;
}

interface ITileCoordinates {
  row:number;
  col:number;
}

export default class Board {
  protected __rows:number;

  protected __cols:number;

  protected __tileSize:number;

  protected __state:GameState;

  protected __game:Phaser.Game;

  protected __coefs:any;

  protected __darkTiles:Phaser.Group;

  protected __mapElements:Phaser.Group;

  protected __levelData:any;

  protected __tileCoordinatesMap:Map<Phaser.TileSprite, ITileCoordinates>;

  constructor(state:GameState, config:IBoardConfig) {
    this.__rows = config.rows;
    this.__cols = config.cols;
    this.__tileSize = config.tileSize;
    this.__state = state;
    this.__game = state.game;
    this.__darkTiles = state.darkTiles;
    this.__mapElements = state.mapElements;
    this.__levelData = config.levelData;
    this.__coefs = this.__levelData.coefs;


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

  get tileSize():number {
    return this.__tileSize;
  }

  get numCells():number {
    return this.__rows * this.__cols;
  }

  get rows():number {
    return this.__rows;
  }

  get cols():number {
    return this.__cols;
  }

  initLevel():void {
    this.initDarkness();
    this.initItems();
    this.initEnemies();
    this.initExit();
  }

  initDarkness():void {
    let i:number, j:number, tile:Phaser.TileSprite;

    for (i = 0; i < this.__rows; i++) {
      for (j = 0; j < this.__cols; j++) {
        //tile = new Phaser.TileSprite(this.__game,)
      }
    }
  }

  initItems():void {

  }

  initEnemies():void {

  }

  initExit():void {

  }

  getSurrounding(coordinates:ITileCoordinates):Array<ITileCoordinates> {
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

  getXYFromRowCol(coordinates:ITileCoordinates):Phaser.Point {
    return new Phaser.Point(
      coordinates.col * this.__tileSize + this.__tileSize * .5,
      coordinates.row * this.__tileSize + this.__tileSize * .5
    );
  }

  getFreeCell():ITileCoordinates {
    const len = this.__mapElements.length;

    let row:number, col:number, i:number;
    let freeCell:ITileCoordinates, foundCell:boolean;
    let currentCell:ITileCoordinates, currentTile:Phaser.TileSprite;

    while (!freeCell) {
      foundCell = false;

      row = this.__game.rnd.integerInRange(0, this.__rows - 1);
      col = this.__game.rnd.integerInRange(0, this.__cols - 1);

      for (i = 0; i < len; i++) {
        currentTile = this.__mapElements.children[i] as Phaser.TileSprite;
        currentCell = this.__tileCoordinatesMap.get(currentTile);
        if (currentTile.alive && currentCell.row === row && currentCell.col === col) {
          foundCell = true;
          break;
        }
      }

      if (!foundCell) {
        freeCell = { row, col };
      }
    }

    return freeCell;
  }

  protected createTile(x:number, y:number):Phaser.TileSprite {
    const frame:number = this.__game.rnd.integerInRange(205, 208);
    const tile:Phaser.TileSprite = new Phaser.TileSprite(this.__game, x * this.__tileSize, y * this.__tileSize, this.__tileSize, this.__tileSize, 'terrain', frame);

    tile.inputEnabled = true;
    tile.events.onInputDown.add((t) => {
      this.clearDarknessTile(t, true);
    });

    return tile;
  }
}
*/
