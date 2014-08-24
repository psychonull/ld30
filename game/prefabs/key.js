'use strict';

var Key = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'key', frame);

  // initialize your prefab here
  this.game.physics.p2.enable(this, true);
};

Key.prototype = Object.create(Phaser.Sprite.prototype);
Key.prototype.constructor = Key;

Key.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Key;
