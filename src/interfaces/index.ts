export interface IBoardData {
  readonly rows:number;
  readonly cols:number;
  readonly size:number;
}

export interface ICell {
  readonly row:number;
  readonly col:number;
}

export interface IPoint {
  readonly x:number;
  readonly y:number;
}

export interface IPlayerStats {
  health:number;
  attack:number;
  defense:number;
  gold:number;
  hasKey:boolean;
}

export interface IItem {
  name:string;
  health?:number;
  attack?:number;
  defense?:number;
  gold?:number;
  type:string;
  frames:number[];
}

export interface IEnemy {
  name:string;
  attack:number;
  defense:number;
  health:number;
  gold:number;
  frames:number[];
}

export interface IProp {
  name:string;
  frames:number[];
}

export interface ILevel {
  name:string;
  tiles:number[];
  walls: {
    top:number[];
    side:number[];
    bottom:number[];
  };
  props:IProp[];
  enemies:IEnemy[];
  exit:number[];
  key:number[];
}

export interface ILevelData {
  coefs: {
    propOccupation:number;
    propVariation:number;
    itemOccupation:number;
    itemVariation:number;
    enemyOccupation:number;
    enemyVariation:number;
    levelIncrement:number;
  };
  common: {
    props:IProp[];
    enemies:IEnemy[];
  };
  levels:ILevel[];
  items:IItem[];
}

export interface IGameData {
  floor:number;
  theme:number;
  stats:IPlayerStats;
}
