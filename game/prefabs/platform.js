/*jshint bitwise: false*/

"use strict";

var colors = [
    [255,0,0]
  , [0,255,0]
  , [0,0,255]
  , [255,0,255]
  , [0,255,255]
  , [255,255,0]
  , [255,150,0]
];

function rgbToHex(c) {
  return "0x" + ((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1);
}

var Platform = function(game, x, y, rad, i) {
  this.game = game;
  this.radius = rad;
  Phaser.Sprite.call(this, game, x, y, "shape");

  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(rgbToHex(colors[i]), 0.2);
  graphics.lineStyle(10, rgbToHex(colors[i]), 0.5);

  graphics.drawCircle(x, y, rad);

  game.physics.p2.enable(this, false);
  this.body.setCircle(200);
  this.body.static = true;
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Platform;
