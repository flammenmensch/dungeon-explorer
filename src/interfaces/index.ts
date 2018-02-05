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

export interface IItemType {
  health?:number;
  attack?:number;
  defense?:number;
  gold?:number;
  type:string;
  frames:number[];
}

export interface IEnemyType {
  attack:number;
  defense:number;
  health:number;
  gold:number;
  frames:number[];
}

export interface ILevelData {
  coefs: {
    itemOccupation:number;
    itemVariation:number;
    enemyOccupation:number;
    enemyVariation:number;
    levelIncrement:number;
  };
  itemTypes:IItemType[];
  enemyTypes:IEnemyType[];
}

export interface IGameData {
  currentLevel:number;
  playerStats:IPlayerStats;
}
