import {IBoardData, ICell, IPoint} from '../interfaces';

const relativePositions = [
  {row:  1, col: -1},
  {row:  1, col:  0},
  {row:  1, col:  1},
  {row:  0, col: -1},
  {row:  0, col:  1},
  {row: -1, col: -1},
  {row: -1, col:  0},
  {row: -1, col:  1}
];

export const countCells = (board:IBoardData):number =>
  board.rows * board.cols;

export const getSurroundingCells = (cell:ICell, board:IBoardData):ICell[] => {
  const adjacentTiles:ICell[] = [];

  relativePositions.forEach((relPos:ICell):void => {
    let relRow:number = cell.row + relPos.row;
    let relCol:number = cell.col + relPos.col;

    if (relRow >= 0 && relRow < board.rows && relCol >= 0 && relCol < board.cols) {
      adjacentTiles.push({row: relRow, col: relCol});
    }
  });

  return adjacentTiles;
};

export const getXYFromCell = (cell:ICell, board:IBoardData):IPoint => ({
  x: cell.col * board.size + board.size * .5,
  y: cell.row * board.size + board.size * .5
});

export const getCellFromXY = (point:IPoint, board:IBoardData):ICell => ({
  row: point.y / board.size - .5,
  col: point.x / board.size - .5
});

export const getCellFromIndex = (index:number, board:IBoardData):ICell => ({
  row: Math.floor(index / (board.rows - 1)),
  col: index % board.cols
});

export const getIndexFromCell = (cell:ICell, board:IBoardData):number =>
  cell.row * board.cols + cell.col;

export const compareCells = (a:ICell, b:ICell):boolean =>
  a.row === b.row && a.col === b.col;
