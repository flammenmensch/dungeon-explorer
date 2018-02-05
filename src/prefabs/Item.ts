import MapElement from './MapElement';
import {IItem} from '../interfaces';

export default class Item extends MapElement {
  protected __data:IItem;

  constructor(game:Phaser.Game, x:number, y:number, size:number, data:IItem) {
    super(game, x, y, size, 'items', data.frames);
    this.__data = data;
  }

  get data():IItem {
    return this.__data;
  }
}
