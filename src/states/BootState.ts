export default class BootState extends Phaser.State {
  init() {
    this.game.stage.backgroundColor = '#000';
    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }
  preload() {
    this.load.image('bar', 'assets/images/preloader-bar.png');
  }
  create() {
    this.state.start('Preload');
  }
}
