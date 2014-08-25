"use strict";

function rnd(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var Obstacle = function(game, x, y, key, platformIndex) {
  Phaser.Sprite.call(this, game, x, y, key);

  this.game.physics.p2.enable(this, false);
  this.body.kinematic = true;

  this.body.mass = 100;
  this.maxSpeed = 50;

  this.body.sprite.key = "obstacle";

  platformIndex = 5;

  var frames = [];
  var animName = key + "_idle_" + platformIndex;
  var framesLen = 6;
  var start = platformIndex * framesLen;

  for (var i=start; i<start + framesLen; i++){
    frames.push(i);
  }
  
  this.animations.add(animName, frames, rnd(5,15), true);
  this.animations.play(animName);
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Obstacle;