
function rnd(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var tiles = ["toaster", "clock", "pillow", "cup", "teapot"];

    var mx = 500;
    var my = 300;
    var cx = this.game.world.centerX;
    var cy = this.game.world.centerY;

    for(var i=0; i<30; i++){
      var sp = this.game.add.sprite(rnd(cx-mx, cx+mx), rnd(cy-my, cy+my), 'obstacle:' + tiles[rnd(0, tiles.length-1)]);
      
      var framesLen = 6;
      var start = rnd(0, 5) * framesLen;
      var frames = [];
      for (var j=start; j<start + framesLen; j++){
        frames.push(j);
      }

      sp.animations.add("idle", frames, 10, true);
      sp.animations.play("idle");
      sp.alpha = 0.3;
    }

    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.x = this.sprite.scale.y = 5;

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'GAME TITLE', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play', 
      { font: '20px Arial', fill: '#ffffff', align: 'center'});

    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.animations.add('running', [0,1,2,3,4], 10, true);
    this.sprite.animations.play('running');
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('tuto');
    }
  }
};

module.exports = Menu;
