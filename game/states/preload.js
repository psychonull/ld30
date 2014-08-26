
"use strict";
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    this.load.image('tuto', 'assets/tuto.png');

    this.load.spritesheet('player', 'assets/dude.png', 50, 50, 5);
    this.load.spritesheet('target', 'assets/portal.png', 100, 100, 7);
    this.load.spritesheet('key', 'assets/key.png', 50, 50, 5);
  
    this.load.spritesheet("obstacle:toaster", "assets/toaster.png", 50, 50, 36);
    this.load.spritesheet("obstacle:clock", "assets/clock.png", 50, 50, 36);
    this.load.spritesheet("obstacle:pillow", "assets/pillow.png", 100, 100, 36);
    this.load.spritesheet("obstacle:cup", "assets/cup.png", 50, 50, 36);
    this.load.spritesheet("obstacle:teapot", "assets/teapot.png", 50, 50, 36);
    
    this.load.spritesheet('particles', 'assets/particles.png', 10, 10, 4);

    this.load.audio('hurt', 'assets/sounds/hithurt.wav');
    this.load.audio('pickup', 'assets/sounds/pickup.wav');
    this.load.audio('goal', 'assets/sounds/goal.wav');
    this.load.audio('explosion1', 'assets/sounds/explosion1.wav');
    this.load.audio('explosion2', 'assets/sounds/explosion2.wav');
    this.load.audio('explosion3', 'assets/sounds/explosion3.wav');

    this.load.audio('music', 'assets/sounds/music.mp3', 'assets/sounds/music.ogg');

    this.load.image('bg', 'assets/bg.png');
    this.load.image('smoke', 'assets/particles/smoke-puff.png');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
