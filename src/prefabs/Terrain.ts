import {IBoardData, ICell, IEnemy, IItem, ILevelData, IPoint, IProp} from '../interfaces';
import * as boardUtils from '../utils/boardUtils';
import {randomBetween} from '../utils/mathUtils';
import MapElement from './MapElement';
import Item from './Item';
import Enemy from './Enemy';

const tileSets = [
  [101, 104],
  [121, 124],
  [141, 144],
  [205, 208],
  [170, 170],
];

export const getFreeCell = (group:Phaser.Group, board:IBoardData):ICell => {
  let freeCell:ICell, currentCell:ICell, foundCell:boolean;
  let currentChild:Phaser.TileSprite, row:number, col:number, i:number;

  const len = group.length;

  while (!freeCell) {
    foundCell = false;

    row = randomBetween(0, board.rows, true);
    col = randomBetween(0, board.cols, true);

    for (i = 0; i < len; i++) {
      // FIXME Incorrect cell calculation
      currentCell = boardUtils.getCellFromIndex(i, board);
      currentChild = group.children[i] as Phaser.TileSprite;
      if (currentChild && currentChild.alive && currentCell.row === row && currentCell.col === col) {
        foundCell = true;
        break;
      }
    }

    if (!foundCell) {
      freeCell = { row, col };
    }
  }

  return freeCell;
};

export const createBackgroundTiles = (game:Phaser.Game, board:IBoardData, onInput:Function):Phaser.Group => {
  const group = new Phaser.Group(game);

  let frame:number, tile:Phaser.TileSprite;
  const selectedSet = game.rnd.integerInRange(0, tileSets.length - 1);

  for (let i:number = 0; i < board.rows; i++) {
    for (let j:number = 0; j < board.cols; j++) {
      frame = game.rnd.integerInRange(tileSets[selectedSet][0], tileSets[selectedSet][1]);
      tile = new Phaser.TileSprite(game, j * board.size, i * board.size, board.size, board.size, 'terrain', frame);
      tile.inputEnabled = true;
      tile.events.onInputDown.add(() => {
        onInput({ row: i, col: j }, tile);
      });

      group.add(tile);
    }
  }

  return group;
};

export const createMapElements = (game:Phaser.Game, board:IBoardData):Phaser.Group => {
  return new Phaser.Group(game);
};

export const createDarkTiles = (game:Phaser.Game, board:IBoardData):Phaser.Group => {
  const group = new Phaser.Group(game);

  let tile:Phaser.TileSprite;

  for (let i:number = 0; i < board.rows; i++) {
    for (let j:number = 0; j < board.cols; j++) {
      tile = new Phaser.TileSprite(game, j * board.size, i * board.size, board.size, board.size, 'terrain', 153);
      tile.alpha = 0.7;

      group.add(tile);
    }
  }

  return group;
};

export const createProps = (group:Phaser.Group, board:IBoardData, levelData:ILevelData):void => {
  const numCells = boardUtils.countCells(board);
  const numItems = Math.round(numCells * levelData.coefs.propOccupation * randomBetween(1 - levelData.coefs.propVariation, 1 + levelData.coefs.propVariation));

  let type:number, propData:IProp, prop:MapElement, cell:ICell, point:IPoint;

  for (let i = 0; i < numItems; i++) {
    type = randomBetween(0, levelData.propTypes.length, true);

    propData = levelData.propTypes[type];

    cell = getFreeCell(group, board);
    point = boardUtils.getXYFromCell(cell, board);

    prop = new MapElement(group.game, point.x, point.y, board.size, 'terrain', propData.frames);
    prop.inputEnabled = false;
    prop.visible = false;
    group.add(prop);
  }
};

export const createItems = (group:Phaser.Group, board:IBoardData, levelData:ILevelData, onCollect:Function):void => {
  const numCells = boardUtils.countCells(board);
  const numItems = Math.round(
    numCells * levelData.coefs.itemOccupation * randomBetween(1 - levelData.coefs.itemVariation, 1 + levelData.coefs.itemVariation)
  );

  let type:number, itemData:IItem, item:Item, cell:ICell, point:IPoint;

  const createListener = (cell, item) => () => onCollect(cell, item);

  for (let i = 0; i < numItems; i++) {
    type = randomBetween(0, levelData.itemTypes.length, true);

    itemData = levelData.itemTypes[type];

    cell = getFreeCell(group, board);
    point = boardUtils.getXYFromCell(cell, board);

    item = new Item(group.game, point.x, point.y, board.size, itemData);
    item.visible = false;
    item.inputEnabled = true;
    item.events.onInputDown.add(createListener(cell, item));

    group.add(item);
  }
};

export const createEnemies = (group:Phaser.Group, board:IBoardData, levelData:ILevelData, onAttack:Function):void => {
  const numCells = boardUtils.countCells(board);
  const numItems = Math.round(
    numCells * levelData.coefs.enemyOccupation * randomBetween(1 - levelData.coefs.enemyVariation, 1 + levelData.coefs.enemyVariation)
  );

  let type:number, enemyData:IEnemy, enemy:Enemy, cell:ICell, point:IPoint;

  const createListener = (cell:ICell, enemy:Enemy) => () => onAttack(cell, enemy);

  for (let i = 0; i < numItems; i++) {
    type = randomBetween(0, levelData.enemyTypes.length, true);

    enemyData = levelData.enemyTypes[type];

    cell = getFreeCell(group, board);
    point = boardUtils.getXYFromCell(cell, board);

    enemy = new Enemy(group.game, point.x, point.y, board.size, enemyData);
    enemy.visible = false;
    enemy.inputEnabled = true;
    enemy.events.onInputDown.add(createListener(cell, enemy));

    group.add(enemy);
  }
};

export const createKey = (group:Phaser.Group, board:IBoardData, onCollect:Function):ICell => {
  const cell:ICell = getFreeCell(group, board);
  const position:IPoint = boardUtils.getXYFromCell(cell, board);
  const key = new MapElement(group.game, position.x, position.y, board.size, 'items', [6]);
  key.visible = false;
  key.inputEnabled = true;
  key.events.onInputDown.add(() => {
    onCollect(cell, key);
  });
  group.add(key);

  return cell;
};

export const createExit = (group:Phaser.Group, board:IBoardData, onExit:Function):ICell => {
  const cell = getFreeCell(group, board);

  return cell;
};

export const createEntrance = (group:Phaser.Group, board:IBoardData):ICell => {
  const cell = getFreeCell(group, board);
  const position = boardUtils.getXYFromCell(cell, board);
  const entrance = new Phaser.TileSprite(group.game, position.x, position.y, board.size, board.size, 'terrain', 330);
  entrance.anchor.set(.5, .5);
  group.add(entrance);

  return cell;
};

export const clearDarknessTile = (darkTiles:Phaser.Group, mapElements:Phaser.Group, cell:ICell, board:IBoardData, considerEnemies:boolean=true) => {
  const cells:ICell[] = [ cell, ...boardUtils.getSurroundingCells(cell, board) ];

  if (considerEnemies) {
    const hasMonster = cells.some((c:ICell) => {
      const point = boardUtils.getXYFromCell(c, board);

      const enemy = mapElements.children.find(
        (el:MapElement) => (el instanceof Enemy && el.x === point.x && el.y === point.y)
      ) as Enemy;

      return enemy && enemy.alive && enemy.visible;
    });

    if (hasMonster) {
      return;
    }
  }

  cells.forEach((c:ICell, i:number) => {
    const index = boardUtils.getIndexFromCell(c, board);
    const darkTile:Phaser.TileSprite = darkTiles.children[index] as Phaser.TileSprite;
    const point = boardUtils.getXYFromCell(c, board);

    const mapElement = mapElements.children.find((el:Phaser.TileSprite) => el.x === point.x && el.y === point.y) as MapElement;

    if (mapElement && mapElement.alive) {
      mapElement.visible = true;
    }

    darkTile.game.add.tween(darkTile).to({ alpha: 0 }, 150, null, true, i * 25).onComplete.add(() => {
      darkTile.alive = darkTile.exists = darkTile.visible = false;
    });
  });
};
