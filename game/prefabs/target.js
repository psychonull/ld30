"use strict";

var Target = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'target', frame);

  game.physics.p2.enable(this, false);
  this.body.static = true;
  this.body.dynamic = false;
  this.body.data.shapes[0].sensor = true;
  this.body.sprite.key = "target";

  this.animations.add('spining', [0,1,2,3,4,5], 10, true);
  this.animations.add('closed', [6]);

  this.animations.play('closed');
  this.isOpen = false;

  this.openPortalSound = this.game.add.audio('openPortal');
  this.openPortalSound.volume = 0.3;
  
  this.closePortalSound = this.game.add.audio('closePortal');
  this.closePortalSound.volume = 0.3;


};

Target.prototype = Object.create(Phaser.Sprite.prototype);
Target.prototype.constructor = Target;

Target.prototype.close = function(){
  if (this.isOpen){
    this.animations.play('closed');
    this.isOpen = false;
    this.closePortalSound.play();

  }
};

Target.prototype.open = function() {
  if (!this.isOpen){
    this.animations.play('spining');
    this.isOpen = true;
    this.openPortalSound.play();
  }
};

module.exports = Target;
