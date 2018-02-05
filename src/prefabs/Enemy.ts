import MapElement from './MapElement';
import {IEnemy} from '../interfaces';

export default class Enemy extends MapElement {
  protected __data:IEnemy;

  constructor(game:Phaser.Game, x:number, y:number, size:number, data:IEnemy) {
    super(game, x, y, size, 'heroes', data.frames);
    this.__data = data;
  }

  get data():IEnemy {
    return this.__data;
  }
}
