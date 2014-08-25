
function Tuto() {}

Tuto.prototype = {
  preload: function() {

  },
  create: function() {

    this.game.add.tileSprite(this.game.world.centerX - 250, this.game.world.centerY - 280, 500, 400, 'tuto');

    this.instructionsText = this.game.add.text(this.game.world.centerX, 460, 'Click anywhere to continue', 
      { font: '30px Arial', fill: '#ffffff', align: 'center'});
    
    this.instructionsText.anchor.setTo(0.5, 0.5);

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Tuto;
