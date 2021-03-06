export default class GameOverState extends Phaser.State {
  init() {
    // Pass user score here
    this.game.stage.backgroundColor = 0x330000;
  }
  create() {
    const gameOverText = `Congratulations!\nYou died.\n\nPress any key to restart`;
    const gameOverLabel = this.game.add.text(this.game.world.width * .5, this.game.world.height * .5, gameOverText, {
      font: '16px Pixel',
      fill: '#ffffff',
      align: 'center'
    });
    gameOverLabel.anchor.set(.5, .5);

    this.game.input.keyboard.addCallbacks(null, () => {
      this.startGame();
    });

    this.game.input.mouse.input.onTap.addOnce(() => {
      this.startGame();
    });
  }

  shutdown(game:Phaser.Game) {
    super.shutdown(game);
    this.game.input.keyboard.removeCallbacks();
  }

  protected startGame() {
    this.state.start('Game');
  }
}
