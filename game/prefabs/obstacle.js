"use strict";

var Obstacle = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'obstacle', frame);

  // initialize your prefab here
  
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Obstacle;
