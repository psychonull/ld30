
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

    this.load.spritesheet('player', 'assets/dude.png', 50, 50, 5);
    this.load.spritesheet('target', 'assets/portal.png', 100, 100, 6);
    this.load.spritesheet('key', 'assets/key.png', 50, 50, 5);
  
    this.load.spritesheet("obstacle:toaster", "assets/toaster.png", 50, 50, 36);
    this.load.spritesheet("obstacle:clock", "assets/clock.png", 50, 50, 36);
    this.load.spritesheet("obstacle:pillow", "assets/pillow.png", 100, 100, 36);
    this.load.spritesheet("obstacle:cup", "assets/cup.png", 50, 50, 36);
    this.load.spritesheet("obstacle:teapot", "assets/teapot.png", 50, 50, 36);

    this.load.image('bg', 'assets/bg.png');
    this.load.image('bg2', 'assets/bg2.png');
    this.load.image('smoke', 'assets/particles/smoke-puff.png');

    this.game.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia.png', 'assets/fonts/minecraftia.xml');
    this.game.load.bitmapFont('minecraftia_white', 'assets/fonts/minecraftia_white.png', 'assets/fonts/minecraftia_white.xml');
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
