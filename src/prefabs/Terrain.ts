import {IBoardData, ICell, IEnemy, IItem, ILevelData, IPoint, IProp} from '../interfaces';
import * as boardUtils from '../utils/boardUtils';
import {randomBetween} from '../utils/mathUtils';
import MapElement from './MapElement';
import Item from './Item';
import Enemy from './Enemy';

export const getFreeCell = (group:Phaser.Group, board:IBoardData):ICell => {
  let freeCell:ICell, currentCell:ICell, foundCell:boolean;
  let currentChild:Phaser.TileSprite, row:number, col:number, i:number;

  const len = group.length;

  while (!freeCell) {
    foundCell = false;

    row = randomBetween(0, board.rows, true);
    col = randomBetween(0, board.cols, true);

    for (i = 0; i < len; i++) {
      currentChild = group.children[i] as Phaser.TileSprite;
      currentCell = boardUtils.getCellFromXY({
        x: currentChild.x,
        y: currentChild.y
      }, board);
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

export const createBackgroundTiles = (group:Phaser.Group, levelData:ILevelData, theme:number, board:IBoardData, onInput:Function):void => {
  let frame:number, tile:Phaser.TileSprite;

  const level = levelData.levels[theme];

  for (let i:number = 0; i < board.rows; i++) {
    for (let j:number = 0; j < board.cols; j++) {
      frame = randomBetween(0, level.tiles.length, true);
      tile = new Phaser.TileSprite(group.game, j * board.size, i * board.size, board.size, board.size, 'terrain', level.tiles[frame]);
      tile.inputEnabled = true;
      tile.events.onInputDown.add(() => {
        onInput({ row: i, col: j }, tile);
      });

      group.add(tile);
    }
  }
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

export const createProps = (group:Phaser.Group, board:IBoardData, levelData:ILevelData, levelIndex:number):void => {
  const numCells = boardUtils.countCells(board);
  const numItems = Math.round(numCells * levelData.coefs.propOccupation * randomBetween(1 - levelData.coefs.propVariation, 1 + levelData.coefs.propVariation));

  const currentLevel = levelData.levels[levelIndex];
  const props = [ ...levelData.common.props, ...currentLevel.props ];

  let type:number, propData:IProp, prop:MapElement, cell:ICell, point:IPoint;

  for (let i = 0; i < numItems; i++) {
    type = randomBetween(0, props.length, true);

    propData = props[type];

    cell = getFreeCell(group, board);
    point = boardUtils.getXYFromCell(cell, board);

    prop = new MapElement(group.game, point.x, point.y, board.size, 'terrain', propData.frames);
    prop.inputEnabled = false;
    //prop.visible = false;
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
    type = randomBetween(0, levelData.items.length, true);

    itemData = levelData.items[type];

    cell = getFreeCell(group, board);
    point = boardUtils.getXYFromCell(cell, board);

    item = new Item(group.game, point.x, point.y, board.size, itemData);
    item.visible = false;
    item.inputEnabled = true;
    item.events.onInputDown.addOnce(createListener(cell, item));

    group.add(item);
  }
};

export const createEnemies = (group:Phaser.Group, board:IBoardData, levelData:ILevelData, levelIndex:number, floor:number, onAttack:Function):void => {
  const numCells = boardUtils.countCells(board);
  const numItems = Math.round(
    numCells * levelData.coefs.enemyOccupation * randomBetween(1 - levelData.coefs.enemyVariation, 1 + levelData.coefs.enemyVariation)
  );

  const currentLevel = levelData.levels[levelIndex];
  let type:number, enemyData:IEnemy, enemy:Enemy, cell:ICell, point:IPoint;

  const createListener = (cell:ICell, enemy:Enemy) => () => onAttack(cell, enemy);
  const coef = Math.pow(levelData.coefs.levelIncrement, floor);
  const enemies = [ ...levelData.common.enemies, ...currentLevel.enemies ];

  for (let i = 0; i < numItems; i++) {
    type = randomBetween(0, enemies.length, true);

    enemyData = enemies[type];

    cell = getFreeCell(group, board);
    point = boardUtils.getXYFromCell(cell, board);

    enemy = new Enemy(group.game, point.x, point.y, board.size, {
      ...enemyData,
      attack: enemyData.attack * coef,
      defense: enemyData.defense * coef,
      health: enemyData.health * coef,
      gold: enemyData.gold * coef
    });
    enemy.visible = false;
    enemy.inputEnabled = true;
    enemy.events.onInputDown.add(createListener(cell, enemy));

    group.add(enemy);
  }
};

export const createKey = (group:Phaser.Group, frames:number[], board:IBoardData, onCollect:Function):ICell => {
  const cell:ICell = getFreeCell(group, board);
  const position:IPoint = boardUtils.getXYFromCell(cell, board);
  const key = new MapElement(group.game, position.x, position.y, board.size, 'items', frames);
  key.visible = false;
  key.inputEnabled = true;
  key.events.onInputDown.addOnce(() => {
    onCollect(cell, key);
  });
  group.add(key);

  return cell;
};

export const createExit = (group:Phaser.Group, frames:number[], board:IBoardData, onExit:Function):ICell => {
  const cell = getFreeCell(group, board);
  const position = boardUtils.getXYFromCell(cell, board);
  const exit = new MapElement(group.game, position.x, position.y, board.size, 'terrain', frames);

  exit.anchor.set(.5, .5);
  exit.visible = false;
  exit.inputEnabled = true;
  exit.events.onInputDown.add(() => {
    onExit(cell, exit);
  });
  group.add(exit);

  return cell;
};

export const createEntrance = (group:Phaser.Group, board:IBoardData):ICell => {
  const cell = getFreeCell(group, board);
  const position = boardUtils.getXYFromCell(cell, board);
  const entrance = new MapElement(group.game, position.x, position.y, board.size, 'terrain', [571]);
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

export const createWalls = (group:Phaser.Group, levelData:ILevelData, theme:number, board:IBoardData):void => {
  // create top walls;
  let i:number, frame:number;

  // top walls
  for (i = 0; i < board.cols; i++) {
    frame = randomBetween(0, levelData.levels[theme].walls.top.length, true);
    group.add(new Phaser.TileSprite(group.game, board.size * i + board.size, 0, board.size, board.size, 'terrain', levelData.levels[theme].walls.top[frame]));
  }

  // bottom walls
  /*for (i = 0; i < board.cols; i++) {
    frame = randomBetween(0, levelData.levels[theme].walls.bottom.length, true);
    group.add(new Phaser.TileSprite(group.game, board.size * i + board.size, board.rows * board.size - 1, board.size, board.size, 'terrain', levelData.levels[theme].walls.bottom[frame]));
  }*/

  // left walls
  for (i = 0; i < board.rows + 1; i++) {
    frame = randomBetween(0, levelData.levels[theme].walls.side.length, true);
    group.add(new Phaser.TileSprite(group.game, 0, board.size * i, board.size, board.size, 'terrain', levelData.levels[theme].walls.side[frame]));
  }

  // right walls
  for (i = 0; i < board.rows + 1; i++) {
    frame = randomBetween(0, levelData.levels[theme].walls.side.length, true);
    group.add(new Phaser.TileSprite(group.game, board.cols * board.size + board.size, board.size * i, board.size, board.size, 'terrain', levelData.levels[theme].walls.side[frame]));
  }
};
