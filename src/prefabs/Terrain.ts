import {IBoardData, ICell, ILevelData, IPoint} from '../interfaces';
import * as boardUtils from '../utils/boardUtils';
import {randomBetween} from '../utils/mathUtils';

export const getFreeCell = (group:Phaser.Group, board:IBoardData):ICell => {
  let freeCell:ICell, currentCell:ICell, foundCell:boolean;
  let currentChild:Phaser.TileSprite, row:number, col:number, i:number;

  const len = group.length;

  while (!freeCell) {
    foundCell = false;

    row = randomBetween(0, board.rows, true);
    col = randomBetween(0, board.cols, true);

    for (i = 0; i < len; i++) {
      currentCell = boardUtils.getCellFromIndex(i, board);
      currentChild = group.children[i] as Phaser.TileSprite;
      if (currentChild.alive && currentCell.row === row && currentCell.col === col) {
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

  for (let i:number = 0; i < board.rows; i++) {
    for (let j:number = 0; j < board.cols; j++) {
      frame = game.rnd.integerInRange(205, 208);
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

export const createItems = (group:Phaser.Group, board:IBoardData, levelData:ILevelData, onCollect:Function):void => {
  const numCells = boardUtils.countCells(board);
  const numItems = Math.round(
    numCells * levelData.coefs.itemOccupation * randomBetween(1 - levelData.coefs.itemVariation, 1 + levelData.coefs.itemVariation)
  );

  let type:number, itemData:any, item:Phaser.TileSprite, cell:ICell, point:IPoint;

  const createListener = (cell, item) => () => onCollect(cell, item);

  for (let i = 0; i < numItems; i++) {
    type = randomBetween(0, levelData.itemTypes.length, true);

    itemData = levelData.itemTypes[type];

    cell = getFreeCell(group, board);
    point = boardUtils.getXYFromCell(cell, board);

    item = new Phaser.TileSprite(group.game, point.x, point.y, board.size, board.size, 'items', 10);
    item.anchor.set(.5, .5);
    item.visible = false;
    item.inputEnabled = true;
    item.events.onInputDown.add(createListener(cell, item));

    group.add(item);
  }
};

export const createKey = (group:Phaser.Group, cell:ICell, board:IBoardData, onCollect:Function):void => {
  const position:IPoint = boardUtils.getXYFromCell(cell, board);
  const key = new Phaser.TileSprite(group.game, position.x, position.y, board.size, board.size, 'items', 6);
  key.anchor.set(.5, .5);
  key.inputEnabled = true;
  key.events.onInputDown.add(() => {
    onCollect(cell, key);
  });
  key.visible = false;
  group.add(key);
};

export const createEntrance = (group:Phaser.Group, cell:ICell, board:IBoardData):void => {
  const position = boardUtils.getXYFromCell(cell, board);
  const entrance = new Phaser.TileSprite(group.game, position.x, position.y, board.size, board.size, 'terrain', 330);
  entrance.anchor.set(.5, .5);
  group.add(entrance);
};

export const createExit = (group:Phaser.Group, cell:ICell, board:IBoardData, onCollect:Function):void => {

};

export const createEnemies = (group:Phaser.Group, levelData:ILevelData):void => {

};

export const clearDarknessTile = (darkTiles:Phaser.Group, mapElements:Phaser.Group, cell:ICell, board:IBoardData, considerEnemies:boolean=true) => {
  const cells:ICell[] = [ cell, ...boardUtils.getSurroundingCells(cell, board) ];

  if (considerEnemies) {
    let hasEnemy:boolean = false;

    if (hasEnemy) {
      return;
    }
  }

  cells.forEach((c:ICell, i:number) => {
    const index = boardUtils.getIndexFromCell(c, board);
    const darkTile:Phaser.TileSprite = darkTiles.children[index] as Phaser.TileSprite;
    const point = boardUtils.getXYFromCell(c, board);

    const mapElement = mapElements.children.find((el:Phaser.TileSprite) => el.x === point.x && el.y === point.y);

    if (mapElement) {
      mapElement.visible = true;
    }

    darkTile.game.add.tween(darkTile).to({ alpha: 0 }, 150, null, true, i * 25).onComplete.add(() => {
      darkTile.alive = darkTile.exists = darkTile.visible = false;
    });
  });

  /*const tiles:ICell[] = boardUtils.getSurroundingCells(cell, board);

  console.log('Clear for', cell, tiles);

  let darkTile:Phaser.TileSprite, darkTileCell:ICell, i:number ,j:number;

  if (considerEnemies) {
    let enemy:Phaser.TileSprite, enemyCell:ICell;
    let hasMonster:boolean = false;

    for(i = 0; i < tiles.length; i++) {
      for(j = 0; j < mapElements.length; j++) {
        enemy = mapElements.children[j] as Phaser.TileSprite;
        enemyCell = boardUtils.getCellFromIndex(j, board);

        if(enemy.alive && enemy.data.type === 'enemy' && enemy.visible && enemyCell.row === tiles[i].row && enemyCell.col === tiles[i].col) {
          hasMonster = true;
          break;
        }
      }

      if (hasMonster) {
        return;
      }
    }
  }

  //find dark tiles to kill
  tiles.forEach((currTile:ICell) => {
    for (i = 0; i < darkTiles.length; i++) {
      darkTile = darkTiles.children[i] as Phaser.TileSprite;
      darkTileCell = boardUtils.getCellFromIndex(i, board);

      //check if it matches
      if (darkTile.alive && currTile.row === darkTileCell.row && currTile.col === darkTileCell.col) {
        let mapElement:Phaser.TileSprite, mapElementCell:ICell;
        for (j = 0; j < mapElements.length; j++) {
          mapElement = mapElements.children[j] as Phaser.TileSprite;
          mapElementCell = boardUtils.getCellFromIndex(j, board);

          if (mapElement.alive && mapElementCell.row === darkTileCell.row && mapElementCell.col === darkTileCell.col) {
            mapElement.visible = true;
            break;
          }
        }

        darkTile.destroy();
        break;
      }
    }
  });*/
};
