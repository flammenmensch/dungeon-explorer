export default class PreloadState extends Phaser.State {
  preload() {
    const preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(100, 1);

    this.load.setPreloadSprite(preloadBar);

    this.load.spritesheet('heroes', 'assets/images/uf_heroes.png', 48, 48, undefined, 0, 0);
    this.load.spritesheet('items', 'assets/images/uf_items.png', 48, 48, undefined, 0, 0);
    this.load.spritesheet('terrain', 'assets/images/uf_terrain.png', 48, 48, undefined, 0, 0);
  }
  create() {
    this.state.start('Game');
  }
}
