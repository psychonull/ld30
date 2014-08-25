/*jshint bitwise: false*/

"use strict";

var Platform = function(game, x, y, rad, i) {
  this.game = game;
  this.radius = rad;
  Phaser.Sprite.call(this, game, x, y);

  var graphics = game.add.graphics(0, 0);
  
  var color = "0xef8113";
  if (i%2 === 0){
    color = "0x65d354";
  }

  graphics.beginFill(color, 0.3);
  graphics.lineStyle(10, "0x666666", 0.6);

  graphics.drawCircle(x, y, rad);
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

module.exports = Platform;
