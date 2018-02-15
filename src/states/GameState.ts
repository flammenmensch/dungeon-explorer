import {
  clearDarknessTile,
  createBackgroundTiles,
  createDarkTiles, createEnemies, createEntrance, createExit, createItems, createKey, createProps, createWalls,
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
import {randomBetween} from '../utils/mathUtils';

const ROWS = 10;
const COLS = 10;

const TILE_SIZE = 48;

const LABEL_STYLE = {
  font: '8px Pixel',
  fill: '#ffffff',
  align: 'center'
};

const defaultGameData:IGameData = {
  floor: 1,
  theme: 0,
  stats: {
    health: 25,
    attack: 2,
    defense: 1,
    gold: 0,
    hasKey: false
  }
};

export default class GameState extends Phaser.State {

  protected __playerStats:IPlayerStats;

  protected __currentFloor:number;

  protected __currentTheme:number;

  protected __backgroundTiles:Phaser.Group;

  protected __mapElements:Phaser.Group;

  protected __darkTiles:Phaser.Group;

  protected __walls:Phaser.Group;

  protected __hudMessages:Phaser.Group;

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
    this.__currentFloor = data.floor;
    this.__playerStats = { ...data.stats };
    this.__currentTheme = data.theme;
  }

  create() {
    this.__levelData = this.game.cache.getJSON('gameBaseData') as ILevelData;

    this.__backgroundTiles = this.game.add.group();
    this.__backgroundTiles.x = this.__board.size;
    this.__backgroundTiles.y = this.__board.size;

    this.__mapElements = this.game.add.group();
    this.__mapElements.x = this.__board.size;
    this.__mapElements.y = this.__board.size;

    createBackgroundTiles(this.__backgroundTiles, this.__levelData, this.__currentTheme, this.__board, (cell:ICell):void => {
      clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true);
    });

    createProps(this.__mapElements, this.__board, this.__levelData, this.__currentTheme);

    createItems(this.__mapElements, this.__board, this.__levelData, (cell:ICell, item:Item) => {
      clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true, false, false);

      this.__playerStats.gold += item.data.gold || 0;
      this.__playerStats.health += item.data.health || 0;
      this.__playerStats.attack += item.data.attack || 0;
      this.__playerStats.defense += item.data.defense || 0;

      this.refreshStats();

      item.kill();
    });

    createKey(this.__mapElements, this.__levelData.levels[this.__currentTheme].key, this.__board, (cell:ICell, key:MapElement):void => {
      clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true, false);

      this.__playerStats.hasKey = true;

      this.refreshStats();

      key.kill();

      this.showLabel(key, 'You found the key. Find the exit', 1000);
    });

    createEnemies(this.__mapElements, this.__board, this.__levelData, this.__currentTheme, this.__currentFloor, (cell:ICell, enemy:Enemy):void => {
      const damage = Math.round(
        Math.max(0.5, this.__playerStats.attack * Math.random() - enemy.data.defense * Math.random()) * 100
      ) / 100;

      enemy.data.health -= damage;

      this.showLabel(enemy, damage.toString());

      this.game.add.tween(enemy)
        .to({ tint: 0xff0000 }, 300, null, true)
        .onComplete.addOnce(() => {
          this.game.tweens.removeFrom(enemy);

          enemy.tint = 0xffffff;

          if (enemy.data.health <= 0) {
            this.__playerStats.gold += enemy.data.gold;

            enemy.kill();

            clearDarknessTile(this.__darkTiles, this.__mapElements, cell, this.__board, true, false, false);
          } else {
            const newHealth = this.__playerStats.health - Math.max(0.5, enemy.data.attack * Math.random() - this.__playerStats.defense * Math.random());
            if (Math.ceil(this.__playerStats.health) > Math.ceil(newHealth)) {
              this.camera.flash(0xcc0000, 300, false, 0.25);
              this.camera.onFlashComplete.addOnce(() => {
                this.__playerStats.health = newHealth;
              });
            }
          }

          this.refreshStats();

          if (this.__playerStats.health <= 0) {
            this.gameOver();
          }
        });
    });

    createExit(this.__mapElements, this.__levelData.levels[this.__currentTheme].exit, this.__board, (cell:ICell, exit:MapElement) => {
      if (this.__playerStats.hasKey) {
        this.nextLevel();
      } else {
        this.showLabel(exit, 'You need a key', 1000);
      }
    });

    const entranceCell = createEntrance(this.__mapElements, this.__board);

    this.__darkTiles = createDarkTiles(this.game, this.__board);
    this.__darkTiles.x = this.__board.size;
    this.__darkTiles.y = this.__board.size;

    clearDarknessTile(this.__darkTiles, this.__mapElements, entranceCell, this.__board, true, false, false);

    this.__walls = this.game.add.group();

    createWalls(this.__walls, this.__levelData, this.__currentTheme, this.__board);

    this.initGui();

    this.refreshStats();

    this.__hudMessages = this.game.add.group();
    this.__hudMessages.x = this.__board.size;
    this.__hudMessages.y = this.__board.size;
  }

  refreshStats():void {
    this.__healthLabel.text = Math.ceil(this.__playerStats.health).toString();
    this.__attackLabel.text = Math.ceil(this.__playerStats.attack).toString();
    this.__defenseLabel.text = Math.ceil(this.__playerStats.defense).toString();
    this.__goldLabel.text = Math.ceil(this.__playerStats.gold).toString();

    this.__keyIcon.alpha = this.__playerStats.hasKey ? 1.0 : 0.25;

    if (this.__playerStats.health < 5) {
      this.__healthIcon.frame = 16;
    } else if (this.__playerStats.health < 15) {
      this.__healthIcon.frame = 17;
    } else {
      this.__healthIcon.frame = 18;
    }
  }

  nextLevel():void {
    this.camera.fade(0x000000);
    this.camera.onFadeComplete.addOnce(() => {
      this.game.state.start('Game', true, false, {
        floor: this.__currentFloor + 1,
        theme: randomBetween(0, this.__levelData.levels.length, true),
        stats: { ...this.__playerStats, hasKey: false }
      });
    });
  }

  protected initGui():void {
    const x = 0;
    const y = TILE_SIZE * ROWS + TILE_SIZE;

    const bitmapRect = this.add.bitmapData(this.game.width, this.game.height - TILE_SIZE);

    bitmapRect.ctx.fillStyle = '#111111';
    bitmapRect.ctx.fillRect(0, 0, this.game.width, TILE_SIZE);

    this.add.sprite(0, y, bitmapRect);

    const style = {
      font: '12px Pixel',
      fill: '#fff',
      align: 'left'
    };

    this.__healthIcon = this.add.tileSprite(x, y, TILE_SIZE, TILE_SIZE, 'items', 18);
    this.__healthLabel = this.add.text(x + TILE_SIZE, y + 20, '99+', style);

    this.__attackIcon = this.add.tileSprite(x + TILE_SIZE * 2, y, TILE_SIZE, TILE_SIZE, 'items', 44);
    this.__attackLabel = this.add.text(x + TILE_SIZE * 3, y + 20, '99+', style);

    this.__defenseIcon = this.add.tileSprite(x + TILE_SIZE * 4, y, TILE_SIZE, TILE_SIZE, 'items', 115);
    this.__defenseLabel = this.add.text(x + TILE_SIZE * 5, y + 20, '99+', style);

    this.__goldIcon = this.add.tileSprite(x + TILE_SIZE * 6, y, TILE_SIZE, TILE_SIZE, 'items', 15);
    this.__goldLabel = this.add.text(x + TILE_SIZE * 7, y + 20, '999+', style);

    this.__keyIcon = this.add.tileSprite(x + TILE_SIZE * COLS + TILE_SIZE, y, TILE_SIZE, TILE_SIZE, 'items', this.__levelData.levels[this.__currentTheme].key[0]);

    this.__levelLabel = this.add.text(10, 10, `${this.__levelData.levels[this.__currentTheme].name}: floor ${this.__currentFloor}`, {
      ...style,
      font: '9px Pixel'
    });
  }

  protected gameOver():void {
    this.game.input.enabled = false;
    this.camera.fade(0x330000, 300, true, 1);
    this.camera.onFadeComplete.addOnce(() => {
      this.game.input.enabled = true;
      this.game.state.start('GameOver');
    });
  }

  protected showLabel(mapElement:MapElement, message:string, duration:number=500):void {
    const label = new Phaser.Text(this.game, mapElement.x, mapElement.y, message, LABEL_STYLE);

    label.anchor.setTo(.5, .5);

    this.game.add.tween(label)
      .to({ y: label.y - mapElement.height * .5, alpha: 0.25 }, duration, null, true)
      .onComplete.addOnce(() => {
        label.destroy(true);
      });

    this.__hudMessages.add(label);
  }
}
