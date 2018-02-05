import {IBoardData} from '../src/interfaces';
import * as boardUtils from '../src/utils/boardUtils';

describe('boardUtils.ts', () => {
  const boardData:IBoardData = {
    rows: 4,
    cols: 3,
    size: 16
  };

  describe('getSurroundingCells', () => {
    it('Counts cells in a board', () => {
      expect(boardUtils.countCells(boardData)).toBe(12);
    });
    it('Finds surrounding cells for top left cell', () => {
      const cells = boardUtils.getSurroundingCells({ row: 0, col: 0 }, boardData);
      expect(cells).toHaveLength(3);
      expect(cells).toContainEqual({ row: 0, col: 1 });
      expect(cells).toContainEqual({ row: 1, col: 0 });
      expect(cells).toContainEqual({ row: 1, col: 1 });
    });
    it('Finds surrounding cells for bottom right cell', () => {
      const cells = boardUtils.getSurroundingCells({ row: 3, col: 2 }, boardData);
      expect(cells).toHaveLength(3);
      expect(cells).toContainEqual({ row: 2, col: 1 });
      expect(cells).toContainEqual({ row: 3, col: 1 });
      expect(cells).toContainEqual({ row: 2, col: 2 });
    });
    it('Finds surrounding cells for middle cell', () => {
      const cells = boardUtils.getSurroundingCells({ row: 1, col: 1 }, boardData);
      expect(cells).toHaveLength(8);
    });
  });
  describe('getXYFromCell', () => {
    it('Finds XY coordinates from cell', () => {
      expect(boardUtils.getXYFromCell({ row: 0, col: 0 }, boardData)).toEqual({ x: 8, y: 8 });
      expect(boardUtils.getXYFromCell({ row: 2, col: 1 }, boardData)).toEqual({ x: 24, y: 40 });
      expect(boardUtils.getXYFromCell({ row: 3, col: 2 }, boardData)).toEqual({ x: 40, y: 56 });
    });
  });
  describe('getCellFromXY', () => {
    it('Finds cell by XY coordinates', () => {
      expect(boardUtils.getCellFromXY({ x:  8, y:  8 }, boardData)).toEqual({ row: 0, col: 0 });
      expect(boardUtils.getCellFromXY({ x: 24, y: 40 }, boardData)).toEqual({ row: 2, col: 1 });
      expect(boardUtils.getCellFromXY({ x: 40, y: 56 }, boardData)).toEqual({ row: 3, col: 2 });
    });
  });
  describe('getCellFromIndex', () => {
    it('Finds cell by index', () => {
      expect(boardUtils.getCellFromIndex(0, boardData)).toEqual({ row: 0, col: 0 });
      expect(boardUtils.getCellFromIndex(4, boardData)).toEqual({ row: 1, col: 1 });
    });
  });
  describe('getIndexFromCell', () => {
    it('Finds index by cell', () => {
      expect(boardUtils.getIndexFromCell({ row: 0, col: 1 }, boardData)).toBe(1);
      expect(boardUtils.getIndexFromCell({ row: 2, col: 1 }, boardData)).toBe(7);
      expect(boardUtils.getIndexFromCell({ row: 3, col: 2 }, boardData)).toBe(11);
    });
  });
});
