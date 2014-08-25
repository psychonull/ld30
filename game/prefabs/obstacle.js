"use strict";

var Obstacle = function(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  this.game.physics.p2.enable(this, true);
  this.body.kinematic = true;

  this.body.mass = 100;
  this.maxSpeed = 50;

  this.body.sprite.key = "obstacle";

  this.animations.add('idle', [0,1,2,3,4,5], 10, true);
  this.animations.play('idle');
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Obstacle;
