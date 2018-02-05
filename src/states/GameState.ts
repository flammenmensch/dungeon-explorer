import {
  clearDarknessTile,
  createBackgroundTiles,
  createDarkTiles, createEnemies, createEntrance, createExit, createItems, createKey, createMapElements, createProps,
  getFreeCell,
} from '../prefabs/Terrain';

import {
  IBoardData, ICell,
  IGameData, ILevelData,
  IPlayerStats
} from '../interfaces';

import MapElement from '../prefabs/MapElement';
import Item from '../prefabs/Item';
import Enemy from '../prefabs/Enemy';

const ROWS = 9;
const COLS = 10;

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

  protected __currentLevel:number;

  protected __backgroundTiles:Phaser.Group;

  protected __mapElements:Phaser.Group;

  protected __darkTiles:Phaser.Group;

  protected __levelData:ILevelData;

  protected __board:IBoardData = {
    rows: ROWS,
    cols: COLS,
    size: TILE_SIZE
  };

  private __healthIcon:Phaser.TileSprite;
  private __healthLabel:Phaser.Text;

  private __attackIcon:Phaser.TileSprite;
  private __attackLabel:Phaser.Text;

  private __defenseIcon:Phaser.TileSprite;
  private __defenseLabel:Phaser.Text;

  private __goldIcon:Phaser.TileSprite;
  private __goldLabel:Phaser.Text;

  private __levelLabel:Phaser.Text;

  private __keyIcon:Phaser.TileSprite;

  init(data:IGameData=defaultGameData) {
    this.__currentLevel = data.currentLevel;
    this.__playerStats = data.playerStats;
  }

  create() {
    this.__levelData = this.game.cache.getJSON('gameBaseData') as ILevelData;

    this.__backgroundTiles = this.game.add.existing(createBackgroundTiles(this.game, this.__board, (cell:ICell):void => {
      clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true);
    }));

    this.__mapElements = this.game.add.existing(createMapElements(this.game, this.__board));

    createProps(this.__mapElements, this.__board, this.__levelData);

    createItems(this.__mapElements, this.__board, this.__levelData, (cell:ICell, item:Item) => {
      clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true);

      this.__playerStats.gold += item.data.gold || 0;
      this.__playerStats.health += item.data.health || 0;
      this.__playerStats.attack += item.data.attack || 0;
      this.__playerStats.defense += item.data.defense || 0;

      this.refreshStats();

      item.kill();
    });

    createKey(this.__mapElements, this.__board, (cell:ICell, key:MapElement):void => {
      clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true);

      this.__playerStats.hasKey = true;

      this.refreshStats();

      key.kill();
    });

    createEnemies(this.__mapElements, this.__board, this.__levelData, (cell:ICell, enemy:Enemy):void => {
      const damageAttacked = Math.max(0.5, this.__playerStats.attack * Math.random() - enemy.data.defense * Math.random());
      const damageAttacker = Math.max(0.5, enemy.data.attack * Math.random() - this.__playerStats.defense * Math.random());

      enemy.data.health -= damageAttacked;
      this.__playerStats.health -= damageAttacker;

      this.game.add.tween(enemy)
        .to({ tint: 0xff0000 }, 300, null, true)
        .onComplete.add(() => {
          enemy.tint = 0xffffff;

          this.refreshStats();

          if (enemy.data.health <= 0) {
            clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true);

            this.__playerStats.gold += enemy.data.gold;
            enemy.kill();
          }

          if (this.__playerStats.health <= 0) {
            this.gameOver();
          }
        });
    });

    /*createExit(this.__mapElements, getFreeCell(this.__mapElements, this.__board), this.__board, (cell:ICell) => {

    });*/

    const entranceCell = createEntrance(this.__mapElements, this.__board);

    this.__darkTiles = createDarkTiles(this.game, this.__board);

    clearDarknessTile(this.__darkTiles, this.__mapElements, entranceCell, this.__board, true);

    this.initGui();
  }

  render() {
    //this.game.debug.spriteBounds(this.__healthIcon);
    /*this.game.debug.spriteBounds(this.__attackIcon);
    this.game.debug.spriteBounds(this.__defenseIcon);
    this.game.debug.spriteBounds(this.__goldIcon);*/
    //this.game.debug.spriteBounds(this.__keyIcon);
  }

  refreshStats():void {
    this.__healthLabel.text = Math.ceil(this.__playerStats.health).toString();
    this.__attackLabel.text = Math.ceil(this.__playerStats.attack).toString();
    this.__defenseLabel.text = Math.ceil(this.__playerStats.defense).toString();
    this.__goldLabel.text = Math.ceil(this.__playerStats.gold).toString();

    this.__keyIcon.visible = this.__playerStats.hasKey;

    this.__levelLabel.text = `Level ${this.__currentLevel}`;
  }

  nextLevel():void {
    this.game.state.start('Game', true, false, {
      currentLevel: this.__currentLevel + 1,
      playerStats: this.__playerStats
    });
  }

  protected initGui():void {
    const x = this.game.width - 110;
    const y = TILE_SIZE * ROWS;
    const bitmapRect = this.add.bitmapData(this.game.width, this.game.height - y);

    bitmapRect.ctx.fillStyle = '#000058';
    bitmapRect.ctx.fillRect(0, 0, this.game.width, this.game.height - y);

    const panel = this.add.sprite(0, y, bitmapRect);

    const style = {
      font: '16px Arial',
      fill: '#fff',
      align: 'left'
    };

    this.__healthIcon = this.add.tileSprite(x, y, TILE_SIZE, TILE_SIZE, 'items', 18);
    this.__healthLabel = this.add.text(x + TILE_SIZE, y + 18, '999+', style);

    this.__attackIcon = this.add.tileSprite(x, y + TILE_SIZE, TILE_SIZE, TILE_SIZE, 'items', 44);
    this.__attackLabel = this.add.text(x + TILE_SIZE, y + TILE_SIZE + 18, '999+', style);

    this.__defenseIcon = this.add.tileSprite(x, y + TILE_SIZE * 2, TILE_SIZE, TILE_SIZE, 'items', 224);
    this.__defenseLabel = this.add.text(x + TILE_SIZE, y + TILE_SIZE * 2 + 18, '999+', style);

    this.__goldIcon = this.add.tileSprite(x, y + TILE_SIZE * 3, TILE_SIZE, TILE_SIZE, 'items', 15);
    this.__goldLabel = this.add.text(x + TILE_SIZE, y + TILE_SIZE * 3 + 18, '999+', style);

    this.__keyIcon = this.add.tileSprite(this.game.width / 2 - TILE_SIZE / 2, y + TILE_SIZE * 2 - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, 'items', 6);

    this.__levelLabel = this.add.text(45, this.game.height - TILE_SIZE / 2, 'Level 1', style);

    this.refreshStats();
  }

  protected gameOver():void {
    this.game.state.start('Game');
  }
}
