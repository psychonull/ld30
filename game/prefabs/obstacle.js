"use strict";

var Obstacle = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'obstacle', frame);

  this.game.physics.p2.enable(this, true);
  this.body.kinematic = true;

  this.body.mass = 100;
  this.maxSpeed = 50;
  
  
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Obstacle;
