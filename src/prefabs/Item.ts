import GameState from '../states/GameState';
import Board from './Board';

interface IItemData {
  type:string;
  frame:number;
  health:number;
  attack:number;
  defense:number;
  gold:number;
  row:number;
  col:number;
}

export default class Item extends Phaser.TileSprite {
  protected __data:IItemData;

  protected __state:GameState;

  protected __board:Board;

  protected __game:Phaser.Game;

  constructor(state:GameState, data:IItemData) {
    const position:Phaser.Point = state.board.getXYFromRowCol(data);

    super(state.game, position.x, position.y, state.board.tileSize, state.board.tileSize, 'items', 20);

    this.__state = state;

    this.__game = state.game;

    this.__board = state.board;

    this.__data = data;

    this.anchor.set(.5, .5);

    this.inputEnabled = true;
    this.events.onInputDown.add(this.collect, this);
  }

  protected collect():void {
    if (this.__data.type === 'consumable') {
      this.__state.playerStats.health += this.__data.health;
      this.__state.playerStats.attack += this.__data.attack;
      this.__state.playerStats.defense += this.__data.defense;
      this.__state.playerStats.gold += this.__data.gold;

      this.destroy();
    }
  }
}
