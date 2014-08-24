"use strict";

var Target = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'target', frame);

  game.physics.p2.enable(this, false);
  this.body.static = true;
  this.body.dynamic = false;
  
};

Target.prototype = Object.create(Phaser.Sprite.prototype);
Target.prototype.constructor = Target;

Target.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Target;
