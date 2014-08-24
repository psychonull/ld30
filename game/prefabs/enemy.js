"use strict";

//var switchTime = 0;

var Enemy = function(game, platform, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.game.physics.p2.enable(this, true);
  this.body.mass = 100;
  this.maxSpeed = 50;
  this.platform = platform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.platform, this.platform.radius + this.height / 2);
  //this.THRUST = 100;
  //this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  //this.cam = this.game.add.sprite(this.x, this.y);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  /*
  if(this.currentPlatform){
    //this.move();
    //this.moveCam();
  }
  */

  //this.limitSpeedP2JS(this.body, this.maxSpeed);
};

Enemy.prototype.move = function() {
  //var platform = this.currentPlatform;
  /*
  var angle = Math.atan2(platform.y - this.y, platform.x - this.x);
  this.body.rotation = angle;
  this.body.thrust(this.THRUST * -1);
  */
};

module.exports = Enemy;
