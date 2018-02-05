export default class MapElement extends Phaser.TileSprite {
  constructor(game:Phaser.Game, x:number, y:number, size:number, texture:string, frames:number[]) {
    super(game, x, y, size, size, texture, frames[0]);

    this.anchor.set(.5, .5);

    if (frames.length > 1) {
      this.animations.add('idle', frames, 10, true);
      this.play('idle');
    }
  }
  kill():void {
    this.alive = this.exists = this.visible = false;
  }
}
